import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Trash2, Bot, User, Loader2, X, Minimize2, MessageSquare } from 'lucide-react';
import { AI_QUICK_ACTIONS, generateId } from '../utils/aiCoach';
import { chatCompletionStream, chatCompletion, readStream, AI_COACH_SYSTEM_PROMPT } from '../utils/zhipuAI';
import type { ChatMessage } from '../utils/zhipuAI';
import type { AIChatMessage } from '../types';

interface AIFloatingWindowProps {
  chatId: string;
  contextInfo?: {
    projectTitle?: string;
    currentTask?: string;
    userCode?: string;
    error?: string;
  };
  hideTrigger?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// 统一获取指针坐标（兼容鼠标和触摸）
function getPointerPos(e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent): { clientX: number; clientY: number } {
  if ('touches' in e) {
    const touch = e.touches[0] || (e as TouchEvent).changedTouches[0];
    return touch ? { clientX: touch.clientX, clientY: touch.clientY } : { clientX: 0, clientY: 0 };
  }
  return { clientX: (e as MouseEvent).clientX, clientY: (e as MouseEvent).clientY };
}

export default function AIFloatingWindow({ chatId, contextInfo, hideTrigger, open: externalOpen, onOpenChange }: AIFloatingWindowProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = (val: boolean) => {
    setInternalOpen(val);
    onOpenChange?.(val);
  };
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState(380);
  const [height, setHeight] = useState(520);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<{ type: string; startX: number; startY: number; startW: number; startH: number } | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  const storageKey = `ai-chat-${chatId}`;
  const [messages, setMessages] = useState<AIChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildMessages = (userText: string): ChatMessage[] => {
    const contextParts: string[] = [];
    if (contextInfo?.projectTitle) contextParts.push(`当前项目：${contextInfo.projectTitle}`);
    if (contextInfo?.currentTask) contextParts.push(`当前任务：${contextInfo.currentTask}`);
    if (contextInfo?.userCode) contextParts.push(`用户代码：\n\`\`\`python\n${contextInfo.userCode.slice(-1500)}\n\`\`\``);
    if (contextInfo?.error) contextParts.push(`报错信息：${contextInfo.error}`);

    const contextContent = contextParts.length > 0
      ? `【上下文信息】\n${contextParts.join('\n')}\n\n${userText}`
      : userText;

    const recentHistory = messages.slice(-10);
    const historyMsgs: ChatMessage[] = recentHistory.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    return [
      { role: 'system', content: AI_COACH_SYSTEM_PROMPT },
      ...historyMsgs,
      { role: 'user', content: contextContent },
    ];
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: AIChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    const aiMsgId = generateId();
    const aiMsg: AIChatMessage = {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = buildMessages(trimmed);

      // 尝试流式调用，不支持时回退到非流式
      try {
        const stream = await chatCompletionStream(apiMessages);
        let fullContent = '';

        await readStream(
          stream,
          (token) => {
            fullContent += token;
            setMessages((prev) =>
              prev.map((msg) => msg.id === aiMsgId ? { ...msg, content: fullContent } : msg)
            );
          },
          () => setIsLoading(false),
          (err) => {
            setMessages((prev) =>
              prev.map((msg) => msg.id === aiMsgId ? { ...msg, content: fullContent || `AI回复出错：${err.message}` } : msg)
            );
            setIsLoading(false);
          }
        );
      } catch {
        // 流式不支持，回退到非流式
        const content = await chatCompletion(apiMessages);
        setMessages((prev) =>
          prev.map((msg) => msg.id === aiMsgId ? { ...msg, content: content || 'AI回复为空' } : msg)
        );
        setIsLoading(false);
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) => msg.id === aiMsgId ? { ...msg, content: `请求失败：${err.message || '网络错误'}` } : msg)
      );
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleClear = () => {
    setMessages([]);
  };

  // 拖拽调整大小 — 兼容鼠标和触摸
  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    const { clientX, clientY } = getPointerPos(e);
    resizeRef.current = { type, startX: clientX, startY: clientY, startW: width, startH: height };
    document.body.style.userSelect = 'none';

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const r = resizeRef.current;
      if (!r) return;
      const { clientX, clientY } = getPointerPos(e);
      const dx = clientX - r.startX;
      const dy = clientY - r.startY;
      if (r.type.includes('e')) setWidth(Math.max(300, Math.min(r.startW + dx, 700)));
      if (r.type.includes('s')) setHeight(Math.max(350, Math.min(r.startH + dy, 800)));
      if (r.type.includes('w')) setWidth(Math.max(300, Math.min(r.startW - dx, 700)));
    };

    const handleEnd = () => {
      resizeRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  }, [width, height]);

  // 拖拽移动 — 兼容鼠标和触摸
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const { clientX, clientY } = getPointerPos(e);
    dragRef.current = { startX: clientX, startY: clientY, originX: pos.x, originY: pos.y };
    document.body.style.userSelect = 'none';

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const { clientX, clientY } = getPointerPos(e);
      setPos({ x: d.originX + (clientX - d.startX), y: d.originY + (clientY - d.startY) });
    };

    const handleEnd = () => {
      dragRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  }, [pos.x, pos.y]);

  return (
    <>
      {!isOpen && !hideTrigger && (
        <button
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all z-50"
        >
          <MessageSquare size={18} />
          <span className="text-sm font-medium">AI助手</span>
        </button>
      )}

      {isOpen && isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all z-50"
        >
          <Bot size={18} />
          <span className="text-sm font-medium">AI助手</span>
          {messages.length > 0 && (
            <span className="flex items-center justify-center w-5 h-5 bg-white/25 rounded-full text-[10px] font-bold">
              {messages.length}
            </span>
          )}
        </button>
      )}

      {isOpen && !isMinimized && (
        <div
          className="fixed bg-white rounded-2xl shadow-2xl shadow-indigo-500/10 border border-gray-200 flex flex-col z-50 overflow-hidden"
          style={{ width, height, right: 24 - pos.x, bottom: 24 - pos.y }}
        >
          {/* 标题栏 — 支持鼠标和触摸拖拽 */}
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shrink-0 cursor-move select-none"
          >
            <div className="flex items-center gap-2">
              <Bot size={16} />
              <span className="text-sm font-semibold">AI 助手</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-white/20 rounded-full">GLM</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="最小化"
              >
                <Minimize2 size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="关闭"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b border-gray-100 shrink-0">
            {AI_QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => sendMessage(action.prompt)}
                disabled={isLoading}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-gray-600 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-full transition-colors disabled:opacity-50"
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5 min-h-0">
            {messages.length === 0 && (
              <div className="text-center text-sm text-gray-400 mt-10">
                <Bot size={28} className="mx-auto mb-2 text-gray-300" />
                <p>有问题随时问我</p>
                <p className="mt-1 text-xs">由智谱GLM大模型驱动</p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                    msg.role === 'assistant'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  {msg.role === 'assistant' ? <Bot size={12} /> : <User size={12} />}
                </div>
                <div
                  className={`max-w-[85%] px-2.5 py-1.5 rounded-lg text-xs whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'bg-indigo-50 text-gray-800 rounded-tl-none'
                      : 'bg-amber-50 text-gray-800 rounded-tr-none'
                  }`}
                >
                  {msg.content || (
                    <span className="inline-flex items-center gap-1 text-gray-400">
                      <Loader2 size={10} className="animate-spin" />
                      思考中...
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2 border-t border-gray-200 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoading ? 'AI正在回复...' : '输入问题...'}
              disabled={isLoading}
              className="flex-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-1.5 text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="清空记录"
            >
              <Trash2 size={13} />
            </button>
          </form>

          {/* 调整手柄 — 支持触摸 */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            onTouchStart={(e) => handleResizeStart(e, 'e')}
            className="absolute top-0 right-0 bottom-0 w-1.5 cursor-e-resize hover:bg-indigo-300 transition-colors"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 's')}
            onTouchStart={(e) => handleResizeStart(e, 's')}
            className="absolute left-0 right-0 bottom-0 h-1.5 cursor-s-resize hover:bg-indigo-300 transition-colors"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            onTouchStart={(e) => handleResizeStart(e, 'se')}
            className="absolute right-0 bottom-0 w-4 h-4 cursor-se-resize"
          >
            <svg className="w-4 h-4 text-gray-300 hover:text-indigo-400 transition-colors" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="8" cy="12" r="1.5" />
              <circle cx="12" cy="8" r="1.5" />
            </svg>
          </div>
          <div
            onMouseDown={(e) => handleResizeStart(e, 'w')}
            onTouchStart={(e) => handleResizeStart(e, 'w')}
            className="absolute top-0 left-0 bottom-0 w-1.5 cursor-w-resize hover:bg-indigo-300 transition-colors"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
            onTouchStart={(e) => handleResizeStart(e, 'sw')}
            className="absolute left-0 bottom-0 w-4 h-4 cursor-sw-resize"
          />
        </div>
      )}
    </>
  );
}
