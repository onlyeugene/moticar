import React from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { ContainerProps } from "@/types/ui";

export default function Container({ children }: ContainerProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 80,
          paddingBottom: 40,
        }}
        className="flex-1"
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
