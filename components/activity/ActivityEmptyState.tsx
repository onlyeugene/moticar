import EmptyIcon from "@/assets/icons/empty.svg";
import React from "react";
import { Text, View } from "react-native";

interface ActivityEmptyStateProps {
  tabName: string;
}

const ActivityEmptyState: React.FC<ActivityEmptyStateProps> = ({ tabName }) => {
  return (
    <View className="flex-1 px-4 items-center justify-center">
      <EmptyIcon />
      <Text className="text-[#888282] text-[14px] font-lexendRegular mt-4">
        No {tabName.toLowerCase()} recorded
      </Text>
    </View>
  );
};

export default ActivityEmptyState;
