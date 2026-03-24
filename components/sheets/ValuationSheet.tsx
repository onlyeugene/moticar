import BottomSheet from "@/components/shared/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ValuationSheetProps {
  visible: boolean;
  onClose: () => void;
  activeCar?: any;
}

const POSITIVE_ASSUMPTIONS = [
  "All tyres have been fitted",
  "All wheels are in good condition",
  "The car has more than one key",
  "Mechanical and electrical parts are fully functional",
  "Exterior and glass are free from imperfections",
];

const NEGATIVE_ASSUMPTIONS = [
  "The car is on import",
  "The glass have any crack or damage",
  "Limited duration left on the MOT",
  "The car has been used as private hire taxi",
  "Items missing from the car",
];

const VALUATION_FACTORS = [
  {
    label: "Make & Year of your Vehicle",
    detail:
      "Mercedes Benz is one of the premium and most desired brand of car in the market",
    badge: "A",
    badgeColor: "#00AEB5",
  },
  {
    label: "Model of your Vehicle",
    detail:
      "In recent years, the ML 350 is a top model from the list of guys who sell these kind of cars.",
    badge: "E",
    badgeColor: "#FFA500",
  },
  {
    label: "Mileage Recorded",
    detail: "Key works",
    badge: "B",
    badgeColor: "#006064",
  },
  {
    label: "Duration of Ownership",
    detail:
      "You seem to have used this car for over 6 years. This length of time might be a strong determinant of interest to the car value.",
    badge: "F",
    badgeColor: "#E53935",
  },
  {
    label: "Faults, Accident History or Body Defects",
    detail: "Key works",
    badge: "D",
    badgeColor: "#7B1FA2",
  },
  {
    label: "Modifications, Add-ons & Options",
    detail:
      "From your expense record, it appears you have upgraded parts that aren't part of the manufacturer's original specification.",
    badge: "C",
    badgeColor: "#F57C00",
  },
];

export default function ValuationSheet({
  visible,
  onClose,
  activeCar,
}: ValuationSheetProps) {
  const resaleValuation = activeCar?.resaleValuation;
  const highestValuation = resaleValuation
    ? resaleValuation * 1.1
    : null;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Estimated Valuation"
      scrollable={true}
      height="90%"
      backgroundColor="#FFFFFF"
      headerRight={
        <TouchableOpacity>
          <Ionicons name="download-outline" size={22} color="#555" />
        </TouchableOpacity>
      }
    >
      <View className="px-4 pb-10">
        {/* Top valuation card */}
        <View className="bg-[#EAFCFD] rounded-[16px] p-5 mb-5 items-center">
          <Text className="text-[#444] text-[12px] font-lexendRegular mb-1">
            Up to
          </Text>
          <Text className="text-[#006C70] text-[32px] font-lexendBold mb-3">
            {resaleValuation
              ? `₦${resaleValuation.toLocaleString()}`
              : "₦7,500,000"}
          </Text>

          {/* Highest valuation tag */}
          <View className="bg-[#FEF597] px-3 py-1.5 rounded-full mb-3">
            <Text className="text-[#444] text-[11px] font-lexendMedium">
              Highest valuation is ₦
              {highestValuation
                ? highestValuation.toLocaleString()
                : "12,905,000"}
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Ionicons
              name="information-circle-outline"
              size={13}
              color="#888"
            />
            <Text className="text-[#888] text-[10px] font-lexendRegular">
              This value is based on some assumptions
            </Text>
          </View>
        </View>

        {/* Assumptions */}
        <View className="bg-[#012E35] rounded-[16px] p-4 mb-5">
          {NEGATIVE_ASSUMPTIONS.map((a) => (
            <View key={a} className="flex-row items-center gap-2 mb-2">
              <Ionicons name="close" size={14} color="#FF6B6B" />
              <Text className="text-[#B0CFCF] text-[11px] font-lexendRegular flex-1">
                {a}
              </Text>
            </View>
          ))}
          {POSITIVE_ASSUMPTIONS.map((a) => (
            <View key={a} className="flex-row items-center gap-2 mb-2">
              <Ionicons name="checkmark" size={14} color="#29D7DE" />
              <Text className="text-[#B0CFCF] text-[11px] font-lexendRegular flex-1">
                {a}
              </Text>
            </View>
          ))}
        </View>

        {/* Valuation factors */}
        {VALUATION_FACTORS.map((factor) => (
          <View key={factor.label} className="mb-4">
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-[#00343F] text-[13px] font-lexendMedium flex-1 mr-3">
                {factor.label}
              </Text>
              <View
                className="w-7 h-7 rounded-full items-center justify-center"
                style={{ backgroundColor: factor.badgeColor }}
              >
                <Text className="text-white text-[11px] font-lexendBold">
                  {factor.badge}
                </Text>
              </View>
            </View>
            <Text className="text-[#888] text-[11px] font-lexendRegular leading-[17px]">
              {factor.detail}
            </Text>
            <View className="h-[1px] bg-[#F0F0F0] mt-4" />
          </View>
        ))}

        <Text className="text-[#ADADAD] text-[10px] font-lexendRegular text-center mt-2">
          This quote is only valid for 3 days.{"\n"}
          This is an estimated value based on your service history, mileage,
          condition of the car and modifications.
        </Text>
      </View>
    </BottomSheet>
  );
}
