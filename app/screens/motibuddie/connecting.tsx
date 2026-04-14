import MotiBuddieIcon from "@/assets/icons/motibuddie.svg";
import Container from "@/components/shared/container";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useSocket } from "@/providers/SocketProvider";
import { useAppStore } from "@/store/useAppStore";
import { useSnackbar } from "@/providers/SnackbarProvider";

export default function Connecting() {
  const params = useLocalSearchParams<{ imei: string }>();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);
  const { socket, isConnected } = useSocket();
  const selectedCarId = useAppStore((state) => state.selectedCarId);
  const { showSnackbar } = useSnackbar();
  const [statusText, setStatusText] = useState("Please keep the vehicle in idle");

  useEffect(() => {
    // ... animation logic ...
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

    let discoveryTimeout: any;

    if (isConnected && socket && params.imei) {
      console.log("📡 Subscribing to Device (Discovery):", params.imei);
      socket.emit("subscribe_device", { imei: params.imei });

      // 5 minute timeout to match the server-side watcher
      discoveryTimeout = setTimeout(() => {
        showSnackbar({
          message: "Connection Timed Out",
          description:
            "We couldn't detect your MotiBuddie. Please ensure it's plugged in and the engine is running.",
          type: "error",
        });
        router.back();
      }, 300000);

      // Device is registered on Hero but hasn't sent GPS data yet
      socket.on("obd:device_silent", (data: { imei: string; message: string }) => {
        console.log("⏳ Device silent:", data.message);
        setStatusText("Device found! Waiting for first GPS signal...");
        showSnackbar({
          message: "Device Found!",
          description: "Waiting for the first GPS signal. This may take a moment.",
          type: "success",
        });
      });

      socket.on("obd:device_online", (data: { imei: string; car_id: string; metadata?: any }) => {
        if (discoveryTimeout) clearTimeout(discoveryTimeout);
        console.log("✅ MotiBuddie is Online!", data);
        showSnackbar({ message: "MotiBuddie Connected!", type: "success" });
        
        // Store the new car_id so details.tsx can fetch by it
        if (data.car_id) {
          useAppStore.getState().setSelectedCarId(data.car_id);
        }

        router.replace("/screens/motibuddie/details");
      });

      socket.on("error", (err: { message: string }) => {
        if (discoveryTimeout) clearTimeout(discoveryTimeout);
        console.error("Socket Error:", err.message);
        showSnackbar({ message: err.message, type: "error" });
        router.back();
      });
    }

    return () => {
      if (discoveryTimeout) clearTimeout(discoveryTimeout);
      if (socket) {
        socket.off("obd:device_online");
        socket.off("obd:device_silent");
        socket.off("error");
      }
    };
  }, [isConnected, socket, params.imei]);

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
            <Text className="text-[#9BBABB] font-lexendRegular text-[14px] mt-2 text-center">
              {statusText}
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
