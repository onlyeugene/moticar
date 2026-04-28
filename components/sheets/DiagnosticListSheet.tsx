import { BrandTags } from "@/lib";
import BrakesIcon from "@/assets/facts/brake.svg";
import BatteryIcon from "@/assets/facts/battery.svg";
import EngineOilIcon from "@/assets/facts/oil.svg";
import FuelIcon from "@/assets/facts/fuel.svg";
import TyresIcon from "@/assets/facts/tyre.svg";
import BottomSheet from "@/components/shared/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { getCurrencySymbol } from "@/utils/currency";

export interface DiagnosticItem {
  key: string;
  label: string;
  value: string;
  sub: string;
  Icon: React.FC<{ width: number; height: number }>;
  hasBrands?: boolean;
  brands?: string[];
  tag?: string;
}

interface DiagnosticListSheetProps {
  visible: boolean;
  onClose: () => void;
  activeCar?: any;
  onSelectItem: (item: DiagnosticItem) => void;
}

export function getDiagnosticItems(activeCar: any, currencySymbol: string): DiagnosticItem[] {
  const isEV = activeCar?.fuelType === 'EV' || activeCar?.fuelType === 'Electric';
  
  const allItems: DiagnosticItem[] = [
    {
      key: "tyres",
      label: "Tyres",
      value: activeCar?.tyreSpec?.size || "265x45 R20",
      sub: `Recommended tyre pressure is between ${activeCar?.tyreSpec?.recommendedPressurePsi || "40–44 psi"}`,
      Icon: TyresIcon,
      hasBrands: !!activeCar?.tyreSpec?.manufacturers?.length,
      brands: activeCar?.tyreSpec?.manufacturers,
    },
    {
      key: "engineOil",
      label: "Engine Oil",
      value: activeCar?.engineOil?.capacityLiters
        ? `${activeCar.engineOil.capacityLiters}L`
        : "8L",
      sub: `Recommended grades: ${activeCar?.engineOil?.recommendedGrade || "5W-30, 10W-40"}`,
      Icon: EngineOilIcon,
      brands: activeCar?.engineOil?.reputableBrands,
    },
    {
      key: "fuel",
      label: "Fuel",
      value: activeCar?.fuelSpec?.capacityLiters
        ? `${activeCar.fuelSpec.capacityLiters}L`
        : "93L",
      sub: "Full Tank",
      Icon: FuelIcon,
      tag: `Est. ${currencySymbol}${((activeCar?.fuelSpec?.capacityLiters || 93) * (activeCar?.fuelSpec?.avgPriceRange || 0)).toLocaleString()}`,
      brands: activeCar?.fuelSpec?.reputableStations,
    },
    {
      key: "brakePads",
      label: "Brake Pads",
      value: activeCar?.brakePads?.thicknessMm
        ? `${activeCar.brakePads.thicknessMm}mm`
        : "10mm",
      sub: `Est. last between ${activeCar?.brakePads?.estLifespanMiles || "30,000–70,000 miles"}`,
      Icon: BrakesIcon,
      brands: activeCar?.brakePads?.reputableBrands,
    },
    {
      key: "battery",
      label: "Car Battery",
      value: activeCar?.batteryVoltage || "13.7V",
      sub: "Normal operating voltage",
      Icon: BatteryIcon,
      hasBrands: !!activeCar?.batterySpec?.providers?.length,
      brands: activeCar?.batterySpec?.providers,
    },
  ];

  if (isEV) {
    return allItems.filter(item => item.key !== 'engineOil' && item.key !== 'fuel');
  }

  return allItems;
}

export default function DiagnosticListSheet({
  visible,
  onClose,
  activeCar,
  onSelectItem,
}: DiagnosticListSheetProps) {
  const user = useAuthStore(state => state.user);
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);
  const items = getDiagnosticItems(activeCar, currencySymbol);

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
                  {item.hasBrands && (
                    <BrandTags size="small" brands={item.brands || []} />
                  )}
                  <View className="flex-row justify-between items-center mt-1">
                    <Text className="text-[#879090] text-[10px] font-lexendRegular flex-1 mr-2">
                      {item.sub}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      {item.tag && item.tag.indexOf('N/A') === -1 && item.tag.indexOf('0') === -1 && (
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

