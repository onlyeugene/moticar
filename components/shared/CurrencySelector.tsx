import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useUpdateProfile } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { CURRENCIES, LANGUAGES } from "@/utils/currency";

interface CurrencySelectorProps {
  onSelect?: (currency: string) => void;
  variant?: "outline" | "ghost" | "auth";
  showLabel?: boolean;
}

export default function CurrencySelector({
  onSelect,
  variant = "outline",
  showLabel = false,
}: CurrencySelectorProps) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [showModal, setShowModal] = useState(false);
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { showSnackbar } = useSnackbar();

  const currentLang =
    LANGUAGES.find((l) => l.value === (user?.preferredLanguage || "en-US")) ||
    LANGUAGES[0];
  const currentCurrency =
    CURRENCIES.find((c) => c.value === (user?.preferredCurrency || "NGN")) ||
    CURRENCIES[0];

  const handleSelectLanguage = (item: (typeof LANGUAGES)[0]) => {
    if (token) {
      updateProfile(
        { preferredLanguage: item.value },
        {
          onSuccess: () => {
            showSnackbar({
              type: "success",
              message: "Language Updated",
              description: `Language set to ${item.label}.`,
            });
          },
        },
      );
    } else {
      updateUser({ preferredLanguage: item.value });
      showSnackbar({
        type: "success",
        message: "Language Selected",
        description: `Starting with ${item.label}.`,
      });
    }
  };

  const handleSelectCurrency = (item: (typeof CURRENCIES)[0]) => {
    if (token) {
      updateProfile(
        { preferredCurrency: item.value, country: item.country },
        {
          onSuccess: () => {
            showSnackbar({
              type: "success",
              message: "Currency Updated",
              description: `Region set to ${item.country} (${item.value}).`,
            });
          },
        },
      );
    } else {
      updateUser({ preferredCurrency: item.value, country: item.country });
      showSnackbar({
        type: "success",
        message: "Currency Selected",
        description: `Region set to ${item.country} (${item.value}).`,
      });
    }
    onSelect?.(item.value);
  };

  const renderTrigger = () => {
    if (variant === "auth") {
      return (
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="flex-row items-center gap-2"
        >
          <Text className="text-[25px]">{currentLang.flag}</Text>
          <Text className="text-white font-lexendSemiBold text-[15px]">
            {currentCurrency.symbol}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#5E858C" />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        className="bg-[#00AEB5]/20 px-3 py-1.5 rounded-full border border-[#00AEB5]/30 flex-row items-center gap-1.5"
      >
        <Text className="text-[14px]">{currentLang.flag}</Text>
        <Text className="text-[#00AEB5] font-lexendMedium text-[12px]">
          {currentCurrency.value}
        </Text>
        <View className="w-1.5 h-1.5 bg-[#00AEB5] rounded-full" />
      </TouchableOpacity>
    );
  };

  return (
    <>
      {renderTrigger()}

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          onPress={() => setShowModal(false)}
          className="flex-1 bg-black/70 justify-end"
        >
          <View className="bg-[#00232A] rounded-t-[40px] p-8 border-t border-[#09515D]/60 shadow-2xl">
            <View className="w-12 h-1.5 bg-[#09515D]/60 rounded-full self-center mb-8" />

            <Text className="text-white text-[22px] font-lexendBold mb-6">
              Preferences
            </Text>

            {/* Language Section */}
            <Text className="text-[#9BBABB] font-lexendBold text-[10px] uppercase mb-3 tracking-widest px-1">
              Preferred Language (Flag)
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-8"
              contentContainerStyle={{ gap: 12, paddingRight: 20 }}
            >
              {LANGUAGES.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => handleSelectLanguage(item)}
                  className={`w-[70px] h-[70px] rounded-2xl items-center justify-center border-2 ${
                    currentLang.value === item.value
                      ? "bg-[#00AEB5]/20 border-[#00AEB5]"
                      : "bg-[#09515D]/20 border-[#09515D]/40"
                  }`}
                >
                  <Text className="text-2xl">{item.flag}</Text>
                  <Text
                    className="text-[10px] text-white font-lexendRegular mt-1 text-center"
                    numberOfLines={1}
                  >
                    {item.label.split(" ")[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Currency Section */}
            <Text className="text-[#9BBABB] font-lexendBold text-[10px] uppercase mb-3 tracking-widest px-1">
              Preferred Currency (Symbol)
            </Text>
            <ScrollView
              className="max-h-[300px]"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
            >
              {CURRENCIES.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => handleSelectCurrency(item)}
                  disabled={isPending}
                  className={`p-4 rounded-[20px] flex-row items-center justify-between ${
                    currentCurrency.value === item.value
                      ? "bg-[#00AEB5]/20 border border-[#00AEB5]/40"
                      : "bg-[#09515D]/20 border border-[#09515D]/40"
                  }`}
                >
                  <View className="flex-row items-center gap-4">
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center ${
                        currentCurrency.value === item.value
                          ? "bg-[#00AEB5]/30"
                          : "bg-[#09515D]/40"
                      }`}
                    >
                      <Text className="text-white font-lexendBold text-[16px]">
                        {item.symbol}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-white font-lexendSemiBold text-[15px]">
                        {item.country}
                      </Text>
                      <Text className="text-[#9BBABB] font-lexendRegular text-[12px]">
                        {item.label} ({item.value})
                      </Text>
                    </View>
                  </View>

                  {currentCurrency.value === item.value && (
                    <View className="bg-[#00AEB5] p-1.5 rounded-full">
                      <Ionicons name="checkmark" size={12} color="#00232A" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowModal(false)}
              className="mt-6 mb-4 w-full h-[55px] rounded-2xl items-center justify-center bg-[#09515D]/30"
            >
              <Text className="text-[#9BBABB] font-lexendBold text-[16px]">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
