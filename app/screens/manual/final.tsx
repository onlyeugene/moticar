import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ScreenBackground } from "@/components/ScreenBackground";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ControlledInput } from "@/components/shared/controlledInput";
import { useUpdateCar } from "@/hooks/useCars";
import { useUpdateProfile } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthState } from "@/types/auth";
import Container from "@/components/shared/container";
import { getCurrencySymbol } from "@/utils/currency";

const finalSchema = z.object({
  monthlyBudget: z.string().optional(),
  mileage: z.string().min(1, "Mileage is required"),
  plate: z.string().min(1, "Plate number is required"),
  vin: z.string().min(1, "Chassis number is required"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  condition: z.enum(["Newly Purchased", "Pre-owned"]),
});

type FinalFormData = z.infer<typeof finalSchema>;

export default function FinalDetailsScreen() {
  const params = useLocalSearchParams<{ carId: string, recommendedBudget: string }>();
  const user = useAuthStore((state: AuthState) => state.user);
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);
  const carId = params.carId;
  const formattedBudget = params.recommendedBudget 
    ? `${currencySymbol} ${Number(params.recommendedBudget).toLocaleString()}` 
    : `${currencySymbol} 62,000`;
  const { showSnackbar } = useSnackbar();
  const { mutate: updateCar, isPending: isSubmitting } = useUpdateCar();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const updateUser = useAuthStore((state: AuthState) => state.updateUser);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FinalFormData>({
    resolver: zodResolver(finalSchema),
    defaultValues: {
      condition: "Newly Purchased",
      purchaseDate: "11.02.2026", // Default from design
    },
  });

  const onSave = (data: FinalFormData) => {
    if (!carId) {
      showSnackbar({
        type: "error",
        message: "Missing car information",
        description: "We couldn't find the car record to update.",
      });
      return;
    }

    updateCar(
      {
        id: carId,
        data: {
          mileage: parseInt(data.mileage),
          plate: data.plate,
          vin: data.vin,
          purchaseDate: data.purchaseDate,
          condition: data.condition,
          monthlyBudget: data.monthlyBudget ? parseInt(data.monthlyBudget) : 0,
        },
      },
      {
        onSuccess: () => {
          // Mark onboarding as completed in local store to prevent redirects
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
            description: error?.response?.data?.message || "Something went wrong",
          });
        },
      }
    );
  };

  return (
    <ScreenBackground withSafeArea>
      <Container>
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
              updateProfile({ onboardingCompleted: true }, {
                onSettled: () => {
                  updateUser({ onboardingCompleted: true });
                  router.replace("/(tabs)");
                }
              });
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

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text className="text-white font-lexendBold text-3xl mb-2">Final Details</Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-sm mb-8">
            These details are used to verify your identity and keep your details safe
          </Text>

          {/* Monthly Budget */}
          <Text className="text-[#356D75] font-lexendRegular text-xs mb-2 uppercase">Estimated monthly budget</Text>
          <ControlledInput
            control={control}
            name="monthlyBudget"
            placeholder={`eg ${currencySymbol}4,000`}
            keyboardType="numeric"
          />

          {/* Recommendation Box */}
          <View className="bg-[#01353D]/50 border border-[#29D7DE]/30 rounded-xl p-4 mb-8">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-[#29D7DE] font-lexendRegular text-xs">Recommendation</Text>
              <Text className="text-[#29D7DE] font-lexendBold text-lg">{formattedBudget}</Text>
            </View>
            <Text className="text-[#9BBABB] font-lexendRegular text-[10px] leading-4">
              From similar car riders who own your kind of vehicle. This might vary from yours based on the frequency and purpose of your use.
            </Text>
          </View>

          {/* Current Car Mileage */}
          <View className="mb-6">
            <Text className="text-[#356D75] font-lexendRegular text-xs mb-2 uppercase">Current Car Mileage</Text>
            <ControlledInput
              control={control}
              name="mileage"
              placeholder="eg 14,000"
              keyboardType="numeric"
            />
            <Text className="text-[#356D75] font-lexendRegular text-[10px] -mt-2">You can find this on your dashboard</Text>
          </View>

          {/* Car Number Plate */}
          <View className="mb-6">
            <Text className="text-[#356D75] font-lexendRegular text-xs mb-2 uppercase">Car Number Plate</Text>
            <ControlledInput
              control={control}
              name="plate"
              placeholder="eg YU 34 ANL"
              autoCapitalize="characters"
            />
            <Text className="text-[#356D75] font-lexendRegular text-[10px] -mt-2">You can find this on your dashboard</Text>
          </View>

          {/* Chasis Number */}
          <View className="mb-6">
            <Text className="text-[#356D75] font-lexendRegular text-xs mb-2 uppercase">Chasis Number</Text>
            <ControlledInput
              control={control}
              name="vin"
              placeholder="eg 9821ndasuhi101"
              autoCapitalize="characters"
            />
            <Text className="text-[#356D75] font-lexendRegular text-[10px] -mt-2">You can find this on your dashboard</Text>
          </View>

          {/* Date of Car Purchase */}
          <View className="mb-6">
            <Text className="text-[#356D75] font-lexendRegular text-xs mb-2 uppercase">Date of Car Purchase</Text>
            <ControlledInput
              control={control}
              name="purchaseDate"
              placeholder="DD.MM.YYYY"
              leftIcon="calendar-outline"
            />
          </View>

          {/* Condition */}
          <View className="mb-10">
            <Text className="text-[#356D75] font-lexendRegular text-xs mb-2 uppercase">Condition at the time of purchase</Text>
            <Pressable 
              className="flex-row items-center justify-between border border-[#09515D] bg-[#012227] rounded-xl px-4 h-14"
              onPress={() => {
                const current = watch("condition");
                setValue("condition", current === "Newly Purchased" ? "Pre-owned" : "Newly Purchased");
              }}
            >
              <Text className="text-white font-lexendRegular">{watch("condition")}</Text>
              <Ionicons name="chevron-down" size={20} color="#356D75" />
            </Pressable>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSave)}
            disabled={isSubmitting}
            activeOpacity={0.8}
            className={`h-16 rounded-full items-center justify-center ${
              isSubmitting ? "bg-[#FBE74C]/60" : "bg-[#FBE74C]"
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#00343F" />
            ) : (
              <Text className="text-[#00343F] font-lexendBold text-lg">Save</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </Container>
    </ScreenBackground>
  );
}
