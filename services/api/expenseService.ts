import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/config/apiRoutes";
import { 
  CreateExpenseInput, 
  Expense, 
  CategoriesResponse, 
  ValuationBreakdown, 
  PriceRecommendationInput, 
  PriceRecommendation,
  UpdateExpenseInput
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

  /** Get standardized expense categories with budget tracking */
  getExpenseCategories: async (carId?: string): Promise<CategoriesResponse> => {
    const response = await apiClient.get(API_ROUTES.EXPENSES.CATEGORIES, { params: { carId } });
    console.log("Categories Response:", JSON.stringify(response.data, null, 2));
    return response.data;
  },

  /** Get estimated car valuation grading */
  getEstimatedValuation: async (carId: string): Promise<ValuationBreakdown> => {
    const response = await apiClient.get(API_ROUTES.EXPENSES.VALUATION(carId));
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
