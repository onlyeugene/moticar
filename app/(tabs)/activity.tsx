import ActivityEmptyState from "@/components/activity/ActivityEmptyState";
import SpendsTab from "@/components/activity/SpendsTab";
import TripsTab from "@/components/activity/TripsTab";
import RemindersTab from "@/components/activity/RemindersTab";
import AddTripSheet from "@/components/sheets/AddTripSheet";
import AddReminderSheet from "@/components/sheets/AddReminderSheet";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useReminders, useTrips, useActivitySpends } from "@/hooks/useActivity";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getCurrencySymbol } from "@/utils/currency";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TABS = ["Trips", "Mileage Milestones", "Spends", "Reminder"];

export default function ActivityScreen() {
  const { selectedCarId, activeActivityTab, setActiveActivityTab } = useAppStore();
  const [isAddTripVisible, setIsAddTripVisible] = useState(false);
  const [isAddReminderVisible, setIsAddReminderVisible] = useState(false);
  const [selectedReminderCategory, setSelectedReminderCategory] = useState("Toll Fee");
  const user = useAuthStore((state) => state.user);
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);

  // Fetch real data using hooks
  const { data: tripsData } = useTrips(selectedCarId || "");
  const { data: spendData } = useActivitySpends(selectedCarId || "");
  const { data: remindersData } = useReminders(selectedCarId || "");

  return (
    <View className="flex-1 bg-[#F0F0F0]">
      <View className="flex-1 pt-20 px-4">
        <Text className="text-[26px] font-lexendMedium mb-6 text-[#001A1F]">
          Activity
        </Text>

        {/* Sub-tabs Header */}
        <View className="mb-6 ">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pt-2"
          >
            <View className="flex-row gap-6">
              {TABS.map((tab) => {
                const isActive = activeActivityTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveActivityTab(tab)}
                    className="items-center pb-2 relative mb-3"
                  >
                    {isActive && (
                      <View className="w-1 h-1 rounded-full bg-[#293536] absolute -right-2 -top-1" />
                    )}
                    <Text
                      className={`text-[14px] font-lexendSemiBold ${
                        isActive ? "text-[#00AEB5]" : "text-[#C1C3C3]"
                      }`}
                    >
                      {tab}
                    </Text>
                    {isActive ? (
                      <View className="absolute bottom-[-4px] left-0 right-0 h-[1px] bg-[#00AEB5] rounded-full" />
                    ) : (
                      <View className="absolute bottom-[-4px] left-0 right-0 h-[1px] bg-[#FFFFFF] rounded-full" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Tab Content */}
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {activeActivityTab === "Trips" && (
            <TripsTab 
              trips={tripsData?.trips} 
              onAddTrip={() => setIsAddTripVisible(true)} 
            />
          )}
          
          {activeActivityTab === "Spends" && (
            <SpendsTab 
              spendData={spendData} 
              currencySymbol={currencySymbol} 
            />
          )}

          {activeActivityTab === "Mileage Milestones" && (
            <ActivityEmptyState tabName={activeActivityTab} />
          )}

          {activeActivityTab === "Reminder" && (
            <RemindersTab 
              summary={remindersData?.summary} 
              onAdd={(cat) => {
                setSelectedReminderCategory(cat);
                setIsAddReminderVisible(true);
              }} 
            />
          )}
        </ScrollView>
      </View>

      <AddTripSheet 
        visible={isAddTripVisible}
        onClose={() => setIsAddTripVisible(false)}
        carId={selectedCarId || ""}
      />

      <AddReminderSheet 
        visible={isAddReminderVisible}
        onClose={() => setIsAddReminderVisible(false)}
        category={selectedReminderCategory}
        carId={selectedCarId || ""}
      />
    </View>
  );
}
