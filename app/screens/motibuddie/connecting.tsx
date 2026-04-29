import MotiBuddieIcon from "@/assets/icons/motibuddie.svg";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import Container from "@/components/shared/container";
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
import { obdService } from "@/services/api/obdService";

export default function Connecting() {
  const params = useLocalSearchParams<{ imei: string; deviceId?: string }>();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);
  const { socket, isConnected } = useSocket();
  const { showSnackbar } = useSnackbar();
  const [statusText, setStatusText] = useState("Please keep the vehicle in idle");

  // Block useObdLiveListener from interfering during pairing
  React.useEffect(() => {
    useAppStore.getState().setIsPairing(true);
    return () => {
      useAppStore.getState().setIsPairing(false);
    };
  }, []);

  useEffect(() => {
    // Pulse animation
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

    let done = false;
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    let discoveryTimeout: ReturnType<typeof setTimeout> | null = null;

    // ── Navigate to details screen with prefill data ──
    const handleDetected = (prefillData: Record<string, any>, imei: string) => {
      if (done) return;
      done = true;
      if (discoveryTimeout) clearTimeout(discoveryTimeout);
      if (pollInterval) clearInterval(pollInterval);

      showSnackbar({ message: "MotiBuddie Connected!", type: "success" });

      // Navigate to details screen — pass prefill data as params
      router.replace({
        pathname: "/screens/motibuddie/details",
        params: {
          imei,
          prefillData: JSON.stringify(prefillData),
        },
      });
    };

    // ── REST polling fallback (every 15s) ──
    if (params.deviceId) {
      pollInterval = setInterval(async () => {
        try {
          const res = await obdService.getConnectionStatus(params.deviceId!);
          // If REST poll says connected and car already exists (upgrade flow)
          if (res?.status === "connected" && res?.carId) {
            if (done) return;
            done = true;
            if (discoveryTimeout) clearTimeout(discoveryTimeout);
            if (pollInterval) clearInterval(pollInterval);
            showSnackbar({ message: "MotiBuddie Connected!", type: "success" });
            useAppStore.getState().setSelectedCarId(res.carId);
            router.replace("/(tabs)/car");
          }
        } catch {
          // silent — keep polling
        }
      }, 15000);
    }

    // ── Socket listeners ──
    if (isConnected && socket && params.imei) {
      console.log("📡 Joining device room:", params.imei);
      socket.emit("subscribe_device", { imei: params.imei });

      // Device registered but no GPS signal yet
      socket.on(
        "obd:device_silent",
        (data: { imei: string; message: string }) => {
          console.log("⏳ Device silent:", data.message);
          setStatusText("Device found! Waiting for first GPS signal...");
          showSnackbar({
            message: "Device Found!",
            description:
              "Waiting for GPS signal. Keep the engine running.",
            type: "success",
          });
        },
      );

      // ── New event: device detected, prefill data ready ──
      socket.on(
        "obd:device_detected",
        (data: {
          imei: string;
          prefillData: Record<string, any>;
          hasVin: boolean;
          message: string;
        }) => {
          console.log("✅ Socket: obd:device_detected", data);
          setStatusText(data.message || "Device connected!");
          handleDetected(data.prefillData, data.imei);
        },
      );

      // ── Upgrade flow: device already linked to a car ──
      socket.on(
        "obd:device_online",
        (data: { imei: string; car_id: string; metadata?: any }) => {
          console.log("✅ Socket: obd:device_online", data);
          if (data.car_id) {
            if (done) return;
            done = true;
            if (discoveryTimeout) clearTimeout(discoveryTimeout);
            if (pollInterval) clearInterval(pollInterval);
            showSnackbar({ message: "MotiBuddie Connected!", type: "success" });
            useAppStore.getState().setSelectedCarId(data.car_id);
            router.replace("/(tabs)/car");
          }
        },
      );

      // ── Timeout from server ──
      socket.on(
        "obd:pairing_timeout",
        (data: { imei: string; message: string }) => {
          if (done) return;
          done = true;
          if (discoveryTimeout) clearTimeout(discoveryTimeout);
          if (pollInterval) clearInterval(pollInterval);
          showSnackbar({
            message: "Connection timeout",
            description: data.message,
            type: "error",
          });
          router.back();
        },
      );

      socket.on("error", (err: { message: string }) => {
        if (done) return;
        console.error("Socket Error:", err.message);
        showSnackbar({ message: err.message, type: "error" });
      });
    }

    // 10-minute client-side timeout as last resort
    discoveryTimeout = setTimeout(() => {
      if (done) return;
      if (pollInterval) clearInterval(pollInterval);
      showSnackbar({
        message: "Still connecting...",
        description:
          "We couldn't detect your MotiBuddie. Make sure it's plugged in and the engine is running.",
        type: "error",
      });
      router.back();
    }, 600000);

    return () => {
      done = true;
      if (discoveryTimeout) clearTimeout(discoveryTimeout);
      if (pollInterval) clearInterval(pollInterval);
      if (socket) {
        socket.off("obd:device_online");
        socket.off("obd:device_detected");
        socket.off("obd:device_silent");
        socket.off("obd:pairing_timeout");
        socket.off("error");
      }
    };
  }, [isConnected, socket, params.imei, params.deviceId]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <ScreenBackground>
      <Container>
        <View className="flex-1 items-center justify-center -mt-32">
          <View className="items-center justify-center">
            <Animated.View
              style={[styles.glow, glowStyle]}
              className="absolute w-48 h-48 rounded-full bg-[#29D7DE]"
            />
            <Animated.View
              style={[styles.glow, { opacity: 0.1 }]}
              className="absolute w-64 h-64 rounded-full bg-[#29D7DE]/20"
            />
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