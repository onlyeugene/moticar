import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

interface VehicleDetailsSheetProps {
  visible: boolean;
  carData?: {
    make?: string;
    model?: string;
    year?: string;
    plateNumber?: string;
    fuelType?: string;
    transmission?: string;
    engineSize?: string;
    cylinders?: string;
    horsepower?: string;
    driveType?: string;
    bodyStyle?: string;
    segment?: string;
    color?: string;
    doors?: string;
  };
  onClose: () => void;
  onConfirm: () => void;
}

export default function VehicleDetailsSheet({
  visible,
  carData,
  onClose,
  onConfirm,
}: VehicleDetailsSheetProps) {
  const detailItems = [
    {
      label: "Year of Production",
      value: carData?.year || "N/A",
      icon: "calendar-outline",
      iconType: "Ionicons",
      hasChevron: true,
    },
    {
      label: "Fuel Type",
      value: carData?.fuelType || "N/A",
      icon: "fuel",
      iconType: "MaterialCommunityIcons",
    },
    {
      label: "Gearbox",
      value: carData?.transmission || "N/A",
      icon: "gearbox-selector",
      iconType: "MaterialCommunityIcons",
    },
    {
      label: "Engine",
      value: carData?.engineSize || "N/A",
      icon: "engine-outline",
      iconType: "MaterialCommunityIcons",
    },
    {
      label: "Cylinder",
      value: carData?.cylinders || "N/A",
      icon: "cylinder",
      iconType: "MaterialCommunityIcons",
    },
    {
      label: "Horse Power",
      value: carData?.horsepower || "N/A",
      icon: "speedometer-outline",
      iconType: "Ionicons",
    },
    {
      label: "Drive Type",
      value: carData?.driveType || "N/A",
      icon: "car-settings",
      iconType: "MaterialCommunityIcons",
    },
    {
      label: "Body Style",
      value: carData?.bodyStyle || "N/A",
      icon: "car-side",
      iconType: "FontAwesome5",
    },
    {
      label: "Segment",
      value: carData?.segment || "N/A",
      icon: "car-outline",
      iconType: "Ionicons",
    },
    {
      label: "Body Color",
      value: carData?.color || "N/A",
      icon: "palette-outline",
      iconType: "Ionicons",
    },
    {
      label: "Doors",
      value: carData?.doors || "N/A",
      icon: "car-door",
      iconType: "MaterialCommunityIcons",
    },
  ];

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title=""
      height="85%"
      backgroundColor="#FFFFFF"
    >
      <View className="items-center px-4">
        <Text className="text-[#9BA0A0] font-lexendRegular text-[14px] mb-4">
          This is what we got
        </Text>

        {/* Logo - using car icon for dynamic data */}
        <View className="w-12 h-12 rounded-full border border-[#D0D5DD] items-center justify-center mb-2">
          <MaterialCommunityIcons name="car-sports" size={32} color="#101828" />
        </View>

        <Text className="text-[#00343F] font-lexendBold text-[20px] mb-2 text-center">
          {carData?.make || "Unknown"} {carData?.model || "Vehicle"}
        </Text>

        <View className="border border-[#D0D5DD] rounded-[4px] px-3 py-1 mb-6">
          <Text className="text-[#00343F] font-lexendBold text-[16px]">
            {carData?.plateNumber || "NO PLATE"}
          </Text>
        </View>

        <View className="w-full h-[1px] bg-[#F2F4F7] mb-4" />

        <View className="w-full flex-row items-center justify-center mb-6">
          <View className="h-[1px] flex-1 bg-[#F2F4F7]" />
          <Text className="text-[#98A2B3] font-lexendRegular text-[12px] px-4">
            Expected Features
          </Text>
          <View className="h-[1px] flex-1 bg-[#F2F4F7]" />
        </View>

        {/* Grid of Details */}
        <View className="flex-row flex-wrap w-full">
          {detailItems.map((item, index) => (
            <View key={index} className="w-1/2 flex-row items-start mb-6 px-1">
              <View className="mr-2 mt-1">
                {item.iconType === "Ionicons" && (
                  <Ionicons name={item.icon as any} size={20} color="#29D7DE" />
                )}
                {item.iconType === "MaterialCommunityIcons" && (
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={20}
                    color="#29D7DE"
                  />
                )}
                {item.iconType === "FontAwesome5" && (
                  <FontAwesome5
                    name={item.icon as any}
                    size={18}
                    color="#29D7DE"
                  />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-[#9BA0A0] font-lexendRegular text-[10px]">
                  {item.label}:
                </Text>
                <View className="flex-row items-center">
                  <Text
                    className="text-[#00232A] font-lexendBold text-[13px]"
                    numberOfLines={1}
                  >
                    {item.value}
                  </Text>
                  {item.hasChevron && (
                    <Ionicons
                      name="chevron-down"
                      size={14}
                      color="#9BA0A0"
                      className="ml-1"
                    />
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Confirmation Button */}
        <TouchableOpacity
          onPress={onConfirm}
          className="w-full h-[56px] bg-[#FBE74C] rounded-[12px] items-center justify-center mt-4 mb-10"
        >
          <Text className="text-[#00343F] font-lexendBold text-[16px]">
            That's correct
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
