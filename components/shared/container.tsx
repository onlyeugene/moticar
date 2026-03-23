import React from "react";
import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import { ContainerProps } from "@/types/ui";

export default function Container({ children }: ContainerProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 mt-20 px-4">{children}</View>
    </TouchableWithoutFeedback>
  );
}
