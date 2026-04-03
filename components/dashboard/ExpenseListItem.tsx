import { CATEGORY_COLORS } from "@/constants/Colors";
import { Expense } from "@/types/expense";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useDeleteExpense } from "@/hooks/useExpenses";

import FuelIcon from "@/assets/icons/car/fuel.svg";
import CarWashIcon from "@/assets/icons/car/parts/autodetailingCarCare.svg";
import BodyWorkIcon from "@/assets/icons/car/parts/body.svg";
import ServicingIcon from "@/assets/icons/car/parts/engine.svg";
import MaintenanceIcon from "@/assets/icons/car/parts/repairKit.svg";
import AlignmentIcon from "@/assets/icons/car/parts/suspension.svg";
import OilIcon from "@/assets/icons/car/parts/engileOil.svg";
import TyresIcon from "@/assets/icons/car/parts/tyres.svg";
import BrakesIcon from "@/assets/icons/car/parts/brakes.svg";
import ACSystemIcon from "@/assets/icons/car/parts/Air Conditioning.svg";
import BatteryIcon from "@/assets/icons/car/parts/electrics.svg";
import TransmissionIcon from "@/assets/icons/car/parts/transmission.svg";
import InteriorIcon from "@/assets/icons/car/parts/interior.svg";
import LightingIcon from "@/assets/icons/car/parts/lighting.svg";
import ToolsIcon from "@/assets/icons/car/parts/toolsEquipments.svg";
import AccessoriesIcon from "@/assets/icons/car/parts/carAccessories.svg";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ExpenseListItemProps {
  expense: Expense;
  currencySymbol: string;
  onPressDetails?: (expense: Expense) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  "Fuel Top-Up": "gas-station",
  "Car Wash": "water",
  Maintenance: "wrench",
  Servicing: "car-cog",
  Insurance: "shield-check",
  Repairs: "hammer-wrench",
  Others: "dots-horizontal",
  "Key works": "key",
  "Body work": "car-door",
  Alignment: "axis-arrow",
  Balancing: "account-balance",
  "Tires & Wheels": "tire",
  "Brake System": "brake",
  "Air Conditioning": "air-conditioner",
  "Battery & Electrics": "battery-charging",
  Transmission: "cog",
  Interior: "car-seat",
  Lighting: "car-light-high",
  "Mechanical Work": "settings",
  "Accessories & Parts": "shopping-cart",
  Dues: "assignment",
  Hydraulics: "settings-input-component",
  Misc: "more-horiz",
  Engine: "directions-car",
  Parking: "local-parking",
  Penalty: "report-problem",
  Radiator: "ac-unit",
  Towing: "car-repair",
  "Tyre Guage": "tire-repair",
};

const CATEGORY_SVG_ICONS: Record<string, any> = {
  "Fuel Top-Up": FuelIcon,
  "Car Wash": CarWashIcon,
  Maintenance: MaintenanceIcon,
  Servicing: ServicingIcon,
  Repairs: ToolsIcon,
  "Body work": BodyWorkIcon,
  Alignment: AlignmentIcon,
  Balancing: AlignmentIcon,
  "Oil Change": OilIcon,
  "Tires & Wheels": TyresIcon,
  "Brake System": BrakesIcon,
  "Air Conditioning": ACSystemIcon,
  "Battery & Electrics": BatteryIcon,
  Transmission: TransmissionIcon,
  Interior: InteriorIcon,
  Lighting: LightingIcon,
  "Mechanical Work": MaintenanceIcon,
  "Accessories & Parts": AccessoriesIcon,
  "Key works": ToolsIcon,
  Engine: ServicingIcon,
  Radiator: ACSystemIcon,
  "Tyre Guage": TyresIcon,
};

import { getRelativeTime } from "@/utils/date";

export default function ExpenseListItem({
  expense,
  currencySymbol,
  onPressDetails,
}: ExpenseListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const deleteMutation = useDeleteExpense();

  const color = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS["Others"];
  const iconName = CATEGORY_ICONS[expense.category] || "cash";
  const SvgIcon = CATEGORY_SVG_ICONS[expense.category];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteMutation.mutate(expense.id || (expense as any)._id),
        },
      ],
    );
  };

  const time = new Date(expense.date)
    .toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

  const relativeDate = getRelativeTime(expense.date);

  return (
    <View className="mb-3">
      <TouchableOpacity
        onPress={toggleExpand}
        activeOpacity={0.7}
        className="bg-white mt-3 rounded-xl flex-row items-center justify-between"
      >
        <View className="flex-1 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-xl items-center justify-center border border-[#F0F0F0]">
              {SvgIcon ? (
                <SvgIcon width={24} height={24} color={color} fill={color} />
              ) : (
                <MaterialCommunityIcons
                  name={iconName}
                  size={24}
                  color={color}
                />
              )}
            </View>
            <View className="flex-row items-start gap-2">
              <View className="items-start">
                <Text className="text-[#1A3B41] font-lexendSemiBold text-[15px]">
                  {expense.category || ""}
                </Text>
                <Text className="text-[#9BBABB] font-lexendRegular text-[11px] mt-0.5">
                  {relativeDate} . {time}
                </Text>
              </View>
              {(expense.technicianId || expense.metadata?.workshopName) && (
                <View className="bg-[#ECE6B7] px-2 py-0.5 rounded-full max-w-[120px]">
                  <Text
                    numberOfLines={1}
                    className="text-[#425658] font-lexendRegular text-[10px]"
                  >
                    {(() => {
                      const name =
                        (typeof expense.technicianId === "object"
                          ? expense.technicianId?.name
                          : expense.metadata?.workshopName) || "";
                      return name.length > 10
                        ? `${name.slice(0, 10)}...`
                        : name;
                    })()}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="items-end">
            <Text className="text-[#1FCAE3] font-lexendMedium text-[16px]">
              {currencySymbol}
              {expense.amount.toLocaleString()}
            </Text>
            <Text className="text-[#CDC270] font-lexendRegular text-[12px] mt-0.5">
              {expense.paymentMethod}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className="bg-[#F5F5F5] mt-2 px-4 py-3 rounded-b-xl flex-row justify-around border-x border-b border-[#F0F0F0]">
          <TouchableOpacity className="flex-row items-center gap-1.5">
            <Ionicons name="refresh" size={16} color="#1A3B41" />
            <Text className="text-[#586A6B] font-lexendRegular text-[12px]">
              Repeat
            </Text>
          </TouchableOpacity>
          <View className="w-[1px] h-4 bg-[#E0E0E0]" />
          <TouchableOpacity
            onPress={() => onPressDetails?.(expense)}
            className="flex-row items-center gap-1.5"
          >
            <Ionicons name="eye-outline" size={16} color="#1A3B41" />
            <Text className="text-[#586A6B] font-lexendRegular text-[12px]">
              Details
            </Text>
          </TouchableOpacity>
          <View className="w-[1px] h-4 bg-[#E0E0E0]" />
          <TouchableOpacity
            onPress={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex-row items-center gap-1.5"
          >
            <Ionicons
              name="trash-outline"
              size={16}
              color={deleteMutation.isPending ? "#CCC" : "#FF7A8D"}
            />
            <Text
              className={`font-lexendRegular text-[12px] ${
                deleteMutation.isPending ? "text-[#CCC]" : "text-[#EE6969]"
              }`}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}