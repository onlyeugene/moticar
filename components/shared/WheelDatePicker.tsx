import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
  ScrollView,
} from "react-native";

const ITEM_HEIGHT = 45;
const VISIBLE_ITEMS = 3;
const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2);

interface WheelPickerProps {
  data: string[] | number[];
  initialValue?: string | number;
  onValueChange: (value: string | number) => void;
  width?: number;
}

const WheelPicker = ({ data, initialValue, onValueChange, width = 80 }: WheelPickerProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedValue, setSelectedValue] = useState(initialValue || data[0]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const value = data[index];
    if (value !== undefined && value !== selectedValue) {
      setSelectedValue(value);
      onValueChange(value);
    }
  };

  useEffect(() => {
    const index = (data as any[]).indexOf(initialValue);
    if (index !== -1 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: index * ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    }
  }, []);

  return (
    <View style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, width, overflow: "hidden" }}>
      <View
        style={{
          position: "absolute",
          top: ITEM_HEIGHT * CENTER_INDEX,
          left: 0,
          right: 0,
          height: ITEM_HEIGHT,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: "#1A8798",
        }}
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        onScrollEndDrag={handleScroll}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * CENTER_INDEX,
        }}
        scrollEventThrottle={16}
      >
        {data.map((item, index) => {
          const isSelected = item === selectedValue;
          return (
            <View
              key={index}
              style={{
                height: ITEM_HEIGHT,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: isSelected ? "#FFFFFF" : "#356D75",
                  fontSize: isSelected ? 18 : 16,
                  fontFamily: isSelected ? "LexendBold" : "LexendRegular",
                }}
              >
                {item}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

interface WheelDatePickerProps {
  onDateChange: (date: string) => void;
  initialDate?: string; // Format: DD.MM.YYYY
}

export const WheelDatePicker = ({ onDateChange, initialDate = "12.02.2025" }: WheelDatePickerProps) => {
  const [day, month, year] = initialDate.split(".").map((v, i) => parseInt(v));
  
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
  const YEARS = Array.from({ length: 30 }, (_, i) => 2026 - i);

  const [selectedDay, setSelectedDay] = useState(day || 1);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[(month || 1) - 1]);
  const [selectedYear, setSelectedYear] = useState(year || 2025);

  useEffect(() => {
    const monthIndex = MONTHS.indexOf(selectedMonth) + 1;
    const formattedMonth = monthIndex.toString().padStart(2, "0");
    const formattedDay = selectedDay.toString().padStart(2, "0");
    onDateChange(`${formattedDay}.${formattedMonth}.${selectedYear}`);
  }, [selectedDay, selectedMonth, selectedYear]);

  return (
    <View className="flex-row items-center justify-center gap-10 mt-6 mb-10">
      <WheelPicker
        data={MONTHS}
        initialValue={selectedMonth}
        onValueChange={(val) => setSelectedMonth(val as string)}
        width={60}
      />
      <WheelPicker
        data={DAYS}
        initialValue={selectedDay}
        onValueChange={(val) => setSelectedDay(val as number)}
        width={40}
      />
      <WheelPicker
        data={YEARS}
        initialValue={selectedYear}
        onValueChange={(val) => setSelectedYear(val as number)}
        width={80}
      />
    </View>
  );
};
