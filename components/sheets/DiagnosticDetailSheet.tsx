import { DiagnosticItem } from "./DiagnosticListSheet";
import BottomSheet from "@/components/shared/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface Station {
  name: string;
  color: string;
}

const FUEL_STATIONS: Station[] = [
  { name: "RAMEN", color: "#E53935" },
  { name: "elf", color: "#006064" },
  { name: "SHELL", color: "#FDD835" },
  { name: "Total", color: "#E65100" },
  { name: "Mobil", color: "#1565C0" },
];

function getDetails(item: DiagnosticItem | null, activeCar: any) {
  if (!item) return [];
  switch (item.key) {
    case "fuel":
      return [
        {
          label: "Capacity",
          value: activeCar?.fuelSpec?.capacityLiters
            ? `${activeCar.fuelSpec.capacityLiters}L`
            : "93L",
        },
        {
          label: "Average Price Range",
          value: activeCar?.fuelSpec?.avgPriceRange
            ? `₦${(activeCar.fuelSpec.avgPriceRange * (activeCar.fuelSpec.capacityLiters || 93)).toLocaleString()}`
            : "₦62,000",
        },
      ];
    case "engineOil":
      return [
        {
          label: "Capacity",
          value: activeCar?.engineOil?.capacityLiters
            ? `${activeCar.engineOil.capacityLiters}L`
            : "8L",
        },
        {
          label: "Recommended Grade",
          value: activeCar?.engineOil?.recommendedGrade || "5W-30",
        },
      ];
    case "tyres":
      return [
        { label: "Size", value: activeCar?.tyreSpec?.size || "265x45 R20" },
        {
          label: "Recommended Pressure",
          value:
            activeCar?.tyreSpec?.recommendedPressurePsi || "32–35 psi",
        },
      ];
    case "brakePads":
      return [
        {
          label: "Thickness",
          value: activeCar?.brakePads?.thicknessMm
            ? `${activeCar.brakePads.thicknessMm}mm`
            : "10mm",
        },
        {
          label: "Estimated Lifespan",
          value:
            activeCar?.brakePads?.estLifespanMiles || "30,000–70,000 miles",
        },
      ];
    case "battery":
      return [
        { label: "Voltage", value: activeCar?.batteryVoltage || "13.7V" },
        { label: "Status", value: "Normal operating voltage" },
      ];
    default:
      return [];
  }
}

interface DiagnosticDetailSheetProps {
  visible: boolean;
  onClose: () => void;
  item: DiagnosticItem | null;
  activeCar?: any;
  onRecordExpense?: () => void;
}

export default function DiagnosticDetailSheet({
  visible,
  onClose,
  item,
  activeCar,
  onRecordExpense,
}: DiagnosticDetailSheetProps) {
  const details = getDetails(item, activeCar);
  const showFuelStations = item?.key === "fuel";

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={
        <View className="flex-row items-center gap-2">
          <View className="w-5 h-5 rounded-full bg-[#29D7DE]/20 items-center justify-center">
            <View className="w-2 h-2 rounded-full bg-[#29D7DE]" />
          </View>
          <Text className="text-[#00343F] text-[16px] font-lexendBold">
            Diagnostic Checklist
          </Text>
        </View>
      }
      scrollable={true}
      height="75%"
      backgroundColor="#FFFFFF"
    >
      <View className="px-4 pb-10">
        {/* Item header */}
        <View className="flex-row justify-between items-center mb-6 mt-2">
          <Text className="text-[#00343F] text-[22px] font-lexendBold">
            {item?.label}
          </Text>
          {item && <item.Icon width={40} height={40} />}
        </View>

        {/* Spec rows */}
        {details.map((d) => (
          <View
            key={d.label}
            className="flex-row justify-between items-center py-4 border-b border-[#F5F5F5]"
          >
            <Text className="text-[#888] text-[13px] font-lexendRegular">
              {d.label}
            </Text>
            <Text className="text-[#00343F] text-[13px] font-lexendMedium">
              {d.value}
            </Text>
          </View>
        ))}

        {/* Fuel stations */}
        {showFuelStations && (
          <View className="py-4 border-b border-[#F5F5F5]">
            <Text className="text-[#888] text-[13px] font-lexendRegular mb-3">
              Reputable Stations
            </Text>
            <View className="flex-row gap-2 flex-wrap">
              {FUEL_STATIONS.map((s) => (
                <View
                  key={s.name}
                  className="px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                >
                  <Text className="text-white text-[10px] font-lexendBold">
                    {s.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Record Expense CTA */}
        <TouchableOpacity
          onPress={onRecordExpense}
          className="bg-[#29D7DE] h-[52px] rounded-full items-center justify-center mt-6 mb-4"
        >
          <Text className="text-[#00343F] text-[15px] font-lexendBold">
            Record an Expense
          </Text>
        </TouchableOpacity>

        {/* What next */}
        <Text className="text-[#00343F] text-[14px] font-lexendMedium mb-3">
          What next?
        </Text>

        <TouchableOpacity className="flex-row justify-between items-center mb-3">
          <Text className="text-[#444] text-[13px] font-lexendRegular">
            Set a reminder
          </Text>
          <Ionicons name="open-outline" size={16} color="#ADADAD" />
        </TouchableOpacity>

        {showFuelStations && (
          <TouchableOpacity className="flex-row justify-between items-center mb-4">
            <Text className="text-[#444] text-[13px] font-lexendRegular">
              Find a fuel station near you
            </Text>
            <Ionicons name="open-outline" size={16} color="#ADADAD" />
          </TouchableOpacity>
        )}

        {/* Low gauge warning */}
        {showFuelStations && (
          <View className="bg-[#FFE5E5] px-4 py-3 rounded-[10px] flex-row items-center gap-2">
            <Ionicons name="warning-outline" size={14} color="#E53935" />
            <Text className="text-[#E53935] text-[11px] font-lexendRegular flex-1">
              Your gauge is left with only 13% capacity
            </Text>
          </View>
        )}
      </View>
    </BottomSheet>
  );
}
