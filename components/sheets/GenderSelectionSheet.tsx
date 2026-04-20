import React, { useState } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { Ionicons } from "@expo/vector-icons";

interface GenderSelectionSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (gender: string) => void;
  currentGender?: string;
}

const GENDERS = [
  { label: "Male", value: "Male", icon: "male-outline" as const },
  { label: "Female", value: "Female", icon: "female-outline" as const },
];

export default function GenderSelectionSheet({
  visible,
  onClose,
  onSelect,
  currentGender,
}: GenderSelectionSheetProps) {
  const [selected, setSelected] = useState(currentGender || "");

  const handleSave = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Gender"
      height="40%"
      backgroundColor="#FFFFFF"
      scrollable={false}
      headerRight={
        <TouchableOpacity
          onPress={handleSave}
          disabled={!selected}
          className={`bg-[#00AEB5] px-5 py-1.5 rounded-full ${!selected ? 'opacity-50' : ''}`}
        >
          <Text className="text-white font-lexendSemiBold text-[14px]">
            Save
          </Text>
        </TouchableOpacity>
      }
    >
      <View className="px-4 pt-4">
        {GENDERS.map((item) => {
          const isSelected = selected === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => setSelected(item.value)}
              className={`flex-row items-center justify-between px-4 py-4 rounded-2xl mb-3 border ${
                isSelected
                  ? "border-[#00AEB5] bg-[#00AEB5]/5"
                  : "border-[#F0F0F0] bg-white"
              }`}
            >
              <View className="flex-row items-center gap-3">
                <Ionicons 
                  name={item.icon} 
                  size={20} 
                  color={isSelected ? "#00AEB5" : "#7BA0A3"} 
                />
                <Text
                  className={`font-lexendRegular text-[15px] ${
                    isSelected ? "text-[#00343F]" : "text-[#5E7A7A]"
                  }`}
                >
                  {item.label}
                </Text>
              </View>
              <View
                className={`w-6 h-6 rounded-full items-center justify-center border-2 ${
                  isSelected ? "bg-[#00AEB5] border-[#00AEB5]" : "border-[#E0EDED]"
                }`}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomSheet>
  );
}
