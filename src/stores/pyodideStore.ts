import { create } from 'zustand';

interface PyodideState {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  setLoaded: (loaded: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePyodideStore = create<PyodideState>((set) => ({
  isLoaded: false,
  isLoading: false,
  error: null,
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
