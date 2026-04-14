import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import GoogleIcon from "@/assets/icons/google.svg";
import MailIcon from "@/assets/icons/mail.svg";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SocialAuthProps } from "@/types/ui";

export const SocialAuthButtons = ({ 
  onAuth = (type: string) => console.log(`${type} pressed`),
  showEmail = true,
  appleBg = "white",
  googleBg = "white",
  appleBorder = "#143E44",
  googleBorder = "#143E44",
  appleIconColor = "black",
  googleIconColor = "black",
  disabled = false,
}: SocialAuthProps) => {
  const isAndroid = Platform.OS === "android";

  return (
    <View className={`w-full ${disabled ? "opacity-50" : ""}`}>
      {/* SSO Buttons Row */}
      <View className="flex-row items-center justify-center w-full gap-4 mb-4">
        {!isAndroid && (
          <Pressable
            style={{ borderColor: appleBorder, backgroundColor: appleBg }}
            className="flex-1 items-center justify-center border border-[#143E44] h-[52px] rounded-full active:opacity-80 shadow-sm"
            onPress={() => onAuth("apple")}
            disabled={disabled}
          >
            <Ionicons name="logo-apple" size={24} color={appleIconColor} />
          </Pressable>
        )}

        <Pressable
          style={{ borderColor: googleBorder, backgroundColor: googleBg }}
          className="flex-1 items-center justify-center border border-[#143E44] h-[52px] rounded-full active:opacity-80 shadow-sm"
          onPress={() => onAuth("google")}
          disabled={disabled}
        >
          <GoogleIcon width={22} height={22} />
        </Pressable>
      </View>

      {/* Email Button */}
      {showEmail && (
        <Pressable
          className="w-full bg-white h-[52px] rounded-full flex-row items-center justify-center active:opacity-90 shadow-md gap-3"
          onPress={() => router.push("/(auth)/create")}
          disabled={disabled}
        >
          <Ionicons name="mail-outline" size={24} color="black" />
          <Text className="text-[#1E293B] font-lexendSemiBold text-base">
            Sign up with Email
          </Text>
        </Pressable>
      )}
    </View>
  );
};
