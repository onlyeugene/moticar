import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { LANGUAGES } from "@/utils/currency";
import { SvgProps } from "react-native-svg";

interface LanguageSelectionSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (languageCode: string) => void;
  currentLanguage?: string;
}

export default function LanguageSelectionSheet({
  visible,
  onClose,
  onSave,
  currentLanguage,
}: LanguageSelectionSheetProps) {
  const [selected, setSelected] = useState(currentLanguage || "en-GB");

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Language"
      height="40%"
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
      <View className="flex-row flex-wrap gap-3 px-2 pb-8 pt-2">
        {LANGUAGES.map((item) => {
          const isSelected = selected === item.value;
          const Icon = item.flag as React.FC<SvgProps>;

          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => setSelected(item.value)}
              className={`w-[112px] h-[75px] rounded-2xl items-center justify-center  ${
                isSelected
                  ? "border-[#00AEB5] border-2 bg-white"
                  : "border-[#D4D4D4] border "
              }`}
            >
              <Icon width={30} height={30} />
              <Text
                className={`mt-2 font-lexendRegular text-[0.75rem] ${
                  isSelected ? "text-[#00343F]" : "text-[#5D7070]"
                }`}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomSheet>
  );
}
