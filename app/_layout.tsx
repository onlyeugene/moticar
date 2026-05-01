// Ensures this layout is rendered on the client (Expo Router).
"use client";

// ThemeProvider removed - in React Navigation v7 it calls useNavigation() internally
// which causes "Couldn't find a navigation context" during API-driven re-renders
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { LoadingModal } from "../components/ui/LoadingModal";
import "../global.css";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { QueryProvider } from "../providers/QueryProvider";
import { SnackbarProvider } from "../providers/SnackbarProvider";
import { SocketProvider } from "../providers/SocketProvider";
import { PreferenceInitializer } from "@/components/shared/PreferenceInitializer";
import { rem } from "nativewind";
import { Dimensions, useWindowDimensions } from "react-native";

// configureReanimatedLogger removed as it is handled by Reanimated directly in newer versions
// if needed, it should be inside RootLayout or at the top level

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { width, fontScale } = useWindowDimensions();

  // Set responsive base font size (rem)
  useEffect(() => {
    rem.set((width / 375) * 16 * fontScale);
  }, [width, fontScale]);

  const [isHydrated, setIsHydrated] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    "LexendDeca-Thin": require("../assets/fonts/LexendDeca-Thin.ttf"),
    "LexendDeca-ExtraLight": require("../assets/fonts/LexendDeca-ExtraLight.ttf"),
    "LexendDeca-Light": require("../assets/fonts/LexendDeca-Light.ttf"),
    "LexendDeca-Regular": require("../assets/fonts/LexendDeca-Regular.ttf"),
    "LexendDeca-Medium": require("../assets/fonts/LexendDeca-Medium.ttf"),
    "LexendDeca-SemiBold": require("../assets/fonts/LexendDeca-SemiBold.ttf"),
    "LexendDeca-Bold": require("../assets/fonts/LexendDeca-Bold.ttf"),
    "LexendDeca-ExtraBold": require("../assets/fonts/LexendDeca-ExtraBold.ttf"),
    "LexendDeca-Black": require("../assets/fonts/LexendDeca-Black.ttf"),
    UkNumberPlate: require("../assets/fonts/UKNumberPlate.ttf"),
  });

  useEffect(() => {
    const initStores = async () => {
      try {
        await Promise.all([
          useAuthStore.persist.rehydrate(),
          useAppStore.persist.rehydrate(),
        ]);
      } catch (error) {
        console.error("❌ Hydration failed:", error);
      } finally {
        setIsHydrated(true);
      }
    };

    initStores();
  }, []);

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  const hasHiddenSplash = useRef(false);

  useEffect(() => {
    async function hideSplashScreen() {
      if (fontsLoaded && isHydrated && !hasHiddenSplash.current) {
        try {
          hasHiddenSplash.current = true;
          await SplashScreen.hideAsync();
        } catch (e) {
          // Silence 'No native splash screen registered' error
        }
      }
    }
    hideSplashScreen();
  }, [fontsLoaded, isHydrated]);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setPositionAsync("relative").catch(() => {});
      NavigationBar.setBackgroundColorAsync("#013037").catch(() => {});
      NavigationBar.setButtonStyleAsync("light").catch(() => {});
    }
  }, []);

  // Initialize Push Notifications
  usePushNotifications();

  if (!fontsLoaded || !isHydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <PaperProvider>
        <SnackbarProvider>
          <QueryProvider>
            <SocketProvider>
              <PreferenceInitializer />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(onboarding)" />
                <Stack.Screen name="screens" />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal" }}
                />
              </Stack>
            </SocketProvider>
            {/* <OfflineBanner /> */}
          </QueryProvider>
          <LoadingModal visible={false} />
        </SnackbarProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
