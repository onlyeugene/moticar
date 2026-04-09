import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { notificationService } from "@/services/api/notificationService";
import { useAuthStore } from "@/store/useAuthStore";

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const usePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  
  const { user } = useAuthStore();
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (!userId) return;

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        // Sync token with backend
        notificationService.registerPushToken(token).catch(err => 
          console.error("Failed to sync push token with backend:", err)
        );
      }
    });

    // Listen for incoming notifications while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
      // Handle badge count if provided in data
      const badgeCount = notification.request.content.badge;
      if (typeof badgeCount === 'number') {
        Notifications.setBadgeCountAsync(badgeCount).catch(() => {});
      }
    });

    // Listen for user interaction with a notification (tapping it)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log("Notification Tapped:", data);
      
      // Here you can implement deep linking logic based on data.type
      // e.g., if (data.type === 'alert') router.push('/diagnostics')
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [userId]);

  return { expoPushToken, notification };
};

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== "granted") {
      console.warn("Permission not granted for push notifications!");
      return;
    }

    const projectId = 
      Constants?.expoConfig?.extra?.eas?.projectId ?? 
      Constants?.easConfig?.projectId ?? 
      '';

    try {
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("Expo Push Token:", token);
    } catch (e) {
      console.error("Failed to get push token:", e);
    }
  } else {
    console.warn("Push notifications require a physical device");
  }

  return token;
}
