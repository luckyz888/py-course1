import type { TestCase } from '../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface TestCaseResult {
  testCase: TestCase;
  index: number;
  passed: boolean;
  actualOutput: string;
}

interface ExerciseJudgeProps {
  results: TestCaseResult[];
}

export default function ExerciseJudge({ results }: ExerciseJudgeProps) {
  const allPassed = results.length > 0 && results.every((r) => r.passed);

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div
        className={`px-4 py-3 text-white font-medium ${
          allPassed ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      >
        {allPassed ? '🎉 恭喜通过！' : '💪 继续努力！'}
      </div>
      <div className="divide-y divide-gray-100">
        {results.map((result) => (
          <div
            key={result.index}
            className={`px-4 py-3 flex items-start gap-3 ${
              result.passed ? 'bg-emerald-50/50' : 'bg-rose-50/50'
            }`}
          >
            {result.passed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${
                  result.passed ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                测试用例 {result.index + 1}：{result.passed ? '通过' : '未通过'}
              </p>
              {!result.passed && (
                <div className="mt-2 space-y-1 text-xs">
                  <p className="text-gray-500">
                    输入：
                    <code className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded font-mono">
                      {result.testCase.input}
                    </code>
                  </p>
                  <p className="text-gray-500">
                    预期输出：
                    <code className="ml-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-mono">
                      {result.testCase.expectedOutput}
                    </code>
                  </p>
                  <p className="text-gray-500">
                    实际输出：
                    <code className="ml-1 px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded font-mono">
                      {result.actualOutput}
                    </code>
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
