import React, { useState, useMemo } from "react";
import {
  Pressable,
  Text,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from "react-native";
import { ScreenBackground } from "@/components/ScreenBackground";
import Container from "@/components/shared/container";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSearchCars } from "@/hooks/useCars";

interface CarResult {
  make: string;
  model: string;
  year: number;
  class: string;
  fuelType: string;
  engine?: string;
  transmission?: string;
  brandKeys?: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [selectedCar, setSelectedCar] = useState<CarResult | null>(null);
  const { data, isLoading } = useSearchCars(query);

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
        pathname: "/screens/manual/details",
        params: {
          make: selectedCar.make,
          model: selectedCar.model,
          year: selectedCar.year,
          brandKeys: selectedCar.brandKeys,
        },
      });
    }
  };

  const isSelected = (car: CarResult) =>
    selectedCar?.model === car.model &&
    selectedCar?.year === car.year &&
    selectedCar?.fuelType === car.fuelType &&
    selectedCar?.engine === car.engine &&
    selectedCar?.transmission === car.transmission;

  const renderCarCard = (car: CarResult) => {
    const active = isSelected(car);
    const carKey = `${car.model}-${car.year}-${car.fuelType}-${car.engine}-${car.transmission}`;
    return (
      <TouchableOpacity
        key={carKey}
        onPress={() => setSelectedCar(car)}
        className={`flex-row items-center p-4 rounded-xl mb-3 border ${
          active ? "border-2 border-[#1A8798]" : " border-[#09515D]"
        }`}
      >
        <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center mr-4">
          <Ionicons
            name="car-outline"
            size={24}
            color={active ? "#29D7DE" : "#9BBABB"}
          />
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text
              className={`font-lexendMedium text-[12px] ${active ? "text-[#FFFFFF]" : "text-[#466A6A]"}`}
            >
              {car.model}
            </Text>
            <Text className={`font-lexendMedium text-[12px] text-[#FDEF56]`}>
              {car.year}
            </Text>
          </View>

          <View className="flex-row gap-2 mt-1">
            {[car.class, car.year.toString(), car.fuelType]
              .filter(Boolean)
              .map((tag, i) => (
                <View key={i} className="bg-[#5E9597] px-2 py-0.5 rounded">
                  <Text className="text-[#002E35] font-lexendRegular text-[8px]">
                    {tag}
                  </Text>
                </View>
              ))}
          </View>
        </View>

        <View
          className={`ml-4 w-6 h-6 rounded-full border items-center justify-center ${
            active ? "bg-[#29D7DE] border-[#29D7DE]" : "border-white/20"
          }`}
        >
          {active && <Ionicons name="checkmark" size={16} color="#002E35" />}
        </View>
      </TouchableOpacity>
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
          <Text className="text-white text-[32px] font-lexendBold">
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
              setSelectedCar(null); // Clear selection on new search
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
          ) : query.length > 2 && Object.keys(groupedCars).length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-[#9BBABB] font-lexendRegular text-center">
                No cars found matching "{query}"
              </Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
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
            className={`h-16 rounded-full items-center justify-center w-10/12 mx-auto ${
              selectedCar ? "bg-[#29D7DE]" : "bg-[#004648]"
            }`}
          >
            <Text
              className={`font-lexendBold text-lg ${selectedCar ? "text-[#00343F]" : "text-[#00343F]"}`}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </Container>
    </ScreenBackground>
  );
}
