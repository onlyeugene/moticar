import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Ellipse } from "react-native-svg";
import { ScreenBackgroundProps } from "@/types/ui";

/**
 * A reusable background component that provides a dark teal background
 * with a prominent top-center cyan glow matching the Moticar brand identity.
 */
export const ScreenBackground: React.FC<ScreenBackgroundProps> = ({
  children,
  withSafeArea = true,
  className,
  style,
  ...props
}) => {
  return (
    <View 
      className={`flex-1 ${className || ""}`}
      style={[styles.container, style]} 
      {...props}
    >
      <View style={styles.glowContainer}>
        <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient
              id="topGlow"
              cx="50%"
              cy="0%"
              rx="80%"
              ry="50%"
              fx="50%"
              fy="0%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#29D7DE" stopOpacity="0.6" />
              <Stop offset="0.5" stopColor="#00AEB5" stopOpacity="0.25" />
              <Stop offset="100%" stopColor="#013037" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="50%" cy="0%" rx="80%" ry="50%" fill="url(#topGlow)" />
        </Svg>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#002E35",
    flex: 1,
  },
  glowContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "60%",
    pointerEvents: "none",
  },
});
