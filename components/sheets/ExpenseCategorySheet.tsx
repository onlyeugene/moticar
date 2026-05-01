import { useAppStore } from "@/store/useAppStore";
import { useExpenseCategories } from "@/hooks/useExpenses";
import { ExpenseCategory } from "@/types/expense";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BottomSheet from "../shared/BottomSheet";

// ... (SVGs same)

// Asset imports for SVGs
import KeyWorksIcon from "@/assets/expense/keyworks.svg";
import CarWashIcon from "@/assets/expense/carwash.svg";
import AlignmentIcon from "@/assets/expense/alignment.svg";
import BalancingIcon from "@/assets/expense/balancing.svg";
import BodyworkIcon from "@/assets/expense/bodywork.svg";
import FuelIcon from "@/assets/expense/fuel.svg";
import DuesIcon from "@/assets/expense/dues.svg";
import HydraulicsIcon from "@/assets/expense/hydraulics.svg";
import MechanicalIcon from "@/assets/expense/mechanical.svg";
import MiscIcon from "@/assets/expense/misc.svg";
import EngineIcon from "@/assets/expense/engine.svg";
import ParkingIcon from "@/assets/expense/parking.svg";
import PenaltyIcon from "@/assets/expense/penalty.svg";
import RadiatorIcon from "@/assets/expense/radiator.svg";
import ServicingIcon from "@/assets/expense/servicing.svg";
import FilterIcon from "@/assets/expense/filter-lines.svg";
import TowingIcon from "@/assets/expense/towing.svg";
import AccessoryIcon from "@/assets/expense/accesory.svg";
import TyreGuage from "@/assets/expense/tyre.svg";

interface ExpenseCategorySheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: ExpenseCategory) => void;
}

const CATEGORY_SVG_MAP: Record<string, React.FC<any>> = {
  "Key works": KeyWorksIcon,
  "Car Wash": CarWashIcon,
  Alignment: AlignmentIcon,
  Balancing: BalancingIcon,
  "Body work": BodyworkIcon,
  "Fuel Top-Up": FuelIcon,
  Dues: DuesIcon,
  Hydraulics: HydraulicsIcon,
  "Mechanical Work": MechanicalIcon,
  Misc: MiscIcon,
  Engine: EngineIcon,
  Parking: ParkingIcon,
  Penalty: PenaltyIcon,
  Radiator: RadiatorIcon,
  Servicing: ServicingIcon,
  Towing: TowingIcon,
  "Tyre Guage": TyreGuage,
  "Accessories & Parts": AccessoryIcon,
};

export const CategoryIcon = ({
  name,
  size = 24,
}: {
  name: string;
  size?: number;
}) => {
  const IconComponent = CATEGORY_SVG_MAP[name];

  if (!IconComponent) {
    return <Ionicons name="briefcase-outline" size={size} color="#6D8686" />;
  }

  return <IconComponent width={size} height={size} />;
};

export default function ExpenseCategorySheet({
  visible,
  onClose,
  onSelect,
}: ExpenseCategorySheetProps) {
  const [search, setSearch] = useState("");
  const { selectedCarId } = useAppStore();
  const { data, isLoading } = useExpenseCategories(selectedCarId, visible);

  const categories = data?.categories || [];

  const sections = useMemo(() => {
    const filtered = categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()),
    );

    const commonlyUsed = filtered
      .filter((c) => c.isCommon)
      .sort((a, b) => a.name.localeCompare(b.name));
    const allCategories = [...filtered].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    const result = [];
    if (commonlyUsed.length > 0 && !search) {
      result.push({
        title: "COMMONLY USED",
        data: [commonlyUsed],
        isGrid: true,
      });
    }
    if (allCategories.length > 0) {
      result.push({
        title: "ALL CATEGORIES",
        data: [allCategories],
        isGrid: true,
      });
    }

    return result;
  }, [categories, search]);

  const renderCategoryItem = (item: ExpenseCategory, isCommon: boolean) => (
    <TouchableOpacity
      key={item.id || item._id}
      className={`${isCommon ? "w-1/4" : "w-1/3"} items-center mb-6`}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <View className="w-12 h-12 rounded-full bg-[#EEEEEE] items-center justify-center mb-2">
        <CategoryIcon name={item.name} />
      </View>
      <Text
        className="text-[0.75rem] font-lexendRegular text-[#8B8B8B] text-center"
        numberOfLines={1}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={
        <View className="flex-row items-center flex-1 justify-center mr-8">
          <Text className="text-[#00343F] text-[0.875rem] font-lexendBold">
            Select New Expense Category
          </Text>
        </View>
      }
      backgroundColor="#F0F0F0"
      height="70%"
    >
      <View className="p-4 bg-white rounded-[12px]">
        <View className="flex-row items-center bg-[#F8F8F8] border-b border-[#D4D4D4] px-2 py-3 mb-6">
          <TextInput
            className="flex-1 ml-3 font-lexendRegular text-[0.75rem] text-[#1C1C1E]"
            placeholder="Search category"
            placeholderTextColor="#9A9A9A"
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="search-outline" size={20} color="#D4D4D4" />
        </View>

        {(!selectedCarId || selectedCarId === "" || (!isLoading && categories.length === 0)) ? (
          <View className="items-center justify-center py-20 px-10">
            <View className="w-20 h-20 bg-[#F5F5F5] rounded-full items-center justify-center mb-6">
              <Ionicons name="car-outline" size={40} color="#00AEB5" />
            </View>
            <Text className="text-[#00343F] text-[1.125rem] font-lexendBold text-center mb-2">
              No Vehicle Found
            </Text>
            <Text className="text-[#8B8B8B] text-[0.875rem] font-lexendRegular text-center leading-5">
              You need to have a registered car to view expense categories and track budgets.
            </Text>
          </View>
        ) : isLoading ? (
          <ActivityIndicator size="large" color="#00343F" className="mt-10" />
        ) : (
          <View>
            {sections.map((section) => (
              <View key={section.title} className="mb-6">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-[0.875rem] font-lexendBold text-[#6C6C70] tracking-widest">
                    {section.title}
                  </Text>
                  {section.title === "ALL CATEGORIES" && (
                    <TouchableOpacity>
                      <FilterIcon width={24} height={24} />
                    </TouchableOpacity>
                  )}
                </View>
                <View className="flex-row flex-wrap">
                  {section.data[0].map((item: ExpenseCategory) =>
                    renderCategoryItem(item, section.title === "COMMONLY USED"),
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </BottomSheet>
  );
}
