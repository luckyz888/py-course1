import type { Badge } from '../types';

export const badges: Badge[] = [
  { id: 'first-lesson', name: '初学者', description: '完成第一个知识点学习', icon: '🎓', condition: '完成1个知识点' },
  { id: 'first-exercise', name: '实践者', description: '通过第一个编程练习', icon: '💻', condition: '通过1个练习' },
  { id: 'first-quiz', name: '测验达人', description: '通过第一次章节测评', icon: '📝', condition: '通过1次测评' },
  { id: 'streak-7', name: '坚持不懈', description: '连续学习7天', icon: '🔥', condition: '连续学习7天' },
  { id: 'streak-30', name: '学习狂人', description: '连续学习30天', icon: '⚡', condition: '连续学习30天' },
  { id: 'perfect-quiz', name: '满分王', description: '测评获得满分', icon: '🏆', condition: '测评满分' },
  { id: 'module-complete', name: '模块大师', description: '完成一个完整模块', icon: '📚', condition: '完成1个模块' },
  { id: 'all-modules', name: '全能学者', description: '完成所有课程模块', icon: '👑', condition: '完成全部6个模块' },
  { id: 'points-100', name: '百分先锋', description: '累计获得100积分', icon: '⭐', condition: '积分达到100' },
  { id: 'points-500', name: '积分达人', description: '累计获得500积分', icon: '🌟', condition: '积分达到500' },
  { id: 'points-1000', name: '千分王者', description: '累计获得1000积分', icon: '💫', condition: '积分达到1000' },
  { id: 'exercises-10', name: '勤学苦练', description: '通过10个编程练习', icon: '🎯', condition: '通过10个练习' },
];
