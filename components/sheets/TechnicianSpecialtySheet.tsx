import { TECHNICIAN_CATEGORIES, TechnicianCategory } from "@/types/technician";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BottomSheet from "../shared/BottomSheet";

interface TechnicianSpecialtySheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (specialty: TechnicianCategory) => void;
  currentSpecialty?: string;
}

export const Header = ({ onClose }: { onClose: () => void }) => (
  <View className="flex-row items-center justify-between flex-1 px-2">
    <TouchableOpacity onPress={onClose}>
      <Ionicons name="chevron-back" size={24} color="#1A3B41" />
    </TouchableOpacity>
    <Text className="text-[#00343F] font-lexendBold text-[1.125rem]">
      Specialty
    </Text>
    <TouchableOpacity onPress={onClose}>
      <Ionicons name="close" size={24} color="#1A3B41" />
    </TouchableOpacity>
  </View>
);

export default function TechnicianSpecialtySheet({
  visible,
  onClose,
  onSelect,
  currentSpecialty,
}: TechnicianSpecialtySheetProps) {
  const [selected, setSelected] = useState<TechnicianCategory | null>(
    (currentSpecialty as TechnicianCategory) || null,
  );

  const handleSave = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      title={<Header onClose={onClose} />}
      backgroundColor="#FFFFFF"
      height={"65%"}
      footer={
        <TouchableOpacity
          onPress={handleSave}
          disabled={!selected}
          className={`h-[60px] w-11/12 mx-auto rounded-full items-center justify-center ${
            selected ? "bg-[#002D36]" : "bg-[#002D36] opacity-50"
          }`}
        >
          <Text className="text-white font-lexendBold text-[1.25rem]">Save</Text>
        </TouchableOpacity>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
        <View className="flex-row flex-wrap gap-x-2 gap-y-3 px-1">
          {TECHNICIAN_CATEGORIES.map((cat) => {
            const isSelected = selected === cat;

            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelected(cat)}
                style={{ width: "31.5%" }}
                className={`items-center justify-center py-3 px-1 rounded-lg ${
                  isSelected
                    ? "bg-[#10AEB5]"
                    : "bg-[#F3F3F3]"
                }`}
              >
                <Text
                  numberOfLines={2}
                  className={`text-center text-[0.6875rem] font-lexendRegular ${
                    isSelected ? "text-white" : "text-[#00343F]"
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
