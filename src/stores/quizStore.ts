import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizResult } from '../types';

interface QuizState {
  quizResults: Record<string, QuizResult>;
  submitQuiz: (moduleId: string, result: QuizResult) => void;
  getQuizResult: (moduleId: string) => QuizResult | undefined;
  getBestScore: (moduleId: string) => number;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      quizResults: {},
      submitQuiz: (moduleId, result) => {
        set((state) => {
          const existing = state.quizResults[moduleId];
          if (existing && existing.score >= result.score) return state;
          return {
            quizResults: {
              ...state.quizResults,
              [moduleId]: result,
            },
          };
        });
      },
      getQuizResult: (moduleId) => {
        return get().quizResults[moduleId];
      },
      getBestScore: (moduleId) => {
        return get().quizResults[moduleId]?.score ?? 0;
      },
    }),
    { name: 'quiz-results' }
  )
);
