import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BootcampProgress, AIChatMessage } from '../types';

interface BootcampState {
  projectProgress: Record<string, BootcampProgress>;
  chatHistories: Record<string, AIChatMessage[]>;

  // 进度相关
  saveCode: (projectId: string, code: string) => void;
  getCode: (projectId: string) => string;
  completeTask: (projectId: string, taskId: string) => void;
  isTaskCompleted: (projectId: string, taskId: string) => boolean;
  markProjectCompleted: (projectId: string) => void;
  isProjectCompleted: (projectId: string) => boolean;
  getProjectProgress: (projectId: string) => BootcampProgress | undefined;
  getOverallProgress: () => number;

  // AI聊天相关
  addChatMessage: (projectId: string, message: AIChatMessage) => void;
  updateChatMessage: (projectId: string, messageId: string, content: string) => void;
  getChatHistory: (projectId: string) => AIChatMessage[];
  clearChatHistory: (projectId: string) => void;
}

export const useBootcampStore = create<BootcampState>()(
  persist(
    (set, get) => ({
      projectProgress: {},
      chatHistories: {},

      saveCode: (projectId, code) => {
        set((state) => {
          const existing = state.projectProgress[projectId];
          return {
            projectProgress: {
              ...state.projectProgress,
              [projectId]: {
                projectId,
                code,
                completedTasks: existing?.completedTasks ?? [],
                isCompleted: existing?.isCompleted ?? false,
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },

      getCode: (projectId) => {
        return get().projectProgress[projectId]?.code ?? '';
      },

      completeTask: (projectId, taskId) => {
        set((state) => {
          const existing = state.projectProgress[projectId];
          const completedTasks = existing?.completedTasks ?? [];
          if (completedTasks.includes(taskId)) return state;
          return {
            projectProgress: {
              ...state.projectProgress,
              [projectId]: {
                projectId,
                code: existing?.code ?? '',
                completedTasks: [...completedTasks, taskId],
                isCompleted: existing?.isCompleted ?? false,
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },

      isTaskCompleted: (projectId, taskId) => {
        return get().projectProgress[projectId]?.completedTasks.includes(taskId) ?? false;
      },

      markProjectCompleted: (projectId) => {
        set((state) => {
          const existing = state.projectProgress[projectId];
          return {
            projectProgress: {
              ...state.projectProgress,
              [projectId]: {
                projectId,
                code: existing?.code ?? '',
                completedTasks: existing?.completedTasks ?? [],
                isCompleted: true,
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },

      isProjectCompleted: (projectId) => {
        return get().projectProgress[projectId]?.isCompleted ?? false;
      },

      getProjectProgress: (projectId) => {
        return get().projectProgress[projectId];
      },

      getOverallProgress: () => {
        const progress = get().projectProgress;
        const completedCount = Object.values(progress).filter((p) => p.isCompleted).length;
        return Math.round((completedCount / 10) * 100);
      },

      addChatMessage: (projectId, message) => {
        set((state) => {
          const history = state.chatHistories[projectId] ?? [];
          return {
            chatHistories: {
              ...state.chatHistories,
              [projectId]: [...history, message],
            },
          };
        });
      },

      updateChatMessage: (projectId, messageId, content) => {
        set((state) => {
          const history = state.chatHistories[projectId] ?? [];
          return {
            chatHistories: {
              ...state.chatHistories,
              [projectId]: history.map((msg) =>
                msg.id === messageId ? { ...msg, content } : msg
              ),
            },
          };
        });
      },

      getChatHistory: (projectId) => {
        return get().chatHistories[projectId] ?? [];
      },

      clearChatHistory: (projectId) => {
        set((state) => {
          const { [projectId]: _, ...rest } = state.chatHistories;
          return { chatHistories: rest };
        });
      },
    }),
    { name: 'bootcamp-store' }
  )
);
