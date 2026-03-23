import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface DatePickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  initialDate?: Date;
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
  initialDate = new Date(),
  title = "Add Date of Expense",
}: DatePickerSheetProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [viewDate, setViewDate] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));

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

  const handleSave = () => {
    onSelect(selectedDate);
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
              <Text className="text-[#00343F] text-[14px] font-lexendBold">
                {title}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="z-10">
              <Ionicons name="close" size={28} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Calendar Body */}
          <View className="px-6">
            {/* Month Navigation */}
            <View className="flex-row justify-between items-center py-4">
              <TouchableOpacity onPress={handlePrevMonth}>
                <MaterialCommunityIcons name="chevron-double-left" size={16} color="#00343F" />
              </TouchableOpacity>
              <Text className="text-[#00AEB5] text-[14px] font-lexendBold">
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </Text>
              <TouchableOpacity onPress={handleNextMonth}>
                <MaterialCommunityIcons name="chevron-double-right" size={16} color="#00343F" />
              </TouchableOpacity>
            </View>

            {/* Weekday Labels */}
            <View className="flex-row justify-around mb-4">
              {WEEKDAYS.map((day) => (
                <Text key={day} className="text-[#333333] font-lexendBold text-[14px] w-[40px] text-center">
                  {day}
                </Text>
              ))}
            </View>

            {/* Days Grid */}
            <View className="flex-row flex-wrap justify-around">
              {calendarDays.map((dateObj, idx) => {
                const selected = isSelected(dateObj.fullDate);
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedDate(dateObj.fullDate)}
                    className="w-[40px] h-[40px] items-center justify-center mb-2"
                  >
                    <View className={`w-[36px] h-[36px] items-center justify-center rounded-full ${selected ? 'bg-[#FBE74C]' : ''}`}>
                      <Text className={`font-lexendRegular text-[12px] ${
                        dateObj.type === 'current' 
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
          </View>

          {/* Footer Save Button */}
          <View className="pb-10">
            <TouchableOpacity 
              onPress={handleSave}
              className="bg-[#00343F] w-[80%] py-5 rounded-full items-center mx-auto"
            >
              <Text className="text-white font-lexendBold text-[18px]">Save</Text>
            </TouchableOpacity>
          </View>
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
    minHeight: 500,
  },
});
