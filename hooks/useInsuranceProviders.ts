import { useQuery } from "@tanstack/react-query";
import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/config/apiRoutes";

export interface InsuranceProvider {
  _id: string;
  name: string;
  countryCode: string;
  logoUrl?: string;
  isActive: boolean;
}

export const useInsuranceProviders = (countryCode?: string) => {
  return useQuery({
    queryKey: ["insurance-providers", countryCode],
    queryFn: async () => {
      if (!countryCode) return [];
      const response = await apiClient.get(API_ROUTES.INSURANCE.PROVIDERS(countryCode));
      return response.data.providers as InsuranceProvider[];
    },
    enabled: !!countryCode,
  });
};
