import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activityService } from "@/services/api/activityService";
import { expenseService } from "@/services/api/expenseService";
import { CreateTripInput, CreateReminderInput } from "@/types/activity";

/**
 * Activity Hooks
 * 
 * Provides React Query hooks for all activity-related actions.
 */

export const useTrips = (carId: string, month?: string, year?: string, week?: string) => {
  return useQuery({
    queryKey: ["activity", "trips", carId, month, year, week],
    queryFn: () => activityService.getTrips(carId, month, year, week),
    enabled: !!carId,
  });
};

export const useCreateManualTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTripInput) => activityService.createManualTrip(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activity", "trips", variables.carId] });
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTripInput> }) => 
      activityService.updateTrip(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["activity", "trips", response.trip.carId] });
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, carId }: { id: string; carId: string }) => 
      activityService.deleteTrip(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activity", "trips", variables.carId] });
    },
  });
};

export const useReminders = (carId: string) => {
  return useQuery({
    queryKey: ["activity", "reminders", carId],
    queryFn: () => activityService.getReminders(carId),
    enabled: !!carId,
  });
};

export const useCreateReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReminderInput) => activityService.createReminder(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activity", "reminders", variables.carId] });
    },
  });
};

export const useActivitySpends = (carId: string, month?: string, year?: string) => {
  return useQuery({
    queryKey: ["activity", "spends", carId, month, year],
    queryFn: async () => {
      const breakdown = await activityService.getSpendsChart(carId, month, year);
      // We still fetch all expenses for historical charts (like CPM) 
      // but we store them separately to avoid polluting the monthly breakdown.
      const allExpenses = await expenseService.getExpensesByCarId(carId);
      return {
        ...breakdown,
        allExpenses: allExpenses.expenses
      };
    },
    enabled: !!carId,
  });
};

export const useActivityInsights = (carId: string, month?: string, year?: string) => {
  return useQuery({
    queryKey: ["activity", "insights", carId, month, year],
    queryFn: () => activityService.getInsights(carId, month, year),
    enabled: !!carId,
  });
};

export const useMilestones = (carId: string) => {
  return useQuery({
    queryKey: ["activity", "milestones", carId],
    queryFn: () => activityService.getMilestones(carId),
    enabled: !!carId,
  });
};

export const useCreateMilestone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { carId: string; mileage: number; description?: string; timestamp?: string }) => 
      activityService.createMilestone(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activity", "milestones", variables.carId] });
      queryClient.invalidateQueries({ queryKey: ["cars", variables.carId] });
    },
  });
};

export const useResolveMilestone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: { status: 'confirmed' | 'rejected', mileage?: number } }) => 
      activityService.resolveMilestone(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["activity", "milestones", response.milestone.carId] });
      queryClient.invalidateQueries({ queryKey: ["cars", response.milestone.carId] });
    },
  });
};





