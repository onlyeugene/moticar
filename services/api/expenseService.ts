import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/config/apiRoutes";
import { 
  CreateExpenseInput, 
  Expense, 
  CategoriesResponse, 
  ValuationBreakdown, 
  PriceRecommendationInput, 
  PriceRecommendation 
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
};
