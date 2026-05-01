import React, { useState } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import Container from "@/components/shared/container";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { carService } from "@/services/api/carService";
import { obdService } from "@/services/api/obdService";
import { useAppStore } from "@/store/useAppStore";
import { RulerPicker } from "@/components/shared/RulerPicker";
import { CarCreateInput } from "@/types/car";
import { TextInput } from "react-native";

type FinalDetailsParams = {
  imei: string;
  make: string;
  carModel: string;
  year: string;
  mileage: string;
  vin?: string;
  transmission?: string;
  engineDesc?: string;
  fuelType?: string;
  driveType?: string;
  bodyStyle?: string;
  segment?: string;
  plate?: string;
};

export default function ObdFinalDetails() {
  const params = useLocalSearchParams<FinalDetailsParams>();
  const { showSnackbar } = useSnackbar();
  const { setSelectedCarId } = useAppStore();

  const [monthlyBudget, setMonthlyBudget] = useState(50000);
  const [plate, setPlate] = useState(params.plate || "");
  const [condition, setCondition] = useState<
    "Newly Purchased" | "Already had an existing user"
  >("Newly Purchased");
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [dontRememberDate, setDontRememberDate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const carPayload: CarCreateInput = {
        make: params.make,
        carModel: params.carModel,
        year: parseInt(params.year) || new Date().getFullYear(),
        mileage: parseInt(params.mileage) || 0,
        vin: params.vin || undefined,
        plate: plate || undefined,
        fuelType: params.fuelType || undefined,
        transmission: params.transmission || undefined,
        engineDesc: params.engineDesc || undefined,
        driveType: params.driveType || undefined,
        bodyStyle: params.bodyStyle || undefined,
        segment: params.segment || undefined,
        monthlyBudget,
        currency: "NGN",
        condition,
        purchaseDate: dontRememberDate ? undefined : purchaseDate.toISOString(), // ← string now
        entryMethod: "obd",
      };

      const newCar = await carService.createCar(carPayload); // ← returns Car directly
      const newCarId = newCar?._id || newCar?.id;

      if (!newCarId) {
        throw new Error("Car creation failed — no ID returned");
      }

      if (params.imei) {
        await obdService.linkDevice({ imei: params.imei, carId: newCarId });
      }

      setSelectedCarId(newCarId);

      showSnackbar({
        message: "Car added successfully!",
        description: "Your motiBuddie is now connected.",
        type: "success",
      });

      router.replace("/(tabs)/car");
    } catch (error: any) {
      console.error("Save OBD car failed:", error);
      showSnackbar({
        message: "Could not save car. Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Container>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8">
              <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                <Ionicons name="arrow-back" size={24} color="white" />
              </Pressable>
              <View className="flex-row gap-2">
                <View className="w-8 h-2 rounded-full bg-[#29D7DE]" />
                <View className="w-8 h-2 rounded-full bg-[#29D7DE]" />
                <View className="w-8 h-2 rounded-full bg-[#09515D]" />
              </View>
              <TouchableOpacity onPress={() => router.replace("/(tabs)/car")}>
                <Text className="text-[#9BBABB] font-lexendRegular text-[0.875rem]">
                  Skip
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-white text-[1.75rem] font-lexendMedium mb-2">
              Final Details
            </Text>
            <Text className="text-[#9BBABB] font-lexendRegular text-[0.875rem] mb-8">
              These details are used to verify your identity and keep your
              details safe
            </Text>

            {/* Monthly Budget — Ruler Picker */}
            <View className="mb-8">
              <RulerPicker
                title="Estimated monthly budget"
                initialValue={50000}
                value={monthlyBudget}
                onValueChange={setMonthlyBudget}
                unitPrefix="₦"
              />
            </View>

            {/* Plate Number */}
            <View className="mb-6">
              <Text className="text-[#9BBABB] font-lexendRegular text-[0.75rem] mb-2 px-1">
                Car Number Plate
              </Text>
              <View className="bg-[#032529] border border-[#09515D] rounded-xl px-4 h-[56px] justify-center">
                <Text
                  className="text-white font-lexendMedium text-[1rem] text-center tracking-widest uppercase"
                  onPress={() => {}}
                >
                  {plate || "-- --- ---"}
                </Text>
              </View>
              {/* Simple input below */}
              <View className="mt-2">
                <TextInput
                  placeholder="Enter plate (e.g. NJ 67 XOM)"
                  placeholderTextColor="#597374"
                  value={plate}
                  onChangeText={(text) => setPlate(text.toUpperCase())}
                  autoCapitalize="characters"
                  style={{
                    backgroundColor: "#032529",
                    borderWidth: 1,
                    borderColor: "#09515D",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    height: 56,
                    color: "white",
                    fontFamily: "LexendDeca-Regular",
                    fontSize: 14,
                    marginTop: 8,
                  }}
                />
              </View>
              <Text className="text-[#597374] font-lexendRegular text-[0.625rem] mt-1 px-1">
                You can find this on your vehicle papers
              </Text>
            </View>

            {/* Date of Purchase */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-[#9BBABB] font-lexendRegular text-[0.75rem]">
                  Date of Purchase
                </Text>
                <TouchableOpacity
                  onPress={() => setDontRememberDate(!dontRememberDate)}
                  className="flex-row items-center gap-2"
                >
                  <View
                    className={`w-5 h-5 rounded border ${
                      dontRememberDate
                        ? "bg-[#29D7DE] border-[#29D7DE]"
                        : "border-[#09515D]"
                    } items-center justify-center`}
                  >
                    {dontRememberDate && (
                      <Ionicons name="checkmark" size={12} color="#00343F" />
                    )}
                  </View>
                  <Text className="text-[#9BBABB] font-lexendRegular text-[0.75rem]">
                    I don't remember
                  </Text>
                </TouchableOpacity>
              </View>

              {!dontRememberDate && (
                <View className="bg-[#032529] border border-[#09515D] rounded-xl p-4">
                  {/* Simple year/month/day scroll — you can replace with your date picker */}
                  <View className="flex-row justify-around">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => (
                      <TouchableOpacity
                        key={m}
                        onPress={() => {
                          const d = new Date(purchaseDate);
                          d.setMonth(i);
                          setPurchaseDate(d);
                        }}
                        className={`px-3 py-2 rounded-lg ${
                          purchaseDate.getMonth() === i
                            ? "bg-[#29D7DE]"
                            : "bg-transparent"
                        }`}
                      >
                        <Text
                          className={`font-lexendMedium text-[0.8125rem] ${
                            purchaseDate.getMonth() === i
                              ? "text-[#00343F]"
                              : "text-[#9BBABB]"
                          }`}
                        >
                          {m}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text className="text-[#9BBABB] text-center text-[0.75rem] mt-2">
                    {purchaseDate.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              )}
            </View>

            {/* Condition */}
            <View className="mb-8">
              <Text className="text-[#9BBABB] font-lexendRegular text-[0.75rem] mb-3">
                Condition at the time of purchase
              </Text>
              {(
                ["Newly Purchased", "Already had an existing user"] as const
              ).map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setCondition(opt)}
                  className={`flex-row items-center justify-between px-5 py-4 rounded-xl mb-3 border ${
                    condition === opt
                      ? "bg-[#032529] border-[#29D7DE]"
                      : "bg-[#032529] border-[#09515D]"
                  }`}
                >
                  <Text
                    className={`font-lexendMedium text-[0.875rem] ${
                      condition === opt ? "text-white" : "text-[#9BBABB]"
                    }`}
                  >
                    {opt}
                  </Text>
                  {condition === opt && (
                    <View className="w-6 h-6 rounded-full bg-[#29D7DE] items-center justify-center">
                      <Ionicons name="checkmark" size={14} color="#00343F" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Save Button */}
          <View className="absolute bottom-0 left-0 right-0 px-4 pb-10 bg-transparent">
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.85}
              className={`w-full h-[56px] rounded-full items-center justify-center ${
                isSaving ? "bg-[#09515D]" : "bg-[#29D7DE]"
              }`}
            >
              {isSaving ? (
                <ActivityIndicator color="#00343F" />
              ) : (
                <Text className="text-[#00343F] font-lexendBold text-[1rem]">
                  Save
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Container>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
