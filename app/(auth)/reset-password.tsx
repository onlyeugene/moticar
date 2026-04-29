import Container from "@/components/shared/container";
import { ControlledInput } from "@/components/shared/controlledInput";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useResetPassword } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { passwordSchema } from "@/utils/validation";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DoneIcon from "@/assets/icons/done.svg";

import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  Dimensions,
} from "react-native";
import * as z from "zod";

const { width } = Dimensions.get("window");

const schema = z.object({
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const { email, otp } = useLocalSearchParams<{ email: string; otp: string }>();
  const { showSnackbar } = useSnackbar();
  const resetPassword = useResetPassword();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Validation checks
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthCount = [hasMinLength, hasNumber, hasSymbol].filter(Boolean).length;
  const isButtonDisabled = strengthCount < 3 || password !== confirmPassword || resetPassword.isPending;

  const getStrengthColor = () => {
    if (strengthCount === 0) return "bg-[#498200]";
    if (strengthCount === 1) return "bg-[#D62C01]";
    if (strengthCount === 2) return "bg-[#FF9900]";
    return "bg-[#498200]";
  };

  const getStrengthWidth = () => {
    if (strengthCount === 0) return "w-0";
    if (strengthCount === 1) return "w-1/3";
    if (strengthCount === 2) return "w-2/3";
    return "w-full";
  };

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword.mutate(
      { 
        email: email!, 
        otp: otp!, 
        newPassword: data.password 
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
        },
        onError: (error: any) => {
          showSnackbar({
            type: "error",
            message: "Reset failed",
            description:
              error.response?.data?.message ||
              "Unexpected error occurred. Please try again.",
          });
        },
      },
    );
  };

  if (showSuccess) {
    return (
      <ScreenBackground>
        <Container>
          <View className="flex-1 items-center justify-center">
            {/* Success Flower Logo */}
            <View className="relative w-24 h-24 items-center justify-center mb-10">
              <DoneIcon />
            </View>

            <Text className="text-white text-[26px] font-lexendBold text-center px-4 leading-9">
              Your password has been successfully reset!
            </Text>
            
            <Text className="text-[#9BBABB] font-lexendRegular text-[14px] text-center mt-4 px-6 leading-6">
              you can now use your new password to log back into your account
            </Text>

            <View className="mt-12 w-full px-4">
              <Pressable
                onPress={() => router.replace("/(auth)/login")}
                className="w-full h-[54px] rounded-full bg-[#29D7DE] items-center justify-center active:opacity-90"
              >
                <Text className="font-lexendBold text-[16px] text-[#00343F]">
                  Log in
                </Text>
              </Pressable>
            </View>
          </View>
        </Container>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <Container>
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <View className="flex-row items-center gap-1">
             {/* Country flag/selector placeholder if needed */}
          </View>
        </View>

        <View className="mt-8">
          <Text className="text-white text-[32px] font-lexendMedium leading-10">
            Enter New Password
          </Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-[16px] mt-2 leading-6">
            Your new password must be different from previous used passwords
          </Text>
        </View>

        <View className="mt-10 gap-6">
          <View>
            <ControlledInput
              control={control}
              name="password"
              placeholder="Password"
              secureTextEntry
              showPasswordToggle
              // rightIcon="help-circle-outline"
              editable={!resetPassword.isPending}
            />
            <Text className="text-[#5E7A7C] font-lexendMedium text-[14px] mt-2 ml-1">
              Must be at least 8 characters
            </Text>
          </View>

          <View>
            <ControlledInput
              control={control}
              name="confirmPassword"
              placeholder="Re-enter Password"
              secureTextEntry
              showPasswordToggle
              // rightIcon="help-circle-outline"
              editable={!resetPassword.isPending}
            />
            <Text className="text-[#5E7A7C] font-lexendMedium text-[14px] mt-2 ml-1">
              Must be at least 8 characters
            </Text>
          </View>
        </View>

        {/* Strength Bar */}
        <View className="h-1.5 bg-[#204749] w-full rounded-full mt-8 overflow-hidden">
          <View
            className={`h-full ${getStrengthColor()} ${getStrengthWidth()} transition-all duration-300`}
          />
        </View>

        {/* Requirements Checklist */}
        <View className="mt-6 gap-3">
          <View className="flex-row items-center gap-3">
            <View
              className={`w-5 h-5 rounded-full items-center justify-center border ${hasMinLength ? "bg-[#498200] border-[#498200]" : "border-[#7BA0A3]"}`}
            >
              {hasMinLength && (
                <Ionicons name="checkmark" size={12} color="#00232A" />
              )}
            </View>
            <Text className="text-[#7BA0A3] font-lexendRegular text-[16px]">
              8 characters minimum
            </Text>
          </View>
          
          <View className="flex-row items-center gap-3">
            <View
              className={`w-5 h-5 rounded-full items-center justify-center border ${hasNumber ? "bg-[#498200] border-[#498200]" : "border-[#7BA0A3]"}`}
            >
              {hasNumber && (
                <Ionicons name="checkmark" size={12} color="#00232A" />
              )}
            </View>
            <Text className="text-[#7BA0A3] font-lexendRegular text-[16px]">
              a number
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            <View
              className={`w-5 h-5 rounded-full items-center justify-center border ${hasSymbol ? "bg-[#498200] border-[#498200]" : "border-[#7BA0A3]"}`}
            >
              {hasSymbol && (
                <Ionicons name="checkmark" size={12} color="#00232A" />
              )}
            </View>
            <Text className="text-[#7BA0A3] font-lexendRegular text-[16px]">
              a symbol
            </Text>
          </View>
        </View>

        <View className="flex-1" />

        <View className="mb-10">
          <Pressable
            disabled={isButtonDisabled}
            onPress={handleSubmit(onSubmit)}
            className={`w-full h-[54px] rounded-full items-center justify-center active:opacity-90 ${isButtonDisabled ? "bg-[#09515D]/60" : "bg-[#29D7DE]"}`}
          >
            {resetPassword.isPending ? (
              <ActivityIndicator color="#00343F" />
            ) : (
              <Text className="font-lexendBold text-[16px] text-[#00343F]">
                Reset Password
              </Text>
            )}
          </Pressable>
        </View>
      </Container>
    </ScreenBackground>
  );
}
