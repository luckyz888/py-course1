import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronRight,
  Lightbulb,
  Eye,
  Send,
  Loader2,
  Code,
  PartyPopper,
  MessageSquare,
} from 'lucide-react';
import { allModules } from '../data/modules';
import { useExerciseStore } from '../stores/exerciseStore';
import { runPython, isPyodideLoaded, loadPyodide } from '../utils/pyodide';
import CodeEditor from '../components/CodeEditor';
import ExerciseJudge from '../components/ExerciseJudge';
import AIFloatingWindow from '../components/AIFloatingWindow';
import type { Exercise, TestCase } from '../types';

interface TestCaseResult {
  testCase: TestCase;
  index: number;
  passed: boolean;
  actualOutput: string;
}

function findExercise(exerciseId: string): Exercise | undefined {
  for (const module of allModules) {
    for (const chapter of module.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.exercise && lesson.exercise.id === exerciseId) {
          return lesson.exercise;
        }
      }
    }
  }
  return undefined;
}

function findExerciseContext(exerciseId: string) {
  for (const module of allModules) {
    for (const chapter of module.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.exercise && lesson.exercise.id === exerciseId) {
          return {
            moduleTitle: module.title,
            moduleId: module.id,
            chapterTitle: chapter.title,
            lessonTitle: lesson.title,
          };
        }
      }
    }
  }
  return null;
}

export default function Practice() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const { submitExercise, isExercisePassed, getExerciseResult } =
    useExerciseStore();

  const exercise = exerciseId ? findExercise(exerciseId) : undefined;
  const context = exerciseId ? findExerciseContext(exerciseId) : null;

  const [hintsShown, setHintsShown] = useState(0);
  const [showReference, setShowReference] = useState(false);
  const [confirmReference, setConfirmReference] = useState(false);
  const [judgeResults, setJudgeResults] = useState<TestCaseResult[] | null>(
    null
  );
  const [isJudging, setIsJudging] = useState(false);
  const [resultAnimation, setResultAnimation] = useState<'pass' | 'fail' | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const codeRef = useRef('');

  const alreadyPassed = exerciseId ? isExercisePassed(exerciseId) : false;
  const savedResult = exerciseId ? getExerciseResult(exerciseId) : undefined;

  const handleShowHint = () => {
    if (exercise && hintsShown < exercise.hints.length) {
      setHintsShown((prev) => prev + 1);
    }
  };

  const handleRequestReference = () => {
    setConfirmReference(true);
  };

  const handleConfirmReference = () => {
    setShowReference(true);
    setConfirmReference(false);
  };

  const handleCancelReference = () => {
    setConfirmReference(false);
  };

  const handleSubmit = async () => {
    if (!exercise || isJudging) return;

    setIsJudging(true);
    setJudgeResults(null);
    setResultAnimation(null);

    try {
      if (!isPyodideLoaded()) {
        await loadPyodide();
      }

      const code = codeRef.current || exercise.initialCode;
      const results: TestCaseResult[] = [];

      for (let i = 0; i < exercise.testCases.length; i++) {
        const tc = exercise.testCases[i];
        try {
          const fullCode = `${code}\nprint(${tc.input})`;
          const runResult = await runPython(fullCode);
          const actualOutput = (runResult.output || '').trim();
          const expectedOutput = tc.expectedOutput.trim();
          results.push({
            testCase: tc,
            index: i,
            passed: actualOutput === expectedOutput,
            actualOutput: actualOutput || (runResult.error ? `错误: ${runResult.error}` : ''),
          });
        } catch (err: any) {
          results.push({
            testCase: tc,
            index: i,
            passed: false,
            actualOutput: `运行错误: ${err.message || String(err)}`,
          });
        }
      }

      setJudgeResults(results);

      const allPassed = results.every((r) => r.passed);
      if (allPassed) {
        setResultAnimation('pass');
        submitExercise(exercise.id, code, true);
      } else {
        setResultAnimation('fail');
      }
    } catch (err: any) {
      console.error('评判失败:', err);
    } finally {
      setIsJudging(false);
    }
  };

  if (!exercise || !context) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1e1b4b]/10 flex items-center justify-center">
            <Code className="w-5 h-5 text-[#1e1b4b]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1e1b4b]">编程练习</h1>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 mb-4">未找到该练习</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-4 py-2 bg-[#1e1b4b] text-white rounded-lg hover:bg-[#1e1b4b]/90 transition-colors"
          >
            返回课程列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slide-up">
      {/* 面包屑导航 */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
        <Link
          to="/courses"
          className="hover:text-[#1e1b4b] transition-colors"
        >
          课程
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link
          to={`/courses/${context.moduleId}`}
          className="hover:text-[#1e1b4b] transition-colors"
        >
          {context.moduleTitle}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[#1e1b4b] font-medium">{exercise.id}</span>
      </nav>

      {/* 已完成横幅 */}
      {alreadyPassed && (
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-xl p-4 flex items-center gap-3 animate-green-pulse">
          <PartyPopper className="w-6 h-6 shrink-0" />
          <div>
            <p className="font-bold">已完成此练习！</p>
            <p className="text-sm text-white/80">你可以重新提交来更新代码</p>
          </div>
        </div>
      )}

      {/* 标题区域 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1e1b4b]/10 flex items-center justify-center">
            <Code className="w-5 h-5 text-[#1e1b4b]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1e1b4b]">
              {context.lessonTitle}
            </h1>
            <p className="text-xs text-gray-400">
              {context.chapterTitle} · {context.moduleTitle}
            </p>
          </div>
        </div>
      </div>

      {/* 主体内容：左右布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 左侧：题目描述 */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 max-h-[300px] overflow-y-auto">
            <h2 className="text-base font-semibold text-[#1e1b4b] mb-3">
              题目描述
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {exercise.description}
            </p>
          </div>

          {/* 提示区域 */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-[#1e1b4b]">提示</h2>
              {exercise.hints.length > 0 && (
                <span className="text-xs text-gray-400">
                  {hintsShown} / {exercise.hints.length}
                </span>
              )}
            </div>
            {hintsShown > 0 && (
              <div className="space-y-2 mb-3">
                {exercise.hints.slice(0, hintsShown).map((hint, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-800">{hint}</p>
                  </div>
                ))}
              </div>
            )}
            {hintsShown < exercise.hints.length ? (
              <button
                onClick={handleShowHint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                查看提示
              </button>
            ) : (
              hintsShown > 0 && (
                <p className="text-xs text-gray-400">已显示全部提示</p>
              )
            )}
          </div>

          {/* 参考答案区域 */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-[#1e1b4b] mb-3">
              参考答案
            </h2>
            {showReference ? (
              <pre className="p-3 bg-gray-50 rounded-lg text-sm text-gray-800 font-mono whitespace-pre-wrap overflow-x-auto">
                {exercise.referenceAnswer}
              </pre>
            ) : (
              <>
                <button
                  onClick={handleRequestReference}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#1e1b4b] bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  查看参考答案
                </button>
                {/* 确认对话框 */}
                {confirmReference && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm mx-4">
                      <h3 className="text-base font-semibold text-[#1e1b4b] mb-2">
                        确认查看参考答案？
                      </h3>
                      <p className="text-sm text-gray-500 mb-5">
                        建议先独立思考并尝试完成练习，查看参考答案可能会影响学习效果。
                      </p>
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={handleCancelReference}
                          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          取消
                        </button>
                        <button
                          onClick={handleConfirmReference}
                          className="px-4 py-2 text-sm text-white bg-[#1e1b4b] hover:bg-[#1e1b4b]/90 rounded-lg transition-colors"
                        >
                          确认查看
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 右侧：代码编辑器 */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <CodeEditor
              code={
                savedResult?.submittedCode || exercise.initialCode
              }
              onCodeChange={(code) => {
                codeRef.current = code;
              }}
              height="400px"
            />
          </div>

          {/* 提交评判 + AI助手按钮 */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={isJudging}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white bg-[#f59e0b] hover:bg-[#f59e0b]/90 disabled:opacity-50 rounded-xl font-medium transition-colors"
            >
              {isJudging ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  评判中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  提交评判
                </>
              )}
            </button>
            <button
              onClick={() => setAiOpen(true)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold rounded-xl transition-colors shrink-0 ${
                aiOpen ? 'bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <MessageSquare size={16} />
              AI助手
            </button>
          </div>

          {/* 评判结果 with animation */}
          {judgeResults && (
            <div className={
              resultAnimation === 'pass' ? 'animate-green-pulse' :
              resultAnimation === 'fail' ? 'animate-red-shake' : ''
            }>
              <ExerciseJudge results={judgeResults} />
            </div>
          )}
        </div>
      </div>

      {/* AI助手浮窗 */}
      <AIFloatingWindow
        chatId={`practice-${exerciseId}`}
        hideTrigger
        open={aiOpen}
        onOpenChange={setAiOpen}
        contextInfo={{
          projectTitle: context?.lessonTitle,
          userCode: codeRef.current || exercise?.initialCode,
        }}
      />
    </div>
  );
}
