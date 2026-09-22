import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import type { Case, Evidence, Artifact } from '../types';

interface CaseState {
  cases: Case[];
  activeCaseId: string | null;
  addCase: (newCase: Omit<Case, 'id' | 'createdAt' | 'findings' | 'status' | 'evidence'>) => void;
  setActiveCase: (id: string) => void;
  updateCaseStatus: (id: string, status: Case['status']) => void;
  addEvidence: (caseId: string, evidence: Omit<Evidence, 'id' | 'addedAt'>) => void;
  updateEvidenceNotes: (caseId: string, evidenceId: string, notes: string) => void;
  deleteEvidence: (caseId: string, evidenceId: string) => void;
  updateArtifact: (caseId: string, evidenceId: string, artifactId: string, updates: Partial<Artifact>) => void;
  updateBoard: (caseId: string, nodes: any[], edges: any[]) => void;
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
          evidence: [],
        };
        return { cases: [...state.cases, fullCase] };
      }),
      setActiveCase: (id) => set({ activeCaseId: id }),
      updateCaseStatus: (id, status) => set((state) => ({
        cases: state.cases.map(c => c.id === id ? { ...c, status } : c)
      })),
      addEvidence: (caseId, evidenceData) => set((state) => ({
        cases: state.cases.map(c => {
          if (c.id === caseId) {
            const newEvidence: Evidence = {
              ...evidenceData,
              id: `EV-${String(c.evidence.length + 1).padStart(3, '0')}`,
              addedAt: new Date().toISOString()
            };
            // Assign evidenceId to parsed artifacts
            newEvidence.artifacts = newEvidence.artifacts.map((a, i) => ({
              ...a,
              id: `ART-${newEvidence.id}-${i}`,
              evidenceId: newEvidence.id
            }));
            return { ...c, evidence: [...c.evidence, newEvidence] };
          }
          return c;
        })
      })),
      updateEvidenceNotes: (caseId, evidenceId, notes) => set((state) => ({
        cases: state.cases.map(c => {
          if (c.id === caseId) {
            return {
              ...c,
              evidence: c.evidence.map(e => e.id === evidenceId ? { ...e, notes } : e)
            };
          }
          return c;
        })
      })),
      deleteEvidence: (caseId, evidenceId) => set((state) => ({
        cases: state.cases.map(c => {
          if (c.id === caseId) {
            return {
              ...c,
              evidence: c.evidence.filter(e => e.id !== evidenceId)
            };
          }
          return c;
        })
      })),
      updateArtifact: (caseId, evidenceId, artifactId, updates) => set((state) => ({
        cases: state.cases.map(c => {
          if (c.id === caseId) {
            return {
              ...c,
              evidence: c.evidence.map(e => {
                if (e.id === evidenceId) {
                  return {
                    ...e,
                    artifacts: e.artifacts.map(a => a.id === artifactId ? { ...a, ...updates } : a)
                  };
                }
                return e;
              })
            };
          }
          return c;
        })
      })),
      updateBoard: (caseId, nodes, edges) => set((state) => ({
        cases: state.cases.map(c => c.id === caseId ? { ...c, board: { nodes, edges } } : c)
      })),
    }),
    {
      name: 'forensicdesk-cases',
      storage: createJSONStorage(() => storage),
    }
  )
);
