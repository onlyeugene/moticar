import TabBar from "@/components/shared/tabs";
import { useUserCars } from "@/hooks/useCars"; // Added
import { useExpenseCategories } from "@/hooks/useExpenses";
import { useAppStore } from "@/store/useAppStore";
import { Tabs } from "expo-router";
import { useObdLiveListener } from "@/hooks/useObdLiveListener";

export default function TabLayout() {
  useObdLiveListener(); // Initialize global OBD listener
  const { selectedCarId } = useAppStore();
  const { data: carsData } = useUserCars(); // Added

  // Fallback: Use selectedCarId if valid, otherwise first available car
  const activeCarId =
    carsData?.cars?.find((c) => (c.id || (c as any)._id) === selectedCarId)
      ? selectedCarId
      : carsData?.cars?.[0]?.id || (carsData?.cars?.[0] as any)?._id;

  const { data: categoriesData } = useExpenseCategories(activeCarId);
  const categories = categoriesData?.categories || [];

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} categories={categories} />}
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