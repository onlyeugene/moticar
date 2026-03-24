import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { ScreenBackground } from "@/components/ScreenBackground";
import Container from "@/components/shared/container";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ControlledInput } from "@/components/shared/controlledInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { passwordSchema } from "@/utils/validation";
import { useSetPassword } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthState } from "@/types/auth";
import DoneIcon from "@/assets/icons/done.svg";

const schema = z.object({
  password: passwordSchema,
});

interface PasswordFormData {
  password: string;
}

export default function Password() {
  const { email, otp } = useLocalSearchParams<{ email: string; otp: string }>();
  const { showSnackbar } = useSnackbar();
  const setPassword = useSetPassword();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
    },
  });

  const password = watch("password");

  // Validation checks
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthCount = [hasMinLength, hasNumber, hasSymbol].filter(
    Boolean,
  ).length;
  const isButtonDisabled = strengthCount < 3 || setPassword.isPending;

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

  const user = useAuthStore((state) => state.user);
  const onSubmit = (data: PasswordFormData) => {
    setPassword.mutate(
      { 
        email: email!, 
        otp: otp!, 
        password: data.password,
        preferredCurrency: user?.preferredCurrency,
        country: user?.country
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
        },
        onError: (error: any) => {
          showSnackbar({
            type: "error",
            message: "Failed to set password",
            description:
              error.response?.data?.message || "Please try again later.",
          });
        },
      },
    );
  };

  if (showSuccess) {
    return (
      <ScreenBackground>
        <Container>
          <View className="flex-1 items-center justify-center -mt-10">
            <View className="w-24 h-24 items-center justify-center mb-10">
              <DoneIcon />
            </View>

            <Text className="text-white text-[26px] font-lexendBold text-center mb-4">
              Your account {"\n"} was successfully created!
            </Text>

            <Text className="text-[#9BBABB] font-lexendRegular text-[14px] text-center mb-12">
              Only one click to explore online education.
            </Text>

            <Pressable
              onPress={() => router.replace("/(auth)/login")}
              className="w-full h-[50px] bg-[#29D7DE] rounded-full items-center justify-center active:opacity-90"
            >
              <Text className="font-lexendBold text-[16px] text-[#00343F]">
                Log in
              </Text>
            </Pressable>
          </View>
        </Container>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <Container>
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        </View>
        <View className="mt-10">
          <Text className="text-white text-[26px] font-lexendBold">
            Enter Password
          </Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-[14px] mt-2 leading-6">
            We just sent 5-digit code to {email}, {"\n"}enter it below:
          </Text>
        </View>

        <View className="mt-10 w-full">
          <ControlledInput
            placeholder="Password"
            secureTextEntry
            showPasswordToggle
            name="password"
            control={control}
            placeholderClassName="text-[#7BA0A3]"
            containerClassName="border-[#1A8798]"
            className="px-2 text-white"
          />

          <Text className="text-[#5E7A7C] font-lexendMedium text-[14px] mt-">
            Must be at least 8 characters
          </Text>

          {/* Strength Bar */}
          <View className="h-2 bg-[#204749] w-full rounded-full mt-3 overflow-hidden">
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
              <Text
                className={`${hasMinLength ? "text-[#7BA0A3]" : "text-[#7BA0A3]"} font-lexendRegular text-[14px]`}
              >
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
              <Text
                className={`${hasNumber ? "text-[#7BA0A3]" : "text-[#7BA0A3]"} font-lexendRegular text-[14px]`}
              >
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
              <Text
                className={`${hasSymbol ? "text-[#7BA0A3]" : "text-[#7BA0A3]"} font-lexendRegular text-[14px]`}
              >
                one symbol minimum
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-16">
          <Pressable
            disabled={isButtonDisabled}
            onPress={handleSubmit(onSubmit)}
            className={`w-full h-[50px] rounded-full items-center justify-center active:opacity-90 ${isButtonDisabled ? "bg-[#09515D]/60" : "bg-[#29D7DE]"}`}
          >
            {setPassword.isPending ? (
              <ActivityIndicator color="#00343F" />
            ) : (
              <Text className="font-lexendBold text-[16px] text-[#00343F]">
                Next
              </Text>
            )}
          </Pressable>
        </View>
      </Container>
    </ScreenBackground>
  );
}
