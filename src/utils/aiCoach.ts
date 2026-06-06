// 预设的AI快捷操作
export const AI_QUICK_ACTIONS = [
  { id: 'hint', label: '思路点拨', icon: '💡', prompt: '给我一些思路提示' },
  { id: 'debug', label: '代码纠错', icon: '🔧', prompt: '帮我检查代码问题' },
  { id: 'stuck', label: '我卡住了', icon: '🆘', prompt: '我卡住了，不知道下一步怎么做' },
  { id: 'explain', label: '概念解释', icon: '📖', prompt: '请解释一下相关概念' },
];

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
