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
import * as Localization from "expo-localization";

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

  // Auto-detect fallbacks from device if the user hasn't explicitly set them
  const deviceLocales = Localization.getLocales();
  const deviceCurrency = deviceLocales[0]?.currencyCode;
  const deviceLanguageTag = deviceLocales[0]?.languageTag; // e.g., "en-US"
  const deviceLanguageCode = deviceLocales[0]?.languageCode; // e.g., "en"

  const currentLang =
    LANGUAGES.find((l) => l.value === user?.preferredLanguage) ||
    LANGUAGES.find((l) => l.value === deviceLanguageTag) ||
    LANGUAGES.find((l) => l.value.startsWith(deviceLanguageCode || "en")) ||
    LANGUAGES.find((l) => l.value === "en-GB") ||
    LANGUAGES[0];

  const currentCurrency =
    CURRENCIES.find((c) => c.value === user?.preferredCurrency) ||
    CURRENCIES.find((c) => c.value === deviceCurrency) ||
    CURRENCIES.find((c) => c.value === "USD") ||
    CURRENCIES[0];

  const handleSelectLanguage = (item: (typeof LANGUAGES)[0]) => {
    if (token) {
      updateProfile(
        { 
          preferredLanguage: item.value,
          hasManuallySetPreferences: true
        },
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
        { 
          preferredCurrency: item.value, 
          country: item.country,
          hasManuallySetPreferences: true
        },
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
      updateUser({ 
        preferredCurrency: item.value, 
        country: item.country,
        hasManuallySetPreferences: true 
      });
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
          <currentLang.flag width={20} height={20} />
          <Text className="text-white font-lexendSemiBold text-[0.9375rem]">
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
        <currentLang.flag width={16} height={16} />
        <Text className="text-[#00AEB5] font-lexendMedium text-[0.75rem]">
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

            <Text className="text-white text-[1.375rem] font-lexendBold mb-6">
              Preferences
            </Text>

            {/* Language Section */}
            <Text className="text-[#9BBABB] font-lexendBold text-[0.625rem] uppercase mb-3 tracking-widest px-1">
              Preferred Language (Flag)
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-8"
              contentContainerStyle={{ gap: 12, paddingRight: 20 }}
            >
              {LANGUAGES.map((item) => {
                const isFlagString = typeof item.flag === "string";
                return (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => handleSelectLanguage(item)}
                    className={`w-[70px] h-[70px] rounded-2xl items-center justify-center  ${
                      currentLang.value === item.value
                        ? "border-2 border-[#00AEB5]"
                        : "border border-[#09515D]"
                    }`}
                  >
                  
                      <item.flag width={28} height={28} />
                   
                  
                    <Text
                      className="text-[0.75rem] text-white font-lexendRegular mt-2 text-center"
                      numberOfLines={1}
                    >
                      {item.label.split(" ")[0]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Currency Section */}
            <Text className="text-[#9BBABB] font-lexendBold text-[0.625rem] uppercase mb-3 tracking-widest px-1">
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
                  className={`p-4 rounded-[8px] flex-row items-center justify-between ${
                    currentCurrency.value === item.value
                      ? " border-2 border-[#1A8798]"
                      : "border border-[#09515D]"
                  }`}
                >
                  <View className="flex-row items-center gap-4 flex-shrink">
                    {typeof item.icon !== 'string' && item.icon ? (
                      <item.icon width={28} height={28} />
                    ) : (
                      <View className="w-7 h-7 rounded-full bg-[#09515D]/40 items-center justify-center border border-[#09515D]">
                        <Text className="text-white font-lexendSemiBold text-[0.625rem] uppercase">
                          {item.value.slice(0, 2)}
                        </Text>
                      </View>
                    )}
                    <View className="flex-row items-center flex-wrap gap-1">
                      <Text className={`font-lexendRegular text-[0.875rem] ${currentCurrency.value === item.value ? "text-[#FFFFFF]" : "text-[#9BBABB]"}`}>
                        {item.label}
                      </Text>
                      <View className="rounded-[4px] px-2 py-0.5 bg-[#5E9597] border border-[#5E9597] justify-center ml-1">
                        <Text className="text-[#002E35] uppercase font-lexendSemiBold text-[0.5rem]">
                          {item.country}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <Text className={`font-lexendBold text-[0.875rem] ${currentCurrency.value === item.value ? "text-[#00AEB5]" : "text-[#9BBABB]"}`}>
                      {item.symbol}
                    </Text>
                    <View className={`p-1.5 rounded-full ${currentCurrency.value === item.value ? "bg-[#00AEB5]" : "bg-[#09515D]"}`}>
                      <Ionicons name="checkmark" size={12} color={currentCurrency.value === item.value ? "#FFFFFF" : "#00232A"} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowModal(false)}
              className="mt-6 mb-4 w-full h-[55px] rounded-2xl items-center justify-center bg-[#09515D]/30"
            >
              <Text className="text-[#9BBABB] font-lexendBold text-[1rem]">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
