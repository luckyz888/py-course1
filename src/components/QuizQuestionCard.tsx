import type { QuizQuestion } from '../types';
import CodeEditor from './CodeEditor';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  questionIndex: number;
  answer: string;
  onAnswerChange: (answer: string) => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizQuestionCard({ question, questionIndex, answer, onAnswerChange }: QuizQuestionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 题号 + 题目 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-8 h-8 rounded-lg bg-[#1e1b4b] text-white text-sm font-bold flex items-center justify-center">
            {questionIndex + 1}
          </span>
          <div className="flex-1">
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-[#1e1b4b]/10 text-[#1e1b4b] mb-2">
              {question.type === 'choice' ? '选择题' : question.type === 'fill' ? '填空题' : '编程题'}
            </span>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{question.question}</p>
          </div>
        </div>
      </div>

      {/* 答题区域 */}
      <div className="p-6">
        {question.type === 'choice' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onAnswerChange(option)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                  answer === option
                    ? 'border-[#f59e0b] bg-[#f59e0b]/5 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`shrink-0 w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center ${
                    answer === option
                      ? 'bg-[#f59e0b] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {OPTION_LABELS[idx]}
                </span>
                <span className={answer === option ? 'text-[#1e1b4b] font-medium' : 'text-gray-700'}>
                  {option}
                </span>
              </button>
            ))}
          </div>
        )}

        {question.type === 'fill' && (
          <div>
            <input
              type="text"
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="请输入答案…"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#f59e0b] focus:outline-none transition-colors text-gray-800 placeholder:text-gray-400"
            />
          </div>
        )}

        {question.type === 'coding' && (
          <CodeEditor
            code={question.initialCode || ''}
            onCodeChange={onAnswerChange}
            height="300px"
          />
        )}
      </div>
    </div>
  );
}
