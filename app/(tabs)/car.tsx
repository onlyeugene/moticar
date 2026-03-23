import { ScreenBackground } from '@/components/ScreenBackground';
import { View, Text } from 'react-native';
export default function CarScreen() {
  return (
    <ScreenBackground className="flex-1 justify-center items-center">
      <Text className="text-white">Car</Text>
    </ScreenBackground>
  );
}