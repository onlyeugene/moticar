import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/config/apiRoutes";
import { 
  CreateExpenseInput, 
  Expense, 
  CategoriesResponse, 
  ValuationBreakdown, 
  PriceRecommendationInput, 
  PriceRecommendation,
  UpdateExpenseInput,
  ScanReceiptResponse
} from "@/types/expense";

/**
 * Expense Service
 * 
 * Handles expense logging, categories, valuation, and price recommendations.
 */
export const expenseService = {
  /** Log a new expense (with repetitive check) */
  logExpense: async (data: CreateExpenseInput): Promise<{ message: string; expense: Expense; alert?: string }> => {
    const response = await apiClient.post(API_ROUTES.EXPENSES.BASE, data);
    return response.data;
  },

  /** Scan a receipt and extract details (AI scan) */
  scanReceipt: async (file: any): Promise<ScanReceiptResponse> => {
    const formData = new FormData();
    const filename = file.uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename || "");
    const type = match ? `image/${match[1]}` : "image";

    formData.append("receipt", {
      uri: file.uri,
      name: filename,
      type,
    } as any);

    const response = await apiClient.post(API_ROUTES.EXPENSES.SCAN_RECEIPT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },

  /** Upload multiple receipts for an expense */
  uploadReceipts: async (files: any[]): Promise<{ urls: string[] }> => {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      const filename = file.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : "image";
      
      formData.append("files", {
        uri: file.uri,
        name: filename || `receipt_${index}.jpg`,
        type,
      } as any);
    });

    const response = await apiClient.post(API_ROUTES.EXPENSES.UPLOAD_RECEIPT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },

  /** Upload a receipt as proof (No AI scan) */
  uploadReceipt: async (file: any, carId?: string): Promise<ScanReceiptResponse> => {
    const formData = new FormData();
    
    if (file.uri) {
      const uriParts = file.uri.split('.');
      let fileType = uriParts[uriParts.length - 1].toLowerCase();
      if (fileType === 'jpg') fileType = 'jpeg';

      formData.append("file", {
        uri: file.uri,
        name: `receipt.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    } else {
      formData.append("file", file);
    }

    if (carId) {
      formData.append("carId", carId);
    }

    const response = await apiClient.post(API_ROUTES.EXPENSES.UPLOAD_RECEIPT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /** Get standardized expense categories with budget tracking */
  getExpenseCategories: async (carId?: string): Promise<CategoriesResponse> => {
    const response = await apiClient.get(API_ROUTES.EXPENSES.CATEGORIES, { params: { carId } });
    // console.log("Categories Response:", JSON.stringify(response.data, null, 2));
    return response.data;
  },

  /** Get estimated car valuation grading */
  getEstimatedValuation: async (carId: string): Promise<ValuationBreakdown> => {
    const response = await apiClient.get(API_ROUTES.EXPENSES.VALUATION(carId));
    return response.data;
  },

  /** Get valuation status (canGenerate, daysRemaining) */
  getValuationStatus: async (carId: string): Promise<any> => {
    const response = await apiClient.get(`${API_ROUTES.EXPENSES.VALUATION(carId)}/status`);
    return response.data;
  },

  /** Get AI-powered price recommendation for a category */
  getPriceRecommendation: async (data: PriceRecommendationInput): Promise<PriceRecommendation> => {
    const response = await apiClient.post(API_ROUTES.EXPENSES.RECOMMEND_PRICE, data);
    return response.data;
  },

  /** Update an existing expense */
  updateExpense: async (id: string, data: UpdateExpenseInput): Promise<{ message: string; expense: Expense }> => {
    const response = await apiClient.patch(API_ROUTES.EXPENSES.DETAIL(id), data);
    return response.data;
  },

  /** Delete an expense */
  deleteExpense: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(API_ROUTES.EXPENSES.DETAIL(id));
    return response.data;
  },

  /** Get all expenses for a specific car */
  getExpensesByCarId: async (carId: string): Promise<{ count: number; expenses: Expense[] }> => {
    const response = await apiClient.get(API_ROUTES.EXPENSES.BY_CAR(carId));
    return response.data;
  },
};
