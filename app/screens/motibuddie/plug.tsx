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
          <View className="items-center mt-10">
            <View className="w-full aspect-[16/10] bg-[#09515D]/20 rounded-[24px] overflow-hidden border border-[#09515D]/30 items-center justify-center">
              <BuddieCar width="100%" height="100%" />
            </View>
          </View>

          {/* Content */}
          <View className="mt-8">
            <Text className="text-white text-[28px] font-lexendMedium">
              Pairing your device
            </Text>
            <Text className="text-[#9BBABB] font-lexendRegular text-[15px] mt-4 leading-7">
              Please insert your motibuddie into the OBD2 port and start your car engine.
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <View className="mb-10 w-full gap-6">
          <Pressable
            onPress={() => router.push("/screens/motibuddie/connecting")}
            className="w-full h-[56px] rounded-full bg-[#29D7DE] items-center justify-center active:opacity-90 shadow-lg"
            style={{
              shadowColor: "#29D7DE",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text className="font-lexendBold text-[16px] text-[#00343F]">
              Start Pairing
            </Text>
          </Pressable>

          <Pressable 
            onPress={() => router.push("/screens/motibuddie/imei")}
            className="items-center py-2"
          >
            <Text className="text-[#9BBABB] font-lexendRegular text-[14px]">
              Or <Text className="text-[#29D7DE] font-lexendMedium">Enter IMEI manually</Text>
            </Text>
          </Pressable>
        </View>
      </Container>
    </ScreenBackground>
  );
}
