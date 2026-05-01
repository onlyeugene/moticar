import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ToolIcon from "@/assets/tabs/tool.svg";
import CoinsIcon from "@/assets/tabs/coins.svg";
import Certificate from "@/assets/tabs/certificate.svg";
import Luggage from "@/assets/tabs/luggage.svg";
import CarInfoIcon from "@/assets/tabs/car.svg";
import TicketIcon from "@/assets/tabs/ticket.svg";
import {LoadingModal} from "@/components/ui/LoadingModal";


interface RemindersTabProps {
  summary?: Record<string, number>;
  isLoading?: boolean;
  onAdd: (category: string) => void;
  onSelectCategory: (category: string) => void;
}

const CATEGORIES = [
  { id: "Toll Fee", icon: TicketIcon, type: "svg" },
  { id: "Servicing", icon: ToolIcon, type: "svg" },
  { id: "Dues & Levies", icon: CoinsIcon, type: "svg" },
  { id: "Penalties", icon: Certificate, type: "svg" },
  { id: "Planned Trips", icon: Luggage, type: "svg" },
  { id: "Others", icon: CarInfoIcon, type: "svg" },
];

type CategoryItem = typeof CATEGORIES[0];

const CategoryCard = ({
  category,
  count,
  onPress,
  onAdd,
}: {
  category: CategoryItem;
  count: number;
  onPress: () => void;
  onAdd: () => void;
}) => {
  const IconComponent = category.icon as React.FC<any>;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-[4px] p-4 mb-4 flex-1 mx-2"
      style={styles.cardShadow}
    >
      <View className="flex-row justify-between items-start mb-4">
        <Text className="text-[#293536] font-lexendRegular text-[0.75rem]">
          {category.id}
        </Text>
        <View className="opacity-40">
          {category.type === "svg" && (
            <IconComponent width={20} height={20} color="#ACB7B7" />
          )}
          {category.type === "material" && (
            <MaterialCommunityIcons name={category.icon as any} size={20} color="#ACB7B7" />
          )}
        </View>
      </View>

      <View className="flex-row items-end justify-between mt-4">
        <Text className="text-[#00AEB5] font-lexendMedium text-[2rem]">
          {count}
        </Text>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className=""
        >
          <Ionicons name="add" size={24} color="#C8CCCC" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const RemindersTab: React.FC<RemindersTabProps> = ({ summary, isLoading, onAdd, onSelectCategory }) => {
  const rows: CategoryItem[][] = [];
  for (let i = 0; i < CATEGORIES.length; i += 2) {
    rows.push(CATEGORIES.slice(i, i + 2));
  }

  return (
    <View className="flex-1 min-h-[500px]">
      <LoadingModal visible={isLoading || false} />
      <Text className="text-[#5D8689] font-lexendRegular text-[0.75rem] leading-4 mb-8 px-2">
        Never be late to attend to issues or concerns surrounding your car.
        Schedule reminders and keep revisions, maintenance and payments up to date.
      </Text>

      {rows.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row">
          {row.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              count={summary?.[cat.id] || 0}
              onPress={() => onSelectCategory(cat.id)}
              onAdd={() => onAdd(cat.id)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {},
});

export default RemindersTab;
