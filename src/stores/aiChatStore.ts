import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GlobalChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIChatState {
  messages: GlobalChatMessage[];
  addMessage: (message: GlobalChatMessage) => void;
  updateMessage: (messageId: string, content: string) => void;
  clearMessages: () => void;
}

export const useAIChatStore = create<AIChatState>()(
  persist(
    (set) => ({
      messages: [],

      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      },

      updateMessage: (messageId, content) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId ? { ...msg, content } : msg
          ),
        }));
      },

      clearMessages: () => {
        set({ messages: [] });
      },
    }),
    { name: 'ai-chat-store' }
  )
);
