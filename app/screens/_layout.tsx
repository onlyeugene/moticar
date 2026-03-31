import { Stack } from "expo-router";
import React from "react";

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
      <Stack.Screen 
        name="manual/details" 
        options={{ 
          title: "Car Details",
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }} 
      />
      <Stack.Screen name="manual/final" options={{ title: "Final Details" }} />
      <Stack.Screen 
        name="scan/license" 
        options={{ 
          animation: "slide_from_right",
        }} 
      />
       <Stack.Screen 
        name="scan/license-details" 
        options={{ 
          animation: "fade_from_bottom",
          presentation: "transparentModal",
        }} 
      />
      <Stack.Screen 
        name="scan/details" 
        options={{ 
          animation: "fade_from_bottom",
          presentation: "transparentModal",
        }} 
      />
    </Stack>
  );
}
