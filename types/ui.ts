import React from "react";
import { ViewProps, TextInputProps } from "react-native";
import { Control, FieldValues, Path } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

export interface ScreenBackgroundProps extends ViewProps {
  children: React.ReactNode;
  withSafeArea?: boolean;
}

export interface ContainerProps {
  children: React.ReactNode;
}

export interface ControlledInputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  containerClassName?: string;
  inputClassName?: string;
}

export interface SocialAuthProps {
  onAuth?: (type: string) => void;
  showEmail?: boolean;
  appleBg?: string;
  googleBg?: string;
  appleBorder?: string;
  googleBorder?: string;
  appleIconColor?: string;
  googleIconColor?: string;
  disabled?: boolean;
}

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

export interface ErrorTextProps {
  error?: string;
}
