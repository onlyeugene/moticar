import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider, onlineManager } from "@tanstack/react-query";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false, // Recommended for React Native
    },
  },
});

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state: NetInfoState) => {
    setOnline(!!state.isConnected);
  });
});

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Provider for React Query's QueryClient.
 * This should wrap the root of the application.
 * Now includes support for automatic refetching on reconnect.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
