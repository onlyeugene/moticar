import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current || (initialValue !== undefined && initialValue !== selectedValue)) {
      isFirstRender.current = false;
      setSelectedValue(initialValue || data[0]);
      const index = (data as any[]).indexOf(initialValue || data[0]);
      if (index !== -1 && scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: index * ITEM_HEIGHT,
            animated: false,
          });
        }, 100);
      }
    }
  }, [initialValue, data]);

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
              className={`${isSelected ? "font-lexendRegular text-[#FFFFFF]" : "font-lexendRegular text-[#9BA5A5]"} text-[14px]`}
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

interface FormWheelDatePickerProps {
  onDateChange: (date: string) => void;
  initialDate?: string; // Format: DD.MM.YYYY
}

export const FormWheelDatePicker = ({ 
  onDateChange, 
  initialDate 
}: FormWheelDatePickerProps) => {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const MONTHS = useMemo(() => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], []);

  const getInitialValues = useCallback(() => {
    if (initialDate) {
      const parts = initialDate.split(/[-.]/);
      if (parts.length === 3) {
        return parts.map(v => parseInt(v));
      }
    }
    return [currentDay, currentMonth, currentYear];
  }, [initialDate, currentDay, currentMonth, currentYear]);

  const [initialDay, initialMonth, initialYear] = getInitialValues();
  
  const [selectedDay, setSelectedDay] = useState(Number(initialDay));
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[initialMonth - 1] || MONTHS[currentMonth - 1]);
  const [selectedYear, setSelectedYear] = useState(Number(initialYear));

  const YEARS = useMemo(() => Array.from({ length: 50 }, (_, i) => currentYear - i), [currentYear]);

  // Sync state when initialDate changes externally
  useEffect(() => {
    if (initialDate) {
      const parts = initialDate.split(/[-.]/);
      if (parts.length === 3) {
        const [d, m, y] = parts.map(v => parseInt(v));
        setSelectedDay(Number(d));
        setSelectedMonth(MONTHS[m - 1]);
        setSelectedYear(Number(y));
      }
    }
  }, [initialDate, MONTHS]);

  const monthIndex = useMemo(() => MONTHS.indexOf(selectedMonth) + 1, [selectedMonth, MONTHS]);

  // Function to get valid days for current month/year
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, monthIndex, 0).getDate();
  }, [selectedYear, monthIndex]);

  const DAYS = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  // Filter months if selected year is current year
  const availableMonths = useMemo(() => {
    if (Number(selectedYear) === Number(currentYear)) {
      return MONTHS.slice(0, currentMonth);
    }
    return MONTHS;
  }, [selectedYear, currentYear, currentMonth, MONTHS]);

  // Filter days if selected year and month are current
  const availableDays = useMemo(() => {
    if (Number(selectedYear) === Number(currentYear) && Number(monthIndex) === Number(currentMonth)) {
      return DAYS.slice(0, currentDay);
    }
    return DAYS;
  }, [selectedYear, currentYear, monthIndex, currentMonth, currentDay, DAYS]);

  useEffect(() => {
    // Validation: ensure month is not in future if year is current
    if (Number(selectedYear) === Number(currentYear) && Number(monthIndex) > Number(currentMonth)) {
      setSelectedMonth(MONTHS[currentMonth - 1]);
      return;
    }

    // Validation: ensure day is not in future if year and month are current
    if (Number(selectedYear) === Number(currentYear) && Number(monthIndex) === Number(currentMonth) && Number(selectedDay) > Number(currentDay)) {
      setSelectedDay(currentDay);
      return;
    }

    // Validation: ensure day is valid for the month
    if (Number(selectedDay) > Number(daysInMonth)) {
      setSelectedDay(daysInMonth);
      return;
    }

    const formattedMonth = monthIndex.toString().padStart(2, "0");
    const formattedDay = selectedDay.toString().padStart(2, "0");
    onDateChange(`${formattedDay}-${formattedMonth}-${selectedYear}`);
  }, [selectedDay, selectedMonth, selectedYear, daysInMonth, monthIndex, currentDay, currentMonth, currentYear, MONTHS]);

  return (
    <View className="flex-row items-center justify-center gap-10 mt-6 mb-10">
      <WheelPicker
        data={availableDays}
        initialValue={selectedDay}
        onValueChange={(val) => setSelectedDay(Number(val))}
        width={50}
      />
      <WheelPicker
        data={availableMonths}
        initialValue={selectedMonth}
        onValueChange={(val) => setSelectedMonth(String(val))}
        width={70}
      />
      <WheelPicker
        data={YEARS}
        initialValue={selectedYear}
        onValueChange={(val) => setSelectedYear(Number(val))}
        width={90}
      />
    </View>
  );
};
