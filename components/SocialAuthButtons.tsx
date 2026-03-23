import React from "react";
import { View, Text, Pressable } from "react-native";
import AppleIcon from "../assets/icons/apple.svg";
import GoogleIcon from "../assets/icons/google.svg";
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
}: SocialAuthProps) => {
  return (
    <View className="w-full px-5">
      {/* SSO Buttons Row */}
      <View className="flex-row items-center justify-center w-full gap-4 mb-4">
        <Pressable
          style={{ borderColor: appleBorder , backgroundColor: appleBg}}
          className="flex-1 items-center justify-center border border-[#143E44] h-12 rounded-full active:opacity-80 shadow-sm"
          onPress={() => onAuth("apple")}
        >
          <Ionicons name="logo-apple" size={24} color={appleIconColor} />
        </Pressable>

        <Pressable
          style={{ borderColor: googleBorder, backgroundColor: googleBg }}
          className="flex-1 items-center justify-center border border-[#143E44] h-12 rounded-full active:opacity-80 shadow-sm"
          onPress={() => onAuth("google")}
        >
          <GoogleIcon width={22} height={22} />
        </Pressable>
      </View>

      {/* Email Button */}
      {showEmail && (
        <Pressable 
          className="w-full bg-white h-12 rounded-full items-center justify-center active:opacity-90 shadow-md"
          onPress={() => router.push('/(auth)/create')}
        >
          <Text className="text-[#1E293B] font-lexendMedium text-base">
            Sign up with Email
          </Text>
        </Pressable>
      )}
    </View>
  );
};
