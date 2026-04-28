import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/config/apiRoutes";

/**
 * OBD Service for MotiBuddie device connection and management.
 */
export const obdService = {
  /**
   * New-car discovery: register a MotiBuddie by IMEI, server auto-creates the car.
   */
  pairDevice: async (imei: string): Promise<any> => {
    const response = await apiClient.post(API_ROUTES.OBD.PAIR, { imei });
    return response.data;
  },

  /**
   * Upgrade an existing car to OBD tracking.
   */
  enableObd: async (carId: string, imei: string): Promise<any> => {
    const response = await apiClient.post(API_ROUTES.OBD.ENABLE, { carId, imei });
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
  },

  /**
   * Final confirmation to activate a car that was auto-discovered via OBD.
   */
  activateCar: async (carId: string): Promise<any> => {
    const response = await apiClient.post(API_ROUTES.OBD.ACTIVATE(carId));
    return response.data;
  }
};
