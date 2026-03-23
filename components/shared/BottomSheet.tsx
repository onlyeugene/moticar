import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  StyleSheet,
  DimensionValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  height?: DimensionValue;
  backgroundColor?: string;
}

export default function BottomSheet({
  visible,
  onClose,
  title,
  children,
  headerRight,
  backgroundColor = "#F0F0F0",
  height,
}: BottomSheetProps) {
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
            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#7A7A7C" />
              </TouchableOpacity>
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
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingHorizontal: 10, 
              paddingBottom: 20,
            }}
          >
            {children}
          </ScrollView>
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
