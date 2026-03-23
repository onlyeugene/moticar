import TabBar from '@/components/shared/tabs';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
   <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="car" />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="more" />
      <Tabs.Screen name="me" />
    </Tabs>
  );
}