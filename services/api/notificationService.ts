import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/config/apiRoutes";

export interface Notification {
  _id: string;
  title: string;
  body: string;
  type: 'alert' | 'tip' | 'promotion' | 'reminder' | 'system';
  source: 'system' | 'motibuddie';
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async (type?: string): Promise<{ count: number; notifications: Notification[] }> => {
    const response = await apiClient.get(API_ROUTES.NOTIFICATIONS.BASE, {
      params: { type }
    });
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.patch(`${API_ROUTES.NOTIFICATIONS.BASE}/${notificationId}/read`);
  },

  markAllAsRead: async (type?: string): Promise<void> => {
    await apiClient.patch(`${API_ROUTES.NOTIFICATIONS.BASE}/mark-all-read`, {}, {
      params: { type }
    });
  },
  
  registerPushToken: async (token: string): Promise<void> => {
    await apiClient.patch(API_ROUTES.USER.PUSH_TOKEN, { token });
  }
};
