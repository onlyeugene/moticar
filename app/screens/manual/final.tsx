import Container from "@/components/shared/container";
import { ControlledInput } from "@/components/shared/controlledInput";
import { RulerPicker } from "@/components/shared/RulerPicker";
import { WheelDatePicker } from "@/components/shared/WheelDatePicker";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useUpdateProfile } from "@/hooks/useAuth";
import { useUpdateCar } from "@/hooks/useCars";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthState } from "@/types/auth";
import { getCurrencySymbol } from "@/utils/currency";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";

const finalSchema = z.object({
  monthlyBudget: z.number().optional(),
  mileage: z.string().min(1, "Mileage is required"),
  plate: z.string().min(1, "Plate number is required"),
  vin: z.string().min(1, "Chassis number is required"),
  purchaseDate: z.string().optional(),
  dontRememberDate: z.boolean(),
  condition: z.enum(["Newly Purchased", "Already had an existing user"]),
});

type FinalFormData = z.infer<typeof finalSchema>;

export default function FinalDetailsScreen() {
  const params = useLocalSearchParams<{
    carId: string;
    recommendedBudget: string;
  }>();
  const user = useAuthStore((state: AuthState) => state.user);
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);
  const carId = params.carId;

  const { showSnackbar } = useSnackbar();
  const { mutate: updateCar, isPending: isSubmitting } = useUpdateCar();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();
  const updateUser = useAuthStore((state: AuthState) => state.updateUser);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FinalFormData>({
    resolver: zodResolver(finalSchema),
    mode: "onChange",
    defaultValues: {
      condition: "Newly Purchased",
      purchaseDate: "12.02.2025",
      dontRememberDate: false,
      monthlyBudget: params.recommendedBudget
        ? parseInt(params.recommendedBudget)
        : 50000,
    },
  });

  const condition = watch("condition");
  const dontRememberDate = watch("dontRememberDate");

  const onSave = (data: FinalFormData) => {
    if (!carId) {
      showSnackbar({
        type: "error",
        message: "Missing car information",
        description: "We couldn't find the car record to update.",
      });
      return;
    }

    let purchaseDate: Date | null = null;
    if (!data.dontRememberDate && data.purchaseDate) {
      const [d, m, y] = data.purchaseDate.split(".");
      purchaseDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    }

    updateCar(
      {
        id: carId,
        data: {
          mileage: parseInt(data.mileage),
          plate: data.plate,
          vin: data.vin,
          purchaseDate,
          condition: data.condition,
          monthlyBudget: data.monthlyBudget || 0,
        },
      },
      {
        onSuccess: () => {
          updateUser({ onboardingCompleted: true });
          showSnackbar({
            type: "success",
            message: "Onboarding complete!",
            description: "Your car details have been finalized.",
          });
          router.replace("/(tabs)");
        },
        onError: (error: any) => {
          showSnackbar({
            type: "error",
            message: "Failed to update details",
            description:
              error?.response?.data?.message || "Something went wrong",
          });
        },
      },
    );
  };

  return (
    <ScreenBackground withSafeArea>
      <View className="flex-1 mt-20 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View className="flex-row gap-2">
            <View className="w-12 h-2 rounded-full bg-[#00343F]" />
            <View className="w-12 h-2 rounded-full bg-[#29D7DE]" />
          </View>

          <TouchableOpacity
            onPress={() => {
              updateProfile(
                { onboardingCompleted: true },
                {
                  onSettled: () => {
                    updateUser({ onboardingCompleted: true });
                    router.replace("/(tabs)");
                  },
                },
              );
            }}
            disabled={isUpdatingProfile}
          >
            <View className="flex-row items-center">
              {isUpdatingProfile ? (
                <ActivityIndicator size="small" color="#29D7DE" />
              ) : (
                <>
                  <Text className="text-[#29D7DE] font-lexendRegular mr-1">
                    Skip
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#29D7DE" />
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
          className="flex-1"
        >
          <Text className="text-white font-lexendMedium text-[26px] mb-2">
            Final Details
          </Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-[14px] mb-8">
            These details are used to verify your identity and keep {"\n"}your
            details safe
          </Text>

          {/* Monthly Budget Section */}
          <View className="mb-10 items-center">
            <RulerPicker
              value={watch("monthlyBudget")}
              onValueChange={(val) => setValue("monthlyBudget", val)}
              unitPrefix={currencySymbol}
              min={1000}
              max={1000000}
              step={500}
              unitStep={500}
            />
          </View>

          {/* Current Car Mileage */}
          <View className="mb-8">
            <Text className="text-[#4FB8C8] font-lexendRegular text-[12px] mb-2 ">
              Current Car Mileage
            </Text>
            <ControlledInput<FinalFormData>
              control={control}
              name="mileage"
              placeholder="----"
              keyboardType="numeric"
              inputClassName="text-center text-[18px] font-lexendBold"
            />
            <Text className="text-[#9BBABB] font-lexendRegular text-[12px] text-center -mt-2">
              You can find this on your dashboard
            </Text>
          </View>

          {/* Car Number Plate */}
          <View className="mb-8">
            <Text className="text-[#4FB8C8] font-lexendRegular text-[12px] mb-2">
              Car Number Plate
            </Text>
            <ControlledInput<FinalFormData>
              control={control}
              name="plate"
              placeholder="-- --- ---"
              autoCapitalize="characters"
              inputClassName="text-center text-[18px] font-lexendBold"
            />
          </View>

          {/* Chasis Number */}
          <View className="mb-8">
            <Text className="text-[#4FB8C8] font-lexendRegular text-[12px] mb-2">
              Chasis Number
            </Text>
            <ControlledInput<FinalFormData>
              control={control}
              name="vin"
              placeholder="-----------------"
              autoCapitalize="characters"
              inputClassName="text-center text-[18px] font-lexendBold"
            />
            <Text className="text-[#9BBABB] font-lexendRegular text-[12px] text-center -mt-2">
              You can find this on your windscreen, drivers side door, under{" "}
              {"\n"}the passengers floor mat or engine bay
            </Text>
          </View>

          {/* Date of Car Purchase */}
          <Animated.View layout={LinearTransition} className="mb-5">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-[#4FB8C8] font-lexendRegular text-[12px]">
                Date of Purchase
              </Text>
              <Pressable
                onPress={() => setValue("dontRememberDate", !dontRememberDate)}
                className="flex-row items-center"
              >
                <Ionicons
                  name={dontRememberDate ? "checkbox" : "square-outline"}
                  size={18}
                  color="#29D7DE"
                />
                <Text className="text-[#FFFFFF] font-lexendRegular text-[12px] ml-2">
                  I dont remember
                </Text>
              </Pressable>
            </View>

            {!dontRememberDate && (
              <Animated.View
                entering={FadeInDown.duration(300)}
                exiting={FadeOutUp.duration(300)}
              >
                <WheelDatePicker
                  initialDate={watch("purchaseDate")}
                  onDateChange={(val) => setValue("purchaseDate", val)}
                />
              </Animated.View>
            )}
          </Animated.View>

          {/* Condition */}
          <View className="mb-10">
            <Text className="text-[#4FB8C8] font-lexendRegular text-[12px] mb-4 ">
              Condition at the time of purchase
            </Text>

            <View className="rounded-xl border border-[#09515D] overflow-hidden">
              <Pressable
                onPress={() => setValue("condition", "Newly Purchased")}
                className={`flex-row items-center justify-between p-5 ${condition === "Newly Purchased" ? "bg-[#043F48]" : ""}`}
              >
                <Text
                  className={`font-lexendMedium text-[14px] ${condition === "Newly Purchased" ? "text-[#FFFFFF]" : "text-[#899B9B]"}`}
                >
                  Newly Purchased
                </Text>
                <View
                  className={`w-[26px] h-[26px] rounded-full items-center justify-center ${
                    condition === "Newly Purchased"
                      ? "bg-[#00AEB5]"
                      : " bg-[#012227]"
                  }`}
                >
                  {condition === "Newly Purchased" ? (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  ) : (
                    <Ionicons name="checkmark" color="#013037" />
                  )}
                </View>
              </Pressable>

              <View className="h-[1px] bg-[#09515D]" />

              <Pressable
                onPress={() =>
                  setValue("condition", "Already had an existing user")
                }
                className="flex-row items-center justify-between p-5"
              >
                <Text
                  className={`font-lexendMedium text-[14px] ${condition === "Already had an existing user" ? "text-[#FFFFFF]" : "text-[#899B9B]"}`}
                >
                  Already had an existing user
                </Text>
                <View
                  className={`w-[26px] h-[26px] rounded-full items-center justify-center ${
                    condition === "Already had an existing user"
                      ? "bg-[#00AEB5]"
                      : "bg-[#012328]"
                  }`}
                >
                  {condition === "Already had an existing user" ? (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  ) : (
                    <Ionicons name="checkmark" color="#013037" />
                  )}
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* Anchored Save Button */}
        <View className="absolute bottom-0 left-0 right-0 pt-4 pb-8 px-4">
          <TouchableOpacity
            onPress={handleSubmit(onSave)}
            disabled={isSubmitting || !isValid}
            activeOpacity={0.8}
            className={`h-16 rounded-full items-center justify-center ${
              !isValid || isSubmitting ? "bg-[#29D7DE]/10" : "bg-[#29D7DE]"
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#00343F" />
            ) : (
              <Text
                className={`font-lexendBold text-lg ${!isValid ? "text-[#00343F]" : "text-[#00343F]"}`}
              >
                Save
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScreenBackground>
  );
}
