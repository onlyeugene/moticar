import Container from "@/components/shared/container";
import { ControlledInput } from "@/components/shared/controlledInput";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useForgotPassword } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { emailSchema } from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
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
  email: emailSchema,
});

type ForgotPasswordFormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const { showSnackbar } = useSnackbar();
  const forgotPassword = useForgotPassword();

  const {
    control,
    handleSubmit,
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");
  const isButtonDisabled = !email || forgotPassword.isPending;

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          showSnackbar({
            type: "success",
            message: "OTP Sent",
            description: "A reset code has been sent to your email.",
          });
          router.replace({
            pathname: "/(auth)/forgot-password-otp",
            params: { email: data.email },
          });
        },
        onError: (error: any) => {
          showSnackbar({
            type: "error",
            message: "Request failed",
            description:
              error.response?.data?.message ||
              "Could not send reset code. Please check your email and try again.",
          });
        },
      },
    );
  };

  return (
    <ScreenBackground>
      <Container>
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        </View>

        <View className="mt-8">
          <Text className="text-white text-[1.625rem] font-lexendMedium leading-10">
            Reset Password
          </Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-[0.875rem] mt-2 leading-6">
            Enter the email associated with your moticar account
          </Text>
        </View>

        <View className="mt-7">
             <ControlledInput
            control={control}
            name="email"
            leftIcon="mail-outline"
            placeholder="Enter your email address"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!forgotPassword.isPending}
          />
        </View>

        <View className="flex-1" />

        <View className="mb-10">
          <Pressable
            disabled={isButtonDisabled}
            onPress={handleSubmit(onSubmit)}
            className={`w-full h-[54px] rounded-full items-center justify-center active:opacity-90 ${isButtonDisabled ? "bg-[#09515D]/60" : "bg-[#29D7DE]"}`}
          >
            {forgotPassword.isPending ? (
              <ActivityIndicator color="#00343F" />
            ) : (
              <Text className="font-lexendBold text-[1rem] text-[#00343F]">
                Reset password
              </Text>
            )}
          </Pressable>
        </View>
      </Container>
    </ScreenBackground>
  );
}
