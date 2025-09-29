import { create } from "zustand";

export type Q = { id: string; topic: string; diff: "Easy"|"Medium"|"Hard"; text: string };
type Answer = { qid: string; text: string };

type SessionState = {
  questions: Q[];
  index: number;
  answers: Answer[];

  setQuestions: (qs: Q[]) => void;
  setIndex: (i: number) => void;
  next: () => void;
  prev: () => void;
  addAnswer: (a: Answer) => void;
};

export const useSession = create<SessionState>((set, get) => ({
  questions: [],
  index: 0,
  answers: [],

  setQuestions: (qs) => set({ questions: qs, index: 0, answers: [] }),
  setIndex: (i) => {
    const max = get().questions.length - 1;
    set({ index: Math.max(0, Math.min(i, max)) });
  },
  next: () => get().setIndex(get().index + 1),
  prev: () => get().setIndex(get().index - 1),
  addAnswer: (a) => set({ answers: [...get().answers, a] }),
}));
