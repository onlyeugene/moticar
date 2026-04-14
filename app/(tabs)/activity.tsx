import ActivityEmptyState from "@/components/activity/ActivityEmptyState";
import SpendsTab from "@/components/activity/SpendsTab";
import TripsTab from "@/components/activity/TripsTab";
import RemindersTab from "@/components/activity/RemindersTab";
import MileageMilestonesTab from "@/components/activity/MileageMilestonesTab";
import AddTripSheet from "@/components/sheets/AddTripSheet";

import AddReminderSheet from "@/components/sheets/AddReminderSheet";
import ReminderCategorySheet from "@/components/sheets/ReminderCategorySheet";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useReminders, useTrips, useActivitySpends, useDeleteTrip } from "@/hooks/useActivity";
import { Trip } from "@/types/activity";

import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getCurrencySymbol } from "@/utils/currency";
import { DateNavigator, DateGrain } from "@/components/shared/DateNavigator";
import FilterGrainSheet from "@/components/sheets/FilterGrainSheet";
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterGrain, setFilterGrain] = useState<DateGrain>("Month");
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [selectedTripForEdit, setSelectedTripForEdit] = useState<Trip | null>(null);


  const user = useAuthStore((state) => state.user);
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);

  // Helper for week number
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Prepare filter params
  const monthParam = (selectedDate.getMonth() + 1).toString();
  const yearParam = selectedDate.getFullYear().toString();
  const weekParam = filterGrain === "Week" ? getWeekNumber(selectedDate).toString() : undefined;

  // Fetch real data using hooks with filters
  const { data: rawTripsData } = useTrips(
    selectedCarId || "", 
    filterGrain === "Month" || filterGrain === "Week" ? monthParam : undefined,
    yearParam,
    filterGrain === "Week" ? weekParam : undefined
  );
  const { data: rawSpendData } = useActivitySpends(
    selectedCarId || "",
    filterGrain === "Month" || filterGrain === "Week" ? monthParam : undefined,
    yearParam
  );
  const { data: remindersData } = useReminders(selectedCarId || "");
  const { mutate: deleteTrip } = useDeleteTrip();


  // Client-side filtering as a safeguard and to ensure precision
  const tripsData = React.useMemo(() => {
    if (!rawTripsData?.trips) return { trips: [], count: 0 };
    
    const filtered = rawTripsData.trips.filter(trip => {
      const tripDate = new Date(trip.startTime);
      const isSameYear = tripDate.getFullYear() === selectedDate.getFullYear();
      const isSameMonth = tripDate.getMonth() === selectedDate.getMonth();
      
      if (filterGrain === "Year") return isSameYear;
      if (filterGrain === "Month") return isSameYear && isSameMonth;
      if (filterGrain === "Week") {
        // Find start and end of the selected week (Sun-Sat)
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        return tripDate >= startOfWeek && tripDate <= endOfWeek;
      }
      return true;
    });

    return { trips: filtered, count: filtered.length };
  }, [rawTripsData, selectedDate, filterGrain]);

  const spendData = React.useMemo(() => {
    if (!rawSpendData) return undefined;
    
    const filteredExpenses = (rawSpendData.expenses || []).filter(exp => {
      const expDate = new Date(exp.date);
      const isSameYear = expDate.getFullYear() === selectedDate.getFullYear();
      const isSameMonth = expDate.getMonth() === selectedDate.getMonth();
      
      if (filterGrain === "Year") return isSameYear;
      if (filterGrain === "Month") return isSameYear && isSameMonth;
      if (filterGrain === "Week") {
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        return expDate >= startOfWeek && expDate <= endOfWeek;
      }
      return true;
    });

    return { ...rawSpendData, expenses: filteredExpenses };
  }, [rawSpendData, selectedDate, filterGrain]);

  // Get reminders for the currently selected category
  const categoryReminders = (remindersData?.reminders || []).filter(
    (r) => r.category === selectedReminderCategory
  );

  return (
    <View className="flex-1 bg-[#F5F7F7]">
      <View className="flex-1 pt-20 px-4">
        <Text className="text-[28px] font-lexendBold mb-6 text-[#001A1F]">
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
                      className={`text-[12px] font-lexendSemiBold ${
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

        {(activeActivityTab === "Trips" || activeActivityTab === "Spends") && (
          <DateNavigator
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            grain={filterGrain}
            onFilterPress={() => setIsFilterSheetVisible(true)}
          />
        )}

        {/* Tab Content */}
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        >
          {activeActivityTab === "Trips" && (
            <TripsTab 
              trips={tripsData?.trips} 
              onAddTrip={() => {
                setSelectedTripForEdit(null);
                setIsAddTripVisible(true);
              }} 
              onEditTrip={(trip) => {
                setSelectedTripForEdit(trip);
                setIsAddTripVisible(true);
              }}
              onDeleteTrip={(trip) => {
                if (trip.id) {
                  deleteTrip({ id: trip.id, carId: selectedCarId || "" });
                }
              }}
            />
          )}

          
          {activeActivityTab === "Spends" && (
            <SpendsTab 
              spendData={spendData} 
              currencySymbol={currencySymbol} 
            />
          )}

          {activeActivityTab === "Mileage Milestones" && (
            <MileageMilestonesTab carId={selectedCarId || ""} />
          )}


          {activeActivityTab === "Reminders" && (
            <RemindersTab 
              summary={remindersData?.summary} 
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
        onClose={() => setIsAddReminderVisible(false)}
        category={selectedReminderCategory}
        carId={selectedCarId || ""}
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
      />

      <FilterGrainSheet 
        visible={isFilterSheetVisible}
        onClose={() => setIsFilterSheetVisible(false)}
        selectedGrain={filterGrain}
        onSelect={setFilterGrain}
      />
    </View>
  );
}
