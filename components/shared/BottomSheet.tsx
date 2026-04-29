import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  StyleSheet,
  DimensionValue,
  Platform,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomSheetProps {
  visible: boolean;
  onClose?: () => void;
  title: string | React.ReactNode;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  height?: DimensionValue;
  backgroundColor?: string;
  scrollable?: boolean;
  showCloseButton?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  footer?: React.ReactNode;
  contentPadding?: number;
}

export default function BottomSheet({
  visible,
  onClose,
  title,
  children,
  headerRight,
  backgroundColor = "#F0F0F0",
  height,
  scrollable = true,
  showCloseButton = true,
  leftIcon = "close",
  footer,
  contentPadding = 10,
}: BottomSheetProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.container, { backgroundColor, height }]}>
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6 px-4 pt-6">
            <View className="flex-row items-center gap-4 flex-1">
              {showCloseButton && (
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name={leftIcon} size={24} color="#101828" />
                </TouchableOpacity>
              )}
              {typeof title === "string" ? (
                <Text className="text-[#00343F] text-[16px] font-lexendBold">
                  {title}
                </Text>
              ) : (
                title
              )}
            </View>
            {headerRight}
          </View>

          {/* Content */}
          <View className="flex-1">
            {scrollable ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                contentContainerStyle={{
                  paddingHorizontal: contentPadding,
                  paddingBottom: keyboardHeight > 0 ? keyboardHeight + 40 : 40,
                }}
              >
                {children}
              </ScrollView>
            ) : (
              <View style={{ flex: 1, paddingHorizontal: contentPadding }}>{children}</View>
            )}
          </View>

          {/* Footer */}
          {footer && (
            <View className="px-4 pb-6 pt-2">
              {footer}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
});
