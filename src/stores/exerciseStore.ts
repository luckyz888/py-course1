import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExerciseResult } from '../types';

interface ExerciseState {
  exerciseResults: Record<string, ExerciseResult>;
  submitExercise: (exerciseId: string, code: string, passed: boolean) => void;
  isExercisePassed: (exerciseId: string) => boolean;
  getExerciseResult: (exerciseId: string) => ExerciseResult | undefined;
}

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      exerciseResults: {},
      submitExercise: (exerciseId, code, passed) => {
        set((state) => ({
          exerciseResults: {
            ...state.exerciseResults,
            [exerciseId]: {
              exerciseId,
              passed,
              submittedCode: code,
              submittedAt: new Date().toISOString(),
            },
          },
        }));
      },
      isExercisePassed: (exerciseId) => {
        return get().exerciseResults[exerciseId]?.passed ?? false;
      },
      getExerciseResult: (exerciseId) => {
        return get().exerciseResults[exerciseId];
      },
    }),
    { name: 'exercise-results' }
  )
);
