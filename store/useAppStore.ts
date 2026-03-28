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
      scanningProgress: {
        picturesCompleted: false,
        licenseCompleted: false,
      },
      tempCapturedImage: null,
      setAppReady: (ready) => set({ isAppReady: ready }),
      setTheme: (theme) => set({ theme }),
      setSelectedCarId: (id) => set({ selectedCarId: id }),
      setScanningProgress: (progress) =>
        set((state) => ({
          scanningProgress: { ...state.scanningProgress, ...progress },
        })),
      setTempCapturedImage: (uri) => set({ tempCapturedImage: uri }),
    }),
    {
      name: "moticar-app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        scanningProgress: state.scanningProgress,
        theme: state.theme,
        selectedCarId: state.selectedCarId,
      }),
    }
  )
);
