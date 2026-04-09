import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { technicianService } from "@/services/api/technicianService";
import { CreateTechnicianInput } from "@/types/technician";

/**
 * Hook for fetching all technicians.
 */
export const useTechnicians = () => {
  return useQuery({
    queryKey: ["technicians"],
    queryFn: technicianService.getTechnicians,
  });
};

/**
 * Hook for adding a new technician.
 */
export const useAddTechnician = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTechnicianInput) => technicianService.addTechnician(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
};

/**
 * Hook for updating an existing technician.
 */
export const useUpdateTechnician = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTechnicianInput> }) => 
      technicianService.updateTechnician(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
};

/**
 * Hook for deleting a technician.
 */
export const useDeleteTechnician = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => technicianService.deleteTechnician(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
};
