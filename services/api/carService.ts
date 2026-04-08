import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/config/apiRoutes";
import { 
  Car, 
  CarCreateInput, 
  CarSearchResponse, 
  MakesResponse, 
  ModelsResponse, 
  TrimsResponse,
  ScanPhotosInput,
  ScanLicenseInput,
  CarDetails,
  CarUpdateInput
} from "@/types/car";

/**
 * Car Service
 * 
 * Groups all car-related API calls in one place.
 */
export const carService = {
  /** Create a car manually */
  createCar: async (data: CarCreateInput): Promise<Car> => {
    const response = await apiClient.post(API_ROUTES.CARS.CREATE, data);
    return response.data;
  },

  /** Update car details */
  updateCar: async (id: string, data: CarUpdateInput): Promise<Car> => {
    const response = await apiClient.patch(API_ROUTES.CARS.UPDATE(id), data);
    return response.data;
  },

  /** Get all cars for the authenticated user */
  getUserCars: async (): Promise<{ count: number; cars: Car[] }> => {
    const response = await apiClient.get(API_ROUTES.CARS.LIST);
    return response.data;
  },

  /** AI image extraction from 3 photos */
  scanPhotos: async (formData: FormData): Promise<any> => {
    const response = await apiClient.post(API_ROUTES.CARS.SCAN_PHOTOS, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /** OCR extraction from Vehicle License */
  scanLicense: async (formData: FormData): Promise<any> => {
    const response = await apiClient.post(API_ROUTES.CARS.SCAN_LICENSE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /** Get car makes (optionally filtered by year) */
  getMakes: async (year?: number): Promise<MakesResponse> => {
    const response = await apiClient.get(API_ROUTES.CARS.MAKES, { params: { year } });
    return response.data;
  },

  /** Search for cars by name (make or model) */
  searchCars: async (query: string): Promise<CarSearchResponse> => {
    const response = await apiClient.get(API_ROUTES.CARS.SEARCH, { params: { q: query } });
    return response.data;
  },

  /** Get car models for a make */
  getModels: async (make: string, year?: number): Promise<ModelsResponse> => {
    const response = await apiClient.get(API_ROUTES.CARS.MODELS, { params: { make, year } });
    return response.data;
  },

  /** Get car trims for a model */
  getTrims: async (make: string, model: string, year?: number): Promise<TrimsResponse> => {
    const response = await apiClient.get(API_ROUTES.CARS.TRIMS, { params: { make, model, year } });
    return response.data;
  },

  /** Get detailed car specs based on search results */
  getCarDetails: async (params: { make: string; model: string; year: number; trim?: string }): Promise<CarDetails> => {
    const response = await apiClient.get(API_ROUTES.CARS.DETAILS, { params });
    return response.data;
  },

  /** Get specific car by its ID */
  getCarById: async (id: string): Promise<{ car: Car }> => {
    const response = await apiClient.get(API_ROUTES.CARS.GET_BY_ID(id));
    return response.data;
  },

  /** Upload and OCR a car document (Saves immediately) */
  uploadDocument: async (carId: string, type: string, file: any): Promise<any> => {
    const formData = new FormData();
    formData.append("type", type);
    
    if (file.uri) {
      const uriParts = file.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append("file", {
        uri: file.uri,
        name: `document.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    const response = await apiClient.post(API_ROUTES.CARS.DOCUMENTS(carId), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /** Stateless scan for pre-filling forms */
  scanDocument: async (file: any, type?: string): Promise<any> => {
    const formData = new FormData();
    if (type) formData.append("type", type);

    if (file.uri) {
      const uriParts = file.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append("file", {
        uri: file.uri,
        name: `scan.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    const response = await apiClient.post(API_ROUTES.CARS.SCAN_DOCUMENT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /** Save document manually (JSON) */
  saveDocumentManual: async (carId: string, data: any): Promise<any> => {
    const response = await apiClient.post(API_ROUTES.CARS.DOCUMENTS_MANUAL(carId), data);
    return response.data;
  },

  /** Get detailed document list */
  getDocuments: async (carId: string): Promise<any> => {
    const response = await apiClient.get(API_ROUTES.CARS.DOCUMENTS_LIST(carId));
    return response.data;
  },

  /** Update detailed document */
  updateDocument: async (carId: string, docId: string, data: any): Promise<any> => {
    const response = await apiClient.patch(API_ROUTES.CARS.DOCUMENTS_DETAIL(carId, docId), data);
    return response.data;
  },

  /** Delete document */
  deleteDocument: async (carId: string, docId: string): Promise<any> => {
    const response = await apiClient.delete(API_ROUTES.CARS.DOCUMENTS_DETAIL(carId, docId));
    return response.data;
  },
};

