import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { allModules } from '../data/modules';

interface CourseState {
  completedLessons: string[];
  markLessonComplete: (lessonId: string) => void;
  isLessonComplete: (lessonId: string) => boolean;
  getModuleProgress: (moduleId: string) => number;
  getChapterProgress: (chapterId: string, lessonIds: string[]) => number;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      markLessonComplete: (lessonId: string) => {
        set((state) => {
          if (state.completedLessons.includes(lessonId)) return state;
          return { completedLessons: [...state.completedLessons, lessonId] };
        });
      },
      isLessonComplete: (lessonId: string) => {
        return get().completedLessons.includes(lessonId);
      },
      getModuleProgress: (moduleId: string) => {
        const mod = allModules.find((m) => m.id === moduleId);
        if (!mod) return 0;
        const allLessonIds = mod.chapters.flatMap((ch) => ch.lessons.map((l) => l.id));
        if (allLessonIds.length === 0) return 0;
        const completed = allLessonIds.filter((id) => get().completedLessons.includes(id));
        return Math.round((completed.length / allLessonIds.length) * 100);
      },
      getChapterProgress: (_chapterId: string, lessonIds: string[]) => {
        if (lessonIds.length === 0) return 0;
        const completed = lessonIds.filter((id) => get().completedLessons.includes(id));
        return Math.round((completed.length / lessonIds.length) * 100);
      },
    }),
    { name: 'course-progress' }
  )
);
