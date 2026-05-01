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
import CurrencySelectionSheet from "@/components/sheets/CurrencySelectionSheet";
import LanguageSelectionSheet from "@/components/sheets/LanguageSelectionSheet";
import EditProfileSheet from "@/components/sheets/EditProfileSheet";
import { CURRENCIES, LANGUAGES } from "@/utils/currency";
import React, { useState } from "react";
import { router } from "expo-router";
import BookIcon from "@/assets/more/book.svg";
import CoinStack from "@/assets/more/coinstack.svg";
import Headset from "@/assets/more/headphones.svg";
import Command from "@/assets/more/command.svg";
import HelpIcon from "@/assets/more/help-circle.svg";
import KeyIcon from "@/assets/more/key.svg";
import Logout from "@/assets/more/logout.svg";
import Translate from "@/assets/more/translate.svg";
import Website from "@/assets/icons/web.svg";
import External from "@/assets/icons/external.svg";
import Linktree from "@/assets/icons/linktree.svg";
import Inbox from "@/assets/more/inbox.svg";
import { LoadingModal } from "@/components/ui/LoadingModal";

interface SettingItemProps {
  icon: React.FC<any>;
  label: string;
  value?: string;
  ValueIcon?: React.FC<any>;
  onPress?: () => void;
  isLast?: boolean;
  choose? : boolean
}

function SettingItem({
  icon: Icon,
  label,
  value,
  ValueIcon,
  onPress,
  isLast,
  choose
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
        <Text className="text-[#001A1F] text-[0.875rem] font-lexendRegular">
          {label}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        {value && (
          <Text className="text-[#00AEB5] text-[0.75rem] font-lexendRegular">
            {value}
          </Text>
        )}
        {ValueIcon && <ValueIcon width={18} height={18} />}
        {!choose ? <Ionicons name="chevron-forward" size={16} color="#7BA0A3" /> : <External width={18} height={18} />}
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
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [showProfileSheet, setShowProfileSheet] = useState(false);

  const currentCurrency =
    CURRENCIES.find((c) => c.value === user?.preferredCurrency) ||
    CURRENCIES.find((c) => c.value === "USD") ||
    CURRENCIES[0];

  const currentLanguage =
    LANGUAGES.find((l) => l.value === user?.preferredLanguage) ||
    LANGUAGES.find((l) => l.value === "en-GB") ||
    LANGUAGES[0];

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
        <Text className="text-[#00343F] text-[1.625rem] font-lexendMedium mb-6">
          More
        </Text>

        {/* Profile Card */}
        <TouchableOpacity onPress={() => setShowProfileSheet(true)} className="bg-[#ECE6B7] rounded-[8px] p-4 flex-row items-center justify-between mb-8 border border-[#F8E761]">
          <View className="flex-row items-center gap-4 flex-1 mr-2">
            <View>
              <View className="w-[64px] h-[64px] rounded-full bg-[#F4EBFF] items-center justify-center border-2 border-[#F4EBFF] overflow-hidden">
                <View className="bg-white w-full h-full items-center justify-center">
                  {user?.avatar ? (
                    <Image 
                      source={{ uri: user.avatar }} 
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <Text className="text-[#006C70] text-[1.5rem] font-lexendBold">
                      {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
                    </Text>
                  )}
                </View>
              </View>
              <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#22C55E] border-2 border-[#FEF9C3]" />
            </View>
            <View className="flex-1">
              <Text className="text-[#00343F] text-[0.875rem] font-lexendMedium">
                {user?.name || ""}
              </Text>
              <Text
                className="text-[#00343F] text-[1rem] font-lexendBold"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user?.username || ""}
              </Text>
              <View className="bg-[#29D7DE] px-2 py-2 rounded-[8px] mt-1 self-start">
                <Text className="text-[#00343F] text-[0.75rem] font-lexendRegular">
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
        <Text className="text-[#6C6C70] text-[0.875rem] font-lexendMedium mb-2 px-1">
          SETTINGS
        </Text>
        <View className="bg-white rounded-[16px] px-4 mb-8">
          <SettingItem 
            icon={KeyIcon} 
            label="Change Password" 
            onPress={() => router.push("/screens/settings/change-password")}
          />
          <SettingItem 
            icon={Inbox} 
            label="Email Subscriptions" 
            onPress={() => router.push("/screens/settings/email-subscriptions")}
          />
          <SettingItem
            icon={CoinStack}
            label="Currency"
            value={`${currentCurrency.value} [ ${currentCurrency.symbol} ]`}
            onPress={() => setShowCurrencySheet(true)}
          />
          <SettingItem
            icon={Translate}
            label="Language"
            value={currentLanguage.label}
            ValueIcon={currentLanguage.flag as React.FC<any>}
            onPress={() => setShowLanguageSheet(true)}
            isLast={true}
          />
        </View>

        {/* SUPPORT */}
        <Text className="text-[#6C6C70] text-[0.875rem] font-lexendMedium mb-2 px-1">
          SUPPORT
        </Text>
        <View className="bg-white rounded-[16px] px-4 mb-8">
          {/* <SettingItem icon={Headset} label="Contact Us" /> */}
          <SettingItem
            icon={HelpIcon}
            label="FAQ"
            onPress={() => router.push("/screens/legal/faq")}
          />
          <SettingItem
            icon={BookIcon}
            label="Terms of Use"
            onPress={() => router.push("/screens/legal/terms-and-conditions")}
          />
          {/* <SettingItem
            icon={BookIcon}
            label="Membership Terms"
            onPress={() => router.push("/screens/legal/membership-terms")}
          /> */}
          {/* <SettingItem
            icon={BookIcon}
            label="Privacy Policy"
            onPress={() => router.push("/screens/legal/privacy-policy")}
          /> */}
          <SettingItem icon={Command} label="Community" choose={true}/>
          <SettingItem icon={Website} label="Website" isLast={true} choose={true}/>
        </View>

        {/* YOUR ACCOUNT */}
        <Text className="text-[#6C6C70] text-[0.875rem] font-lexendMedium mb-2 px-1">
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

        <View className="items-center justify-center gap-3">
            <Text className="text-[14px] font-lexendBold text-[#667085]">Join our socials</Text>
            <Linktree />
        </View>
      </ScrollView>

      {/* Sheets */}
      <CurrencySelectionSheet
        visible={showCurrencySheet}
        onClose={() => setShowCurrencySheet(false)}
        currentCurrency={user?.preferredCurrency}
        onSave={(code) => {
          updateProfile.mutate({ 
            preferredCurrency: code,
            hasManuallySetPreferences: true
          });
          setShowCurrencySheet(false);
        }}
      />

      <LanguageSelectionSheet
        visible={showLanguageSheet}
        onClose={() => setShowLanguageSheet(false)}
        currentLanguage={user?.preferredLanguage}
        onSave={(code) => {
          updateProfile.mutate({ 
            preferredLanguage: code,
            hasManuallySetPreferences: true
          });
          setShowLanguageSheet(false);
        }}
      />

      <EditProfileSheet
        visible={showProfileSheet}
        onClose={() => setShowProfileSheet(false)}
      />

      <LoadingModal
        visible={logout.isPending || deleteAccount.isPending}
        message={logout.isPending ? "Logging out..." : "Deleting account..."}
      />
    </View>
  );
}
