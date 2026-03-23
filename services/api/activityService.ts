import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/config/apiRoutes";
import { 
  TripsResponse, 
  CreateTripInput, 
  Trip, 
  RemindersResponse, 
  CreateReminderInput, 
  Reminder, 
  SpendBreakdown,
  InsightsResponse
} from "@/types/activity";

/**
 * Activity Service
 * 
 * Handles trips, reminders, and spend aggregation API calls.
 */
export const activityService = {
  /** Get all recorded trips for a car */
  getTrips: async (carId: string): Promise<TripsResponse> => {
    const response = await apiClient.get(API_ROUTES.ACTIVITY.TRIPS, { params: { carId } });
    return response.data;
  },

  /** Log a manual trip */
  createManualTrip: async (data: CreateTripInput): Promise<{ message: string; trip: Trip }> => {
    const response = await apiClient.post(API_ROUTES.ACTIVITY.TRIPS, data);
    return response.data;
  },

  /** Get all reminders with category counters */
  getReminders: async (carId: string): Promise<RemindersResponse> => {
    const response = await apiClient.get(API_ROUTES.ACTIVITY.REMINDERS, { params: { carId } });
    return response.data;
  },

  /** Create a new reminder */
  createReminder: async (data: CreateReminderInput): Promise<{ message: string; reminder: Reminder }> => {
    const response = await apiClient.post(API_ROUTES.ACTIVITY.REMINDERS, data);
    return response.data;
  },

  /** Get monthly spend aggregation chart */
  getSpendsChart: async (carId: string, month?: string, year?: string): Promise<SpendBreakdown> => {
    const response = await apiClient.get(API_ROUTES.ACTIVITY.SPENDS, { 
      params: { carId, month, year } 
    });
    return response.data;
  },

  /** Get monthly activity insights */
  getInsights: async (carId: string, month?: string, year?: string): Promise<InsightsResponse> => {
    const response = await apiClient.get(API_ROUTES.ACTIVITY.INSIGHTS, { 
      params: { carId, month, year } 
    });
    return response.data;
  },
};
