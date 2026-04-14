// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide header for all auth screens
        gestureEnabled: false, // Disable by default
        animation: 'slide_from_right',
      }}
    >
      {/* Welcome - First screen, no swipe */}
      <Stack.Screen 
        name="welcome" 
        options={{
          gestureEnabled: false,
        }}
      />
      
      {/* Login - Enable swipe back to welcome */}
      <Stack.Screen 
        name="create" 
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />

      <Stack.Screen 
        name="otp"
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />

      <Stack.Screen 
        name="password"
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />

      <Stack.Screen 
        name="login"
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen 
        name="name"
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen 
        name="forgot-password"
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen 
        name="reset-password"
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
    </Stack>
  );
}