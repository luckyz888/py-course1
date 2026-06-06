import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Bot, User, Loader2 } from 'lucide-react';
import { useBootcampStore } from '../stores/bootcampStore';
import { AI_QUICK_ACTIONS, generateId } from '../utils/aiCoach';
import { chatCompletionStream, readStream, AI_COACH_SYSTEM_PROMPT } from '../utils/zhipuAI';
import type { ChatMessage } from '../utils/zhipuAI';
import type { AIChatMessage } from '../types';

interface AICoachPanelProps {
  projectId: string;
  projectTitle: string;
  currentTask?: string;
  userCode?: string;
  error?: string;
}

export default function AICoachPanel({ projectId, projectTitle, currentTask, userCode, error }: AICoachPanelProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatHistories = useBootcampStore((s) => s.chatHistories);
  const chatHistory = chatHistories[projectId] ?? [];
  const addChatMessage = useBootcampStore((s) => s.addChatMessage);
  const updateChatMessage = useBootcampStore((s) => s.updateChatMessage);
  const clearChatHistory = useBootcampStore((s) => s.clearChatHistory);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const buildMessages = (userText: string): ChatMessage[] => {
    const systemMsg: ChatMessage = {
      role: 'system',
      content: AI_COACH_SYSTEM_PROMPT,
    };

    const contextParts: string[] = [];
    if (projectTitle) contextParts.push(`当前项目：${projectTitle}`);
    if (currentTask) contextParts.push(`当前任务：${currentTask}`);
    if (userCode) contextParts.push(`用户代码：\n\`\`\`python\n${userCode}\n\`\`\``);
    if (error) contextParts.push(`报错信息：${error}`);

    const contextContent = contextParts.length > 0
      ? `【上下文信息】\n${contextParts.join('\n')}\n\n${userText}`
      : userText;

    // 取最近10条历史消息作为上下文
    const recentHistory = chatHistory.slice(-10);
    const historyMsgs: ChatMessage[] = recentHistory.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    return [systemMsg, ...historyMsgs, { role: 'user', content: contextContent }];
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    // 添加用户消息
    const userMsg: AIChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(projectId, userMsg);

    // 创建AI消息占位
    const aiMsgId = generateId();
    const aiMsg: AIChatMessage = {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };
    addChatMessage(projectId, aiMsg);

    setInput('');
    setIsLoading(true);

    try {
      const messages = buildMessages(trimmed);
      const stream = await chatCompletionStream(messages);
      let fullContent = '';

      await readStream(
        stream,
        (token) => {
          fullContent += token;
          updateChatMessage(projectId, aiMsgId, fullContent);
        },
        () => {
          setIsLoading(false);
        },
        (err) => {
          const errMsg = `抱歉，AI回复出错：${err.message}`;
          updateChatMessage(projectId, aiMsgId, fullContent || errMsg);
          setIsLoading(false);
        }
      );
    } catch (err: any) {
      const errMsg = `请求失败：${err.message || '网络错误，请稍后重试'}`;
      updateChatMessage(projectId, aiMsgId, errMsg);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleClear = () => {
    clearChatHistory(projectId);
  };

  return (
    <div className="flex flex-col h-full border-l border-gray-200 bg-white">
      {/* 顶部标题 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-indigo-600" />
          <h3 className="font-semibold text-gray-800">AI 陪练教练</h3>
          <span className="text-[10px] px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded-full">GLM</span>
        </div>
        <button
          onClick={handleClear}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          title="清空聊天记录"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* 快捷操作 */}
      <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-gray-100">
        {AI_QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => handleQuickAction(action.prompt)}
            disabled={isLoading}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-full transition-colors disabled:opacity-50"
          >
            <span>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>

      {/* 聊天消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {chatHistory.length === 0 && (
          <div className="text-center text-sm text-gray-400 mt-8">
            <Bot size={32} className="mx-auto mb-2 text-gray-300" />
            <p>有问题随时问我</p>
            <p className="mt-1">由智谱GLM大模型驱动</p>
          </div>
        )}
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* 头像 */}
            <div
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                msg.role === 'assistant'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
            </div>
            {/* 消息气泡 */}
            <div
              className={`max-w-[85%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === 'assistant'
                  ? 'bg-indigo-50 text-gray-800 rounded-tl-none'
                  : 'bg-amber-50 text-gray-800 rounded-tr-none'
              }`}
            >
              {msg.content || (
                <span className="inline-flex items-center gap-1 text-gray-400">
                  <Loader2 size={12} className="animate-spin" />
                  思考中...
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 底部输入框 */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-gray-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? 'AI正在回复...' : '输入你的问题...'}
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>
    </div>
  );
}
