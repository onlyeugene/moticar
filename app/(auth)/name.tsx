import DoneIcon from "@/assets/icons/done.svg";
import Container from "@/components/shared/container";
import { ControlledInput } from "@/components/shared/controlledInput";
import CurrencySelector from "@/components/shared/CurrencySelector";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useSetName } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useAuthStore } from "@/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import * as z from "zod";

const schema = z
  .object({
    name: z.string().min(2, "Name is required"),
    hasPreferredName: z.boolean(),
    preferredName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.hasPreferredName &&
        (!data.preferredName || data.preferredName.trim().length < 2)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Preferred name is required",
      path: ["preferredName"],
    },
  );

type NameFormData = {
  name: string;
  hasPreferredName: boolean;
  preferredName?: string;
};

export default function SetName() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { showSnackbar } = useSnackbar();
  const setNameMutation = useSetName();
  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((state) => state.user);
  const [hasPreferredName, setHasPreferredName] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NameFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      hasPreferredName: false,
      preferredName: "",
    },
  });

  const onSubmit = (data: NameFormData) => {
    if (!email) {
      showSnackbar({
        type: "error",
        message: "Session expired",
        description: "Please start the registration again.",
      });
      router.replace("/(auth)/create");
      return;
    }

    setNameMutation.mutate(
      {
        email: email!,
        name: data.name,
        preferredName: data.hasPreferredName ? data.preferredName : undefined,
      },
      {
        onSuccess: (response: any) => {
          // Success screen will be shown, user will then go to login
          setShowSuccess(true);
        },
        onError: (error: any) => {
          showSnackbar({
            type: "error",
            message: "Failed to update profile",
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
              Just one more step! Sign in to start tracking your car expenses.
            </Text>

            <Pressable
              onPress={() => router.replace("/(auth)/login")}
              className="w-full h-[50px] bg-[#29D7DE] rounded-full items-center justify-center active:opacity-90"
            >
              <Text className="font-lexendBold text-[16px] text-[#00343F]">
                Go to Login
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
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <View className="flex-row items-center gap-4">
            <CurrencySelector variant="auth" />
          </View>
        </View>

        <View className="mt-10">
          <Text className="text-white text-[26px] font-lexendMedium">
            Can we get your name?
          </Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-[14px] mt-2 leading-6">
            This would help a lot in personalization
          </Text>
        </View>

        <View className="mt-10 gap-6">
          <View>
            <Text className="text-[#00AEB5] font-lexendMedium text-[12px] mb-2 px-1">
              Enter your name
            </Text>
            <ControlledInput<NameFormData>
              placeholder="eugen"
              name="name"
              control={control}
              leftIcon="mail-outline"
              placeholderClassName="text-[#7BA0A3]"
              containerClassName="border-[#1A8798] bg-[#00232A]"
              className="px-2 text-white"
            />
          </View>

          <Pressable
            onPress={() => {
              const newValue = !hasPreferredName;
              setHasPreferredName(newValue);
              setValue("hasPreferredName", newValue);
            }}
            className="flex-row items-center gap-3 px-1"
          >
            <View
              className={`w-5 h-5 rounded-[4px] border items-center justify-center ${hasPreferredName ? "bg-[#29D7DE] border-[#29D7DE]" : "border-[#7BA0A3]"}`}
            >
              {hasPreferredName && (
                <Ionicons name="checkmark" size={14} color="#00343F" />
              )}
            </View>
            <Text className="text-white font-lexendMedium text-[14px]">
              I have a preferred name
            </Text>
          </Pressable>

          {hasPreferredName && (
            <View>
              <Text className="text-[#00AEB5] font-lexendMedium text-[12px] mb-2 px-1">
                Preferred name
              </Text>
              <ControlledInput<NameFormData>
                placeholder="DonBosco"
                name="preferredName"
                control={control}
                leftIcon="mail-outline"
                placeholderClassName="text-[#7BA0A3]"
                containerClassName="border-[#1A8798] bg-[#00232A]"
                className="px-2 text-white"
              />
            </View>
          )}
        </View>

        <View className="flex-1 justify-end mb-10">
          <Pressable
            disabled={setNameMutation.isPending}
            onPress={handleSubmit(onSubmit)}
            className={`w-full h-[54px] rounded-full items-center justify-center ${setNameMutation.isPending ? "bg-[#09515D]/60" : "bg-[#29D7DE]"}`}
          >
            {setNameMutation.isPending ? (
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
