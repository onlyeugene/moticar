import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "../shared/BottomSheet";

export type DateGrain = "Year" | "Month" | "Week";

interface FilterGrainSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedGrain: DateGrain;
  onSelect: (grain: DateGrain) => void;
}

const GRAINS: { label: string; value: DateGrain; icon: string }[] = [
  { label: "Yearly", value: "Year", icon: "calendar-outline" },
  { label: "Monthly", value: "Month", icon: "calendar-clear-outline" },
  { label: "Weekly", value: "Week", icon: "time-outline" },
];

export default function FilterGrainSheet({
  visible,
  onClose,
  selectedGrain,
  onSelect,
}: FilterGrainSheetProps) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Filter Period"
      height="40%"
    >
      <View className="px-4 py-2">
        <Text className="text-[#8B8B8B] text-[14px] font-lexendRegular mb-6">
          Choose how you want to filter your activity data
        </Text>

        {GRAINS.map((item) => {
          const isSelected = selectedGrain === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => {
                onSelect(item.value);
                onClose();
              }}
              className={`flex-row items-center justify-between p-4 mb-3 rounded-2xl border ${
                isSelected ? "border-[#00AEB5]" : "border-[#F0F0F0]"
              }`}
            >
              <View className="flex-row items-center gap-4">
                <View className={`w-10 h-10 rounded-full items-center justify-center ${isSelected ? "bg-[#00AEB5]" : ""}`}>
                   <Ionicons 
                    name={item.icon as any} 
                    size={20} 
                    color={isSelected ? "white" : "#7BA0A3"} 
                  />
                </View>
                <Text className={`text-[16px] ${isSelected ? "font-lexendSemiBold text-[#00343F]" : "font-lexendRegular text-[#8B8B8B]"}`}>
                  {item.label}
                </Text>
              </View>

              {isSelected && (
                <Ionicons name="checkmark-circle" size={24} color="#00AEB5" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomSheet>
  );
}
