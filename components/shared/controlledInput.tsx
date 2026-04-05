import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ErrorText } from "./ErrorText";
import { ControlledInputProps } from "@/types/ui";

export function ControlledInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  secureTextEntry = false,
  showPasswordToggle = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerClassName,
  inputClassName,
  ...rest
}: ControlledInputProps<T>) {
  const { className = "", ...props } = rest;
  const [isPasswordVisible, setPasswordVisible] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View className="mb-4 w-full">
          <View
            className={`rounded-xl border bg-[#012227] overflow-hidden ${
              error ? "border-[#ED5E5E]" : "border-[#09515D]"
            } ${containerClassName}`}
          >
            <View className="flex-row items-center px-4 min-h-[52px]">
              {leftIcon && (
                <Ionicons
                  name={leftIcon}
                  size={20}
                  color="#356D75"
                  className="mr-3"
                />
              )}
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                placeholderTextColor="#356D75"
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                className={`flex-1 font-lexendRegular text-white py-3 h-full ${inputClassName || ""} ${className}`}
                style={{ textAlignVertical: "center" }}
                {...props}
              />
              {error && (
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#ED5E5E"
                />
              )}
              {showPasswordToggle && !error && (
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!isPasswordVisible)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#7BA0A3"
                  />
                </TouchableOpacity>
              )}
              {rightIcon && !error && (
                <TouchableOpacity
                  onPress={onRightIconPress}
                  activeOpacity={0.7}
                  disabled={!onRightIconPress}
                >
                  <Ionicons name={rightIcon} size={22} color="#29D7DE" />
                </TouchableOpacity>
              )}
            </View>
            {error && (
              <View className="bg-[#ED5E5E] py-1.5  items-center">
                <Text className="font-lexendRegular text-xs text-white">
                  {error.message}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    />
  );
}
