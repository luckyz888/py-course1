import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { useAIChatStore } from '../stores/aiChatStore';
import { chatCompletionStream, readStream, AI_ASSISTANT_SYSTEM_PROMPT } from '../utils/zhipuAI';
import type { ChatMessage } from '../utils/zhipuAI';
import { generateId } from '../utils/aiCoach';

const SUGGESTED_PROMPTS = [
  { icon: '🐍', label: 'Python基础', prompt: '请帮我复习Python基础语法，包括变量、数据类型和控制流' },
  { icon: '🐼', label: 'Pandas操作', prompt: '请介绍Pandas最常用的数据操作方法' },
  { icon: '📊', label: '数据可视化', prompt: '如何用Matplotlib制作常见的数据图表？' },
  { icon: '🧹', label: '数据清洗', prompt: '数据清洗的常用方法和最佳实践有哪些？' },
];

export default function AIChat() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useAIChatStore((s) => s.messages);
  const addMessage = useAIChatStore((s) => s.addMessage);
  const updateMessage = useAIChatStore((s) => s.updateMessage);
  const clearMessages = useAIChatStore((s) => s.clearMessages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg = {
      id: generateId(),
      role: 'user' as const,
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);

    const aiMsgId = generateId();
    addMessage({
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    });

    setInput('');
    setIsLoading(true);

    try {
      const recentHistory = messages.slice(-10);
      const historyMsgs: ChatMessage[] = recentHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const apiMessages: ChatMessage[] = [
        { role: 'system', content: AI_ASSISTANT_SYSTEM_PROMPT },
        ...historyMsgs,
        { role: 'user', content: trimmed },
      ];

      const stream = await chatCompletionStream(apiMessages);
      let fullContent = '';

      await readStream(
        stream,
        (token) => {
          fullContent += token;
          updateMessage(aiMsgId, fullContent);
        },
        () => setIsLoading(false),
        (err) => {
          updateMessage(aiMsgId, fullContent || `AI回复出错：${err.message}`);
          setIsLoading(false);
        }
      );
    } catch (err: any) {
      updateMessage(aiMsgId, `请求失败：${err.message || '网络错误，请稍后重试'}`);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <MessageSquare size={16} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">AI 助手</h2>
            <p className="text-xs text-gray-400">由智谱 GLM-4.7-Flash 驱动</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
            清空对话
          </button>
        )}
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
              <Bot size={28} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">你好，我是AI助手</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              我可以帮你解答Python和数据分析相关问题，提供学习建议，辅助你的学习之旅
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {SUGGESTED_PROMPTS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => sendMessage(item.prompt)}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all text-left"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'assistant'
                  ? 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm'
                  : 'bg-indigo-600 text-white rounded-tr-sm'
              }`}
            >
              {msg.content ? (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-gray-400">
                  <Loader2 size={14} className="animate-spin" />
                  思考中...
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 rounded-b-xl">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? 'AI正在回复...' : '输入你的问题，按回车发送...'}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 disabled:bg-gray-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
        <p className="text-[10px] text-gray-400 mt-1.5 text-center">
          AI回复仅供参考，请注意甄别准确性
        </p>
      </div>
    </div>
  );
}
