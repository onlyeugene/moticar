export interface AppState {
  isAppReady: boolean;
  theme: "light" | "dark" | "system";
  selectedCarId?: string;
  setAppReady: (ready: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setSelectedCarId: (id: string) => void;
}
