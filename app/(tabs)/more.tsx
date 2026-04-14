import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout, useDeleteAccount, useUpdateProfile } from "@/hooks/useAuth";
import CurrencySelectionSheet, {
  CURRENCIES,
} from "@/components/sheets/CurrencySelectionSheet";
import React, { useState } from "react";
import BookIcon from "@/assets/more/book.svg";
import CoinStack from "@/assets/more/coinstack.svg";
import Headset from "@/assets/more/headphones.svg";
import Command from "@/assets/more/command.svg";
import HelpIcon from "@/assets/more/help-circle.svg";
import KeyIcon from "@/assets/more/key.svg";
import Logout from "@/assets/more/logout.svg";
import Translate from "@/assets/more/translate.svg";
import Inbox from "@/assets/more/inbox.svg";
import { LoadingModal } from "@/components/ui/LoadingModal";

interface SettingItemProps {
  icon: React.FC<any>;
  label: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
}

function SettingItem({
  icon: Icon,
  label,
  value,
  onPress,
  isLast,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between py-4 ${
        !isLast ? "border-b border-[#F0F0F0]" : ""
      }`}
      onPress={onPress}
    >
      <View className="flex-row items-center gap-3">
        <Icon width={18} height={18} />
        <Text className="text-[#001A1F] text-[14px] font-lexendRegular">
          {label}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        {value && (
          <Text className="text-[#00AEB5] text-[12px] font-lexendRegular">
            {value}
          </Text>
        )}
        <Ionicons name="chevron-forward" size={16} color="#7BA0A3" />
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

  const currentCurrency =
    CURRENCIES.find((c) => c.code === user?.preferredCurrency) || CURRENCIES[0];

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
      ],
    );
  };

  return (
    <View className="flex-1 bg-[#F0F0F0] mb-20">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 60, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[#00343F] text-[26px] font-lexendMedium mb-6">
          More
        </Text>

        {/* Profile Card */}
        <TouchableOpacity className="bg-[#ECE6B7] rounded-[8px] p-4 flex-row items-center justify-between mb-8 border border-[#F8E761]">
          <View className="flex-row items-center gap-4 flex-1 mr-2">
            <View>
              <View className="w-[64px] h-[64px] rounded-full bg-[#F4EBFF] items-center justify-center border-2 border-[#F4EBFF] overflow-hidden">
                <View className="bg-white w-full h-full items-center justify-center">
                  <Text className="text-[#006C70] text-[24px] font-lexendBold">
                    {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
                  </Text>
                </View>
              </View>
              <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#22C55E] border-2 border-[#FEF9C3]" />
            </View>
            <View className="flex-1">
              <Text className="text-[#00343F] text-[14px] font-lexendMedium">
                {user?.name || ""}
              </Text>
              <Text
                className="text-[#00343F] text-[16px] font-lexendBold"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user?.preferredName || ""}
              </Text>
              <View className="bg-[#29D7DE] px-2 py-2 rounded-[8px] mt-1 self-start">
                <Text className="text-[#00343F] text-[12px] font-lexendRegular">
                  userID: {user?.id?.slice(-8) || ""}
                </Text>
              </View>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color="#7BA0A3"
            opacity={0.5}
          />
        </TouchableOpacity>

        {/* SETTINGS */}
        <Text className="text-[#6C6C70] text-[14px] font-lexendMedium mb-2 px-1">
          SETTINGS
        </Text>
        <View className="bg-white rounded-[16px] px-4 mb-8">
          <SettingItem icon={KeyIcon} label="Change Password" />
          <SettingItem icon={Inbox} label="Email Subscriptions" />
          <SettingItem
            icon={CoinStack}
            label="Currency"
            value={`${currentCurrency.code} [ ${currentCurrency.symbol} ]`}
            onPress={() => setShowCurrencySheet(true)}
          />
          <SettingItem
            icon={Translate}
            label="Language"
            value="English"
            isLast={true}
          />
        </View>

        {/* SUPPORT */}
        <Text className="text-[#6C6C70] text-[14px] font-lexendMedium mb-2 px-1">
          SUPPORT
        </Text>
        <View className="bg-white rounded-[16px] px-4 mb-8">
          <SettingItem icon={Headset} label="Contact Us" />
          <SettingItem icon={HelpIcon} label="FAQ" />
          <SettingItem icon={BookIcon} label="Terms & Policy" />
          <SettingItem icon={Command} label="Community" isLast={true} />
        </View>

        {/* YOUR ACCOUNT */}
        <Text className="text-[#6C6C70] text-[14px] font-lexendMedium mb-2 px-1">
          YOUR ACCOUNT
        </Text>
        <View className="bg-white rounded-[16px] px-4 mb-8">
          <SettingItem icon={Logout} label="Logout" onPress={handleLogout} />
          <SettingItem
            icon={HelpIcon}
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

      <LoadingModal
        visible={logout.isPending || deleteAccount.isPending}
        message={logout.isPending ? "Logging out..." : "Deleting account..."}
      />
    </View>
  );
}
