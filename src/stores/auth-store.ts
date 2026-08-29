import { create } from "zustand";
import type { AuthUser } from "@/features/auth/types";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
