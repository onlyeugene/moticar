import Container from "@/components/shared/container";
import { OtpInput } from "@/components/shared/OtpInput";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useResendOtp } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { otpSchema } from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface OtpFormData {
  otp: string;
}

export default function ForgotPasswordOtp() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [timer, setTimer] = useState(59);
  const { showSnackbar } = useSnackbar();
  const resendOtp = useResendOtp();

  const {
    control,
    handleSubmit,
    watch,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otp = watch("otp");
  const isButtonDisabled = otp.length < 5;

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
    // For forgot password, we proceed to reset screen where the actual verification happens 
    // along with the password reset (per backend API).
    router.replace({
      pathname: "/(auth)/reset-password",
      params: { email, otp: data.otp },
    });
  };

  const handleResend = () => {
    if (timer === 0 && !resendOtp.isPending) {
      resendOtp.mutate(
        { email: email!, reason: "forgot-password" },
        {
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
              description:
                error.response?.data?.message || "Please try again later.",
            });
          },
        },
      );
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
          <Text className="text-white text-[32px] font-lexendMedium">
            Verify OTP
          </Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-[16px] mt-2 leading-6">
            We just sent a 5-digit code to {email}, enter it below:
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
              className={`w-full h-[50px] rounded-full items-center justify-center active:opacity-90 ${isButtonDisabled ? "bg-[#09515D]" : "bg-[#29D7DE]"}`}
            >
              <Text className="font-lexendBold text-[16px] text-[#00343F]">
                Verify Code
              </Text>
            </Pressable>
          </View>

          <View className="mt-6 items-center">
            <Text className="text-[#7BA0A3] font-lexendRegular text-[16px]">
              Didn't get code?{" "}
              <Text
                onPress={handleResend}
                className={`text-[#FDEF56] font-lexendSemiBold ${timer > 0 ? "opacity-50" : ""}`}
              >
                {resendOtp.isPending
                  ? "Sending..."
                  : timer > 0
                    ? `Resend in ${timer}s`
                    : "Resend OTP"}
              </Text>
            </Text>
          </View>
        </View>
      </Container>
    </ScreenBackground>
  );
}
