import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { carService } from "@/services/api/carService";

/**
 * Car Hooks
 * 
 * Provides React Query hooks for all car-related actions.
 */

export const useCreateCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: carService.createCar,
    onSuccess: () => {
      // ONLY invalidate the user's list of cars, not search results or catalog
      queryClient.invalidateQueries({ queryKey: ["cars", "user"] });
    },
  });
};

/** Update an existing car's details */
export const useUpdateCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      carService.updateCar(id, data),
    onSuccess: (updatedCar) => {
      // Invalidate specific user car queries
      queryClient.invalidateQueries({ queryKey: ["cars", "user"] });
      // Also invalidate the specific detail query for this car if it exists
      queryClient.invalidateQueries({ queryKey: ["cars", "details", updatedCar?.id] });
    },
  });
};

/** Get all cars for the user */
export const useUserCars = () => {
  return useQuery({
    queryKey: ["cars", "user"],
    queryFn: carService.getUserCars,
  });
};

/** Get specific car by its ID */
export const useCarById = (id: string) => {
  return useQuery({
    queryKey: ["cars", "details", id],
    queryFn: () => carService.getCarById(id),
    enabled: !!id,
  });
};

/** Search for cars by make or model */
export const useSearchCars = (query: string) => {
  return useQuery({
    queryKey: ["cars", "search", query],
    queryFn: () => carService.searchCars(query),
    enabled: !!query && query.length > 2, 
  });
};

/** Get detailed specs for a car (e.g., after selecting from search) */
export const useCarDetails = (params: { make: string; model: string; year: number; trim?: string }) => {
  return useQuery({
    queryKey: ["cars", "details", params.make, params.model, params.year, params.trim],
    queryFn: () => carService.getCarDetails(params),
    enabled: !!params.make && !!params.model && !!params.year,
  });
};

/** AI-powered photo scanning */
export const useScanPhotos = () => {
  return useMutation({
    mutationFn: carService.scanPhotos,
  });
};

/** OCR-powered license scanning */
export const useScanLicense = () => {
  return useMutation({
    mutationFn: carService.scanLicense,
  });
};

/** Get car makes optionally filtered by year */
export const useCarMakes = (year?: number) => {
  return useQuery({
    queryKey: ["cars", "makes", year],
    queryFn: () => carService.getMakes(year),
  });
};

/** Get car models for a specific make and year */
export const useCarModels = (make: string, year?: number) => {
  return useQuery({
    queryKey: ["cars", "models", make, year],
    queryFn: () => carService.getModels(make, year),
    enabled: !!make,
  });
};

/** Get car trims for a specific make, model, and year */
export const useCarTrims = (make: string, model: string, year?: number) => {
  return useQuery({
    queryKey: ["cars", "trims", make, model, year],
    queryFn: () => carService.getTrims(make, model, year),
    enabled: !!make && !!model,
  });
};

/** Upload and OCR a car document */
export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ carId, type, file }: { carId: string; type: string; file: any }) =>
      carService.uploadDocument(carId, type, file),
    onSuccess: () => {
      // Invalidate both the car list and potentially specific detail views
      queryClient.invalidateQueries({ queryKey: ["cars", "user"] });
    },
  });
};
