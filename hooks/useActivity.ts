import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activityService } from "@/services/api/activityService";
import { CreateTripInput, CreateReminderInput } from "@/types/activity";

/**
 * Activity Hooks
 * 
 * Provides React Query hooks for all activity-related actions.
 */

export const useTrips = (carId: string) => {
  return useQuery({
    queryKey: ["activity", "trips", carId],
    queryFn: () => activityService.getTrips(carId),
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
    queryFn: () => activityService.getSpendsChart(carId, month, year),
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
