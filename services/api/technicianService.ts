import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/config/apiRoutes";
import { Technician, CreateTechnicianInput } from "@/types/technician";

/**
 * Technician Service
 * 
 * Handles technician CRUD operations.
 */
export const technicianService = {
  /** Get all saved technicians for the current user */
  getTechnicians: async (): Promise<{ count: number; technicians: Technician[] }> => {
    const response = await apiClient.get(API_ROUTES.TECHNICIANS.BASE);
    return response.data;
  },

  /** Add a new auto-technician */
  addTechnician: async (data: CreateTechnicianInput): Promise<Technician> => {
    const response = await apiClient.post(API_ROUTES.TECHNICIANS.BASE, data);
    return response.data;
  },

  /** Update an existing auto-technician */
  updateTechnician: async (id: string, data: Partial<CreateTechnicianInput>): Promise<Technician> => {
    const response = await apiClient.patch(API_ROUTES.TECHNICIANS.DETAIL(id), data);
    return response.data;
  },

  /** Remove a saved technician */
  deleteTechnician: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(API_ROUTES.TECHNICIANS.DETAIL(id));
    return response.data;
  },
};
