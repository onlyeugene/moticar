import ActivityEmptyState from "@/components/activity/ActivityEmptyState";
import SpendsTab from "@/components/activity/SpendsTab";
import TripsTab from "@/components/activity/TripsTab";
import RemindersTab from "@/components/activity/RemindersTab";
import MileageMilestonesTab from "@/components/activity/MileageMilestonesTab";
import AddTripSheet from "@/components/sheets/AddTripSheet";

import AddReminderSheet from "@/components/sheets/AddReminderSheet";
import ReminderCategorySheet from "@/components/sheets/ReminderCategorySheet";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useReminders } from "@/hooks/useActivity";
import { Reminder, Trip } from "@/types/activity";

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

const TABS = ["Trips", "Mileage Milestones", "Spends", "Reminders"];

export default function ActivityScreen() {
  const { selectedCarId, activeActivityTab, setActiveActivityTab } = useAppStore();
  const [isAddTripVisible, setIsAddTripVisible] = useState(false);
  const [isAddReminderVisible, setIsAddReminderVisible] = useState(false);
  const [isCategoryListVisible, setIsCategoryListVisible] = useState(false);
  const [selectedReminderCategory, setSelectedReminderCategory] = useState("Toll Fee");
  const [selectedTripForEdit, setSelectedTripForEdit] = useState<Trip | null>(null);
  const [selectedReminderForEdit, setSelectedReminderForEdit] = useState<Reminder | null>(null);

  const user = useAuthStore((state) => state.user);
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);

  // Reminders fetching (global for the tab)
  const { data: remindersData, isLoading: isRemindersLoading } = useReminders(selectedCarId || "");

  // Get reminders for the currently selected category
  const categoryReminders = (remindersData?.reminders || []).filter(
    (r) => r.category === selectedReminderCategory
  );

  return (
    <View className="flex-1 bg-[#F5F7F7]">
      <View className="flex-1 pt-20 px-4">
        <Text className="text-[1.75rem] font-lexendBold mb-6 text-[#001A1F]">
          Activity
        </Text>

        {/* Sub-tabs Header */}
        <View className="mb-6 ">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pt-2"
          >
            <View className="flex-row gap-3">
              {TABS.map((tab) => {
                const isActive = activeActivityTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveActivityTab(tab)}
                    className={`px-4 py-2.5 rounded-[8px] items-center justify-center ${
                      isActive ? "bg-[#00AEB5]" : "bg-[#DEDEDE]"
                    }`}
                  >
                    <Text
                      className={`text-[0.75rem] font-lexendSemiBold ${
                        isActive ? "text-white" : "text-[#A1A1A1]"
                      }`}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Tab Content */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {activeActivityTab === "Trips" && (
            <TripsTab 
              onAddTrip={() => {
                setSelectedTripForEdit(null);
                setIsAddTripVisible(true);
              }} 
              onEditTrip={(trip) => {
                setSelectedTripForEdit(trip);
                setIsAddTripVisible(true);
              }}
            />
          )}

          {activeActivityTab === "Spends" && (
            <SpendsTab 
              currencySymbol={currencySymbol} 
            />
          )}

          {activeActivityTab === "Mileage Milestones" && (
            <MileageMilestonesTab carId={selectedCarId || ""} />
          )}

          {activeActivityTab === "Reminders" && (
            <RemindersTab 
              summary={remindersData?.summary} 
              isLoading={isRemindersLoading}
              onAdd={(cat) => {
                setSelectedReminderCategory(cat);
                setIsAddReminderVisible(true);
              }} 
              onSelectCategory={(cat) => {
                setSelectedReminderCategory(cat);
                setIsCategoryListVisible(true);
              }}
            />
          )}
        </ScrollView>
      </View>

      <AddTripSheet 
        visible={isAddTripVisible}
        onClose={() => {
          setIsAddTripVisible(false);
          setSelectedTripForEdit(null);
        }}
        carId={selectedCarId || ""}
        trip={selectedTripForEdit}
      />

      <AddReminderSheet 
        visible={isAddReminderVisible}
        onClose={() => {
          setIsAddReminderVisible(false);
          setSelectedReminderForEdit(null);
        }}
        category={selectedReminderCategory}
        carId={selectedCarId || ""}
        reminder={selectedReminderForEdit}
      />

      <ReminderCategorySheet
        visible={isCategoryListVisible}
        onClose={() => setIsCategoryListVisible(false)}
        category={selectedReminderCategory}
        reminders={categoryReminders}
        onAdd={() => {
          setIsCategoryListVisible(false);
          setIsAddReminderVisible(true);
        }}
        onEditReminder={(reminder) => {
          setIsCategoryListVisible(false);
          setSelectedReminderForEdit(reminder);
          setIsAddReminderVisible(true);
        }}
      />
    </View>
  );
}
