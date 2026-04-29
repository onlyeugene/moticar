import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/config/apiRoutes";

export const obdService = {
  /** Step 1: Initiate pairing — registers device, starts watcher */
  pairDevice: async (imei: string) => {
    const response = await apiClient.post(API_ROUTES.OBD.PAIR, { imei });
    return response.data;
  },

  /** Step 2: Link device to car after Final Details form is saved */
  linkDevice: async (data: { imei: string; carId: string }) => {
    const response = await apiClient.post(API_ROUTES.OBD.LINK_DEVICE, data);
    return response.data;
  },

  /** Upgrade existing car to OBD */
  enableObd: async (data: { carId: string; imei: string }) => {
    const response = await apiClient.post(API_ROUTES.OBD.ENABLE, data);
    return response.data;
  },

  /** Poll device connection status */
  getConnectionStatus: async (deviceId: string) => {
    const response = await apiClient.get(API_ROUTES.OBD.STATUS(deviceId));
    return response.data;
  },

  /** Get diagnostic report for a car */
  getDiagnosticReport: async (carId: string) => {
    const response = await apiClient.get(API_ROUTES.OBD.DIAGNOSTIC(carId));
    return response.data;
  },

  /** Activate car after OBD confirmation (legacy — upgrade flow) */
  activateCar: async (carId: string) => {
    const response = await apiClient.post(API_ROUTES.OBD.ACTIVATE(carId));
    return response.data;
  },

  /** Send a command to the device */
  sendCommand: async (imei: string, command: string) => {
    const response = await apiClient.post(API_ROUTES.OBD.COMMAND, { imei, command });
    return response.data;
  },
};