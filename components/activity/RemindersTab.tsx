import React from "react";
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import TicketIcon from "@/assets/icons/ticket.svg";

interface RemindersTabProps {
  summary?: Record<string, number>;
  onAdd: (category: string) => void;
}

const CATEGORIES = [
  { id: "Toll Fee", icon: TicketIcon, type: "svg" },
  { id: "Servicing", icon: "wrench-cog", type: "material" },
  { id: "Dues & Levies", icon: "cash-multiple", type: "material" },
  { id: "Penalties", icon: "file-alert-outline", type: "material" },
  { id: "Planned Trips", icon: "briefcase-outline", type: "material" },
  { id: "Others", icon: "car-info", type: "material" },
];

const CategoryCard = ({ 
  category, 
  count, 
  onPress 
}: { 
  category: typeof CATEGORIES[0]; 
  count: number; 
  onPress: () => void;
}) => {
  const IconComponent = category.icon;

  return (
    <View 
      className="bg-white rounded-[4px] p-4 mb-4 flex-1 mx-2"
      style={styles.cardShadow}
    >
      <View className="flex-row justify-between items-start mb-4">
        <Text className="text-[#293536] font-lexendRegular text-[12px]">
          {category.id}
        </Text>
        <View className="opacity-40">
            {category.type === "svg" && (
                <IconComponent width={20} height={20} color="#ACB7B7" />
            )}
            {category.type === "ionicon" && (
                <Ionicons name={category.icon as any} size={20} color="#ACB7B7" />
            )}
            {category.type === "material" && (
                <MaterialCommunityIcons name={category.icon as any} size={20} color="#ACB7B7" />
            )}
        </View>
      </View>

      <View className="flex-row items-end justify-between mt-4">
        <Text className="text-[#00AEB5] font-lexendMedium text-[32px]">
          {count}
        </Text>
        <TouchableOpacity 
          onPress={onPress}
          className="bg-[#FFFFFF] shadow-[#0000001A] shadow-sm w-[32px] h-[32px] rounded-[8px]  items-center justify-center"
        >
          <Ionicons name="add" size={24} color="#C8CCCC" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const RemindersTab: React.FC<RemindersTabProps> = ({ summary, onAdd }) => {
  // Split categories into pairs for the grid
  const rows = [];
  for (let i = 0; i < CATEGORIES.length; i += 2) {
    rows.push(CATEGORIES.slice(i, i + 2));
  }

  return (
    <View className="flex-1  h-full">
      <Text className="text-[#5D8689] font-lexendRegular text-[12px] leading-4 mb-8 px-2">
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
              onPress={() => onAdd(cat.id)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 8,
    // elevation: 2,
    // borderWidth: 1,
    // borderColor: "#E9F0F0",
  },
});

export default RemindersTab;
