import { Ionicons } from "@expo/vector-icons";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout, useDeleteAccount, useUpdateProfile } from "@/hooks/useAuth";
import CurrencySelectionSheet, { CURRENCIES } from "@/components/sheets/CurrencySelectionSheet";
import React, { useState } from "react";

interface SettingItemProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
}

function SettingItem({ icon, label, value, onPress, isLast }: SettingItemProps) {
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between py-4 ${
        !isLast ? "border-b border-[#F0F0F0]" : ""
      }`}
      onPress={onPress}
    >
      <View className="flex-row items-center gap-3">
        <Ionicons name={icon as any} size={20} color="#006C70" />
        <Text className="text-[#00343F] text-[14px] font-lexendRegular">
          {label}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        {value && (
          <Text className="text-[#00AEB5] text-[12px] font-lexendRegular">
            {value}
          </Text>
        )}
        <Ionicons name="chevron-forward" size={16} color="#ADADAD" />
      </View>
    </TouchableOpacity>
  );
}

export default function MoreScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const deleteAccount = useDeleteAccount();
  const updateProfile = useUpdateProfile();
  const [showCurrencySheet, setShowCurrencySheet] = useState(false);

  const currentCurrency = CURRENCIES.find(
    (c) => c.code === user?.preferredCurrency
  ) || CURRENCIES[0];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => logout.mutate() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent and cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAccount.mutate(),
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#F0F0F0] mb-20">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 60, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[#00343F] text-[28px] font-lexendBold mb-6">
          More
        </Text>

        {/* Profile Card */}
        <TouchableOpacity className="bg-[#FEF9C3] rounded-[16px] p-4 flex-row items-center justify-between mb-8 border border-[#FDE68A]">
          <View className="flex-row items-center gap-4">
            <View>
              <View className="w-[64px] h-[64px] rounded-full bg-[#E5E7EB] items-center justify-center border-2 border-white overflow-hidden">
                <View className="bg-[#29D7DE]/20 w-full h-full items-center justify-center">
                  <Text className="text-[#006C70] text-[24px] font-lexendBold">
                    {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
                  </Text>
                </View>
              </View>
              <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#22C55E] border-2 border-[#FEF9C3]" />
            </View>
            <View>
              <Text className="text-[#00343F] text-[14px] font-lexendRegular">
                {user?.preferredName || user?.name || "Bamidele Akeem"}
              </Text>
              <Text className="text-[#00343F] text-[20px] font-lexendBold">
                {user?.username || "Keemson"}
              </Text>
              <View className="bg-[#29D7DE] px-2 py-0.5 rounded-md mt-1 self-start">
                <Text className="text-[#00343F] text-[10px] font-lexendRegular">
                  userID: {user?.id?.slice(-8) || "123324244"}
                </Text>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#00343F" opacity={0.5} />
        </TouchableOpacity>

        {/* SETTINGS */}
        <Text className="text-[#879090] text-[12px] font-lexendBold tracking-widest mb-2 px-1">
          SETTINGS
        </Text>
        <View className="bg-white rounded-[16px] px-4 mb-8">
          <SettingItem icon="key-outline" label="Change Password" />
          <SettingItem icon="mail-outline" label="Email Subscriptions" />
          <SettingItem
            icon="cash-outline"
            label="Currency"
            value={`${currentCurrency.code} [ ${currentCurrency.symbol} ]`}
            onPress={() => setShowCurrencySheet(true)}
          />
          <SettingItem
            icon="language-outline"
            label="Language"
            value="English"
            isLast={true}
          />
        </View>

        {/* SUPPORT */}
        <Text className="text-[#879090] text-[12px] font-lexendBold tracking-widest mb-2 px-1">
          SUPPORT
        </Text>
        <View className="bg-white rounded-[16px] px-4 mb-8">
          <SettingItem icon="headset-outline" label="Contact Us" />
          <SettingItem icon="help-circle-outline" label="FAQ" />
          <SettingItem icon="document-text-outline" label="Terms & Policy" />
          <SettingItem icon="people-outline" label="Community" isLast={true} />
        </View>

        {/* YOUR ACCOUNT */}
        <Text className="text-[#879090] text-[12px] font-lexendBold tracking-widest mb-2 px-1">
          YOUR ACCOUNT
        </Text>
        <View className="bg-white rounded-[16px] px-4 mb-8">
          <SettingItem
            icon="log-out-outline"
            label="Logout"
            onPress={handleLogout}
          />
          <SettingItem
            icon="alert-circle-outline"
            label="Delete Account"
            onPress={handleDeleteAccount}
            isLast={true}
          />
        </View>
      </ScrollView>

      {/* Sheets */}
      <CurrencySelectionSheet
        visible={showCurrencySheet}
        onClose={() => setShowCurrencySheet(false)}
        currentCurrency={user?.preferredCurrency}
        onSelect={(code) => {
          updateProfile.mutate({ preferredCurrency: code });
          setShowCurrencySheet(false);
        }}
      />
    </View>
  );
}
