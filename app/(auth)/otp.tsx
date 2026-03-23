import { ScreenBackground } from "@/components/ScreenBackground";
import Container from "@/components/shared/container";
import { ControlledInput } from "@/components/shared/controlledInput";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { OtpInput } from "@/components/shared/OtpInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { otpSchema } from "@/utils/validation";
import { useVerifyEmail, useResendOtp } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";

interface OtpFormData {
  otp: string;
}

export default function Otp() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [timer, setTimer] = useState(59);
  const { showSnackbar } = useSnackbar();
  const verifyEmail = useVerifyEmail();
  const resendOtp = useResendOtp();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otp = watch("otp");
  const isButtonDisabled = otp.length < 5 || verifyEmail.isPending;

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const onSubmit = (data: OtpFormData) => {
    verifyEmail.mutate({ email: email!, otp: data.otp }, {
      onSuccess: () => {
        showSnackbar({
          type: "success",
          message: "Email verified!",
          description: "Now set your account password.",
        });
        router.push({
          pathname: "/(auth)/password",
          params: { email, otp: data.otp },
        });
      },
      onError: (error: any) => {
        showSnackbar({
          type: "error",
          message: "Verification failed",
          description: error.response?.data?.message || "Invalid OTP code. Please try again.",
        });
      },
    });
  };

  const handleResend = () => {
    if (timer === 0 && !resendOtp.isPending) {
      resendOtp.mutate({ email: email!, reason: "signup" }, {
        onSuccess: () => {
          setTimer(59);
          showSnackbar({
            type: "success",
            message: "OTP Resent",
            description: "A new code has been sent to your email.",
          });
        },
        onError: (error: any) => {
          showSnackbar({
            type: "error",
            message: "Failed to resend OTP",
            description: error.response?.data?.message || "Please try again later.",
          });
        },
      });
    }
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
          <Text className="text-white text-[32px] font-lexendBold">
            Verify Email
          </Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-[16px] mt-2 leading-6">
            We just sent 5-digit code to {email || "your email"}, enter it below:
          </Text>

          <View className="mt-5">
            <Text className="text-[#32717B] font-lexendRegular text-[12px] mb-2">
              Code
            </Text>
            <Controller
              control={control}
              name="otp"
              render={({ field: { onChange, value } }) => (
                <OtpInput value={value} onChange={onChange} length={5} />
              )}
            />
          </View>

          <View className="mt-10">
            <Pressable
              disabled={isButtonDisabled}
              onPress={handleSubmit(onSubmit)}
              className={`w-[366px] h-[50px] rounded-full items-center justify-center active:opacity-90 ${isButtonDisabled ? "bg-[#09515D]" : "bg-[#29D7DE]"}`}
            >
              {verifyEmail.isPending ? (
                <ActivityIndicator color="#00343F" />
              ) : (
                <Text className="font-lexendBold text-[16px] text-[#00343F]">
                  Verify Email
                </Text>
              )}
            </Pressable>
          </View>

          <View className="mt-6 items-center">
            <Text className="text-[#7BA0A3] font-lexendRegular text-[16px]">
             Didn't get code?{' '}
              <Text
                onPress={handleResend}
                className={`text-[#FDEF56] font-lexendSemiBold ${timer > 0 ? "opacity-50" : ""}`}
              >
                {resendOtp.isPending ? "Sending..." : timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
              </Text>
            </Text>
          </View>
        </View>
      </Container>
    </ScreenBackground>
  );
}
