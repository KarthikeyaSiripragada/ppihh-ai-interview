import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  email: string;
  role: "candidate" | "interviewer";
  verified: boolean;
};

type Store = {
  user: User | null;
  setUser: (u: User) => void;
  signOut: () => void;
};

export const useAppStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      setUser: (u) => set({ user: u }),
      signOut: () => set({ user: null }),
    }),
    { name: "ppihh-user" }
  )
);
