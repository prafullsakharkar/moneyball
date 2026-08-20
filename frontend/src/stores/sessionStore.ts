import { create } from 'zustand';
import type { Session, SecurityEvent } from '@domain/index';

interface SessionState {
  currentSessionId: string | null;
  sessions: Session[];
  securityEvents: SecurityEvent[];
  isLoading: boolean;
  setSessions: (sessions: Session[], currentSessionId: string) => void;
  removeSession: (sessionId: string) => void;
  setSecurityEvents: (events: SecurityEvent[]) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  currentSessionId: null,
  sessions: [],
  securityEvents: [],
  isLoading: false,
  setSessions: (sessions, currentSessionId) => set({ sessions, currentSessionId, isLoading: false }),
  removeSession: (sessionId) => set((s) => ({ sessions: s.sessions.filter((x) => x.id !== sessionId) })),
  setSecurityEvents: (events) => set({ securityEvents: events }),
  setLoading: (loading) => set({ isLoading: loading }),
  clear: () => set({ currentSessionId: null, sessions: [], securityEvents: [], isLoading: false }),
}));
