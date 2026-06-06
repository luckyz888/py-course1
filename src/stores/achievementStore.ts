import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LevelInfo {
  icon: string;
  name: string;
  minPoints: number;
  nextLevelPoints: number | null;
}

const LEVELS: LevelInfo[] = [
  { icon: '🌱', name: '初学者', minPoints: 0, nextLevelPoints: 100 },
  { icon: '📖', name: '入门者', minPoints: 100, nextLevelPoints: 300 },
  { icon: '🔬', name: '探索者', minPoints: 300, nextLevelPoints: 600 },
  { icon: '📊', name: '分析师', minPoints: 600, nextLevelPoints: 1000 },
  { icon: '🏆', name: '专家', minPoints: 1000, nextLevelPoints: 1500 },
  { icon: '👑', name: '大师', minPoints: 1500, nextLevelPoints: null },
];

interface AchievementState {
  points: number;
  earnedBadges: string[];
  streak: number;
  longestStreak: number;
  studyDays: string[];
  addPoints: (amount: number) => void;
  earnBadge: (badgeId: string) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  recordStudyDay: () => void;
  checkBadges: (context: { completedLessons: string[]; passedExercises: string[]; quizResults: Record<string, { score: number; totalQuestions: number }> }) => string[];
  getLevel: () => LevelInfo;
  getLevelProgress: () => number;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      points: 0,
      earnedBadges: [],
      streak: 0,
      longestStreak: 0,
      studyDays: [],

      addPoints: (amount: number) => {
        set((state) => ({ points: state.points + amount }));
      },

      earnBadge: (badgeId: string) => {
        set((state) => {
          if (state.earnedBadges.includes(badgeId)) return state;
          return { earnedBadges: [...state.earnedBadges, badgeId] };
        });
      },

      incrementStreak: () => {
        set((state) => {
          const newStreak = state.streak + 1;
          return { streak: newStreak, longestStreak: Math.max(newStreak, state.longestStreak) };
        });
      },

      resetStreak: () => {
        set({ streak: 0 });
      },

      recordStudyDay: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          if (state.studyDays.includes(today)) return state;
          return { studyDays: [...state.studyDays, today] };
        });
      },

      checkBadges: (context) => {
        const state = get();
        const newBadges: string[] = [];

        if (context.completedLessons.length >= 1 && !state.earnedBadges.includes('first-lesson')) {
          newBadges.push('first-lesson');
        }
        if (context.passedExercises.length >= 1 && !state.earnedBadges.includes('first-exercise')) {
          newBadges.push('first-exercise');
        }
        if (state.streak >= 7 && !state.earnedBadges.includes('streak-7')) {
          newBadges.push('streak-7');
        }
        if (state.streak >= 30 && !state.earnedBadges.includes('streak-30')) {
          newBadges.push('streak-30');
        }
        if (state.points >= 100 && !state.earnedBadges.includes('points-100')) {
          newBadges.push('points-100');
        }
        if (state.points >= 500 && !state.earnedBadges.includes('points-500')) {
          newBadges.push('points-500');
        }
        if (state.points >= 1000 && !state.earnedBadges.includes('points-1000')) {
          newBadges.push('points-1000');
        }
        if (context.passedExercises.length >= 10 && !state.earnedBadges.includes('exercises-10')) {
          newBadges.push('exercises-10');
        }

        const hasPerfectQuiz = Object.values(context.quizResults).some(r => r.score === r.totalQuestions && r.totalQuestions > 0);
        if (hasPerfectQuiz && !state.earnedBadges.includes('perfect-quiz')) {
          newBadges.push('perfect-quiz');
        }

        const hasQuizPass = Object.values(context.quizResults).some(r => r.score > 0);
        if (hasQuizPass && !state.earnedBadges.includes('first-quiz')) {
          newBadges.push('first-quiz');
        }

        for (const badgeId of newBadges) {
          get().earnBadge(badgeId);
        }

        return newBadges;
      },

      getLevel: () => {
        const pts = get().points;
        for (let i = LEVELS.length - 1; i >= 0; i--) {
          if (pts >= LEVELS[i].minPoints) return LEVELS[i];
        }
        return LEVELS[0];
      },

      getLevelProgress: () => {
        const pts = get().points;
        const level = get().getLevel();
        if (level.nextLevelPoints === null) return 100;
        const range = level.nextLevelPoints - level.minPoints;
        const progress = pts - level.minPoints;
        return Math.round((progress / range) * 100);
      },
    }),
    { name: 'achievement-store' }
  )
);
