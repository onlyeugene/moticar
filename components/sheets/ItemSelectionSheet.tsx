import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import BottomSheet from "../shared/BottomSheet";

import BearingsIcon from "@/assets/parts/bearings.svg";
import BeltsIcon from "@/assets/parts/belts.svg";
import BodyIcon from "@/assets/parts/body.svg";
import CarPartsIcon from "@/assets/parts/carParts-5.svg";
import DampingIcon from "@/assets/parts/damping.svg";
import CoolingIcon from "@/assets/parts/engineCoolingSystem.svg";
import FilterIcon from "@/assets/parts/filter.svg";
import FuelIcon from "@/assets/parts/fuel.svg";
import GasketIcon from "@/assets/parts/gasket.svg";
import OilIcon from "@/assets/parts/oil.svg";
import SensorsIcon from "@/assets/parts/sensors.svg";
import SteeringIcon from "@/assets/parts/steering.svg";
import SuspensionIcon from "@/assets/parts/suspension.svg";
import TowbarParts1Icon from "@/assets/parts/towbarParts-1.svg";
import TowbarPartsIcon from "@/assets/parts/towbarParts.svg";
import TransmissionIcon from "@/assets/parts/transmission.svg";
import TyresIcon from "@/assets/parts/tyres.svg";
import WiperIcon from "@/assets/parts/wiper.svg";

interface ItemSelectionSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (item: string) => void;
}

const ITEMS = [
  { label: "Towbar", icon: TowbarPartsIcon },
  { label: "Bearings", icon: BearingsIcon },
  { label: "Car Accessories", icon: CarPartsIcon },
  { label: "Suspension", icon: SuspensionIcon },
  { label: "Oils & Fluids", icon: OilIcon },
  { label: "Gasket & Sealing Rings", icon: GasketIcon },
  { label: "Tow Parts", icon: TowbarParts1Icon },
  { label: "Wiper", icon: WiperIcon },
  { label: "Body", icon: BodyIcon },
  { label: "Tyres", icon: TyresIcon },
  { label: "Steering", icon: SteeringIcon },
  { label: "Filters", icon: FilterIcon },
  { label: "Gasket", icon: GasketIcon },
  { label: "Fuel Supply", icon: FuelIcon },
  { label: "Damping", icon: DampingIcon },
  { label: "Sensors", icon: SensorsIcon },
  { label: "Belts/Chains/Rollers", icon: BeltsIcon },
  { label: "Transmission", icon: TransmissionIcon },
  { label: "Cooling System", icon: CoolingIcon },
];

export const Header = ({ onClose }: { onClose: () => void }) => (
  <View className="flex-row items-center justify-between flex-1 px-2">
    <TouchableOpacity onPress={onClose}>
      <Ionicons name="chevron-back" size={24} color="#1A3B41" />
    </TouchableOpacity>
    <Text className="text-[#00343F] font-lexendMedium text-[0.875rem]">
      Select Item
    </Text>
    <TouchableOpacity onPress={onClose}>
      <Ionicons name="close" size={24} color="#1A3B41" />
    </TouchableOpacity>
  </View>
);

export default function ItemSelectionSheet({
  visible,
  onClose,
  onSelect,
}: ItemSelectionSheetProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSave = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      title={<Header onClose={onClose} />}
      backgroundColor="#FFFFFF"
      height={"60%"}
      footer={
        <TouchableOpacity
          onPress={handleSave}
          disabled={!selected}
          className={`h-[50px] w-10/12 mx-auto rounded-full items-center justify-center ${
            selected ? "bg-[#00343F]" : "bg-[#002D36] opacity-50"
          }`}
        >
          <Text className="text-white font-lexendBold text-[1rem]">Save</Text>
        </TouchableOpacity>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
        <View className="flex-row flex-wrap justify-between gap-y-3 px-1">
          {ITEMS.map((item) => {
            const isSelected = selected === item.label;
            return (
              <TouchableOpacity
                key={item.label}
                onPress={() => setSelected(item.label)}
                style={{ width: "31%" }}
                className={`items-center justify-center p-3 rounded-[4px]  ${
                  isSelected ? "bg-[#29D7DE] " : "bg-[#F3F3F3] "
                }`}
              >
                <item.icon
                  width={24}
                  height={24}
                  color={isSelected ? "#FFFFFF" : "#00343F"}
                />
                <Text
                  numberOfLines={2}
                  className={`text-center text-[0.75rem] font-lexendRegular mt-2 ${
                    isSelected ? "text-[#00343F]" : "text-[#00343F]"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
