import { DiagnosticItem } from "./DiagnosticListSheet";
import BottomSheet from "@/components/shared/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import HomeIcon from "@/assets/icons/home.svg";
import { BrandTags } from "@/lib";

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
          value: activeCar?.tyreSpec?.recommendedPressurePsi || "32–35 psi",
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
      title=""
      scrollable={true}
      height="75%"
      backgroundColor="#EEF5F5"
    >
      <View className="flex-row items-center gap-2 px-2">
        <HomeIcon width={20} height={20} />
        <Text className="text-[#00AEB5] text-[14px] font-lexendSemiBold">
          Diagnostic Checklist
        </Text>
      </View>
      <View className=" pb-10 px-2">
        {/* Item header */}
        <View className="flex-row justify-between items-center mb-6 mt-2">
          <Text className="text-[#00343F] text-[22px] font-lexendSemiBold">
            {item?.label}
          </Text>
          <View className="bg-[#FFFFFF] w-[96px] h-[100px] rounded-lg flex items-center justify-center">
            {item && <item.Icon width={40} height={40} />}
          </View>
        </View>

        {/* Spec rows */}
        {details.map((d) => (
          <View
            key={d.label}
            className="flex-row justify-between items-center py-4 border-b border-[#C1C3C3]"
          >
            <Text className="text-[#001A1F] text-[14px] font-lexendRegular">
              {d.label}
            </Text>
            <Text className="text-[#006C70] text-[20px] font-lexendSemiBold">
              {d.value}
            </Text>
          </View>
        ))}

        {/* Brands/Manufacturers Section */}
        {item?.brands && item.brands.length > 0 && (
          <View className="py-4 border-b border-[#C1C3C3]">
            <Text className="text-[#001A1F] text-[14px] font-lexendRegular mb-3">
              {item.key === "tyres" ? "Manufacturers" : "Reputable Brands"}
            </Text>
            <BrandTags width={60} height={15} brands={item.brands} />
          </View>
        )}

        {/* Record Expense CTA */}
        <TouchableOpacity
          onPress={onRecordExpense}
          className="bg-[#29D7DE] h-[52px] rounded-full items-center justify-center mt-6 mb-4"
        >
          <Text className="text-[#00343F] text-[16px] font-lexendBold">
            Record an Expense
          </Text>
        </TouchableOpacity>

        {/* What next */}
        <Text className="text-[#00343F] text-[14px] font-lexendSemiBold mb-3 mt-3">
          What next?
        </Text>

        <TouchableOpacity className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center gap-2">
            <Ionicons name="alarm-outline" size={24} color="#29D7DE" />
            <Text className="text-[#006C70] text-[14px] font-lexendRegular">
              Set a reminder
            </Text>
          </View>
          <Ionicons name="open-outline" size={24} color="#C1C3C3" />
        </TouchableOpacity>

        {showFuelStations && (
          <TouchableOpacity className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-2">
              <Ionicons name="location-outline" size={24} color="#29D7DE" />
              <Text className="text-[#006C70] text-[14px] font-lexendRegular">
                Find a fuel station near you
              </Text>
            </View>
            <Ionicons name="open-outline" size={24} color="#C1C3C3" />
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
