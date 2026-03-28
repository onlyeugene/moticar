export interface AppState {
  isAppReady: boolean;
  theme: "light" | "dark" | "system";
  selectedCarId?: string;
  scanningProgress: {
    picturesCompleted: boolean;
    licenseCompleted: boolean;
  };
  tempCapturedImage: string | null;
  setAppReady: (ready: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setSelectedCarId: (id: string) => void;
  setScanningProgress: (progress: Partial<AppState["scanningProgress"]>) => void;
  setTempCapturedImage: (uri: string | null) => void;
}
