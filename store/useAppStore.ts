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
      scannedCarData: null,
      scannedLicenseData: null,
      activeActivityTab: "Trips",
      isDiagnosticActive: false,
      setAppReady: (ready) => set({ isAppReady: ready }),
      setTheme: (theme) => set({ theme }),
      setSelectedCarId: (id) => set({ selectedCarId: id }),
      setScanningProgress: (progress) =>
        set((state) => ({
          scanningProgress: { ...state.scanningProgress, ...progress },
        })),
      setTempCapturedImage: (uri) => set({ tempCapturedImage: uri }),
      setScannedCarData: (data) => set({ scannedCarData: data }),
      setScannedLicenseData: (data) => set({ scannedLicenseData: data }),
      setActiveActivityTab: (tab) => set({ activeActivityTab: tab }),
      setDiagnosticActive: (active) => set({ isDiagnosticActive: active }),
      resetScanningState: () =>
        set({
          scanningProgress: {
            picturesCompleted: false,
            licenseCompleted: false,
          },
          tempCapturedImage: null,
          scannedCarData: null,
          scannedLicenseData: null,
        }),
    }),
    {
      name: "moticar-app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        scanningProgress: state.scanningProgress,
        theme: state.theme,
        selectedCarId: state.selectedCarId,
        scannedCarData: state.scannedCarData,
        scannedLicenseData: state.scannedLicenseData,
        activeActivityTab: state.activeActivityTab,
      }),
    }
  )
);
