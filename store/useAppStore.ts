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
      isPairing: false,
      scanningProgress: {
        picturesCompleted: false,
        licenseCompleted: false,
      },
      tempCapturedImage: null,
      scannedCarData: null,
      scannedLicenseData: null,
      activeActivityTab: "Trips",
      isDiagnosticActive: false,
      obdData: {},
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
      setIsPairing: (pairing) => set({ isPairing: pairing }),
      setObdData: (carId, data) =>
        set((state) => ({
          obdData: {
            ...state.obdData,
            [carId]: { ...(state.obdData[carId] || {}), ...data },
          },
        })),
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
      clearAppState: () =>
        set({
          selectedCarId: undefined,
          isDiagnosticActive: false,
          obdData: {},
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
        theme: state.theme,
        selectedCarId: state.selectedCarId,
        activeActivityTab: state.activeActivityTab,
        obdData: state.obdData,
      }),
    }
  )
);
