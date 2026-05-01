import React from "react";
import { Text, View, Pressable } from "react-native";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import Container from "@/components/shared/container";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import BuddieCar from "@/assets/motibuddie/buddiecar.svg";

export default function Plug() {
  return (
    <ScreenBackground>
      <Container>
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Pressable onPress={() => router.back()} className="p-2 -ml-2">
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            
            {/* Progress Dots */}
            <View className="flex-row gap-2">
              <View className="w-8 h-2 rounded-full bg-[#29D7DE]" />
              <View className="w-8 h-2 rounded-full bg-[#09515D]" />
            </View>
            
            <View className="w-10" />
          </View>

          {/* Car Illustration */}
          <View className="items-center mt-4">
            <View className="w-full aspect-[16/10] overflow-hidden items-center justify-center">
              <BuddieCar width={370} height={230} />
            </View>
          </View>

          {/* Content */}
          <View className="mt-4">
            <Text className="text-white text-[1.625rem] font-lexendMedium">
              Pairing your device
            </Text>
            <Text className="text-[#9BBABB] font-lexendRegular text-[0.875rem] mt-3">
              Please insert your motibuddie into the OBD2 port and start your car engine.
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <View className="mb-10 w-11/12 mx-auto gap-6">
          <Pressable
            onPress={() => router.push("/screens/motibuddie/imei")}
            className="w-full h-[50px] rounded-full bg-[#29D7DE] items-center justify-center"
          >
            <Text className="font-lexendBold text-[1rem] text-[#00343F]">
              Start Pairing
            </Text>
          </Pressable>
        </View>
      </Container>
    </ScreenBackground>
  );
}
