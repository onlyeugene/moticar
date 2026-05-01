import React, { useState } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { CURRENCIES } from "@/utils/currency";
import { SvgProps } from "react-native-svg";
import XeIcon from '@/assets/icons/xe.svg'

interface CurrencySelectionSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (currencyCode: string, country: string) => void;
  currentCurrency?: string;
}

export default function CurrencySelectionSheet({
  visible,
  onClose,
  onSave,
  currentCurrency,
}: CurrencySelectionSheetProps) {
  const [selected, setSelected] = useState(currentCurrency || "USD");

  const handleSave = () => {
    const item = CURRENCIES.find((c) => c.value === selected);
    if (item) onSave(item.value, item.country);
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Currency"
      height="70%"
      backgroundColor="#F0F0F0"
      scrollable={false}
      headerRight={
        <TouchableOpacity
          onPress={handleSave}
          className="bg-[#00AEB5] px-5 py-1.5 rounded-full"
        >
          <Text className="text-white font-lexendSemiBold text-[0.875rem]">
            Save
          </Text>
        </TouchableOpacity>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {CURRENCIES.map((item) => {
          const isSelected = selected === item.value;
          const Icon = typeof item.icon !== "string" ? (item.icon as React.FC<SvgProps>) : null;

          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => setSelected(item.value)}
              className={`flex-row items-center justify-between px-4 py-3 rounded-[8px] mb-2 ${
                isSelected
                  ? "border-[#00AEB5] border-2 bg-white"
                  : "border-[#D4D4D4] border"
              }`}
            >
              {/* Left: flag + name + country pill */}
              <View className="flex-row items-center gap-3 flex-1">
                {Icon ? (
                  <Icon width={20} height={20} />
                ) : (
                  <View className="w-8 h-8 rounded-full bg-[#EEF5F5] items-center justify-center">
                    <Text className="text-[#006C70] font-lexendBold text-[0.6875rem]">
                      {item.value.slice(0, 2)}
                    </Text>
                  </View>
                )}
                <View className="flex-row items-center gap-2 flex-wrap">
                  <Text
                    className={`font-lexendRegular text-[0.9375rem] ${
                      isSelected ? "text-[#00343F]" : "text-[#5E7A7A]"
                    }`}
                  >
                    {item.label}
                  </Text>
                  <View className="bg-[#5E9597] px-2 py-0.5 rounded-[4px]">
                    <Text className="text-[#FFFFFF] font-lexendSemiBold text-[0.5625rem] uppercase">
                      {item.country}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right: symbol + check */}
              <View className="flex-row items-center gap-3">
                <Text
                  className={`font-lexendBold text-[0.9375rem] text-[#00AEB5]`}
                >
                  {item.symbol}
                </Text>
                <View
                  className={`w-7 h-7 rounded-full items-center justify-center ${
                    isSelected ? "bg-[#00AEB5]" : "bg-[#CFD7D8]"
                  }`}
                >
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color={isSelected ? "#FFFFFF" : "#FFFFFF"}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* XE disclaimer */}
        <View className="flex-row items-start gap-3 mt-4 px-1 mb-4">
          <View className="">
            <XeIcon />
          </View>
          <Text className="text-[#717272] font-lexendRegular text-[0.625rem] flex-1 leading-5">
           Please note that changing the currency would convert all pre-existing entries to new values to reflect change of currency. The exchange rate to be applied would be as gotten from XE as at the time of conversion.
          </Text>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
