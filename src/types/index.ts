// 课程模块
export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  chapters: Chapter[];
}

// 章节
export interface Chapter {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

// 知识点
export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  type: 'theory' | 'practice' | 'both';
  content: string;
  codeExample?: string;
  exercise?: Exercise;
}

// 练习
export interface Exercise {
  id: string;
  lessonId: string;
  description: string;
  initialCode: string;
  hints: string[];
  referenceAnswer: string;
  testCases: TestCase[];
}

// 测试用例
export interface TestCase {
  input: string;
  expectedOutput: string;
}

// 测评
export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: QuizQuestion[];
}

// 测评题目
export interface QuizQuestion {
  id: string;
  type: 'choice' | 'fill' | 'coding';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  initialCode?: string;
}

// 练习结果
export interface ExerciseResult {
  exerciseId: string;
  passed: boolean;
  submittedCode: string;
  submittedAt: string;
}

// 测评结果
export interface QuizResult {
  moduleId: string;
  score: number;
  totalQuestions: number;
  answers: Record<string, string>;
  submittedAt: string;
}

// 徽章定义
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

// ========== 训练营类型 ==========

// 训练营项目
export interface BootcampProject {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  difficultyLabel: string;
  tags: string[];
  datasetCode: string;       // Python代码，用于在Pyodide中生成数据集
  datasetDescription: string; // 数据集描述
  tasks: ProjectTask[];       // 项目任务列表
  starterCode: string;        // 起始代码模板
  referenceSolution: string;  // 参考解答
  keyPoints: string[];        // 关键知识点
  outline: OutlineSection[];  // 学习大纲
}

// 学习大纲章节
export interface OutlineSection {
  title: string;
  items: OutlineItem[];
}

// 大纲知识点
export interface OutlineItem {
  title: string;
  content: string;       // 详细知识讲解（Markdown格式）
  codeExample: string;   // 代码示例
  importance?: 'core' | 'important' | 'supplementary';  // 重要程度：核心/重要/补充
}

// 项目任务
export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  hint: string;              // AI提示
  validation: string;        // 验证条件描述
}

// 训练营进度
export interface BootcampProgress {
  projectId: string;
  code: string;              // 用户代码草稿
  completedTasks: string[];  // 已完成的任务ID
  isCompleted: boolean;      // 项目是否完成
  lastUpdated: string;
}

// AI聊天消息
export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
