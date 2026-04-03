import React from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { CarLogo } from "@/components/shared/CarLogo";
import SpecItem from "@/components/car/SpecItem";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

// Icons
import CalendarIcon from "@/assets/icons/car/calendar.svg";
import FuelIcon from "@/assets/icons/car/fuel.svg";
import TransmissionIcon from "@/assets/icons/car/transmission.svg";
import CylinderIcon from "@/assets/icons/car/cylinder.svg";
import DriveIcon from "@/assets/icons/car/drive.svg";
import BodyIcon from "@/assets/icons/car/body.svg";
import SegmentIcon from "@/assets/icons/car/segment.svg";
import SpeedometerIcon from "@/assets/icons/car/speedometer.svg";

export default function MotiBuddieDetails() {
  const params = useLocalSearchParams<{
    make?: string;
    model?: string;
    year?: string;
    mileage?: string;
    vin?: string;
    transmission?: string;
    engine?: string;
    driveType?: string;
    bodyStyle?: string;
    segment?: string;
  }>();

  const carData = {
    make: params.make || "Unknown",
    model: params.model || "Model",
    year: params.year || "---",
    mileage: params.mileage || "0",
    vin: params.vin || "---",
    transmission: params.transmission || "---",
    engine: params.engine || "---",
    driveType: params.driveType || "---",
    bodyStyle: params.bodyStyle || "---",
    segment: params.segment || "---",
  };

  const handleConfirm = () => {
    // In a real app, this would save the car and navigate to the dashboard
    router.replace("/(tabs)/car");
  };

  return (
    <View className="flex-1 bg-black/40">
      <ScreenBackground>
        {/* Semi-transparent spacer at top for modal feel */}
        <Pressable className="h-[15%]" onPress={() => router.back()} />

        {/* Success Content Card */}
        <View className="flex-1 bg-white rounded-t-[36px] overflow-hidden shadow-2xl">
          {/* Header Section with Off-white background */}
          <View className="bg-[#EFEEE7] py-5 ">
            <View className="flex-row  items-center justify-center relative">
              <Text className="text-[#9BBABB] font-lexendMedium text-[14px] tracking-wider">
                This is what we got
              </Text>
              {/* <TouchableOpacity 
                onPress={() => router.back()} 
                className="p-2 -mr-2 bg-white/50 rounded-full"
              >
                <Ionicons name="close" size={20} color="#101828" />
              </TouchableOpacity> */}
            </View>

            <View className="items-center mt-3">
              <View className="">
                <CarLogo make={carData.make} size={48} />
              </View>
              <Text className="text-[#00343F] font-lexendSemiBold text-[20px] text-center">
                {carData.make} {carData.model}
              </Text>

              <View className="flex-row items-center gap-2 mt-4">
                <SpeedometerIcon width={16} height={16} fill="#9BBABB" />
                <Text className="text-[#918E69] font-lexendRegular text-[14px]">
                  Mileage — {carData.mileage}
                </Text>
              </View>
            </View>
          </View>

          {/* Specs / Features Section */}
          <View className="flex-1 px-6">
            {/* Elegant Divider */}
            <View className="flex-row items-center justify-center gap-4 mt-3">
              <View className="h-[1px] flex-1 bg-[#D0CCA6]/30" />
              <Text className="text-[#D0CCA6] font-lexendMedium text-[10px] uppercase tracking-[2px]">
                Expected Features
              </Text>
              <View className="h-[1px] flex-1 bg-[#D0CCA6]/30" />
            </View>

            {/* VIN Display */}
            <View className="items-center mt-4">
              <View className="">
                <Ionicons name="barcode-outline" size={18} color="#9BBABB" />
                <Text className="text-[#00343F] font-lexendMedium text-[14px]">
                  VIN:{" "}
                  <Text className="text-[#356D75] tracking-tighter">
                    {carData.vin}
                  </Text>
                </Text>
                <Ionicons name="chevron-down" size={14} color="#9BBABB" />
              </View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 160 }}
              className="flex-1"
            >
              <View className="flex-row flex-wrap">
                <SpecItem
                  icon={CalendarIcon}
                  label="Year of Production:"
                  value={carData.year}
                  hasDropdown
                />
                <SpecItem
                  icon={TransmissionIcon}
                  label="Transmission"
                  value={carData.transmission}
                />
                <SpecItem
                  icon={CylinderIcon}
                  label="Engine"
                  value={carData.engine}
                  hasDropdown
                />
                <SpecItem
                  icon={DriveIcon}
                  label="Drive Type"
                  value={carData.driveType}
                />
                <SpecItem
                  icon={BodyIcon}
                  label="Body Style"
                  value={carData.bodyStyle}
                  hasDropdown
                />
                <SpecItem
                  icon={SegmentIcon}
                  label="Segment"
                  value={carData.segment}
                />
              </View>
            </ScrollView>
          </View>

          {/* Persistent Footer Button */}
          <View className="absolute bottom-10 left-8 right-8">
            <TouchableOpacity
              onPress={handleConfirm}
              activeOpacity={0.8}
              className="h-[64px] rounded-full items-center justify-center bg-[#FBE74C] shadow-lg shadow-[#FBE74C]/40"
            >
              <Text className="text-[#00343F] font-lexendBold text-[18px]">
                That's correct
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenBackground>
    </View>
  );
}
