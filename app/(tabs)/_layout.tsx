import TabBar from "@/components/shared/tabs";
import { useExpenseCategories } from "@/hooks/useExpenses";
import { Tabs } from "expo-router";

export default function TabLayout() {
  // useExpenseCategories is hoisted HERE (inside the navigator context)
  // NOT inside TabBar — which renders outside the navigation context boundary.
  // Moving it here prevents the upgrade-warning stringify from crashing
  // when it traverses props that contain navigation context getters.
  const { data: categoriesData } = useExpenseCategories();
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