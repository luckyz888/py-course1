// 智谱 GLM-4.7-Flash API 服务模块

const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const API_KEY = '5016ea4f5fe94d838837bd1e91d94e1c.XVDJAn3J1wfCWGYK';
const MODEL = 'glm-4.7-flash';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 非流式调用
export async function chatCompletion(
  messages: ChatMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API请求失败 (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

// 流式调用 — 返回 ReadableStream
export async function chatCompletionStream(
  messages: ChatMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
      stream: true,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API请求失败 (${response.status}): ${err}`);
  }

  const body = response.body;
  if (!body) throw new Error('响应体为空');
  return body;
}

// 解析SSE流，逐token回调
export async function readStream(
  stream: ReadableStream<Uint8Array>,
  onToken: (token: string) => void,
  onDone?: () => void,
  onError?: (err: Error) => void
) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') {
          onDone?.();
          return;
        }
        try {
          const parsed = JSON.parse(data);
          const token = parsed.choices?.[0]?.delta?.content;
          if (token) onToken(token);
        } catch {
          // 忽略解析失败的行
        }
      }
    }
    onDone?.();
  } catch (err) {
    onError?.(err instanceof Error ? err : new Error(String(err)));
  }
}

// AI教练系统提示词
export const AI_COACH_SYSTEM_PROMPT = `你是一位专业的Python数据分析AI教练，服务于"商务数据分析在线教育平台"。你的职责是：

1. 引导学生独立思考，而不是直接给答案
2. 用通俗易懂的语言解释数据分析概念
3. 帮助学生调试代码错误，但要先引导他们自己思考
4. 提供学习建议和思路点拨
5. 回答关于Python、Pandas、NumPy、Matplotlib、数据清洗、数据可视化等数据分析相关问题

规则：
- 用中文回复
- 回答要简洁实用，避免冗长
- 鼓励学生动手实践
- 如果学生问非数据分析相关问题，礼貌地引导回学习话题
- 代码示例使用markdown代码块格式`;

// 通用AI助手系统提示词
export const AI_ASSISTANT_SYSTEM_PROMPT = `你是"商务数据分析在线教育平台"的AI助手，基于智谱GLM大模型。你可以：
- 回答Python和数据分析相关问题
- 帮助解释代码和概念
- 提供学习建议
- 辅助数据分析任务

规则：
- 用中文回复
- 回答准确、简洁、实用
- 代码示例使用markdown代码块格式
- 如果不确定，请诚实说明`;
