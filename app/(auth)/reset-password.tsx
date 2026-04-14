import Container from "@/components/shared/container";
import { ControlledInput } from "@/components/shared/controlledInput";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useResetPassword } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { passwordSchema } from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";
import * as z from "zod";

const schema = z.object({
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const { email, otp } = useLocalSearchParams<{ email: string; otp: string }>();
  const { showSnackbar } = useSnackbar();
  const resetPassword = useResetPassword();

  const {
    control,
    handleSubmit,
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const isButtonDisabled = !password || !confirmPassword || resetPassword.isPending;

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword.mutate(
      { 
        email: email!, 
        otp: otp!, 
        newPassword: data.password 
      },
      {
        onSuccess: () => {
          showSnackbar({
            type: "success",
            message: "Success!",
            description: "Your password has been reset successfully. Please sign in with your new password.",
          });
          // Redirect to login - using absolute path to be safe
          router.replace("/(auth)/login");
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

  return (
    <ScreenBackground>
      <Container>
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        </View>

        <View className="mt-10">
          <Text className="text-white text-[32px] font-lexendMedium">
            Reset Password
          </Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-[16px] mt-2 leading-6">
            Please enter your new password below.
          </Text>
        </View>

        <View className="mt-10">
          <Text className="text-[#32717B] font-lexendMedium text-[14px] mb-3">
            New Password
          </Text>
          <ControlledInput
            control={control}
            name="password"
            placeholder="Enter your new password"
            secureTextEntry
            showPasswordToggle
            editable={!resetPassword.isPending}
          />
        </View>

        <View className="mt-4">
          <Text className="text-[#32717B] font-lexendMedium text-[14px] mb-3">
            Confirm Password
          </Text>
          <ControlledInput
            control={control}
            name="confirmPassword"
            placeholder="Confirm your new password"
            secureTextEntry
            showPasswordToggle
            editable={!resetPassword.isPending}
          />
        </View>

        <View className="mt-10">
          <Pressable
            disabled={isButtonDisabled}
            onPress={handleSubmit(onSubmit)}
            className={`w-full h-[50px] rounded-full items-center justify-center active:opacity-90 ${isButtonDisabled ? "bg-[#09515D]/60" : "bg-[#29D7DE]"}`}
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
