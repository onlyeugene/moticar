import React from "react";
import { Text, View, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import Container from "@/components/shared/container";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ControlledInput } from "@/components/shared/controlledInput";

const imeiSchema = z.object({
  imei: z.string()
    .min(15, "IMEI must be 15 digits")
    .max(15, "IMEI must be 15 digits")
    .regex(/^\d+$/, "IMEI must contain only digits"),
});

type ImeiFormData = z.infer<typeof imeiSchema>;

export default function ImeiEntry() {
  const { control, handleSubmit, formState: { isValid } } = useForm<ImeiFormData>({
    resolver: zodResolver(imeiSchema),
    mode: "onChange",
    defaultValues: { imei: "" },
  });

  const onSubmit = (data: ImeiFormData) => {
    console.log("IMEI Submitted:", data.imei);
    router.push("/screens/motibuddie/connecting");
  };

  return (
    <ScreenBackground>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Container>
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1">
              {/* Header */}
              <View className="flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                  <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                
                {/* Progress Dots */}
                <View className="flex-row gap-2">
                  <View className="w-8 h-2 rounded-full bg-[#09515D]" />
                  <View className="w-8 h-2 rounded-full bg-[#29D7DE]" />
                </View>
                
                <View className="w-10" />
              </View>

              <View className="mt-10">
                <Text className="text-white text-[28px] font-lexendMedium">
                  Enter IMEI
                </Text>
                <Text className="text-[#9BBABB] font-lexendRegular text-[15px] mt-4 leading-7">
                  Please enter the 15-digit IMEI number found on the back of your MotiBuddie device.
                </Text>
              </View>

              <View className="mt-10">
                <Text className="text-[#32717B] font-lexendRegular text-[12px] mb-2 px-1">
                  IMEI Number
                </Text>
                <ControlledInput
                  control={control}
                  name="imei"
                  placeholder="e.g. 123456789012345"
                  keyboardType="numeric"
                  maxLength={15}
                />
              </View>
            </View>

            {/* Action Button */}
            <View className="mb-10 w-full">
              <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid}
                className={`w-full h-[56px] rounded-full items-center justify-center ${
                  isValid ? "bg-[#29D7DE]" : "bg-[#09515D] opacity-50"
                }`}
                style={isValid ? {
                  shadowColor: "#29D7DE",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                } : {}}
              >
                <Text className={`font-lexendBold text-[16px] ${isValid ? "text-[#00343F]" : "text-white/50"}`}>
                  Connect Device
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
