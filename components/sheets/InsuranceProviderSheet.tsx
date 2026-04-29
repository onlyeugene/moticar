import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { useInsuranceProviders, InsuranceProvider } from "@/hooks/useInsuranceProviders";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { CURRENCIES } from "@/utils/currency";

interface InsuranceProviderSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (provider: string) => void;
  selectedProvider?: string;
  initialCountry?: string;
}

const ALPHA_FILTERS = [
  { label: "All", range: null },
  { label: "A - F", range: /^[A-F]/i },
  { label: "G - J", range: /^[G-J]/i },
  { label: "K - O", range: /^[K-O]/i },
  { label: "P - U", range: /^[P-U]/i },
  { label: "V - Z", range: /^[V-Z]/i },
];

export default function InsuranceProviderSheet({
  visible,
  onClose,
  onSelect,
  selectedProvider,
  initialCountry,
}: InsuranceProviderSheetProps) {
  const user = useAuthStore(state => state.user);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry || user?.country || "NG");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCountryList, setShowCountryList] = useState(false);

  const normalizedCountry = useMemo(() => {
    if (!selectedCountry) return "NG";
    if (selectedCountry.length === 2) return selectedCountry.toUpperCase();
    
    // Normalize names to codes (e.g., 'Nigeria' -> 'NG', 'UK' -> 'GB')
    const matched = CURRENCIES.find(c => 
      c.country.toLowerCase() === selectedCountry.toLowerCase() ||
      c.isoCode.toLowerCase() === selectedCountry.toLowerCase()
    );
    return matched ? matched.isoCode : selectedCountry;
  }, [selectedCountry]);

  const { data: providers = [], isLoading } = useInsuranceProviders(normalizedCountry);

  const countryName = useMemo(() => {
    const matched = CURRENCIES.find(c => c.isoCode === normalizedCountry);
    return matched ? matched.country : selectedCountry;
  }, [normalizedCountry, selectedCountry]);

  const filteredProviders = useMemo(() => {
    let list = providers;
    const filter = ALPHA_FILTERS.find(f => f.label === activeFilter);
    if (filter && filter.range) {
      list = providers.filter(p => filter.range?.test(p.name));
    }
    return list;
  }, [providers, activeFilter]);

  const displayedProviders = isExpanded ? filteredProviders : filteredProviders.slice(0, 5);

  const handleSelect = (name: string) => {
    onSelect(name);
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      height="90%"
      backgroundColor="#F5F5F5"
      leftIcon="chevron-back"
        title="Select an insurance provider"
      headerRight={
        <View className="flex-row items-center gap-2">
          <TouchableOpacity className="bg-white w-11 h-11 rounded-full items-center justify-center border border-[#E0E0E0]">
            <Ionicons name="add" size={24} color="#00AEB5" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => selectedProvider && handleSelect(selectedProvider)}
            disabled={!selectedProvider}
            className={`${selectedProvider ? "bg-[#29D7DE]" : "bg-[#29D7DE]/40"} px-4 py-2 rounded-full`}
          >
            <Text className={`${selectedProvider ? "text-[#00343F]" : "text-[#00343F]/40"} font-lexendBold text-[14px]`}>select</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <View className="p-5 bg-white">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-[#A6A8A8] font-lexendMedium text-[12px]">
            Based on your current location
          </Text>
          <TouchableOpacity 
            onPress={() => setShowCountryList(!showCountryList)}
            className="flex-row items-center gap-2"
          >
            <Text className="text-[#006C70] capitalize font-lexendMedium text-[12px]">
              {countryName}
            </Text>
            <Ionicons name={showCountryList ? "chevron-up" : "chevron-down"} size={16} color="#ADADAD" />
          </TouchableOpacity>
        </View>

        {showCountryList && (
          <ScrollView 
            className="max-h-40 mb-4 bg-[#F9F9F9] rounded-xl"
            showsVerticalScrollIndicator={false}
          >
            {CURRENCIES.map((c) => (
              <TouchableOpacity
                key={c.isoCode}
                onPress={() => {
                  setSelectedCountry(c.isoCode);
                  setShowCountryList(false);
                  setIsExpanded(false); // Reset expansion when country changes
                }}
                className={`px-4 py-3 border-b border-[#EEE] ${selectedCountry === c.isoCode ? "bg-[#E6F7F8]" : ""}`}
              >
                <Text className={`font-lexendMedium text-[13px] ${selectedCountry === c.isoCode ? "text-[#00AEB5]" : "text-[#4D5A5D]"}`}>
                  {c.country}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {isExpanded && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="flex-row mb-6"
            contentContainerStyle={{ gap: 8 }}
          >
            {ALPHA_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.label}
                onPress={() => setActiveFilter(filter.label)}
                className={`px-4 py-2 rounded-lg ${
                  activeFilter === filter.label 
                    ? "bg-[#4D5A5D]" 
                    : "bg-[#D9D9D980]"
                }`}
              >
                <Text className={`font-lexendMedium text-[12px] ${
                  activeFilter === filter.label ? "text-white" : "text-[#4D5A5D]"
                }`}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {isLoading ? (
          <View className="py-20 items-center">
            <ActivityIndicator color="#00AEB5" />
          </View>
        ) : (
          <View className="gap-3">
            {displayedProviders.map((provider) => (
              <TouchableOpacity
                key={provider._id}
                onPress={() => handleSelect(provider.name)}
                className={`flex-row items-center justify-between p-5 bg-white rounded-xl border ${
                  selectedProvider === provider.name ? "border-[#00AEB5]" : "border-[#E2E2E2]"
                }`}
              >
                <Text className="text-[#001A1F] font-lexendMedium text-[15px]">
                  {provider.name}
                </Text>
                <View className={`w-7 h-7 rounded-full border items-center justify-center ${
                  selectedProvider === provider.name ? "bg-[#00AEB5] border-[#00AEB5]" : "border-[#E2E2E2] bg-[#DEDEDE]"
                }`}>
                  <Ionicons 
                    name="checkmark" 
                    size={16} 
                    color={selectedProvider === provider.name ? "white" : "#FFFFFF"} 
                  />
                </View>
              </TouchableOpacity>
            ))}

            {!isExpanded && filteredProviders.length > 5 && (
              <TouchableOpacity 
                onPress={() => setIsExpanded(true)}
                className="mt-4 bg-[#E8E8E8] py-4 rounded-full flex-row items-center justify-center gap-2"
              >
                <Text className="text-[#4D5A5D] font-lexendMedium text-[14px]">
                  See more providers
                </Text>
                <Ionicons name="chevron-down" size={16} color="#4D5A5D" />
              </TouchableOpacity>
            )}

            {isExpanded && (
              <TouchableOpacity 
                onPress={() => setIsExpanded(false)}
                className="mt-4 bg-[#E8E8E8] py-4 rounded-full flex-row items-center justify-center gap-2"
              >
                <Text className="text-[#4D5A5D] font-lexendMedium text-[14px]">
                  See less
                </Text>
                <Ionicons name="chevron-up" size={16} color="#4D5A5D" />
              </TouchableOpacity>
            )}

            {isExpanded && filteredProviders.length === 0 && (
              <View className="py-20 items-center">
                <Text className="text-[#8B8B8B] font-lexendRegular">No providers found for this filter.</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </BottomSheet>
  );
}
