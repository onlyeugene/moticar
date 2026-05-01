import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Reminder } from "@/types/activity";
import Empty from "@/assets/icons/empty.svg";
import TicketIcon from "@/assets/icons/ticket.svg";
import BottomSheet from "../shared/BottomSheet";

interface ReminderCategorySheetProps {
  visible: boolean;
  onClose: () => void;
  category: string;
  reminders: Reminder[];
  onAdd: () => void;
  onEditReminder?: (reminder: Reminder) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  "Toll Fee": { component: TicketIcon, type: "svg" },
  "Servicing": { icon: "wrench-cog", type: "material" },
  "Dues & Levies": { icon: "cash-multiple", type: "material" },
  "Penalties": { icon: "file-alert-outline", type: "material" },
  "Planned Trips": { icon: "briefcase-outline", type: "material" },
  "Others": { icon: "car-info", type: "material" },
};

const SEVERITY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  Urgent: { bg: "#FEF2F2", text: "#EF4444", icon: "#EF4444" },
  Mid: { bg: "#FFFBEB", text: "#F59E0B", icon: "#F59E0B" },
  Low: { bg: "#F0FDF4", text: "#22C55E", icon: "#22C55E" },
};

function ReminderRow({ reminder, onPress }: { reminder: Reminder; onPress: () => void }) {
  const dets = reminder.details || {};
  const severity = dets.severity;
  const frequency = dets.frequency || dets.frequencyType || dets.repeatInterval;
  const primaryDate = dets.date || dets.dueDate || dets.startDate;
  const severityStyle = SEVERITY_COLORS[severity || ''] || SEVERITY_COLORS.Mid;
  const dateAdded = format(new Date(reminder.createdAt), "d MMMM, yyyy");

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.row}
      className="bg-white px-4 py-4 mb-2 rounded-[4px]"
    >
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[#001A1F] font-lexendMedium text-[1rem] flex-1" numberOfLines={1}>
            {reminder.name}
          </Text>
          <Ionicons name="chevron-forward" size={24} color="#ADADAD" />
        </View>

        <View className="flex-row items-center gap-2 mb-1">
          {severity && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="bookmark-outline" size={24} color={severityStyle.icon} />
              <Text className="font-lexendRegular text-[0.75rem] text-[#969696]">
                {severity}
              </Text>
            </View>
          )}
          {severity && frequency && (
            <Text className="text-[#A4A4A4] font-lexendRegular text-[0.75rem]">·</Text>
          )}
          {frequency && (
            <Text className="text-[#969696] font-lexendRegular text-[0.75rem]">
              {frequency}
            </Text>
          )}
          {/* {primaryDate && (
            <>
              <Text className="text-[#C1C3C3] font-lexendRegular text-[0.75rem]">·</Text>
              <Text className="text-[#8B8B8B] font-lexendRegular text-[0.75rem]">
                {format(new Date(primaryDate), "MMM d, yyyy")}
              </Text>
            </>
          )} */}
        </View>

        <Text className="text-[#00AEB5] font-lexendRegular text-[0.75rem]">
          Added {dateAdded}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ReminderCategorySheet({
  visible,
  onClose,
  category,
  reminders,
  onAdd,
  onEditReminder,
}: ReminderCategorySheetProps) {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return reminders;
    const q = search.toLowerCase();
    return reminders.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.details?.severity?.toLowerCase().includes(q)
    );
  }, [reminders, search]);

  const headerTitle = (
    <View className="flex-1">
      <Text className="text-[#00AEB5] font-lexendRegular text-[0.6875rem]">
        Reminder
      </Text>
      <Text className="text-[#001A1F] font-lexendBold text-[1.25rem]">
        {category}
      </Text>
    </View>
  );

  const headerRight = (
    <View className="flex-row items-center gap-3">
      <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
        <Ionicons name="search-outline" size={22} color="#293536" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onAdd}>
        <Ionicons name="add" size={26} color="#293536" />
      </TouchableOpacity>
    </View>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={headerTitle}
      headerRight={headerRight}
      backgroundColor="#F5F5F5"
      height="90%"
      scrollable={false}
    >
      <View className="flex-1">
        {/* Search Bar */}
        {showSearch && (
          <View className="px-4 py-3 border-b border-[#F0F0F0]">
            <View className="flex-row items-center bg-white rounded-xl px-4 h-[44px]">
              <Ionicons name="search" size={16} color="#C1C3C3" />
              <TextInput
                className="flex-1 ml-2 font-lexendRegular text-[0.875rem] text-[#001A1F]"
                placeholder="Search reminders..."
                placeholderTextColor="#C1C3C3"
                value={search}
                onChangeText={setSearch}
                autoFocus
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Ionicons name="close-circle" size={16} color="#C1C3C3" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* List */}
        <View className="flex-1">
          {filtered.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Empty width={60} height={50} />
              <Text className="text-[#8B8B8B] font-lexendRegular text-[0.875rem] mt-4">
                No entry recorded
              </Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id || item._id || Math.random().toString()}
              renderItem={({ item }) => (
                <ReminderRow 
                  reminder={item} 
                  onPress={() => onEditReminder?.(item)} 
                />
              )}
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
});
