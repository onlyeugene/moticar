import { useState, useEffect } from "react";
import { Platform } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Android Mock Implementation for Push Notifications.
 * 
 * Remote notifications in Expo Go (Android) were removed in SDK 53+.
 * To prevent the app from crashing due to the expo-notifications package import,
 * we use this platform-specific file which does NOT import expo-notifications.
 */
export const usePushNotifications = () => {
  const [expoPushToken] = useState<string | undefined>(undefined);
  const [notification] = useState<any | undefined>(undefined);
  
  const { user } = useAuthStore();
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (!userId) return;
    
    // We intentionally do nothing here for Android in development (Expo Go)
    if (__DEV__) {
      console.log("📍 [usePushNotifications] Notifications are disabled on Android in Expo Go (SDK 53+).");
    }
  }, [userId]);

  return { expoPushToken, notification };
};
