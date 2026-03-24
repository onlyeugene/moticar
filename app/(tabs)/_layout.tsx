import TabBar from "@/components/shared/tabs";
import { useExpenseCategories } from "@/hooks/useExpenses";
import { useAppStore } from "@/store/useAppStore";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { selectedCarId } = useAppStore();
  const { data: categoriesData } = useExpenseCategories(selectedCarId);
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