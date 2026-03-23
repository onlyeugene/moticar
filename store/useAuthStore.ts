import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState, User } from "@/types/auth";

/**
 * Zustand store for managing authentication state and tokens with persistence.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,

      setAuth: (token, refreshToken, user) => set({ token, refreshToken, user }),
      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : { ...userData } as any,
        })),

      clearAuth: () => set({ token: null, refreshToken: null, user: null }),
    }),
    {
      name: "moticar-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
