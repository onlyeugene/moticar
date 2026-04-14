import React, { useRef, useEffect } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type DateGrain = "Year" | "Month" | "Week";

interface DateNavigatorProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  grain: DateGrain;
  onFilterPress?: () => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  selectedDate,
  onChange,
  grain,
  onFilterPress,
}) => {
  const scrollRef = useRef<ScrollView>(null);

  const handlePrev = () => {
    const newDate = new Date(selectedDate);
    if (grain === "Year") newDate.setFullYear(selectedDate.getFullYear() - 1);
    else if (grain === "Month") newDate.setMonth(selectedDate.getMonth() - 1);
    else if (grain === "Week") newDate.setDate(selectedDate.getDate() - 7);
    onChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    if (grain === "Year") newDate.setFullYear(selectedDate.getFullYear() + 1);
    else if (grain === "Month") newDate.setMonth(selectedDate.getMonth() + 1);
    else if (grain === "Week") newDate.setDate(selectedDate.getDate() + 7);
    onChange(newDate);
  };

  // Logic for horizontal scroll items based on grain
  const renderScrollItems = () => {
    if (grain === "Month") {
      return MONTHS.map((mName, index) => {
        const isActive = selectedDate.getMonth() === index;
        return (
          <TouchableOpacity
            key={mName}
            onPress={() => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(index);
              onChange(newDate);
            }}
            className="items-center px-4"
          >
            <Text
              className={`text-[14px] ${
                isActive
                  ? "text-[#00AEB5] font-lexendSemiBold"
                  : "text-[#A1B1B4] font-lexendRegular"
              }`}
            >
              {mName}
            </Text>
            {isActive && (
              <View className="w-1 h-1 absolute -top-1 right-2 rounded-full bg-[#293536] mt-1" />
            )}
          </TouchableOpacity>
        );
      });
    }

    if (grain === "Year") {
      const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).reverse();
      return years.map((year) => {
        const isActive = selectedDate.getFullYear() === year;
        return (
          <TouchableOpacity
            key={year}
            onPress={() => {
              const newDate = new Date(selectedDate);
              newDate.setFullYear(year);
              onChange(newDate);
            }}
            className="items-center px-4 relative"
          >
            <Text
              className={`text-[14px] ${
                isActive
                  ? "text-[#00AEB5] font-lexendSemiBold"
                  : "text-[#A1B1B4] font-lexendRegular"
              }`}
            >
              {year}
            </Text>
            {isActive && (
              <View className="w-1 h-1 absolute -top-1 right-2 rounded-full bg-[#293536] mt-1" />
            )}
          </TouchableOpacity>
        );
      });
    }

    if (grain === "Week") {
      // Generate 5 weeks around selectedDate
      const weeks = [];
      for (let i = -2; i <= 2; i++) {
        const d = new Date(selectedDate);
        d.setDate(selectedDate.getDate() + (i * 7));
        
        const start = new Date(d);
        start.setDate(d.getDate() - d.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        
        weeks.push({ start, end, original: d });
      }

      return weeks.map((w, index) => {
        const isSelected = w.start <= selectedDate && selectedDate <= w.end;
        const label = `${w.start.getDate()} ${MONTHS[w.start.getMonth()].slice(0, 3)} - ${w.end.getDate()} ${MONTHS[w.end.getMonth()].slice(0, 3)}`;
        
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onChange(w.original)}
            className="items-center px-4"
          >
            <Text
              className={`text-[13px] ${
                isSelected
                  ? "text-[#00AEB5] font-lexendSemiBold"
                  : "text-[#A1B1B4] font-lexendRegular"
              }`}
              numberOfLines={1}
            >
              {label}
            </Text>
            {isSelected && (
              <View className="w-1 h-1 rounded-full absolute -top-1 right-2  bg-[#293536] mt-1" />
            )}
          </TouchableOpacity>
        );
      });
    }
  };

  useEffect(() => {
    if (grain === "Month") {
      const monthIndex = selectedDate.getMonth();
      scrollRef.current?.scrollTo({ x: monthIndex * 60, animated: true });
    }
  }, [selectedDate, grain]);

  return (
    <View className="flex-row items-center justify-between py-4 border-y border-[#E6EDED] mb-6">
      <TouchableOpacity onPress={handlePrev} className="px-2">
        <Ionicons name="chevron-back" size={20} color="#7BA0A3" />
      </TouchableOpacity>

      <View className="flex-1">
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          {renderScrollItems()}
        </ScrollView>
      </View>

      <TouchableOpacity onPress={handleNext} className="px-2">
        <Ionicons name="chevron-forward" size={20} color="#7BA0A3" />
      </TouchableOpacity>

      <View className="w-[1px] h-6 bg-[#E6EDED] mx-2" />

      <TouchableOpacity onPress={onFilterPress} className="px-2">
        <Ionicons name="options-outline" size={20} color="#7BA0A3" />
      </TouchableOpacity>
    </View>
  );
};
