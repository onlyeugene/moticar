import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { WheelDatePicker } from "../shared/WheelDatePicker";
import BottomSheet from "../shared/BottomSheet";

export type EditMode = "color" | "chips" | "toggle" | "input" | "date" | "plate";

interface AttributeEditSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (value: any) => void;
  title: string;
  mode: EditMode;
  options?: string[];
  initialValue: any;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  multiline?: boolean;
}

const COLORS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#000000" },
  { name: "Grey", hex: "#D9D9D9" },
  { name: "Silver", hex: "#EBEBEB" },
  { name: "Blue", hex: "#1A56FF" },
  { name: "Red", hex: "#FF3B30" },
  { name: "Green", hex: "#34C759" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Yellow", hex: "#FFCC00" },
  { name: "Orange", hex: "#FF9500" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Bronze", hex: "#CD7F32" },
  { name: "Purple", hex: "#AF52DE" },
  { name: "Teal", hex: "#5AC8FA" },
  { name: "Maroon", hex: "#800000" },
];

export default function AttributeEditSheet({
  visible,
  onClose,
  onSave,
  title,
  mode,
  options = [],
  initialValue,
  keyboardType = "default",
  multiline = false,
}: AttributeEditSheetProps) {
  const [value, setValue] = useState(initialValue);

  // Sync state when initialValue changes (when switching between different attributes)
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue, visible]);

  const isChanged = value !== initialValue && value !== "" && value !== undefined;

  const headerRight = (
    <TouchableOpacity
      onPress={() => isChanged && onSave(value)}
      disabled={!isChanged}
      style={{ opacity: isChanged ? 1 : 0.5 }}
      className={`${isChanged ? "bg-[#29D7DE]" : "bg-[#29D7DE]/40"} px-8 py-2.5 rounded-full`}
    >
      <Text className={`${isChanged ? "text-[#00343F]" : "text-[#00343F]/90"} font-lexendBold text-[0.875rem]`}>Save</Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (mode) {
      case "color":
        return (
          <View className="flex-row flex-wrap pt-2">
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color.name}
                onPress={() => setValue(color.name)}
                className="w-1/5 mb-6 items-center px-1"
              >
                <View 
                  className={`w-12 h-12 rounded-lg shadow-sm mb-2 ${value === color.name ? 'border-2 border-[#29D7DE]' : 'border border-gray-100'}`}
                  style={{ backgroundColor: color.hex }}
                />
                <Text className="text-[#8B8B8B] text-[0.625rem] font-lexendRegular text-center">
                  {color.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "chips":
        return (
          <View className="flex-row flex-wrap  pt-2">
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setValue(opt)}
                className={`mr-2 mb-3 px-6 py-4 rounded-[8px] border border-gray-50 ${
                  value === opt ? "bg-[#00AEB5]" : "bg-white"
                }`}
              >
                <Text
                  className={`font-lexendRegular text-[0.8125rem] ${
                    value === opt ? "text-white" : "text-[#00343F]"
                  }`}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "toggle":
        return (
          <View className="flex-row gap-3 pt-2">
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setValue(opt)}
                className={`flex-1 py-[8px] px-[32px] rounded-[8px] items-center justify-center ${
                  value === opt ? "bg-[#00AEB5]" : "bg-[#FFFFFF]"
                }`}
              >
                <Text
                  className={`font-lexendRegular text-[0.75rem] ${
                    value === opt ? "text-white" : "text-[#00343F]"
                  }`}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "input":
        return (
          <View className="pt-2 px-6">
            <View className="border-b border-[#0000001A] pb-2">
              <TextInput
                value={value?.toString()}
                onChangeText={setValue}
                autoFocus
                multiline={multiline}
                keyboardType={keyboardType}
                placeholder="Enter value"
                className={`text-[#00343F] font-lexendMedium ${multiline ? "text-[1rem]" : "text-[1.5rem] text-center"}`}
              />
            </View>
          </View>
        );

      case "plate":
        return (
          <View className="pt-2 px-6 items-center">
            <View className="w-full bg-white  rounded-[12px] py-10 px-4">
              <TextInput
                value={value?.toString()}
                onChangeText={setValue}
                autoFocus
                autoCapitalize="characters"
                placeholder="Enter Plate"
                className="text-[#00343F] font-ukNumberPlate text-[2rem] text-center uppercase"
              />
            </View>
          </View>
        );

      case "date":
        return (
          <View className="pt-2">
            <WheelDatePicker
              initialDate={value || "12-02-2025"}
              onDateChange={setValue}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={title}
      headerRight={headerRight}
      height='70%'
      backgroundColor="#F5F5F5"
    >
      <View className="pb-10">{renderContent()}</View>
    </BottomSheet>
  );
}
