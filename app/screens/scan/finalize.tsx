import Container from "@/components/shared/container";
import { ControlledInput } from "@/components/shared/controlledInput";
import { RulerPicker } from "@/components/shared/RulerPicker";
import { FormWheelDatePicker } from "@/components/shared/FormWheelDatePicker";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useCreateCar } from "@/hooks/useCars";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthState } from "@/types/auth";
import { getCurrencySymbol } from "@/utils/currency";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";
import * as z from "zod";

const finalSchema = z.object({
  monthlyBudget: z.number().optional(),
  mileage: z.string().min(1, "Mileage is required"),
  purchaseDate: z.string().optional(),
  dontRememberDate: z.boolean(),
  condition: z.enum(["Newly Purchased", "Already had an existing user"]),
});

type FinalFormData = z.infer<typeof finalSchema>;

export default function FinalizeScan() {
  const {
    scannedCarData,
    scannedLicenseData,
    setScanningProgress,
    setScannedCarData,
    setScannedLicenseData,
  } = useAppStore();

  const user = useAuthStore((state: AuthState) => state.user);
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);
  const { showSnackbar } = useSnackbar();
  const { mutate: saveMutation, isPending: isSaving } = useCreateCar();
  const { mutate: skipMutation, isPending: isSkipping } = useCreateCar();
  const isSubmitting = isSaving || isSkipping;
  const updateUser = useAuthStore((state: AuthState) => state.updateUser);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<FinalFormData>({
    resolver: zodResolver(finalSchema),
    mode: "onChange",
    defaultValues: {
      condition: "Newly Purchased",
      purchaseDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      dontRememberDate: false,
      monthlyBudget: 50000,
    },
  });

  const condition = watch("condition");
  const dontRememberDate = watch("dontRememberDate");

  if (!scannedCarData) {
    return (
      <ScreenBackground>
        <Container>
          <View className="flex-1 items-center justify-center">
            <Text className="text-white font-lexendMedium text-center mb-4">
              No vehicle data found. Please complete the scan steps.
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/screens/scan/scan")}
              className="px-6 py-3 bg-[#29D7DE] rounded-full"
            >
              <Text className="text-[#00343F] font-lexendBold">Go Back</Text>
            </TouchableOpacity>
          </View>
        </Container>
      </ScreenBackground>
    );
  }

  const onSave = (data: FinalFormData) => {
    let purchaseDateStr: string | undefined = undefined;
    if (!data.dontRememberDate && data.purchaseDate) {
      const [d, m, y] = data.purchaseDate.split(/[-.]/);
      const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      purchaseDateStr = date.toISOString();
    }

    saveMutation(
      {
        make: scannedCarData.make || "",
        carModel: scannedCarData.carModel || scannedCarData.model || "",
        year: parseInt(scannedCarData.year) || 0,
        yearRange: scannedCarData.yearRange,
        mileage: parseInt(data.mileage.replace(/,/g, "")),
        plate: (
          scannedCarData.plate ||
          scannedCarData.plateNumber ||
          ""
        ).replace(/-/g, " "),
        vin: scannedCarData.vin || scannedLicenseData?.vin || "",
        fuelType: scannedCarData.fuelType,
        color: scannedCarData.color,
        transmission: scannedCarData.transmission,
        engineDesc:
          scannedCarData.engineDesc ||
          scannedCarData.engine ||
          scannedCarData.engineSize,
        cylinder: scannedCarData.cylinder || scannedCarData.cylinders,
        horsepower: scannedCarData.horsepower,
        driveType: scannedCarData.driveType,
        bodyStyle: scannedCarData.bodyStyle,
        segment: scannedCarData.segment,
        doors: scannedCarData.doors,
        condition:
          data.condition === "Newly Purchased" ? "Newly Purchased" : "Used",
        monthlyBudget: data.monthlyBudget || 0,
        purchaseDate: purchaseDateStr,
        entryMethod: "ai_scan",
      },
      {
        onSuccess: () => {
          showSnackbar({
            type: "success",
            message: "Car Added",
            description: "Your vehicle has been successfully registered.",
          });
          // Reset progress and store
          setScanningProgress({
            picturesCompleted: false,
            licenseCompleted: false,
          });
          setScannedCarData(null);
          setScannedLicenseData(null);
          updateUser({ onboardingCompleted: true });
          router.replace("/(tabs)");
        },
        onError: (error: any) => {
          showSnackbar({
            type: "error",
            message: "Upload Failed",
            description:
              error?.response?.data?.message || "Something went wrong.",
          });
        },
      },
    );
  };

  return (
    <ScreenBackground withSafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 mt-20 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View className="flex-row gap-2">
            <View className="w-[42px] h-[10px] rounded-full bg-[#00343F]" />
            <View className="w-[42px] h-[10px] rounded-full bg-[#29D7DE]" />
          </View>

          <TouchableOpacity
            onPress={() => {
              if (!scannedCarData) {
                updateUser({ onboardingCompleted: true });
                router.replace("/(tabs)");
                return;
              }

              // Silent save on skip
              skipMutation(
                {
                  make: scannedCarData.make || "",
                  carModel:
                    scannedCarData.carModel || scannedCarData.model || "",
                  year: parseInt(scannedCarData.year) || 0,
                  yearRange: scannedCarData.yearRange,
                  mileage: 0,
                  plate: (
                    scannedCarData.plate ||
                    scannedCarData.plateNumber ||
                    ""
                  ).replace(/-/g, " "),
                  vin: scannedCarData.vin || scannedLicenseData?.vin || "",
                  fuelType: scannedCarData.fuelType,
                  color: scannedCarData.color,
                  transmission: scannedCarData.transmission,
                  engineDesc:
                    scannedCarData.engineDesc ||
                    scannedCarData.engine ||
                    scannedCarData.engineSize,
                  cylinder: scannedCarData.cylinder || scannedCarData.cylinders,
                  horsepower: scannedCarData.horsepower,
                  driveType: scannedCarData.driveType,
                  bodyStyle: scannedCarData.bodyStyle,
                  segment: scannedCarData.segment,
                  doors: scannedCarData.doors,
                  condition: "Used",
                  monthlyBudget: 0,
                  entryMethod: "ai_scan",
                },
                {
                  onSuccess: () => {
                    showSnackbar({
                      type: "success",
                      message: "Car Added",
                      description:
                        "Your scanned vehicle has been successfully registered.",
                    });
                    // Reset progress and store
                    setScanningProgress({
                      picturesCompleted: false,
                      licenseCompleted: false,
                    });
                    setScannedCarData(null);
                    setScannedLicenseData(null);
                    updateUser({ onboardingCompleted: true });
                    router.replace("/(tabs)");
                  },
                },
              );
            }}
            disabled={isSubmitting}
          >
            <View className="flex-row items-center">
              {isSkipping ? (
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
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          contentContainerStyle={{ paddingBottom: 150 }}
          className="flex-1"
        >
          <Text className="text-white font-lexendMedium text-[1.625rem] mb-2">
            Final Details
          </Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-[0.875rem] mb-8">
            These details are used to verify your identity and keep {"\n"}your
            details safe
          </Text>

          {/* Monthly Budget Section */}
          <View className="mb-10 items-center">
            <RulerPicker
              value={watch("monthlyBudget")}
              onValueChange={(val) => setValue("monthlyBudget", val)}
              unitPrefix={currencySymbol}
              min={0}
              max={1000000}
              step={100}
              unitStep={500}
            />
          </View>

          {/* Current Car Mileage */}
          <View className="mb-8">
            <Text className="text-[#4FB8C8] font-lexendRegular text-[0.75rem] mb-2 ">
              Current Car Mileage
            </Text>
            <ControlledInput<FinalFormData>
              control={control}
              name="mileage"
              placeholder="----"
              keyboardType="numeric"
              inputClassName="text-center text-[1.5rem] font-lexendRegular"
            />
            <Text className="text-[#9BBABB] font-lexendRegular text-[0.75rem] text-center -mt-2">
              You can find this on your dashboard
            </Text>
          </View>

          {/* Date of Car Purchase */}
          <Animated.View layout={LinearTransition} className="mb-5">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-[#4FB8C8] font-lexendRegular text-[0.75rem]">
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
                <Text className="text-[#FFFFFF] font-lexendRegular text-[0.75rem] ml-2">
                  I dont remember
                </Text>
              </Pressable>
            </View>

            {!dontRememberDate && (
              <Animated.View
                entering={FadeInDown.duration(300)}
                exiting={FadeOutUp.duration(300)}
              >
                <FormWheelDatePicker
                  initialDate={watch("purchaseDate")}
                  onDateChange={(val) => setValue("purchaseDate", val)}
                />
              </Animated.View>
            )}
          </Animated.View>

          {/* Condition */}
          <View className="mb-10">
            <Text className="text-[#4FB8C8] font-lexendRegular text-[0.75rem] mb-4 ">
              Condition at the time of purchase
            </Text>

            <View className="rounded-xl border border-[#09515D] overflow-hidden">
              <Pressable
                onPress={() => setValue("condition", "Newly Purchased")}
                className={`flex-row items-center justify-between p-5 ${condition === "Newly Purchased" ? "bg-[#043F48]" : ""}`}
              >
                <Text
                  className={`font-lexendMedium text-[0.875rem] ${condition === "Newly Purchased" ? "text-[#FFFFFF]" : "text-[#899B9B]"}`}
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
                className={`flex-row items-center justify-between p-5 ${condition === "Already had an existing user" ? "bg-[#043F48]" : ""}`}
              >
                <Text
                  className={`font-lexendMedium text-[0.875rem] ${condition === "Already had an existing user" ? "text-[#FFFFFF]" : "text-[#899B9B]"}`}
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

        {/* Save Button */}
        <View className="absolute bottom-0 left-0 right-0 pt-4 pb-8 px-4 bg-transparent">
          <TouchableOpacity
            onPress={handleSubmit(onSave)}
            disabled={isSubmitting || !isValid}
            activeOpacity={0.8}
            className={`h-16 rounded-full items-center justify-center ${
              !isValid || isSubmitting ? "bg-[#29D7DE]/10" : "bg-[#29D7DE]"
            }`}
          >
            {isSaving ? (
              <ActivityIndicator color="#00343F" />
            ) : (
              <Text className="font-lexendBold text-[#00343F] text-lg">
                Save
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
