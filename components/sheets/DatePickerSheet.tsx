import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface DatePickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  initialDate?: Date;
  maxDate?: Date;
  title?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function DatePickerSheet({
  visible,
  onClose,
  onSelect,
  initialDate,
  maxDate,
  title = "Add Date of Expense",
}: DatePickerSheetProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [viewDate, setViewDate] = useState(new Date((initialDate || new Date()).getFullYear(), (initialDate || new Date()).getMonth(), 1));
  const [isYearMode, setIsYearMode] = useState(false);

  // Sync internal state when initialDate changes or sheet becomes visible
  useEffect(() => {
    if (visible) {
      const baseDate = initialDate || new Date();
      setSelectedDate(baseDate);
      setViewDate(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1));
      setIsYearMode(false);
    }
  }, [visible, initialDate?.getTime()]);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100;
    const endYear = currentYear + 20;
    const list = [];
    for (let i = endYear; i >= startYear; i--) {
      list.push(i);
    }
    return list;
  }, []);

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days = [];
    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ 
        day: daysInPrevMonth - i, 
        type: 'prev', 
        fullDate: new Date(year, month - 1, daysInPrevMonth - i) 
      });
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ 
        day: i, 
        type: 'current', 
        fullDate: new Date(year, month, i) 
      });
    }
    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ 
        day: i, 
        type: 'next', 
        fullDate: new Date(year, month + 1, i) 
      });
    }
    return days;
  }, [viewDate]);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectYear = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
    setIsYearMode(false);
  };

  const handleSave = () => {
    // Preserve the current time (hours, mins, secs) from initialDate or today
    const baseDate = initialDate || new Date();
    const finalDate = new Date(selectedDate);
    finalDate.setHours(baseDate.getHours());
    finalDate.setMinutes(baseDate.getMinutes());
    finalDate.setSeconds(baseDate.getSeconds());
    
    onSelect(finalDate);
    onClose();
  };

  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isFuture = (date: Date) => {
    if (!maxDate) return false;
    // Strip time for comparison
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const limitDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    return compareDate > limitDate;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.container}>
          {/* Custom Header */}
          <View className="flex-row justify-between items-center px-6 pt-6 mb-4 relative h-16">
            <TouchableOpacity onPress={onClose} className="z-10">
              <Ionicons name="chevron-back" size={28} color="#00343F" />
            </TouchableOpacity>
            <View className="">
              <Text className="text-[#00343F] text-[0.875rem] font-lexendBold">
                {title}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="z-10">
              <Ionicons name="close" size={28} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Calendar Body */}
          <View className="px-6 flex-1">
            {/* Month Navigation */}
            <View className="flex-row justify-between items-center py-4">
              <TouchableOpacity onPress={handlePrevMonth}>
                <MaterialCommunityIcons name="chevron-double-left" size={20} color="#00AEB5" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsYearMode(!isYearMode)}>
                <Text className="text-[#00AEB5] text-[1rem] font-lexendBold">
                  {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                  <Ionicons name={isYearMode ? "chevron-up" : "chevron-down"} size={14} color="#00AEB5" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextMonth}>
                <MaterialCommunityIcons name="chevron-double-right" size={20} color="#00AEB5" />
              </TouchableOpacity>
            </View>

            {!isYearMode ? (
              <>
                {/* Weekday Labels */}
                <View className="flex-row mb-4">
                  {WEEKDAYS.map((day) => (
                    <Text key={day} className="text-[#333333] font-lexendBold text-[0.875rem] flex-1 text-center">
                      {day}
                    </Text>
                  ))}
                </View>

                {/* Days Grid */}
                <View className="flex-row flex-wrap">
                  {calendarDays.map((dateObj, idx) => {
                    const selected = isSelected(dateObj.fullDate);
                    const disabled = isFuture(dateObj.fullDate);
                    
                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => !disabled && setSelectedDate(dateObj.fullDate)}
                        disabled={disabled}
                        className="w-[14.28%] aspect-square items-center justify-center mb-1"
                      >
                        <View className={`w-[36px] h-[36px] items-center justify-center rounded-full ${selected ? 'bg-[#FBE74C]' : ''}`}>
                          <Text className={`font-lexendRegular text-[0.75rem] ${
                            disabled
                              ? 'text-[#C1C3C3]'
                              : dateObj.type === 'current' 
                                ? (selected ? 'text-[#202A2A]' : 'text-[#202A2A]') 
                                : 'text-[#92BEC1]'
                          }`}>
                            {dateObj.day}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : (
              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="flex-row flex-wrap justify-between px-1">
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      onPress={() => handleSelectYear(year)}
                      className={`w-[23%] py-3 mb-2 rounded-xl items-center ${viewDate.getFullYear() === year ? 'bg-[#FBE74C]' : 'bg-[#F5F5F5]'}`}
                    >
                      <Text className={`font-lexendMedium text-[0.875rem] ${viewDate.getFullYear() === year ? 'text-[#202A2A]' : 'text-[#00343F]'}`}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

          {/* Footer Save Button */}
          {!isYearMode && (
            <View className="pb-10 pt-4">
              <TouchableOpacity 
                onPress={handleSave}
                className="bg-[#00343F] w-[80%] py-5 rounded-full items-center mx-auto"
              >
                <Text className="text-white font-lexendBold text-[1.125rem]">Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '90%',
    minHeight: 500,
  },
});
