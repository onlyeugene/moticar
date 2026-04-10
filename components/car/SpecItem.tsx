import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SpecItemProps {
  icon: any;
  label: string;
  value: string;
  hasDropdown?: boolean;
  onPress?: () => void;
}

const SpecItem = ({
  icon: Icon,
  label,
  value,
  hasDropdown,
  onPress,
}: SpecItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="px-0"
    >
      <View className="flex-col">
        <View className="flex-row items-center gap-3 mb-1.5">
          {Icon && (
            <View className="w-4 h-4 items-center justify-center">
              <Icon width={20} height={20} fill="#29D7DE" />
            </View>
          )}
          <Text className="text-[#707676] font-lexendRegular text-[12px]">
            {label}:
          </Text>
        </View>

        <View className="flex-row items-center ml-7">
          <Text
            className={`font-lexendMedium text-[14px] mr-1 ${hasDropdown ? "text-[#202A2A]" : "text-[#202A2A]"}`}
            numberOfLines={1}
          >
            {value || "N/A"}
          </Text>
          {hasDropdown && (
            <Ionicons name="chevron-down" size={14} color="#C1C3C3" />
          )}
        </View>
      </View>
      <View className="flex-1" />
    </TouchableOpacity>
  );
};

export default SpecItem;
