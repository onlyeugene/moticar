import BrakesIcon from "@/assets/facts/brake.svg";
import BatteryIcon from "@/assets/facts/battery.svg";
import EngineOilIcon from "@/assets/facts/oil.svg";
import FuelIcon from "@/assets/facts/fuel.svg";
import TyresIcon from "@/assets/facts/tyre.svg";
import BottomSheet from "@/components/shared/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

const PART_BRANDS = ["BOSCH", "STARK", "RIDEX"];

function BrandTags() {
  return (
    <View className="flex-row gap-1 mt-1">
      {PART_BRANDS.map((brand) => (
        <View key={brand} className="bg-[#F0F0F0] px-1.5 py-0.5 rounded">
          <Text className="text-[7px] font-lexendBold text-[#555]">{brand}</Text>
        </View>
      ))}
    </View>
  );
}

interface DiagnosticItem {
  key: string;
  label: string;
  value: string;
  sub: string;
  Icon: React.FC<{ width: number; height: number }>;
  hasBrands?: boolean;
  tag?: string;
}

interface DiagnosticListSheetProps {
  visible: boolean;
  onClose: () => void;
  activeCar?: any;
  onSelectItem: (item: DiagnosticItem) => void;
}

export function getDiagnosticItems(activeCar: any): DiagnosticItem[] {
  return [
    {
      key: "tyres",
      label: "Tyres",
      value: activeCar?.tyreSpec?.size || "265x45 R20",
      sub: `Recommended tyre pressure is between ${activeCar?.tyreSpec?.recommendedPressurePsi || "40–44 psi"}`,
      Icon: TyresIcon,
      hasBrands: true,
    },
    {
      key: "engineOil",
      label: "Engine Oil",
      value: activeCar?.engineOil?.capacityLiters
        ? `${activeCar.engineOil.capacityLiters}L`
        : "8L",
      sub: `Recommended grades: ${activeCar?.engineOil?.recommendedGrade || "5W-30, 10W-40"}`,
      Icon: EngineOilIcon,
    },
    {
      key: "fuel",
      label: "Fuel",
      value: activeCar?.fuelSpec?.capacityLiters
        ? `${activeCar.fuelSpec.capacityLiters}L`
        : "93L",
      sub: "Full Tank",
      Icon: FuelIcon,
      tag: `Est. ₦${((activeCar?.fuelSpec?.capacityLiters || 93) * (activeCar?.fuelSpec?.avgPriceRange || 650)).toLocaleString()}`,
    },
    {
      key: "brakePads",
      label: "Brake Pads",
      value: activeCar?.brakePads?.thicknessMm
        ? `${activeCar.brakePads.thicknessMm}mm`
        : "10mm",
      sub: `Est. last between ${activeCar?.brakePads?.estLifespanMiles || "30,000–70,000 miles"}`,
      Icon: BrakesIcon,
    },
    {
      key: "battery",
      label: "Car Battery",
      value: activeCar?.batteryVoltage || "13.7V",
      sub: "Normal operating voltage",
      Icon: BatteryIcon,
      hasBrands: true,
    },
  ];
}

export default function DiagnosticListSheet({
  visible,
  onClose,
  activeCar,
  onSelectItem,
}: DiagnosticListSheetProps) {
  const items = getDiagnosticItems(activeCar);

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
      height="85%"
      backgroundColor="#FFFFFF"
    >
      <View className="px-2 pb-10">
        {items.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => onSelectItem(item)}
            className="mb-3"
          >
            <View className="flex-row justify-between items-center py-3 border-b border-[#F0F0F0]">
              <View className="flex-row items-center gap-3 flex-1">
                <item.Icon width={28} height={28} />
                <View className="flex-1">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-[#006C70] text-[13px] font-lexendRegular">
                      {item.label}
                    </Text>
                    <Text className="text-[#006C70] text-[18px] font-lexendRegular">
                      {item.value}
                    </Text>
                  </View>
                  {item.hasBrands && <BrandTags />}
                  <View className="flex-row justify-between items-center mt-1">
                    <Text className="text-[#879090] text-[10px] font-lexendRegular flex-1 mr-2">
                      {item.sub}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      {item.tag && (
                        <View className="bg-[#FEF597] px-2 py-0.5 rounded-full">
                          <Text className="text-[#555] text-[8px] font-lexendRegular">
                            {item.tag}
                          </Text>
                        </View>
                      )}
                      <Ionicons
                        name="chevron-forward"
                        size={12}
                        color="#ADADAD"
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheet>
  );
}

export type { DiagnosticItem };
