import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SpecItemProps {
  icon: any;
  label: string;
  value: string;
  hasDropdown?: boolean;
  showChevron?: boolean;
  centered?: boolean;
  onPress?: () => void;
}

const SpecItem = ({
  icon: Icon,
  label,
  value,
  hasDropdown,
  showChevron = false,
  centered = false,
  onPress,
}: SpecItemProps) => {
  const showIcon = !!Icon;

  if (centered) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={onPress ? 0.7 : 1}
        className="items-center py-2"
      >
        <View className="flex-row items-center mb-1">
          {showIcon && (
            <View className="mr-2 items-center justify-center">
              {typeof Icon === "function" ? (
                <Icon width={16} height={16} fill="#29D7DE" />
              ) : (
                <Ionicons name={Icon} size={16} color="#29D7DE" />
              )}
            </View>
          )}
          <Text className="text-[#899B9B] font-lexendRegular text-[0.75rem]" numberOfLines={1}>
            {label}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text
            className="text-[#202A2A] font-lexendSemiBold text-[1rem] text-center"
            numberOfLines={1}
          >
            {value || "---"}
          </Text>
          {(hasDropdown || showChevron) && (
            <Ionicons name="chevron-down" size={14} color="#00AEB5" style={{ marginLeft: 6 }} />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className="flex-row items-center py-1"
    >
      {showIcon && (
        <View className="mr-3 items-center justify-center">
          {typeof Icon === "function" ? (
            <Icon width={18} height={18} fill="#29D7DE" />
          ) : (
            <Ionicons name={Icon} size={18} color="#29D7DE" />
          )}
        </View>
      )}

      <View className="flex-1">
        <Text className="text-[#899B9B] font-lexendRegular text-[0.75rem] mb-0.5" numberOfLines={1}>
          {label}
        </Text>
        <View className="flex-row items-center">
          <Text
            className="text-[#202A2A] font-lexendSemiBold text-[0.9375rem]"
            numberOfLines={1}
          >
            {value || "---"}
          </Text>
          {(hasDropdown || showChevron) && (
            <Ionicons name="chevron-down" size={14} color="#00AEB5" style={{ marginLeft: 4 }} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SpecItem;
