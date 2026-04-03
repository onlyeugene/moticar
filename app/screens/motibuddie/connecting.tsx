import MotiBuddieIcon from "@/assets/icons/motibuddie.svg";
import Container from "@/components/shared/container";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function Connecting() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 2000 }),
        withTiming(1, { duration: 2000 }),
      ),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000 }),
        withTiming(0.2, { duration: 2000 }),
      ),
      -1,
      true,
    );

    // Simulate successful connection after 3 seconds
    const timer = setTimeout(() => {
      router.replace("/screens/motibuddie/details");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <ScreenBackground>
      <Container>
        <View className="flex-1 items-center justify-center -mt-32">
          <View className="items-center justify-center">
            {/* Animated Glow Layers */}
            <Animated.View
              style={[styles.glow, glowStyle]}
              className="absolute w-48 h-48 rounded-full bg-[#29D7DE]"
            />
            <Animated.View
              style={[styles.glow, { opacity: 0.1 }]}
              className="absolute w-64 h-64 rounded-full bg-[#29D7DE]/20"
            />

            {/* Device Icon Container */}
            <View className="w-40 h-40 rounded-full bg-[#032529] border border-[#09515D] items-center justify-center shadow-2xl">
              <MotiBuddieIcon width={85} height={65} />
            </View>
          </View>

          <View className="mt-16 items-center">
            <Text className="text-white text-[26px] font-lexendMedium text-center">
              Connecting to device
            </Text>
            <Text className="text-[#9BBABB] font-lexendRegular text-[16px] mt-4 text-center leading-7">
              Please keep the vehicle in idle
            </Text>
          </View>
        </View>

        {/* Optional: Add a subtle loading indicator at the bottom if needed */}
      </Container>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  glow: {
    shadowColor: "#29D7DE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 15,
  },
});
