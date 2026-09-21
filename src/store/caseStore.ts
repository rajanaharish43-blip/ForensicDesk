import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import type { Case } from '../types';

interface CaseState {
  cases: Case[];
  activeCaseId: string | null;
  addCase: (newCase: Omit<Case, 'id' | 'createdAt' | 'findings' | 'status'>) => void;
  setActiveCase: (id: string) => void;
  updateCaseStatus: (id: string, status: Case['status']) => void;
}

// Create a custom storage wrapper for localforage to work with Zustand persist
const storage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await localforage.getItem(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localforage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localforage.removeItem(name);
  },
};

export const useCaseStore = create<CaseState>()(
  persist(
    (set) => ({
      cases: [],
      activeCaseId: null,
      addCase: (newCase) => set((state) => {
        const id = `CASE-${new Date().getFullYear()}-${String(state.cases.length + 1).padStart(3, '0')}`;
        const fullCase: Case = {
          ...newCase,
          id,
          createdAt: new Date().toISOString(),
          status: 'Active',
          findings: [],
        };
        return { cases: [...state.cases, fullCase] };
      }),
      setActiveCase: (id) => set({ activeCaseId: id }),
      updateCaseStatus: (id, status) => set((state) => ({
        cases: state.cases.map(c => c.id === id ? { ...c, status } : c)
      })),
    }),
    {
      name: 'forensicdesk-cases',
      storage: createJSONStorage(() => storage),
    }
  )
);
