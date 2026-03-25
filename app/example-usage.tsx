import { ScreenBackground } from "@/components/ui/ScreenBackground";
import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/config/apiRoutes";
import { useAppStore } from "@/store/useAppStore";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Example Usage Screen
 *
 * Demonstrates:
 * 1. Fetching data from an API using React Query and Axios.
 * 2. Accessing and updating global state using Zustand.
 * 3. Handling loading, error, and success states.
 */
export default function ExampleUsageScreen() {
  // --- ZUSTAND STATE ---
  const { theme, setTheme } = useAppStore();

  // --- REACT QUERY DATA FETCHING ---
  const {
    data: cars,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      // Using the pre-configured apiClient and routes
      const response = await apiClient.get(API_ROUTES.CARS.LIST);
      return response.data;
    },
  });

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ScreenBackground className="flex-1 p-6">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="text-2xl font-lexendBold text-white mb-6">
          System Setup Example
        </Text>

        {/* Example 1: Zustand Store */}
        <View className="bg-white/10 p-4 rounded-xl mb-6 shadow-sm border border-white/10">
          <Text className="text-lg font-lexendMedium text-white mb-2">
            1. Zustand (Client State)
          </Text>
          <Text className="text-white/60 mb-4">
            Current Theme:{" "}
            <Text className="text-[#FDEF56] font-lexendBold capitalize">
              {theme}
            </Text>
          </Text>
          <TouchableOpacity
            onPress={toggleTheme}
            className="bg-[#FDEF56] py-3 rounded-lg items-center"
          >
            <Text className="text-[#1F1F1F] font-lexendBold">Toggle Theme</Text>
          </TouchableOpacity>
        </View>

        {/* Example 2: React Query */}
        <View className="bg-white/10 p-4 rounded-xl shadow-sm border border-white/10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-lexendMedium text-white">
              2. React Query (Server Data)
            </Text>
            <TouchableOpacity onPress={() => refetch()}>
              <Text className="text-[#FDEF56] text-sm">Refresh</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View className="py-10 items-center">
              <ActivityIndicator color="#FDEF56" />
              <Text className="text-white/60 mt-2">Loading cars...</Text>
            </View>
          ) : isError ? (
            <View className="py-10 items-center">
              <Text className="text-red-400">Error fetching data</Text>
              <Text className="text-white/40 text-xs mt-1">
                {(error as Error).message}
              </Text>
            </View>
          ) : (
            <View>
              {cars && cars.length > 0 ? (
                cars.map((car: any, index: number) => (
                  <View key={index} className="bg-black/20 p-3 rounded-lg mb-2">
                    <Text className="text-white font-lexendMedium">
                      {car.make} {car.model}
                    </Text>
                    <Text className="text-white/40 text-xs">
                      {car.year} • {car.color}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-white/40 text-center py-4 italic">
                  No cars found (This is a placeholder UI)
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}
