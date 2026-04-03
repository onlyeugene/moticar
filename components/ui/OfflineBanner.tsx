import React, { useEffect } from "react";
import { Text, View, StyleSheet, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsOffline } from "@/hooks/useIsOffline";

/**
 * A premium, animated notification banner that appears when the device is offline.
 * Slides down from the top and stays fixed under the status bar.
 */
export function OfflineBanner() {
  const isOffline = useIsOffline();
  const insets = useSafeAreaInsets();
  
  // Animation state
  const translateY = useSharedValue(-100);

  useEffect(() => {
    if (isOffline) {
      // Slide down into view
      translateY.value = withSpring(insets.top + (Platform.OS === 'ios' ? 0 : 10), {
        damping: 15,
        stiffness: 100,
      });
    } else {
      // Slide back up out of view
      translateY.value = withTiming(-100, { duration: 300 });
    }
  }, [isOffline, insets.top]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View 
      style={[styles.container, animatedStyle]} 
      className="absolute left-4 right-4 z-[9999]"
    >
      <View 
        className="bg-[#FBE74C] flex-row items-center justify-center py-3 px-4 rounded-full shadow-lg border border-[#E9F0F0]/20"
        style={styles.shadow}
      >
        <MaterialCommunityIcons name="wifi-off" size={20} color="#00343F" />
        <Text className="text-[#00343F] font-lexendSemiBold text-[13px] ml-2">
          No internet connection
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Fixed positioning is handled by translateY in the hook
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
});
