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
      className="flex-row items-center w-1/2 mb-6 px-1"
    >
      <View className=" ">
        <View className="items-center gap-2 flex-row">
          {Icon && <Icon width={20} height={20} />}
          <Text className="text-[#9BBABB] font-lexendRegular text-[12px]">
            {label}
          </Text>
        </View>

        <View className="flex-row items-center ml-8">
          <Text
            className={`font-lexendBold text-[14px] mr-1 ${hasDropdown ? "text-[#00343F]" : "text-[#616161]"}`}
            numberOfLines={1}
          >
            {value || "---"}
          </Text>
          {hasDropdown && (
            <Ionicons name="chevron-down" size={14} color="#29D7DE" />
          )}
        </View>
      </View>
      <View className="flex-1" />
    </TouchableOpacity>
  );
};

export default SpecItem;
