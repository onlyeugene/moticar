import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import MotiBuddieLogo from "@/assets/icons/motibuddie.svg";

interface Props {
  onCancel: () => void;
  status?: "scanning" | "signal_lost";
}

export default function DiagnosticChecking({ onCancel, status = "scanning" }: Props) {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.3);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 1500, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 0 })
      ),
      -1,
      false
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1500, easing: Easing.out(Easing.quad) }),
        withTiming(0.3, { duration: 0 })
      ),
      -1,
      false
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <Animated.View 
      entering={FadeIn} 
      exiting={FadeOut}
      className="flex-1 items-center justify-center h-[60vh]"
    >
      {/* Close Button */}
      <TouchableOpacity 
        onPress={onCancel}
        className="absolute top-2 right-2 z-50 p-2"
      >
        <Ionicons name="close" size={28} color="#C1C3C3" />
      </TouchableOpacity>

      {/* Signal Lost Banner */}
      {status === "signal_lost" && (
        <Animated.View 
          entering={FadeIn.duration(500)}
          className="absolute top-20 left-0 right-0 bg-[#FFD9A0] py-2 flex-row items-center justify-center gap-2"
        >
          <Ionicons name="warning-outline" size={16} color="#BA7C1B" />
          <Text className="text-[#BA7C1B] font-lexendMedium text-[0.75rem]">Signal Lost</Text>
        </Animated.View>
      )}

      {/* Illustration Area */}
      <View className="items-center justify-center w-full">
        <View className="w-32 h-32 rounded-full shadow-2xl shadow-yellow-400 items-center justify-center">
          <MotiBuddieLogo width={80} height={80} />
        </View>

        <Text className="text-white font-lexendMedium text-[1.625rem] mt-10">Checking</Text>
        <Text className="text-[#9BBABB] font-lexendRegular text-[0.875rem] mt-2">
          Last checked: 12th March, 2026
        </Text>
      </View>
    </Animated.View>
  );
}
