import type { QuizQuestion } from '../types';

interface QuizResultCardProps {
  question: QuizQuestion;
  questionIndex: number;
  userAnswer: string;
  isCorrect: boolean;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizResultCard({ question, questionIndex, userAnswer, isCorrect }: QuizResultCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden ${isCorrect ? 'border-[#10b981]/30' : 'border-[#f43f5e]/30'}`}>
      {/* 题号 + 题目 + 对错标识 */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <span className={`shrink-0 w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center ${
            isCorrect ? 'bg-[#10b981] text-white' : 'bg-[#f43f5e] text-white'
          }`}>
            {questionIndex + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-[#1e1b4b]/10 text-[#1e1b4b]">
                {question.type === 'choice' ? '选择题' : question.type === 'fill' ? '填空题' : '编程题'}
              </span>
              <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full ${
                isCorrect ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#f43f5e]/10 text-[#f43f5e]'
              }`}>
                {isCorrect ? '✓ 正确' : '✗ 错误'}
              </span>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{question.question}</p>
          </div>
        </div>
      </div>

      {/* 答案详情 */}
      <div className="p-5 space-y-3">
        {question.type === 'choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, idx) => {
              const isUserChoice = userAnswer === option;
              const isCorrectOption = question.answer === option;
              return (
                <div
                  key={idx}
                  className={`px-4 py-2.5 rounded-lg border-2 flex items-center gap-3 ${
                    isCorrectOption
                      ? 'border-[#10b981]/40 bg-[#10b981]/5'
                      : isUserChoice
                      ? 'border-[#f43f5e]/40 bg-[#f43f5e]/5'
                      : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <span className={`shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                    isCorrectOption
                      ? 'bg-[#10b981] text-white'
                      : isUserChoice
                      ? 'bg-[#f43f5e] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {OPTION_LABELS[idx]}
                  </span>
                  <span className={`text-sm ${
                    isCorrectOption ? 'text-[#10b981] font-medium' : isUserChoice ? 'text-[#f43f5e] font-medium' : 'text-gray-500'
                  }`}>
                    {option}
                  </span>
                  {isCorrectOption && <span className="ml-auto text-[#10b981] text-sm font-bold">✓</span>}
                  {isUserChoice && !isCorrectOption && <span className="ml-auto text-[#f43f5e] text-sm font-bold">✗</span>}
                </div>
              );
            })}
          </div>
        )}

        {question.type === 'fill' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">你的答案</div>
              <div className={`font-mono text-sm ${isCorrect ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                {userAnswer || '（未作答）'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#10b981]/5 border border-[#10b981]/20">
              <div className="text-xs text-gray-500 mb-1">正确答案</div>
              <div className="font-mono text-sm text-[#10b981] font-medium">{question.answer}</div>
            </div>
          </div>
        )}

        {question.type === 'coding' && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">你的代码</div>
              <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap">{userAnswer || '（未作答）'}</pre>
            </div>
            <div className="p-3 rounded-lg bg-[#10b981]/5 border border-[#10b981]/20">
              <div className="text-xs text-gray-500 mb-1">参考答案</div>
              <pre className="font-mono text-sm text-[#10b981] whitespace-pre-wrap">{question.answer}</pre>
            </div>
          </div>
        )}

        {/* 解析 */}
        <div className="p-3 rounded-lg bg-[#1e1b4b]/5 border border-[#1e1b4b]/10">
          <div className="text-xs font-medium text-[#1e1b4b] mb-1">解析</div>
          <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
        </div>
      </div>
    </div>
  );
}
