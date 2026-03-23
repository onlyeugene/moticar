import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "@/types/app";

/**
 * Base Zustand store for global application state with persistence.
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAppReady: false,
      theme: "system",
      selectedCarId: undefined,
      setAppReady: (ready) => set({ isAppReady: ready }),
      setTheme: (theme) => set({ theme }),
      setSelectedCarId: (id) => set({ selectedCarId: id }),
    }),
    {
      name: "moticar-app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
