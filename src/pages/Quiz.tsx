import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipboardCheck, ArrowLeft, ArrowRight, RotateCcw, BookOpen, Loader2 } from 'lucide-react';
import { allQuizzes } from '../data/quizzes';
import { useQuizStore } from '../stores/quizStore';
import QuizQuestionCard from '../components/QuizQuestionCard';
import QuizResultCard from '../components/QuizResultCard';
import { runPython } from '../utils/pyodide';
import type { QuizResult } from '../types';

export default function Quiz() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const submitQuizResult = useQuizStore((s) => s.submitQuiz);

  const quiz = allQuizzes.find((q) => q.moduleId === moduleId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [correctMap, setCorrectMap] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const handleAnswerChange = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const evaluateCoding = async (code: string): Promise<boolean> => {
    try {
      const result = await runPython(code);
      return !result.error;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setShowSubmitConfirm(false);
    setIsSubmitting(true);

    const results: Record<string, boolean> = {};

    for (const question of quiz.questions) {
      const userAnswer = answers[question.id] || '';
      if (question.type === 'choice') {
        results[question.id] = userAnswer === question.answer;
      } else if (question.type === 'fill') {
        results[question.id] = userAnswer.trim() === question.answer.trim();
      } else {
        results[question.id] = await evaluateCoding(userAnswer);
      }
    }

    const correctCount = Object.values(results).filter(Boolean).length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);

    const quizResult: QuizResult = {
      moduleId: quiz.moduleId,
      score,
      totalQuestions: quiz.questions.length,
      answers,
      submittedAt: new Date().toISOString(),
    };

    submitQuizResult(quiz.moduleId, quizResult);
    setCorrectMap(results);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleRetry = () => {
    setAnswers({});
    setCorrectMap({});
    setCurrentIndex(0);
    setSubmitted(false);
  };

  if (!quiz) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1e1b4b]/10 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-[#1e1b4b]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1e1b4b]">章节测评</h1>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center text-gray-400">
          未找到对应的测评内容
        </div>
      </div>
    );
  }

  // ===== 结果状态 =====
  if (submitted) {
    const correctCount = Object.values(correctMap).filter(Boolean).length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= 60;
    const circumference = 2 * Math.PI * 50;
    const offset = circumference * (1 - score / 100);

    return (
      <div className="space-y-6 animate-slide-up">
        {/* 标题 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1e1b4b]/10 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-[#1e1b4b]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1e1b4b]">{quiz.title} — 测评结果</h1>
        </div>

        {/* 总分 + 环形图 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
          <svg width="160" height="160" viewBox="0 0 120 120" className="mb-4">
            <circle cx="60" cy="60" r="50" stroke="#e5e7eb" strokeWidth="8" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke={passed ? '#10b981' : '#f43f5e'}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{
                ['--circumference' as string]: circumference,
                ['--offset' as string]: offset,
                transition: 'stroke-dashoffset 1s ease-out',
              }}
              className="animate-circle-progress"
            />
            <text x="60" y="55" textAnchor="middle" className="text-3xl font-bold" fill={passed ? '#10b981' : '#f43f5e'}>
              {score}
            </text>
            <text x="60" y="72" textAnchor="middle" className="text-xs" fill="#9ca3af">
              分
            </text>
          </svg>
          <div className="text-center">
            <p className={`text-lg font-bold ${passed ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
              {passed ? '恭喜通过！' : '未通过，继续加油！'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              答对 {correctCount}/{quiz.questions.length} 题 · 及格线 60 分
            </p>
          </div>
        </div>

        {/* 各题详情 */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#1e1b4b]">题目详情</h2>
          {quiz.questions.map((q, idx) => (
            <QuizResultCard
              key={q.id}
              question={q}
              questionIndex={idx}
              userAnswer={answers[q.id] || ''}
              isCorrect={correctMap[q.id] ?? false}
            />
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#f59e0b] text-[#f59e0b] font-medium hover:bg-[#f59e0b]/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重新测评
          </button>
          <button
            onClick={() => navigate(`/courses/${quiz.moduleId}`)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e1b4b] text-white font-medium hover:bg-[#1e1b4b]/90 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            返回课程
          </button>
        </div>
      </div>
    );
  }

  // ===== 答题状态 =====
  const currentQuestion = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;
  const progressPercent = ((currentIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* 顶部标题 + 进度 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1e1b4b]/10 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-[#1e1b4b]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e1b4b]">{quiz.title}</h1>
            <p className="text-sm text-gray-500">章节测评</p>
          </div>
        </div>
        <div className="px-4 py-2 rounded-lg bg-[#1e1b4b]/5 text-[#1e1b4b] font-medium text-sm">
          第 {currentIndex + 1} 题 / 共 {quiz.questions.length} 题
        </div>
      </div>

      {/* 进度条 with gradient */}
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
          }}
        />
      </div>

      {/* 当前题目 */}
      <QuizQuestionCard
        question={currentQuestion}
        questionIndex={currentIndex}
        answer={answers[currentQuestion.id] || ''}
        onAnswerChange={(ans) => handleAnswerChange(currentQuestion.id, ans)}
      />

      {/* 底部导航 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          上一题
        </button>

        {isLast ? (
          <button
            onClick={() => setShowSubmitConfirm(true)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f59e0b] text-white font-bold hover:bg-[#f59e0b]/90 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                评判中…
              </>
            ) : (
              '提交测评'
            )}
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e1b4b] text-white font-medium hover:bg-[#1e1b4b]/90 transition-colors"
          >
            下一题
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 提交确认对话框 */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm mx-4">
            <h3 className="text-base font-semibold text-[#1e1b4b] mb-2">
              确认提交测评？
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              提交后将无法修改答案。
            </p>
            <p className="text-sm text-gray-500 mb-5">
              已作答 {Object.keys(answers).length} / {quiz.questions.length} 题
              {Object.keys(answers).length < quiz.questions.length && (
                <span className="text-[#f59e0b] font-medium">（还有未作答的题目）</span>
              )}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                继续答题
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm text-white bg-[#f59e0b] hover:bg-[#d97706] rounded-lg transition-colors font-medium"
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
