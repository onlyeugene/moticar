import Container from "@/components/shared/container";
import { CarLogo } from "@/components/shared/CarLogo";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CarTypeIcon from "@/components/shared/CarTypeIcon";

export default function Selection() {
  const params = useLocalSearchParams<{
    make: string;
    model: string;
    class: string;
    brandKeys?: string;
    availableYears?: string; // JSON stringified
    availableFuelTypes?: string; // JSON stringified
    gearbox?: string;
  }>();

  const availableYears = params.availableYears
    ? JSON.parse(params.availableYears)
    : [];
  const availableFuelTypes = params.availableFuelTypes
    ? JSON.parse(params.availableFuelTypes)
    : [];

  const [selectedYear, setSelectedYear] = useState<number | null>(
    availableYears.length > 0 ? availableYears[0] : null,
  );
  const [selectedFuelType, setSelectedFuelType] = useState<string | null>(
    availableFuelTypes.length > 0 ? availableFuelTypes[0] : null,
  );

  const handleNext = () => {
    if (params.make && params.model && selectedYear && selectedFuelType) {
      router.push({
        pathname: "/screens/manual/details",
        params: {
          make: params.make,
          model: params.model,
          year: selectedYear.toString(),
          fuelType: selectedFuelType,
          class: params.class,
          brandKeys: params.brandKeys,
          availableYears: params.availableYears,
          availableFuelTypes: params.availableFuelTypes,
          availableGearboxes: params.gearbox,
        },
      });
    }
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
          <Text className="text-white text-[26px] font-lexendMedium">
            Search for your car
          </Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-[14px] mt-2 leading-6">
            Start by adding the details of your personal car for a rich user
            experience
          </Text>
        </View>

        {/* Selected Car Display */}
        <View className="mt-8">
          <View className="flex-row items-center mb-4">
            <Text className="text-[#99C1C7] font-lexendMedium text-lg uppercase mr-3">
              {params.make}
            </Text>
            <View className="flex-1 h-[1px] bg-[#06454F]" />
          </View>
          <View className="flex-row items-center p-4 rounded-xl border border-[#1A8798] bg-[#002E35]">
            <View className="w-[48px] h-[48px] rounded-[8px] bg-white items-center justify-center mr-4">
              <CarLogo make={params.make || ""} size={32} color="#29D7DE" />
            </View>

            <View className="flex-1">
              <View className="flex-row justify-between items-center">
                <Text className="font-lexendRegular text-[14px] text-[#FFFFFF]">
                  {params.model}
                </Text>
                <View className="flex-row items-center gap-3">
                  <CarTypeIcon
                    type={params.class || "SUV"} 
                    size={50} 
                    color="#29D7DE" 
                  />
                  <View className="bg-[#5E9597] px-2 py-1 rounded">
                    <Text className="text-[#002E35] font-lexendBold text-[8px] uppercase">
                      {params.class || "SUV"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="ml-4 w-6 h-6 rounded-full bg-[#00AEB5] items-center justify-center">
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
          </View>
        </View>

        <View className="mt-8 gap-8">
          {/* Year Selection */}
          {availableYears.length > 0 && (
            <View>
              <Text className="text-[#4FB8C8] font-lexendRegular text-[12px] mb-4">
                Year of Model
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
              >
                {availableYears.map((year: number) => (
                  <Pressable
                    key={year}
                    onPress={() => setSelectedYear(year)}
                    className={`px-8 py-3 rounded-[8px]  ${selectedYear === year ? "bg-[#00AEB5] " : "border border-[#09515D]"}`}
                  >
                    <Text
                      className={` text-[14px] ${selectedYear === year ? "text-[#FFFFFF] font-lexendMedium" : "text-[#94ADAD] font-lexendRegular"}`}
                    >
                      {year}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
          <View className="border-b border-[#06454F]" />

          {/* Fuel Type Selection */}
          {availableFuelTypes.length > 0 && (
            <View>
              <Text className="text-[#4FB8C8] font-lexendRegular text-[12px] mb-4">
                Fuel Type
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
              >
                {availableFuelTypes.map((fuel: string) => (
                  <Pressable
                    key={fuel}
                    onPress={() => setSelectedFuelType(fuel)}
                    className={`px-8 py-3 rounded-[8px]  ${selectedFuelType === fuel ? "bg-[#00AEB5] " : "border border-[#09515D]"}`}
                  >
                    <Text
                      className={`text-[14px] ${selectedFuelType === fuel ? "text-[#FFFFFF] font-lexendMedium" : " font-lexendRegular text-[#94ADAD]"}`}
                    >
                      {fuel}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
          <View className="border-b border-[#06454F]" />
        </View>

        {/* Next Button */}
        <View className="absolute bottom-10 left-0 right-0">
          <TouchableOpacity
            disabled={!selectedYear || !selectedFuelType}
            onPress={handleNext}
            activeOpacity={0.8}
            className={`h-16 rounded-full items-center justify-center w-[90%] mx-auto ${
              selectedYear && selectedFuelType ? "bg-[#29D7DE]" : "bg-[#004648]"
            }`}
          >
            <Text className="font-lexendBold text-lg text-[#00343F]">Next</Text>
          </TouchableOpacity>
        </View>
      </Container>
    </ScreenBackground>
  );
}
