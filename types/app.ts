export interface ScannedLicenseData {
  vin: string | null;
  plate?: string | null;
  plateNumber?: string | null;
  engineNumber: string | null;
  dateIssued: string | null;
  expiryDate: string | null;
  ownerAddress: string | null;
  isDocument?: boolean;
  confidenceScore?: number;
  error?: string;
  photoUrl?: string;
}

export interface ObdTelemetry {
  fuelLevel?: number;
  voltage?: string;
  mileage?: number;
  lastSeen?: string;
  status?: "online" | "offline" | "moving" | "pairing";
}

export interface AppState {
  isAppReady: boolean;
  theme: "light" | "dark" | "system";
  selectedCarId?: string;
  obdData: Record<string, ObdTelemetry>;
  scanningProgress: {
    picturesCompleted: boolean;
    licenseCompleted: boolean;
  };
  tempCapturedImage: string | null;
  scannedCarData: any | null;
  scannedLicenseData: ScannedLicenseData | null;
  activeActivityTab: string;
  isDiagnosticActive: boolean;
  setAppReady: (ready: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setSelectedCarId: (id: string) => void;
  setScanningProgress: (progress: Partial<AppState["scanningProgress"]>) => void;
  setTempCapturedImage: (uri: string | null) => void;
  setScannedCarData: (data: any | null) => void;
  setScannedLicenseData: (data: ScannedLicenseData | null) => void;
  setActiveActivityTab: (tab: string) => void;
  setDiagnosticActive: (active: boolean) => void;
  setObdData: (carId: string, data: Partial<ObdTelemetry>) => void;
  resetScanningState: () => void;
  clearAppState: () => void;
}
