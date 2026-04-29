import BottomSheet from "@/components/shared/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import ViewShot from "react-native-view-shot";
import LogoBlue from "@/assets/icons/logoblue.svg";
import * as Sharing from "expo-sharing";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

import diagnosisService, {
  IDiagnosis,
  IDiagnosisStatus,
} from "@/services/api/diagnosisService";
import { carService } from "@/services/api/carService";
import { LoadingModal } from "../ui/LoadingModal";

interface DiagnosisSheetProps {
  visible: boolean;
  onClose: () => void;
  carId: string;
}

type DiagnosisState = "initializing" | "start" | "loading" | "result" | "locked";

export default function DiagnosisSheet({
  visible,
  onClose,
  carId,
}: DiagnosisSheetProps) {
  const [state, setState] = useState<DiagnosisState>("initializing");
  const [status, setStatus] = useState<IDiagnosisStatus | null>(null);
  const [diagnosis, setDiagnosis] = useState<IDiagnosis | null>(null);
  const [car, setCar] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "spending",
  ]);
  const viewShotRef = useRef<ViewShot>(null);

  useEffect(() => {
    if (visible && carId) {
      setState("initializing");
      fetchStatus();
      fetchCar();
    }
  }, [visible, carId]);

  const fetchStatus = async () => {
    try {
      const data = await diagnosisService.getStatus(carId);
      setStatus(data);
      if (!data.canGenerate) {
        setState("locked");
      } else {
        setState("start");
      }
      setDiagnosis(data.lastDiagnosis || null);
    } catch (error) {
      console.error("Error fetching diagnosis status:", error);
    }
  };

  const fetchCar = async () => {
    try {
      const data = await carService.getCarById(carId);
      setCar(data.car);
    } catch (error) {
      console.error("Error fetching car:", error);
    }
  };

  const handleGenerate = async () => {
    try {
      setState("loading");
      const { diagnosis: newDiagnosis } =
        await diagnosisService.generate(carId);
      setDiagnosis(newDiagnosis);
      setState("result");
    } catch (error: any) {
      console.error("Error generating diagnosis:", error);
      alert(error.response?.data?.error || "Failed to generate diagnosis.");
      setState("start");
    }
  };

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Auto Analysis Report",
          UTI: "public.png",
        });
      }
    } catch (error) {
      console.error("Error sharing report:", error);
    }
  };

  const renderStart = () => (
    <View className="items-center justify-center py-10 px-6">
      <View className="items-center justify-center mb-3">
        <LogoBlue />
      </View>
      <Text className="text-[#013037] font-lexendRegular text-center text-[14px] mb-6">
        You are ready to carry out{"\n"}your diagonistic assessment
      </Text>
      <TouchableOpacity
        onPress={handleGenerate}
        className="bg-[#29D7DE] w-full py-4 rounded-full items-center"
      >
        <Text className="text-[#00343F] font-lexendBold text-[14px]">
          Get Car Advice
        </Text>
      </TouchableOpacity>

      <View className="border-b border-[#CED2DA] w-full mt-10" />

      <View className="mt-10">
        <Text className="text-[#92999A] text-[10px] font-lexendRegular text-center">
          This report is generated from your Moticar expense data and general{" "}
          {"\n"}maintenance guidelines for your vehicle type.
        </Text>
        <Text className="text-[#92999A] text-[10px] font-lexendRegular text-center mt-5">
          It is not a substitute for a professional mechanical inspection.{" "}
          {"\n"}Recommendations are suggestive, not diagnostic
        </Text>
      </View>
    </View>
  );

  const renderLoading = () => <LoadingModal visible />;

  const renderLocked = () => {
    const days = status?.daysRemaining || 0;
    const size = 200;
    const strokeWidth = 15;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const halfCircumference = circumference / 2;
    const strokeDashoffset =
      halfCircumference - (days / 30) * halfCircumference;

    return (
      <View className="items-center justify-center py-10 px-6">
        <View style={{ width: size, height: size / 1.5, alignItems: "center" }}>
          <Svg width={size} height={size}>
            <G rotation="-180" origin={`${size / 2}, ${size / 2}`}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#FFF7E8"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${halfCircumference} ${circumference}`}
              />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#FFCD71"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${halfCircumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </G>
          </Svg>
          <View className="absolute top-1/2 items-center">
            <Text className="text-[#131313] font-lexendMedium text-[32px]">
              {days}/30
            </Text>
          </View>
        </View>
        <Text className="text-[#888282] font-lexendRegular text-center text-[14px] -mt-4">
          you can only carry out this{"\n"}exercise once in 30 days.
        </Text>

        <View className="border-b border-[#CED2DA] w-full mt-10" />

        <View className="mt-10">
          <Text className="text-[#92999A] text-[10px] font-lexendRegular text-center">
            This report is generated from your Moticar expense data and general{" "}
            {"\n"}maintenance guidelines for your vehicle type.
          </Text>
          <Text className="text-[#92999A] text-[10px] font-lexendRegular text-center mt-5">
            It is not a substitute for a professional mechanical inspection.{" "}
            {"\n"}Recommendations are suggestive, not diagnostic
          </Text>
        </View>
        {diagnosis && (
          <TouchableOpacity
            onPress={() => setState("result")}
            className="bg-[#29D7DE] w-full py-4 rounded-full items-center mt-8"
          >
            <Text className="text-[#00343F] font-lexendBold text-[16px]">
              View Last Report
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSection = (
    id: string,
    title: string,
    expanded: boolean,
    content: React.ReactNode,
  ) => (
    <View key={id} className="mb-4">
      <TouchableOpacity
        onPress={() => toggleSection(id)}
        className={`flex-row items-center justify-between py-4 ${expanded || id === "forecast" ? "" : "border-b border-[#92BEC1]"}`}
      >
        <Text className="text-[#00343F] font-lexendBold text-[14px]">
          {title}
        </Text>
        <Ionicons
          name={expanded ? "remove-circle-outline" : "add-circle-outline"}
          size={24}
          color={expanded ? "#98A2B3" : "#00AEB5"}
        />
      </TouchableOpacity>
      {expanded && (
        <View
          className={`py-4 px-1 ${expanded && id !== "forecast" ? "border-b border-[#92BEC1]" : ""}`}
        >
          {content}
        </View>
      )}
    </View>
  );

  const renderResult = () => {
    if (!diagnosis) return null;

    return (
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.9 }}>
          <View className="px-4 pb-10">
            {/* Report Header */}
            <View className="bg-white p-4 rounded-[4px] mb-6 mt-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 gap-3">
                  <View className="flex-row gap-2">
                    <View className="w-12 h-12 border border-[#F0F0F0] rounded-lg items-center justify-center">
                      <Ionicons name="car-outline" size={24} color="#EF1C39" />
                    </View>
                    <View>
                      <Text className="text-[#484848] font-lexendBold text-[16px]">
                        {car?.make} {car?.carModel}
                      </Text>
                      <Text className="text-[#00AEB5] font-ukNumberPlate text-[18px] mt-2">
                        {car?.plate || "N/A"}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-[#9F9F9F] text-[9px] font-lexendRegular leading-[15px]">
                    This score reflects your maintenance consistency, spending
                    patterns, and how your car's age and mileage compare to
                    recommended service intervals.
                  </Text>
                </View>
                <View className="items-center bg-[#EAFEFF] rounded-full w-[70px] h-[72px] flex justify-center">
                  <Text className="text-[#7FA4A6] text-[9px] font-lexendSemiBold">
                    Overall Score
                  </Text>
                  <Text className="text-[#29D7DE] text-[33px] font-lexendMedium">
                    {diagnosis.overallScore}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Collapsible Sections */}
            {renderSection(
              "spending",
              "Spending Summary",
              expandedSections.includes("spending"),
              <View>
                <Text className="text-[#00343F] text-[12px] font-lexendRegular leading-5">
                  Total spent ({diagnosis.spendingSummary.periodMonths} months):{" "}
                  <Text className="">
                    {diagnosis.spendingSummary.currency}{" "}
                    {diagnosis.spendingSummary.totalSpent.toLocaleString()}
                  </Text>
                  {"\n"}
                  Monthly average:{" "}
                  <Text className="">
                    {diagnosis.spendingSummary.currency}{" "}
                    {diagnosis.spendingSummary.monthlyAverage.toLocaleString()}
                  </Text>
                  {"\n"}
                  {diagnosis.spendingSummary.breakdown
                    .map(
                      (b) =>
                        `${b.category} accounts for ${b.percentage}% of your total spend.`,
                    )
                    .join(" ")}
                </Text>
                {diagnosis.spendingSummary.comparisonInsight && (
                  <Text className="text-[#00343F] text-[12px] font-lexendRegular leading-5">
                    {diagnosis.spendingSummary.comparisonInsight}
                  </Text>
                )}
              </View>,
            )}

            {renderSection(
              "findings",
              "Key Findings",
              expandedSections.includes("findings"),
              <View className="gap-4">
                {diagnosis.keyFindings.map((finding, i) => (
                  <View key={i} className="flex-row gap-2">
                    <Text className="text-[#00343F] text-[12px] font-lexendBold">
                      {i + 1}.
                    </Text>
                    <View className="flex-1">
                      <Text className="text-[#00343F] text-[12px] font-lexendBold mb-1">
                        {finding.title}
                      </Text>
                      <Text className="text-[#425658] text-[12px] font-lexendRegular leading-5">
                        {finding.detail}
                      </Text>
                      {finding.recommendedAction && (
                        <Text className="text-[#00AEB5] text-[11px] font-lexendSemiBold mt-1">
                          Action: {finding.recommendedAction}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>,
            )}

            {renderSection(
              "calendar",
              "Maintenance Calendar",
              expandedSections.includes("calendar"),
              <View className="gap-2">
                {diagnosis.maintenanceCalendar.map((item, i) => (
                  <View key={i} className="flex-row justify-between">
                    <Text className="text-[#00343F] text-[12px] font-lexendRegular leading-5 flex-1">
                      {item.task} —{" "}
                      {item.dueDate
                        ? new Date(item.dueDate).toDateString()
                        : item.dueMileage
                          ? `${item.dueMileage} km`
                          : "TBD"}
                    </Text>
                    {/* <Text className={`text-[10px] font-lexendBold px-2 rounded ${item.priority === 'high' ? 'bg-red-100 text-red-600' : item.priority === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                      {item.priority.toUpperCase()}
                    </Text> */}
                  </View>
                ))}
              </View>,
            )}

            {renderSection(
              "forecast",
              "Cost Forecast",
              expandedSections.includes("forecast"),
              <View>
                <Text className="text-[#00343F] text-[12px] font-lexendRegular leading-5">
                  {diagnosis.costForecast}
                </Text>
              </View>,
            )}
            <View className="border-t border-[#CED2DA] my-2" />

            <View className="items-center mt-8 pb-10">
              <Text className="text-[#92999A] text-[10px] font-lexendRegular text-center leading-[15px]">
                This report is generated from your Moticar expense data and
                general{"\n"}maintenance guidelines for your vehicle type.
                {"\n\n"}
                It is not a substitute for a professional mechanical inspection.
                {"\n"}Recommendations are suggestive, not diagnostic.
              </Text>
              <Text className="text-[#8C9698] font-lexendBold text-[12px] mt-4">
                Generated: {new Date(diagnosis.generatedAt).toDateString()}
              </Text>
            </View>
          </View>
        </ViewShot>
      </ScrollView>
    );
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Smart Auto Diagnosis"
      height={state === "result" ? "90%" : "60%"}
      backgroundColor="#F0F0F0"
      headerRight={
        state === "result" ? (
          <View className="flex-row gap-4">
            <TouchableOpacity onPress={handleShare}>
              <Ionicons name="share-social-outline" size={22} color="#ADADAD" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare}>
              <Ionicons name="save-outline" size={22} color="#ADADAD" />
            </TouchableOpacity>
          </View>
        ) : null
      }
    >
      {state === "initializing" && <LoadingModal visible message=""/>}
      {state === "start" && renderStart()}
      {state === "loading" && renderLoading()}
      {state === "result" && renderResult()}
      {state === "locked" && renderLocked()}
    </BottomSheet>
  );
}
