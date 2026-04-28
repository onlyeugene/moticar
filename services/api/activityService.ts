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
  /** Get all recorded trips for a car with optional filters */
  getTrips: async (carId: string, month?: string, year?: string, week?: string): Promise<TripsResponse> => {
    const response = await apiClient.get(API_ROUTES.ACTIVITY.TRIPS, { 
      params: { carId, month, year, week } 
    });
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
  
  /** Update an existing reminder */
  updateReminder: async (id: string, data: Partial<CreateReminderInput>): Promise<{ message: string; reminder: Reminder }> => {
    const response = await apiClient.patch(`${API_ROUTES.ACTIVITY.REMINDERS}/${id}`, data);
    return response.data;
  },

  /** Delete a reminder */
  deleteReminder: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`${API_ROUTES.ACTIVITY.REMINDERS}/${id}`);
    return response.data;
  },

  /** Get monthly spend aggregation chart */
  getSpendsChart: async (carId: string, month?: string, year?: string, interval?: string): Promise<SpendBreakdown> => {
    const response = await apiClient.get(API_ROUTES.ACTIVITY.SPENDS, { 
      params: { carId, month, year, interval } 
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

  /** Update a recorded trip */
  updateTrip: async (id: string, data: Partial<CreateTripInput>): Promise<{ message: string; trip: Trip }> => {
    const response = await apiClient.patch(`${API_ROUTES.ACTIVITY.TRIPS}/${id}`, data);
    return response.data;
  },

  /** Delete a recorded trip */
  deleteTrip: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`${API_ROUTES.ACTIVITY.TRIPS}/${id}`);
    return response.data;
  },

  /** Get mileage milestones history */
  getMilestones: async (carId: string): Promise<{ count: number; milestones: any[] }> => {
    const response = await apiClient.get(`${API_ROUTES.ACTIVITY.MILESTONES}`, { params: { carId } });
    return response.data;
  },

  /** Log a manual mileage milestone */
  createMilestone: async (data: { carId: string; mileage: number; description?: string; timestamp?: string }): Promise<{ message: string; milestone: any }> => {
    const response = await apiClient.post(`${API_ROUTES.ACTIVITY.MILESTONES}`, data);
    return response.data;
  },

  /** Resolve a pending milestone discrepancy */
  resolveMilestone: async (id: string, data: { status: 'confirmed' | 'rejected', mileage?: number }): Promise<{ message: string; milestone: any }> => {
    const response = await apiClient.patch(`${API_ROUTES.ACTIVITY.MILESTONES}/${id}`, data);
    return response.data;
  },
};

