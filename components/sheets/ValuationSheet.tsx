import React, { useState } from "react";
import BottomSheet from "@/components/shared/BottomSheet";
import { useMe } from "@/hooks/useAuth";
import { useValuation } from "@/hooks/useExpenses";
import { getCurrencySymbol } from "@/utils/currency";
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";

interface ValuationSheetProps {
  visible: boolean;
  onClose: () => void;
  carId: string;
}

export default function ValuationSheet({
  visible,
  onClose,
  carId,
}: ValuationSheetProps) {
  const [isAssumptionsVisible, setIsAssumptionsVisible] = useState(false);
  const { data: user } = useMe();
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);

  const { data: valuation, isLoading, isError } = useValuation(carId, visible);

  if (isLoading) {
    return (
      <BottomSheet
        visible={visible}
        onClose={onClose}
        title="Estimated Valuation"
        height="90%"
      >
        <View className="flex-1 items-center justify-center">
          <Text className="text-[#888]">Loading latest valuation...</Text>
        </View>
      </BottomSheet>
    );
  }

  if (isError || !valuation) {
    return (
      <BottomSheet
        visible={visible}
        onClose={onClose}
        title="Estimated Valuation"
        height="90%"
      >
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-500 text-center">
            Failed to load valuation
          </Text>
        </View>
      </BottomSheet>
    );
  }

  const estimatedValue = valuation.estimatedValue || 0;
  const highestValuation =
    valuation.highestValuationAvg || Math.round(estimatedValue * 1.15);

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
      .map((s) => s.trim())
      .filter((s) => s.length > 20);

    // Score sentences by keyword matches
    const scoredSentences = sentences.map((s) => {
      const lowerS = s.toLowerCase();
      const score = keywords.reduce(
        (sum, kw) => sum + (lowerS.includes(kw.toLowerCase()) ? 1 : 0),
        0,
      );
      return { sentence: s, score };
    });

    const bestMatch = scoredSentences.sort((a, b) => b.score - a.score)[0];
    return bestMatch && bestMatch.score > 0
      ? `${bestMatch.sentence}.`
      : defaultDesc;
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title=""
      scrollable={true}
      height="90%"
      backgroundColor="#FFFFFF"
    >
      <View className="mb-4 px-2 flex-row items-center justify-between">
        <Text className="text-[#00343F] font-lexendSemiBold text-[22px] ">
          Estimated Valuation
        </Text>

        <Ionicons name="download-outline" size={20} color="#344054" />
      </View>
      <ScrollView className="px-4 pb-10">
        {/* Main Valuation Card */}
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
              Highest valutation is {currencySymbol}
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

        {/* Grades / Scores */}
        {valuation.scores && (
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
                    <Text className="text-[#495353] text-[10px] font-lexendRegular leading-[19px]"
                    numberOfLines={3}>
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
            This quote is only valid for 3 days.
          </Text>
          <Text className="text-[#C1C3C3] text-[10px] font-lexendRegular text-center leading-[15px]">
            This is considering several factors provided here such as your
            service{"\n"}
            history, mileage, condition of the car and modifications
          </Text>
        </View>
      </ScrollView>

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
                {valuation.assumptions && valuation.assumptions.length > 0 ? (
                  valuation.assumptions.map((assumption, idx) => (
                    <View key={idx} className="flex-row items-start gap-3 mb-5">
                      <View className="">
                        <Ionicons name="checkmark" size={16} color="#29D7DE" />
                      </View>
                      <Text className="text-[#9A9B9B] text-[10px] font-lexendRegular flex-1 leading-[22px]">
                        {assumption}
                      </Text>
                    </View>
                  ))
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
