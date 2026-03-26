import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseService } from "@/services/api/expenseService";
import { CreateExpenseInput, UpdateExpenseInput } from "@/types/expense";

/**
 * Expense Hooks
 *
 * Provides React Query hooks for all expense-related actions.
 */

/** Get standardized expense categories with budget tracking */
export const useExpenseCategories = (carId?: string, enabled = true) => {
  return useQuery({
    queryKey: ["expenses", "categories", carId],
    queryFn: () => expenseService.getExpenseCategories(carId),
    // 🛡️ Guard: Only fetch when carId is available as the backend 
    // requires a car context to return enriched budget/spend data.
    enabled: !!carId && enabled,
  });
};

/** Log a new expense */
export const useLogExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseInput) => expenseService.logExpense(data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries (e.g., categories to refresh budget, spends/activity)
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
  });
};

/** Update an existing expense */
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseInput }) =>
      expenseService.updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
  });
};

/** Delete an expense */
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseService.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
  });
};

/** Get all expenses for a specific car */
export const useExpensesByCarId = (carId: string, enabled = true) => {
  return useQuery({
    queryKey: ["expenses", "car", carId],
    queryFn: () => expenseService.getExpensesByCarId(carId),
    enabled: !!carId && enabled,
  });
};

/** Get valuation of a car */
export const useValuation = (carId: string, enabled = true) => {
  return useQuery({
    queryKey: ["expenses", "valuation", carId],
    queryFn: () => expenseService.getEstimatedValuation(carId),
    enabled: !!carId && enabled,
    staleTime: 5 * 60 * 1000,
  });
};
