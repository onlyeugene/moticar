import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { Ionicons } from "@expo/vector-icons";

export const CURRENCIES = [
  { code: "AED", name: "United Arab Emirates Dirham", symbol: "د.إ" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound Sterling", symbol: "£" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "DH" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "RWF", name: "Rwandan Franc", symbol: "RF" },
  { code: "SAR", name: "Saudi Riyal", symbol: "ر.س" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  { code: "USD", name: "United States Dollar", symbol: "$" },
  { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA" },
  { code: "XOF", name: "West African CFA Franc", symbol: "CFA" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
];

interface CurrencySelectionSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (currencyCode: string) => void;
  currentCurrency?: string;
}

export default function CurrencySelectionSheet({
  visible,
  onClose,
  onSelect,
  currentCurrency,
}: CurrencySelectionSheetProps) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Select Currency"
      height="50%"
      backgroundColor="#FFFFFF"
    >
      <View className="px-2 pb-10">
        {CURRENCIES.map((currency) => {
          const isSelected = currentCurrency === currency.code;
          return (
            <TouchableOpacity
              key={currency.code}
              onPress={() => onSelect(currency.code)}
              className="flex-row items-center justify-between py-4 border-b border-[#F5F5F5]"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-full bg-[#EEF5F5] items-center justify-center">
                  <Text className="text-[#006C70] text-[18px] font-lexendBold">
                    {currency.symbol}
                  </Text>
                </View>
                <View>
                  <Text className="text-[#00343F] text-[15px] font-lexendBold">
                    {currency.code}
                  </Text>
                  <Text className="text-[#879090] text-[12px] font-lexendRegular">
                    {currency.name}
                  </Text>
                </View>
              </View>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={24} color="#29D7DE" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomSheet>
  );
}
