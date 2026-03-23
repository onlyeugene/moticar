import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenBackgroundProps } from "@/types/ui";

/**
 * A reusable background component that provides a dark teal gradient
 * matching the Moticar brand identity.
 */
export const ScreenBackground: React.FC<ScreenBackgroundProps> = ({
  children,
  withSafeArea = true,
  className,
  style,
  ...props
}) => {
  const content = (
    <LinearGradient
      colors={["#004852", "#013037"]}
      className={`flex-1 ${className || ""}`}
      style={[{ flex: 1 }, style]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      {...props}
    >
      {children}
    </LinearGradient>
  );

  return content;
};
