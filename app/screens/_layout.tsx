import { Stack } from "expo-router";
import React from "react";

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
      <Stack.Screen
        name="manual"
        options={{
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      />
      <Stack.Screen name="manual/details" options={{ title: "Car Details" }} />
      <Stack.Screen name="manual/final" options={{ title: "Final Details" }} />
      <Stack.Screen
        name="scan"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="motibuddie"
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
