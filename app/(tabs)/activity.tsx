import { ScreenBackground } from '@/components/ScreenBackground';
import { View, Text } from 'react-native';
export default function ActivityScreen() {
  return (
    <ScreenBackground style={{ flex: 1, backgroundColor: '#0D2B2B', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#E8FAF6' }}>Activity</Text>
    </ScreenBackground>
  );
}