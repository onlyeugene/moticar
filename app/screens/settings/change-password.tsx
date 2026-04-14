import Container from "@/components/shared/container";
import { ControlledInput } from "@/components/shared/controlledInput";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useChangePassword } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { passwordSchema } from "@/utils/validation";
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
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordFormData = z.infer<typeof schema>;

export default function ChangePasswordScreen() {
  const { showSnackbar } = useSnackbar();
  const changePassword = useChangePassword();

  const {
    control,
    handleSubmit,
    watch,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const oldPassword = watch("oldPassword");
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");
  
  const isButtonDisabled = !oldPassword || !newPassword || !confirmPassword || changePassword.isPending;

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword.mutate(
      { 
        oldPassword: data.oldPassword, 
        newPassword: data.newPassword 
      },
      {
        onSuccess: (res) => {
          showSnackbar({
            type: "success",
            message: "Success",
            description: res?.message || "Your password has been changed successfully.",
          });
          router.back();
        },
        onError: (error: any) => {
          showSnackbar({
            type: "error",
            message: "Action failed",
            description:
              error.response?.data?.message ||
              "Could not change your password at this time.",
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
            Change Password
          </Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-[16px] mt-2 leading-6">
            Enter your current password and pick a new one.
          </Text>
        </View>

        <View className="mt-10">
          <Text className="text-[#32717B] font-lexendMedium text-[14px] mb-3">
            Current Password
          </Text>
          <ControlledInput
            control={control}
            name="oldPassword"
            placeholder="Enter your current password"
            secureTextEntry
            showPasswordToggle
            editable={!changePassword.isPending}
          />
        </View>

        <View className="mt-4">
          <Text className="text-[#32717B] font-lexendMedium text-[14px] mb-3">
            New Password
          </Text>
          <ControlledInput
            control={control}
            name="newPassword"
            placeholder="Enter your new password"
            secureTextEntry
            showPasswordToggle
            editable={!changePassword.isPending}
          />
        </View>

        <View className="mt-4">
          <Text className="text-[#32717B] font-lexendMedium text-[14px] mb-3">
            Confirm New Password
          </Text>
          <ControlledInput
            control={control}
            name="confirmPassword"
            placeholder="Confirm your new password"
            secureTextEntry
            showPasswordToggle
            editable={!changePassword.isPending}
          />
        </View>

        <View className="mt-10">
          <Pressable
            disabled={isButtonDisabled}
            onPress={handleSubmit(onSubmit)}
            className={`w-full h-[50px] rounded-full items-center justify-center active:opacity-90 ${isButtonDisabled ? "bg-[#09515D]/60" : "bg-[#29D7DE]"}`}
          >
            {changePassword.isPending ? (
              <ActivityIndicator color="#00343F" />
            ) : (
              <Text className="font-lexendBold text-[16px] text-[#00343F]">
                Update Password
              </Text>
            )}
          </Pressable>
        </View>
      </Container>
    </ScreenBackground>
  );
}
