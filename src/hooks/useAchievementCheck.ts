import { useCallback } from 'react';
import { useAchievementStore } from '../stores/achievementStore';
import { useCourseStore } from '../stores/courseStore';
import { useExerciseStore } from '../stores/exerciseStore';
import { useQuizStore } from '../stores/quizStore';

export function useAchievementCheck() {
  const { checkBadges } = useAchievementStore();
  const { completedLessons } = useCourseStore();
  const { exerciseResults } = useExerciseStore();
  const { quizResults } = useQuizStore();

  const check = useCallback(() => {
    const passedExercises = Object.values(exerciseResults)
      .filter(r => r.passed)
      .map(r => r.exerciseId);

    const quizContext = Object.fromEntries(
      Object.entries(quizResults).map(([key, val]) => [
        key,
        { score: val.score, totalQuestions: val.totalQuestions }
      ])
    );

    return checkBadges({
      completedLessons,
      passedExercises,
      quizResults: quizContext,
    });
  }, [checkBadges, completedLessons, exerciseResults, quizResults]);

  return { check };
}
