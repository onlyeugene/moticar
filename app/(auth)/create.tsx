import Container from "@/components/shared/container";
import { ControlledInput } from "@/components/shared/controlledInput";
import CurrencySelector from "@/components/shared/CurrencySelector";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { SocialAuthButtons } from "@/components/ui/SocialAuthButtons";
import { useSignup } from "@/hooks/useAuth";
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
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";

const schema = z.object({
  email: emailSchema,
});

interface CreateAccountFormData {
  email: string;
}

export default function Login() {
  const { showSnackbar } = useSnackbar();
  const signup = useSignup();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const [isAgreed, setIsAgreed] = React.useState(false);
  const email = watch("email");
  const isButtonDisabled = !email || !isAgreed || signup.isPending;

  const onSubmit = (data: CreateAccountFormData) => {
    signup.mutate(data, {
      onSuccess: () => {
        showSnackbar({
          type: "success",
          message: "Account created!",
          description: "We've sent an OTP to your email.",
        });
        router.push({
          pathname: "/(auth)/otp",
          params: { email: data.email },
        });
      },
      onError: (error: any) => {
        showSnackbar({
          type: "error",
          message: "Signup failed",
          description:
            error.response?.data?.message ||
            "Something went wrong. Please try again.",
        });
      },
    });
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
          <Text className="text-white text-[32px] font-lexendBold">
            Create an account
          </Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-[16px] mt-2 leading-6">
            Start by adding the details of your personal car for a{"\n"}rich
            user experience
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
            placeholder="Enter your preferred email address"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!signup.isPending}
          />
        </View>

        <Pressable
          onPress={() => setIsAgreed(!isAgreed)}
          className={`mt-2 flex-row items-center ${signup.isPending ? "opacity-50" : ""}`}
          disabled={signup.isPending}
        >
          <View
            className={`w-6 h-6 rounded-md items-center justify-center ${isAgreed ? "bg-[#43E4E9]" : "border-2 border-[#43E4E9]"}`}
          >
            {isAgreed && (
              <Ionicons name="checkmark" size={16} color="#00232A" />
            )}
          </View>
          <Text className="text-white font-lexendRegular text-[14px] ml-3">
            I am over 18 years old
          </Text>
        </Pressable>

        <View className="mt-10">
          <Pressable
            disabled={isButtonDisabled}
            onPress={handleSubmit(onSubmit)}
            className={`w-[366px] h-[50px] rounded-full items-center justify-center active:opacity-90 ${isButtonDisabled ? "bg-[#09515D]" : "bg-[#43E4E9]"}`}
          >
            {signup.isPending ? (
              <ActivityIndicator color="#00343F" />
            ) : (
              <Text className={`font-lexendBold text-[16px] text-[#00343F]`}>
                Signup
              </Text>
            )}
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
            disabled={signup.isPending}
          />
        </View>

        <View className="flex-1" />

        <View className="mt-10 px-10 mb-9">
          <Text className="text-[#31828E] text-center font-lexendMedium text-[14px] ">
            By signing up, you accept moticar’s{" "}
            <Text className="text-[#FDEF56]">Terms of Service</Text> and
            <Text className="text-[#FDEF56]">Membership Terms</Text>, and
            acknowledge the{" "}
            <Text className="text-[#FDEF56]">Privacy Policy</Text>
          </Text>

          <View className="flex-row gap-2 items-center justify-center mt-6">
            <Text className="text-[#FFFFFF] text-[16px] font-lexendMedium">
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              disabled={signup.isPending}
            >
              <Text
                className={`text-[#00AEB5] font-lexendBold text-[16px] ${signup.isPending ? "opacity-50" : ""}`}
              >
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    </ScreenBackground>
  );
}
