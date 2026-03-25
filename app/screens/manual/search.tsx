import Container from "@/components/shared/container";
import { CarLogo } from "@/components/shared/CarLogo";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useSearchCars } from "@/hooks/useCars";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CarResult {
  make: string;
  model: string;
  year?: number;
  class: string;
  fuelType?: string;
  engine?: string;
  transmission?: string;
  brandKeys?: string;
  availableYears?: number[];
  availableFuelTypes?: string[];
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [selectedCar, setSelectedCar] = useState<CarResult | null>(null);

  const { data, isLoading, isError, refetch } = useSearchCars(query);

  // Group cars by make
  const groupedCars = useMemo(() => {
    if (!data?.cars) return {};
    return data.cars.reduce((acc: Record<string, CarResult[]>, car: any) => {
      const make = car.make || "Other";
      if (!acc[make]) acc[make] = [];
      acc[make].push(car);
      return acc;
    }, {});
  }, [data]);

  const handleNext = () => {
    if (selectedCar) {
      router.push({
        pathname: "/screens/manual/selection",
        params: {
          make: selectedCar.make,
          model: selectedCar.model,
          class: selectedCar.class || "SUV",
          brandKeys: selectedCar.brandKeys,
          availableYears: JSON.stringify(selectedCar.availableYears || []),
          availableFuelTypes: JSON.stringify(selectedCar.availableFuelTypes || []),
        },
      });
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const isSelected = (car: CarResult) =>
    selectedCar?.model === car.model && selectedCar?.make === car.make;

  const renderCarCard = (car: CarResult) => {
    const active = isSelected(car);
    const carKey = `${car.make}-${car.model}`;

    return (
      <View key={carKey} className="mb-4">
        <TouchableOpacity
          onPress={() => {
            if (active) {
              setSelectedCar(null);
            } else {
              setSelectedCar(car);
            }
          }}
          className={`flex-row items-center p-4 rounded-xl bg-[#002E35]  ${
            active ? "border-2 border-[#1A8798]" : "border border-[#09515D]"
          }`}
        >
          <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-4">
            <CarLogo
              make={car.make}
              size={24}
              color={active ? "#29D7DE" : "#9BBABB"}
            />
          </View>

          <View className="flex-1">
            <View className="flex-row justify-between items-center">
              <Text
                className={`font-lexendRegular text-[14px] ${active ? "text-[#FFFFFF]" : "text-[#94ADAD]"}`}
              >
                {car.model}
              </Text>
              <View className="bg-[#5E9597] px-2 py-0.5 rounded">
                <Text className="text-[#002E35] font-lexendMedium text-[8px] uppercase">
                  {car.class || "SUV"}
                </Text>
              </View>
            </View>
          </View>

          <View
            className={`ml-4 w-[26px] h-[26px] rounded-full items-center justify-center ${
              active ? "bg-[#00AEB5]" : "bg-[#012328]"
            }`}
          >
            {active ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : <Ionicons name="checkmark" size={16} color="#013037" />}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenBackground>
      <Container>
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/screens/manual/details",
                params: { make: "", model: "", year: "" },
              })
            }
          >
            <View className="flex-row items-center">
              <Text className="text-[#29D7DE] font-lexendMedium text-lg mr-1">
                Skip
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#29D7DE" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="mt-8">
          <Text className="text-white text-[32px] font-lexendMedium">
            Search for your car
          </Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-[14px] mt-2 leading-6">
            Start by adding the details of your personal car for a rich user
            experience
          </Text>
        </View>

        {/* Search Input */}
        <View className="mt-8 flex-row items-center bg-[#012227] border border-[#09515D] rounded-xl px-4 h-14">
          <TextInput
            className="flex-1 text-white font-lexendRegular text-base"
            placeholder="Search by car name or moticode"
            placeholderTextColor="#356D75"
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              setSelectedCar(null);
            }}
            autoFocus
            clearButtonMode="while-editing"
          />
          <Ionicons name="search-outline" size={20} color="#356D75" />
        </View>

        {/* Results */}
        <View className="flex-1 mt-8">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color="#FDEF56" />
            </View>
          ) : isError ? (
            <View className="flex-1 items-center justify-center">
              <Ionicons
                name="cloud-offline-outline"
                size={48}
                color="#ED5E5E"
              />
              <Text className="text-white font-lexendBold text-[18px] mt-4">
                Network Error
              </Text>
              <Text className="text-[#9BBABB] font-lexendRegular text-center mt-2 px-6">
                Something went wrong. Please check your connection and try
                again.
              </Text>
              <TouchableOpacity
                onPress={handleRetry}
                className="mt-6 px-8 py-3 bg-[#29D7DE] rounded-full"
              >
                <Text className="text-[#00343F] font-lexendBold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : query.length > 2 && Object.keys(groupedCars).length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-[#9BBABB] font-lexendRegular text-center">
                No cars found matching "{query}"
              </Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              {Object.entries(groupedCars).map(([make, cars]) => (
                <View key={make} className="mb-6">
                  <View className="flex-row items-center mb-4">
                    <Text className="text-[#99C1C7] font-lexendMedium text-lg uppercase mr-3">
                      {make} 
                    </Text>
                    <View className="flex-1 h-[1px] bg-[#06454F]" />
                  </View>
                  {cars.map(renderCarCard)}
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Next Button */}
        <View className="absolute bottom-10 left-0 right-0">
          <TouchableOpacity
            disabled={!selectedCar}
            onPress={handleNext}
            activeOpacity={0.8}
            className={`h-16 rounded-full items-center justify-center w-[90%] mx-auto ${
              selectedCar
                ? "bg-[#29D7DE]"
                : "bg-[#004648]"
            }`}
          >
            <Text className={`font-lexendBold text-lg text-[#00343F]`}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </Container>
    </ScreenBackground>
  );
}
