import React from 'react';
import { View, Modal, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LoadingModalProps } from "@/types/ui";
import { RiveLoader } from './RiveLoader';

export const LoadingModal: React.FC<LoadingModalProps> = ({
  visible,
  message,
  riveSource,
  riveResourceName,
}) => {
  if (!visible) return null;

  const resolvedRiveSource = riveSource ?? require("../../assets/rive/loader.riv");
  const resolvedRiveResourceName = riveResourceName ?? "loader";

  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
      <View className="flex-1 justify-center items-center bg-black/30">
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        <View className="items-center justify-center">
          <RiveLoader
            source={resolvedRiveSource}
            resourceName={resolvedRiveResourceName}
            width={72}
            height={72}
            style={{ width: 82, height: 82, alignItems: 'center', justifyContent: 'center' }}
            color="#FBE74C"
          />
          {message && (
            <Text className="mt-4 text-base font-medium text-white text-center">
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};