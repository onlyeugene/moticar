import Container from "@/components/shared/container";
import { ControlledInput } from "@/components/shared/controlledInput";
import CurrencySelector from "@/components/shared/CurrencySelector";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { SocialAuthButtons } from "@/components/ui/SocialAuthButtons";
import { LoadingModal } from "@/components/ui/LoadingModal";
import { useLogin, useSocialLogin } from "@/hooks/useAuth";
import { useSocialAuth } from "@/hooks/useSocialAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { emailSchema, passwordSchema } from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";

const schema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

interface LoginAccountFormData {
  email: string;
  password: string;
}

export default function Login() {
  const { showSnackbar } = useSnackbar();
  const login = useLogin();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginAccountFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email");
  const password = watch("password");
  const isButtonDisabled = !email || !password || login.isPending;

  const onSubmit = (data: LoginAccountFormData) => {
    login.mutate(
      { emailOrUsername: data.email, password: data.password },
      {
        onSuccess: (data) => {
          showSnackbar({
            type: "success",
            message: "Welcome back!",
            description: "You've successfully signed in.",
          });

          if (data.user?.onboardingCompleted) {
            router.replace("/(tabs)");
          } else {
            router.replace("/(onboarding)");
          }
        },
        onError: (error: any) => {
          showSnackbar({
            type: "error",
            message: "Sign in failed",
            description:
              error.response?.data?.message ||
              "Invalid credentials. Please try again.",
          });
        },
      },
    );
  };

  const { loginWithApple, loginWithGoogle, isPending: socialPending } = useSocialAuth({
    onSuccess: (data) => {
      showSnackbar({
        type: "success",
        message: "Welcome back!",
        description: "You've successfully signed in with your social account.",
      });

      if (data.user?.onboardingCompleted) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(onboarding)");
      }
    },
    onError: (error: any) => {
      showSnackbar({
        type: "error",
        message: "Social Login Failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  const handleSocialAuth = (provider: string) => {
    if (provider === "apple") {
      loginWithApple();
    } else if (provider === "google") {
      loginWithGoogle();
    }
  };

  return (
    <ScreenBackground>
      <Container>
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <CurrencySelector variant="auth" />
        </View>
        <View className="mt-10">
          <Text className="text-white text-[32px] font-lexendMedium">
            Sign in
          </Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-[16px] mt-2 leading-6">
            Start by adding the details of your personal car for a rich user
            experience
          </Text>
        </View>

        <View className="mt-10">
          <Text className="text-[#32717B] font-lexendMedium text-[14px] mb-3">
            Email Address
          </Text>
          <ControlledInput
            control={control}
            name="email"
            leftIcon="mail-outline"
            placeholder="Enter your email address"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!login.isPending}
          />
        </View>

        <View className="mt-2">
          <Text className="text-[#32717B] font-lexendMedium text-[14px] mb-3">
            Password
          </Text>
          <ControlledInput
            placeholder="Enter your password"
            secureTextEntry
            name="password"
            control={control}
            placeholderClassName="text-[#7BA0A3]"
            editable={!login.isPending}
          />
        </View>

        <View className="mt-4">
          <Pressable
            disabled={isButtonDisabled}
            onPress={handleSubmit(onSubmit)}
            className={`w-[366px] h-[50px] rounded-full items-center justify-center active:opacity-90 ${isButtonDisabled ? "bg-[#09515D]/60" : "bg-[#29D7DE]"}`}
          >
            {login.isPending ? (
              <ActivityIndicator color="#00343F" />
            ) : (
              <Text className={`font-lexendBold text-[16px] text-[#00343F]`}>
                Sign in
              </Text>
            )}
          </Pressable>
        </View>

        <View className="mt-5">
          <Pressable disabled={login.isPending}>
            <Text
              className={`text-[#9BBABB] font-lexendMedium text-[14px] text-center ${login.isPending ? "opacity-50" : ""}`}
            >
              Forgot Password?
            </Text>
          </Pressable>
        </View>

        <View className="mt-10 flex-row items-center justify-center gap-2">
          <View className="border-b border-[#204749] flex-1" />
          <Text className="text-[#119EAC] font-lexendMedium text-[12px] border p-3 rounded-full border-[#204749]">
            OR
          </Text>
          <View className="border-b border-[#204749] flex-1" />
        </View>

        <View className="mt-10">
          <SocialAuthButtons
            showEmail={false}
            appleBg="transparent"
            appleBorder="#09515D"
            googleBg="transparent"
            googleBorder="#09515D"
            appleIconColor="white"
            onAuth={handleSocialAuth}
            disabled={login.isPending || socialPending}
          />
        </View>

        <View className="flex-1" />

        <View className="mt-10 px-10 mb-9">
          <View className="flex-row gap-2 items-center justify-center mt-6">
            <Text className="text-[#FFFFFF] text-[16px] font-lexendMedium">
              New to moticar?
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/create")}
              disabled={login.isPending}
            >
              <Text
                className={`text-[#00AEB5] font-lexendBold text-[16px] ${login.isPending ? "opacity-50" : ""}`}
              >
                Create an account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Container>
      <LoadingModal visible={socialPending} message="Signing you in..." />
    </ScreenBackground>
  );
}
