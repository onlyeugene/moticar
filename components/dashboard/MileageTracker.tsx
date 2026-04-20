import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Speedometer from "@/assets/icons/car/speedometer.svg";

interface MileageTrackerProps {
  mileage?: number;
  updatedAt?: string;
  approxKm?: number;
  entriesCount?: number;
  onPress?: () => void;
}

export default function MileageTracker({
  mileage,
  updatedAt,
  approxKm = 0,
  entriesCount = 0,
  onPress,
}: MileageTrackerProps) {
  const hasMileage = mileage !== undefined && mileage !== null && mileage > 0;

  const getDaysAgo = (date?: string) => {
    if (!date) return "no updates yet";
    const updated = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - updated.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? "updated today" : `updated ${diffDays} days ago`;
  };

  if (!hasMileage) {
    return (
      <View className="px-4 mb-4">
        <TouchableOpacity onPress={onPress}>
          <View className="w-full">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-[#000000] font-lexendMedium text-[20px]">
                  Mileage Tracker
                </Text>
                <Text className="text-[#4A8588] font-lexendRegular text-[12px] mt-1">
                  No entry has been recorded
                </Text>
              </View>
              <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
                <Ionicons name="add" size={24} color="#00AEB5" />
              </View>
            </View>

            <View className="mt-10 flex-row items-start justify-between">
              <View>
                <Speedometer />
              </View>
              <View className="w-5 h-[5px] bg-[#006C70]" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="px-4 mb-4">
      <View>
        <View className=" rounded-[24px] p-2 overflow-hidden">
          {/* Header */}
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-[#000000] font-lexendBold text-[20px]">
                Mileage Tracker
              </Text>
              <Text className="text-[#4A8588] font-lexendRegular text-[12px] mt-0.5">
                {getDaysAgo(updatedAt)}
              </Text>
            </View>
            <TouchableOpacity onPress={onPress}>
              <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
                <Ionicons name="add" size={24} color="#00AEB5" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View className="flex-row justify-between items-center mt-6">
            <View className="">
              <Speedometer width={42} height={42} />
            </View>

            <View className="items-end">
              <View className="flex-row items-center gap-1.5">
                {/* <Ionicons name="warning-outline" size={16} color="#F8953A" /> */}
                <Text className="text-[#006C70] font-lexendBold text-[32px] leading-[38px] tracking-tight">
                  {mileage.toLocaleString()}
                </Text>
              </View>

              <View className="flex-row items-center gap-2.5 mt-1.5">
                <Text className="text-[#00AEB5] font-lexendMedium text-[14px]">
                  approx. {approxKm}km
                </Text>
                <View className="bg-[#F8E761] px-2.5 py-1 rounded-full items-center justify-center">
                  <Text className="text-[#425658] font-lexendBold text-[10px] uppercase tracking-wider">
                    {entriesCount} Entries
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}