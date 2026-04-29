import BottomSheet from "@/components/shared/BottomSheet";
import { useMe } from "@/hooks/useAuth";
import { expenseService } from "@/services/api/expenseService";
import { getCurrencySymbol } from "@/utils/currency";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Sharing from "expo-sharing";
import React, { useEffect, useRef, useState } from "react";
import ViewShot from "react-native-view-shot";
import Svg, { Circle, G } from "react-native-svg";
import LogoBlue from "@/assets/icons/logoblue.svg";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LoadingModal } from "../ui/LoadingModal";

interface ValuationSheetProps {
  visible: boolean;
  onClose: () => void;
  carId: string;
}

type ValuationState = "initializing" | "start" | "loading" | "result" | "locked";

export default function ValuationSheet({
  visible,
  onClose,
  carId,
}: ValuationSheetProps) {
  const [state, setState] = useState<ValuationState>("initializing");
  const [status, setStatus] = useState<any>(null);
  const [valuation, setValuation] = useState<any>(null);
  const [isAssumptionsVisible, setIsAssumptionsVisible] = useState(false);
  const hiddenViewShotRef = useRef<ViewShot>(null);

  const { data: user } = useMe();
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);

  useEffect(() => {
    if (visible && carId) {
      setState("initializing");
      fetchStatus();
    }
  }, [visible, carId]);

  const fetchStatus = async () => {
    try {
      const data = await expenseService.getValuationStatus(carId);
      setStatus(data);
      if (!data.canGenerate) {
        setState("locked");
      } else {
        setState("start");
      }
      setValuation(data.lastValuation || null);
    } catch (error) {
      console.error("Error fetching valuation status:", error);
    }
  };

  const handleGenerate = async () => {
    try {
      setState("loading");
      const data = await expenseService.getEstimatedValuation(carId);
      setValuation(data);
      setState("result");
    } catch (error: any) {
      console.error("Error generating valuation:", error);
      alert(error.response?.data?.error || "Failed to generate valuation.");
      setState("start");
    }
  };

  const handleShare = async () => {
    try {
      const uri = await hiddenViewShotRef.current?.capture?.();
      if (uri) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Valuation Report",
          UTI: "public.png",
        });
      }
    } catch (error) {
      console.error("Error sharing valuation:", error);
      Alert.alert("Error", "Failed to generate shareable image.");
    }
  };

  const estimatedValue = valuation?.estimatedValue || 0;
  const highestValuation =
    valuation?.highestValuationAvg || Math.round(estimatedValue * 1.15);
  const displayDate =
    valuation?.valuationDate || valuation?.createdAt
      ? new Date(
          valuation.valuationDate || valuation.createdAt!,
        ).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

  const factorConfigs: Record<string, { label: string; description: string }> =
    {
      makeAndYear: {
        label: "Make & Year of your Vehicle",
        description:
          "Based on the brand reputation and the specific production year of your car's model.",
      },
      model: {
        label: "Model of your Vehicle",
        description:
          "Evaluates the popularity and market demand for your specific model variant.",
      },
      mileageRecorded: {
        label: "Mileage Recorded",
        description:
          "Reflects how much the vehicle has been driven compared to market averages.",
      },
      durationOfOwnership: {
        label: "Duration of Ownership",
        description:
          "Considers the number of previous owners and how long you've maintained it.",
      },
      faultsHistory: {
        label: "Faults, Accident History or Body Defects",
        description:
          "Analysis of recorded mechanical issues, body work, and historical repairs.",
      },
      modifications: {
        label: "Modifications, Add-ons & Options",
        description:
          "Impact of aftermarket parts or upgraded features on the vehicle's resale value.",
      },
    };

  const getFactorDescription = (key: string, defaultDesc: string) => {
    if (!valuation?.aiReasoning) return defaultDesc;

    const keywordMap: Record<string, string[]> = {
      makeAndYear: ["year", "age", "make", "brand", "production", "generation"],
      model: ["model", "corolla", "type", "variant", "engine", "market"],
      mileageRecorded: ["mileage", "km", "driven", "odometer", "distance"],
      durationOfOwnership: ["ownership", "owned", "previous", "owner"],
      faultsHistory: [
        "fault",
        "accident",
        "repair",
        "service",
        "mechanical",
        "electrical",
        "wear",
        "condition",
        "cosmetic",
      ],
      modifications: [
        "modification",
        "upgrade",
        "aftermarket",
        "add-on",
        "parts",
      ],
    };

    const keywords = keywordMap[key] || [];
    const sentences = valuation.aiReasoning
      .split(/[.!?]+/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 20);

    const scoredSentences = sentences.map((s: string) => {
      const lowerS = s.toLowerCase();
      const score = keywords.reduce(
        (sum, kw) => sum + (lowerS.includes(kw.toLowerCase()) ? 1 : 0),
        0,
      );
      return { sentence: s, score };
    });

    const bestMatch = scoredSentences.sort(
      (a: any, b: any) => b.score - a.score,
    )[0];
    return bestMatch && bestMatch.score > 0
      ? `${bestMatch.sentence}.`
      : defaultDesc;
  };

  const renderPreviousValuation = () => {
    if (!valuation) return null;
    return (
      <View className="w-full">
        <TouchableOpacity
          className="flex-row items-start justify-between bg-white px-4 py-4 rounded-[5px]"
          onPress={() => setState("result")}
        >
          <View>
            <Text className="text-[#8B8B8B] font-lexendSemiBold text-[10px] uppercase mb-1">
              PREVIOUS VALUATION
            </Text>
          </View>
          <View className="flex-row items-start gap-2">
            <View className="items-end">
              <Text className="text-[#2A2A2A] font-lexendRegular text-[14px]">
                {currencySymbol}
                {valuation.estimatedValue?.toLocaleString()}
              </Text>
              <Text className="text-[#34A853] font-lexendRegular text-[10px]">
                valuation as of{" "}
                {new Date(
                  valuation.valuationDate || Date.now(),
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#888282" />
          </View>
        </TouchableOpacity>

        <Text className="text-[#A4A4A4] text-[10px] font-lexendRegular text-center leading-[14px] mt-4">
          This is considering several factors provided here such as your service{" "}
          {"\n"}history, mileage, condition of the car and modifications
        </Text>
      </View>
    );
  };

  const renderStart = () => (
    <View className="flex-1 items-center px-6 pb-10">
      <View className="flex-1 items-center justify-center w-full">
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
            Get a price estimate
          </Text>
        </TouchableOpacity>
      </View>
      {renderPreviousValuation()}
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
      <View className="flex-1 items-center px-6 pb-10">
        <View className="flex-1 items-center justify-center w-full">
          <View
            style={{ width: size, height: size / 1.5, alignItems: "center" }}
          >
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
        </View>

        {renderPreviousValuation()}
      </View>
    );
  };

  const renderValuationContent = () => (
    <>
      <View className="bg-[#DCF7F8] border-[#92BEC1] shadow-sm rounded-[8px] p-5 mb-6 items-center">
        <View className="flex-row items-center mb-3 gap-2">
          <Text className="text-[#202A2A] text-[12px] font-lexendRegular">
            Up to
          </Text>
          <Text className="text-[#006C70] text-[32px] font-lexendBold">
            {currencySymbol}
            {estimatedValue.toLocaleString()}
          </Text>
        </View>
        <View className="bg-[#F8E761] px-4 py-2 rounded-full mb-4">
          <Text className="text-[#425658] text-[12px] font-lexendRegular">
            Highest valuation is {currencySymbol}
            {highestValuation.toLocaleString()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setIsAssumptionsVisible(true)}
          activeOpacity={0.7}
          className="flex-row items-center gap-1"
        >
          <Ionicons name="alert-circle-outline" size={14} color="#00AEB5" />
          <Text className="text-[#002D36] text-[10px] font-lexendRegular">
            This value is based on some assumptions
          </Text>
        </TouchableOpacity>
      </View>

      {valuation?.scores && (
        <View className="mb-2">
          {Object.entries(valuation.scores).map(([key, grade]) => {
            const config = factorConfigs[key];
            if (!config) return null;

            return (
              <View key={key} className="mb-2">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-[#006C70] text-[12px] font-lexendBold flex-1 mr-4">
                      {config.label}
                    </Text>
                    <Text
                      className="text-[#495353] text-[10px] font-lexendRegular leading-[19px]"
                      numberOfLines={3}
                    >
                      {getFactorDescription(key, config.description)}
                    </Text>
                  </View>
                  <View
                    className="w-9 h-9 rounded-[8px] items-center justify-center -mt-1"
                    style={{
                      backgroundColor: getGradeColor(grade as string),
                    }}
                  >
                    <Text className="text-white font-lexendSemiBold text-[18px]">
                      {grade as string}
                    </Text>
                  </View>
                </View>

                <View className="h-[1px] bg-[#F5F5F5] mt-5" />
              </View>
            );
          })}
        </View>
      )}

      <View className="items-center ">
        <Text className="text-[#006C70] text-[10px] font-lexendMedium mb-1">
          {`valuation is valid as of ${displayDate}`}
        </Text>
        <Text className="text-[#C1C3C3] text-[10px] font-lexendRegular text-center leading-[15px]">
          This is considering several factors provided here such as your service
          {"\n"}
          history, mileage, condition of the car and modifications
        </Text>
      </View>
    </>
  );

  return (
    <BottomSheet
      title
      visible={visible}
      onClose={onClose}
      scrollable={state === "result"}
      height={state === "result" ? "90%" : "80%"}
      backgroundColor={state === "result" ? "#FFFFFF" : "#F0F0F0"}
    >
      <View className="flex-row justify-between items-center px-1 mb-6">
        <Text className="text-[#00343F] font-lexendSemiBold text-[22px]">
          Estimated Valuation
        </Text>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="download-outline" size={22} color="#00343F" />
        </TouchableOpacity>
      </View>

      {state === "initializing" && <LoadingModal visible />}
      {state === "start" && renderStart()}
      {state === "loading" && renderLoading()}
      {state === "locked" && renderLocked()}
      {state === "result" && (
        <View className="px-3 pb-10">{renderValuationContent()}</View>
      )}

      {/* Hidden View for Sharing */}
      {state === "result" && (
        <View
          style={{
            position: "absolute",
            left: -2000,
            width: 375, // Standard mobile width
            backgroundColor: "white",
          }}
        >
          <ViewShot
            ref={hiddenViewShotRef}
            options={{ format: "png", quality: 0.9 }}
          >
            <View className="bg-white p-8">
              <Text className="text-[#00343F] font-lexendSemiBold text-[22px] mb-8">
                Estimated Valuation
              </Text>
              {renderValuationContent()}
            </View>
          </ViewShot>
        </View>
      )}

      <Modal
        visible={isAssumptionsVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsAssumptionsVisible(false)}
      >
        <Pressable
          className="flex-1"
          onPress={() => setIsAssumptionsVisible(false)}
        >
          <BlurView
            intensity={20}
            tint="dark"
            className="flex-1 items-center justify-center px-6"
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              className="bg-[#000000D9] rounded-[24px] w-full p-6 shadow-2xl"
            >
              <View>
                {valuation?.assumptions && valuation.assumptions.length > 0 ? (
                  valuation.assumptions.map(
                    (assumption: string, idx: number) => (
                      <View
                        key={idx}
                        className="flex-row items-start gap-3 mb-5"
                      >
                        <View className="">
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#29D7DE"
                          />
                        </View>
                        <Text className="text-[#9A9B9B] text-[10px] font-lexendRegular flex-1 leading-[22px]">
                          {assumption}
                        </Text>
                      </View>
                    ),
                  )
                ) : (
                  <Text className="text-[#9BBABB] text-[14px] font-lexendRegular text-center py-10">
                    No specific assumptions noted for this valuation.
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={() => setIsAssumptionsVisible(false)}
                className="bg-[#00AEB5] py-4 rounded-xl mt-4 items-center"
              >
                <Text className="text-white font-lexendBold text-[14px]">
                  Got it!
                </Text>
              </TouchableOpacity>
            </Pressable>
          </BlurView>
        </Pressable>
      </Modal>
    </BottomSheet>
  );
}

// Helper function
const getGradeColor = (grade: string): string => {
  switch (grade) {
    case "A":
      return "#005F40";
    case "B":
      return "#19B059";
    case "C":
      return "#B89E41";
    case "D":
      return "#FFC700";
    case "E":
      return "#F78521";
    case "F":
      return "#EF1C39";
    default:
      return "#9E9E9E";
  }
};
