import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useActivityInsights } from "@/hooks/useActivity";

interface DashboardInsightsProps {
  carId: string;
  month?: string;
  year?: string;
}

export default function DashboardInsights({
  carId,
  month,
  year,
}: DashboardInsightsProps) {
  const { data: insightsData, isLoading } = useActivityInsights(
    carId,
    month,
    year,
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const insights = insightsData?.insights || [
    {
      id: "default-1",
      text: "Your Fuel spending increased 12% (N4,000) this month.",
      category: "Fuel",
      type: "neutral",
    },
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % insights.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + insights.length) % insights.length);
  };


  if (!insights.length) return null;

  const currentItem = insights[activeIndex];

  return (
    <View className="mt-4">
      <View className="bg-[#E0FBFC] p-5 rounded-[12px] border border-[#B8F2F4]">
        {isLoading ? (
          <ActivityIndicator size="small" color="#00AEB5" />
        ) : (
          <View className="flex-row items-center gap-3">
            <View className="">
              <Ionicons name="bulb-outline" size={24} color="#00AEB5" />
            </View>
            <View className="flex-1">
              <Text className="font-lexendBold text-[12px] text-[#404040]">
                Insights
              </Text>
              <Text className="text-[#1A3B41] font-lexendRegular text-[13px] leading-5">
                {currentItem.text}
              </Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handlePrev}
                disabled={insights.length <= 1}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color="#00AEB5"
                  style={{ opacity: insights.length <= 1 ? 0.3 : 1 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNext}
                disabled={insights.length <= 1}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#00AEB5"
                  style={{ opacity: insights.length <= 1 ? 0.3 : 1 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonWrapper: {
    marginTop: 16,
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  skeletonBox: {
    backgroundColor: "#E0FBFC",
    height: 96,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#B8F2F4",
  },
});
