import apiClient from "@/config/apiClient";


export interface IKeyFinding {
  index: number;
  title: string;
  detail: string;
  severity: 'info' | 'warning' | 'critical';
  recommendedAction?: string;
}

export interface IMaintenanceItem {
  task: string;
  dueMileage?: number;
  dueDate?: string;
  estimatedCost?: number;
  currency?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ISpendingSummary {
  totalSpent: number;
  monthlyAverage: number;
  currency: string;
  periodMonths: number;
  breakdown: { category: string; percentage: number }[];
  comparisonInsight?: string;
}

export interface IDiagnosis {
  _id: string;
  overallScore: number;
  spendingSummary: ISpendingSummary;
  keyFindings: IKeyFinding[];
  maintenanceCalendar: IMaintenanceItem[];
  costForecast: string;
  generatedAt: string;
}

export interface IDiagnosisStatus {
  canGenerate: boolean;
  daysRemaining: number;
  nextAvailableAt: string | null;
  lastDiagnosis: IDiagnosis | null;
}

const diagnosisService = {
  getStatus: async (carId: string): Promise<IDiagnosisStatus> => {
    const response = await apiClient.get(`/diagnosis/${carId}`);
    return response.data;
  },

  generate: async (carId: string): Promise<{ diagnosis: IDiagnosis }> => {
    const response = await apiClient.post(`/diagnosis/${carId}/generate`);
    return response.data;
  },
};

export default diagnosisService;
