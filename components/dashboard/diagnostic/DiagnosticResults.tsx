import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Plug from "@/assets/icons/plug.svg";
import Battery from "@/assets/motibuddie/icons/battery.svg";
import Activity from "@/assets/motibuddie/icons/activity.svg";
import Award from "@/assets/motibuddie/icons/award.svg";
import Brake from "@/assets/motibuddie/icons/brake.svg";
import Fan from "@/assets/motibuddie/icons/fan.svg";
import Flag from "@/assets/motibuddie/icons/flag.svg";
import Route from "@/assets/motibuddie/icons/route.svg";
import Tool from "@/assets/motibuddie/icons/tool.svg";
import Triangle from "@/assets/motibuddie/icons/triangle.svg";
import Wind from "@/assets/motibuddie/icons/wind.svg";
import Zap from "@/assets/motibuddie/icons/zap.svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface MetricProps {
  label: string;
  value: string;
  icon: React.FC<any>;
  color?: string;
  warning?: boolean;
  size?: "small" | "large";
}

const MetricCard = ({
  label,
  value,
  icon: Icon,
  color = "#29D7DE",
  warning,
  size = "small",
}: MetricProps) => (
  <View
    style={{
      width: size === "large" ? "65%" : "32%",
      height: 126,
    }}
    className={`rounded-[16px] p-4 border mb-3 ${
      warning ? "border-[#F8953A] bg-[#FF5B5B40]" : "border-white/20"
    }`}
  >
    <View className="flex-row items-center justify-between">
      <View className={`p-2 rounded-full`}>
        <Icon width={24} height={24} />
      </View>
      {warning && <Ionicons name="warning" size={12} color="#BA7C1B" />}
    </View>
    <View className="mt-auto">
      <Text className="text-[#5E7A7C] font-lexendRegular text-[12px] mb-1">
        {label}
      </Text>
      <Text className={`font-lexendRegular text-[23px] text-white`}>
        {value}
      </Text>
    </View>
  </View>
);

const CircularProgress = ({
  size,
  strokeWidth,
  progress,
  label,
  subLabel,
}: any) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Handle case where progress is 0 or null
  const safeProgress = Math.max(0, Math.min(100, progress || 0));
  const offset = circumference - (safeProgress / 100) * circumference;

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#52D5FF"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeOpacity={0.3}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#29D7DE"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
      <View className="absolute items-center justify-center">
        <Text className="text-white font-lexendBold text-[18px]">
          {label || "--"}
        </Text>
        {subLabel && (
          <Text className="text-[#81B4B4] font-lexendRegular text-[10px]">
            {subLabel}
          </Text>
        )}
      </View>
    </View>
  );
};

interface Props {
  onCancel: () => void;
  report: any;
}

export default function DiagnosticResults({ onCancel, report }: Props) {
  const [activePage, setActivePage] = useState(0);

  // Fallback structure is no longer needed as the parent handles loading/error states.
  // We use simple optional chaining for extra safety.
  const data = report;

  if (!data) return null;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const page = Math.round(scrollOffset / SCREEN_WIDTH);
    if (page !== activePage) {
      setActivePage(page);
    }
  };

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 ">
      {/* Header */}
      <View className="flex-row items-center justify-end pt-2">
        <TouchableOpacity onPress={onCancel} className="p-2">
          <Ionicons name="close" size={34} color="#6A8476" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Main Health Score */}
        <View className="items-center justify-center ">
          <Text className="text-[#7FA4A6] font-lexendSemiBold text-[14px]">
            Car Health Score
          </Text>
          <Text className="text-white font-lexendMedium text-[53px]">
            {data.healthScore}%
          </Text>
        </View>

        {/* Top Indicators */}
        <View className="flex-row justify-around items-center my-4">
          <View className="items-center">
            <Text className="text-[#7FA4A6] font-lexendSemiBold text-[14px] mb-2">
              Fuel Range
            </Text>
            <CircularProgress
              size={80}
              strokeWidth={10}
              progress={data.fuelRange.percentage}
              label={data.fuelRange.miles?.toString() || "0"}
              subLabel="miles"
            />
          </View>
          <View
            style={{
              shadowColor: "#29D7DE",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 15,
              elevation: 10,
            }}
            className="p-4 rounded-full bg-[#29D7DE] items-center justify-center w-[95px] h-[92px] mt-2"
          >
            <Plug width={51} height={28} />
          </View>
          <View className="items-center">
            <Text className="text-[#7FA4A6] font-lexendSemiBold text-[14px] mb-2">
              Next Service
            </Text>
            <CircularProgress
              size={80}
              strokeWidth={10}
              progress={65}
              label={data.nextService.days?.toString() || "--"}
              subLabel="days"
            />
          </View>
        </View>

        {/* Swipeable Metrics Grid */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          className="w-full mt-5"
        >
          {/* Page 1: Engineering & Safety */}
          <View style={{ width: SCREEN_WIDTH - 32 }} className="px-1">
            <View className="flex-row justify-between">
              <MetricCard
                label="Engine"
                value={
                  data.metrics.engineTemp
                    ? `${data.metrics.engineTemp.value}${data.metrics.engineTemp.unit}`
                    : "--"
                }
                icon={Tool}
                warning={data.metrics.engineTemp?.status === "warning"}
              />
              <MetricCard
                label="Battery"
                value={`${data.metrics.battery.value} ${data.metrics.battery.unit}`}
                icon={Battery}
                warning={data.metrics.battery.status === "warning"}
              />
              <MetricCard
                label="Error Log"
                value={data.metrics.errorLog.value}
                icon={Triangle}
                warning={data.metrics.errorLog.status === "warning"}
              />
            </View>
            <View className="flex-row justify-between">
              <MetricCard
                label="Brake Pad"
                value={
                  data.metrics.brakePad ? data.metrics.brakePad.value : "N/A"
                }
                icon={Brake}
                warning={data.metrics.brakePad?.status === "warning"}
              />
              <MetricCard
                label="ABS"
                value={data.metrics.abs.value}
                icon={Zap}
                warning={data.metrics.abs.status === "warning"}
              />
              <MetricCard
                label="AC"
                value={data.metrics.ac ? data.metrics.ac.value : "N/A"}
                icon={Fan}
              />
            </View>
          </View>

          {/* Page 2: Driving Stats */}
          <View style={{ width: SCREEN_WIDTH - 32 }} className="px-1">
            <View className="flex-row justify-between">
              <MetricCard
                label="Trips"
                value={data.activity.trips.toString()}
                icon={Flag}
              />
              <MetricCard
                label="Miles Driven"
                value={data.activity.milesDriven.toString()}
                icon={Route}
              />
              <MetricCard
                label="Smoothness"
                value={data.activity.smoothness}
                icon={Wind}
              />
            </View>
            <View className="flex-row justify-between">
              <MetricCard
                label="Driving Score"
                value={data.activity.drivingScore}
                icon={Award}
                size="large"
              />
              <MetricCard
                label="Efficiency"
                value={data.activity.efficiency}
                icon={Activity}
              />
            </View>
          </View>
        </ScrollView>
      </ScrollView>

      {/* Footer / Pagination Indicator */}
      <View className="flex-row justify-center gap-2 pb-4">
        <View
          className={`h-2 rounded-full transition-all duration-300 ${
            activePage === 0
              ? "w-[47px] bg-[#7AE6EB]"
              : "w-[47px] bg-[#011F24] border border-[#09515D]"
          }`}
        />
        <View
          className={`h-2 rounded-full transition-all duration-300 ${
            activePage === 1
              ? "w-[47px] bg-[#7AE6EB]"
              : "w-[47px] bg-[#011F24] border border-[#09515D]"
          }`}
        />
      </View>
    </Animated.View>
  );
}
