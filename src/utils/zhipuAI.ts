// 智谱 GLM-4.7-Flash API 服务模块
// 包含：自动重试、请求队列、429 限流处理

const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const API_KEY = '5016ea4f5fe94d838837bd1e91d94e1c.XVDJAn3J1wfCWGYK';
const MODEL = 'glm-4.7-flash';

// 备用模型列表（主模型限流时自动切换）
const FALLBACK_MODELS = ['glm-4-flash', 'glm-4-flash'];

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// ============ 请求队列：防止并发过多触发限流 ============

let queue: (() => void)[] = [];
let activeCount = 0;
const MAX_CONCURRENT = 2; // 最多同时2个请求
const MIN_INTERVAL = 1000; // 请求间隔至少1秒
let lastRequestTime = 0;

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const run = async () => {
      // 确保请求间隔
      const now = Date.now();
      const wait = Math.max(0, MIN_INTERVAL - (now - lastRequestTime));
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));

      activeCount++;
      lastRequestTime = Date.now();
      try {
        const result = await fn();
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        activeCount--;
        // 处理队列中下一个请求
        if (queue.length > 0) {
          const next = queue.shift()!;
          next();
        }
      }
    };

    if (activeCount < MAX_CONCURRENT) {
      run();
    } else {
      queue.push(run);
    }
  });
}

// ============ 自动重试 + 限流处理 ============

const MAX_RETRIES = 3;

function isRateLimitError(status: number): boolean {
  return status === 429 || status === 503;
}

function getRetryDelay(attempt: number): number {
  // 指数退避：2s, 4s, 8s
  return Math.min(2000 * Math.pow(2, attempt), 10000);
}

function parseErrorMessage(status: number, body: string): string {
  try {
    const parsed = JSON.parse(body);
    const code = parsed?.error?.code;
    const msg = parsed?.error?.message || '';

    if (status === 429 || code === '1305') {
      return 'AI服务当前访问量过大，正在自动重试...';
    }
    if (code === '1301') {
      return 'AI服务暂时不可用，请稍后再试';
    }
    if (code === '1215') {
      return '请求内容过长，请缩短后重试';
    }
    return msg || `请求失败 (${status})`;
  } catch {
    return `请求失败 (${status})`;
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  attempt = 0
): Promise<Response> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const body = await response.text();

      // 429 限流：自动重试 + 切换模型
      if (isRateLimitError(response.status) && attempt < MAX_RETRIES) {
        const delay = getRetryDelay(attempt);

        // 尝试切换到备用模型
        let model = MODEL;
        if (attempt > 0 && attempt - 1 < FALLBACK_MODELS.length) {
          model = FALLBACK_MODELS[attempt - 1];
        }

        const newBody = JSON.parse(options.body as string);
        newBody.model = model;

        console.warn(`[AI] 请求被限流，${delay / 1000}秒后重试（第${attempt + 1}次，模型：${model}）`);

        await new Promise((r) => setTimeout(r, delay));

        return fetchWithRetry(
          url,
          { ...options, body: JSON.stringify(newBody) },
          attempt + 1
        );
      }

      throw new Error(parseErrorMessage(response.status, body));
    }

    return response;
  } catch (err) {
    // 网络错误也重试
    if (err instanceof TypeError && attempt < MAX_RETRIES) {
      const delay = getRetryDelay(attempt);
      console.warn(`[AI] 网络错误，${delay / 1000}秒后重试（第${attempt + 1}次）`);
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(url, options, attempt + 1);
    }
    throw err;
  }
}

// ============ API 调用 ============

// 非流式调用
export async function chatCompletion(
  messages: ChatMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  return enqueue(async () => {
    const response = await fetchWithRetry(API_URL, {
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

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? '';
  });
}

// 流式调用 — 返回 ReadableStream
export async function chatCompletionStream(
  messages: ChatMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<ReadableStream<Uint8Array>> {
  return enqueue(async () => {
    const response = await fetchWithRetry(API_URL, {
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

    const body = response.body;
    if (!body) throw new Error('响应体为空');
    return body;
  });
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
