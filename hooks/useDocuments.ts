import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { carService } from "@/services/api/carService";

/**
 * Document Hooks
 * 
 * Provides React Query hooks for managing car documents.
 */

/** Stateless document scan (Pre-fill UI) */
export const useScanDocument = () => {
  return useMutation({
    mutationFn: ({ file, type }: { file: any; type?: string }) =>
      carService.scanDocument(file, type),
  });
};

/** Create/Save a document manually */
export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ carId, data }: { carId: string; data: any }) =>
      carService.saveDocumentManual(carId, data),
    onSuccess: (_, { carId }) => {
      // Invalidate the documents list for this car
      queryClient.invalidateQueries({ queryKey: ["cars", "documents", carId] });
      // Also invalidate the car details since it might have a document virtual
      queryClient.invalidateQueries({ queryKey: ["cars", "user"] });
      queryClient.invalidateQueries({ queryKey: ["cars", "details", carId] });
    },
  });
};

/** Get all documents for a car */
export const useCarDocuments = (carId: string) => {
  return useQuery({
    queryKey: ["cars", "documents", carId],
    queryFn: () => carService.getDocuments(carId),
    enabled: !!carId,
  });
};

/** Update an existing document */
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ carId, docId, data }: { carId: string; docId: string; data: any }) =>
      carService.updateDocument(carId, docId, data),
    onSuccess: (_, { carId }) => {
      queryClient.invalidateQueries({ queryKey: ["cars", "documents", carId] });
      queryClient.invalidateQueries({ queryKey: ["cars", "user"] });
      queryClient.invalidateQueries({ queryKey: ["cars", "details", carId] });
    },
  });
};

/** Delete a document */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ carId, docId }: { carId: string; docId: string }) =>
      carService.deleteDocument(carId, docId),
    onSuccess: (_, { carId }) => {
      queryClient.invalidateQueries({ queryKey: ["cars", "documents", carId] });
      queryClient.invalidateQueries({ queryKey: ["cars", "user"] });
      queryClient.invalidateQueries({ queryKey: ["cars", "details", carId] });
    },
  });
};
