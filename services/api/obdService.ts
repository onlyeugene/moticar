import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/config/apiRoutes";

/**
 * OBD Service for MotiBuddie device connection and management.
 */
export const obdService = {
  /**
   * Register a MotiBuddie device with a car by its IMEI.
   */
  pairDevice: async (carId: string, imei: string): Promise<any> => {
    const response = await apiClient.post(API_ROUTES.OBD.PAIR, { 
      carId, 
      imei 
    });
    return response.data;
  },

  /**
   * Check connection status of a device.
   */
  getConnectionStatus: async (deviceId: string): Promise<any> => {
    const response = await apiClient.get(API_ROUTES.OBD.STATUS(deviceId));
    return response.data;
  },

  /**
   * Get the full diagnostic report for a car.
   */
  getDiagnosticReport: async (carId: string): Promise<any> => {
    const response = await apiClient.get(API_ROUTES.OBD.DIAGNOSTIC(carId));
    return response.data;
  }
};
