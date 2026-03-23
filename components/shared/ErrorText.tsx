import React from 'react';
import { Text, View } from 'react-native';
import { ErrorTextProps } from "@/types/ui";

export const ErrorText: React.FC<ErrorTextProps> = ({ error }) => {
  if (!error) return null;

  return (
    <View className="mt-1">
      <Text className="font-lexendRegular text-xs text-red-500">{error}</Text>
    </View>
  );
};