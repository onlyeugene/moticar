import React, { useState, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Trip } from "@/types/activity";
import TripCard from "./TripCard";
import ActivityEmptyState from "./ActivityEmptyState";
import { DateNavigator, DateGrain } from "@/components/shared/DateNavigator";
import FilterGrainSheet from "@/components/sheets/FilterGrainSheet";
import { useTrips, useDeleteTrip } from "@/hooks/useActivity";
import { useAppStore } from "@/store/useAppStore";
import { LoadingModal } from "../ui/LoadingModal";

interface TripsTabProps {
  onAddTrip?: () => void;
  onTripPress?: (trip: Trip) => void;
  onEditTrip?: (trip: Trip) => void;
  onDeleteTrip?: (trip: Trip) => void;
}

const TripsTab: React.FC<TripsTabProps> = ({ 
  onAddTrip, 
  onTripPress,
  onEditTrip,
  onDeleteTrip
}) => {
  const { selectedCarId } = useAppStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterGrain, setFilterGrain] = useState<DateGrain>("Month");
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);

  // Filter params
  const monthParam = (selectedDate.getMonth() + 1).toString();
  const yearParam = selectedDate.getFullYear().toString();
  
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };
  const weekParam = filterGrain === "Week" ? getWeekNumber(selectedDate).toString() : undefined;

  const { data: rawTripsData, isLoading } = useTrips(
    selectedCarId || "", 
    filterGrain === "Month" || filterGrain === "Week" ? monthParam : undefined,
    yearParam,
    filterGrain === "Week" ? weekParam : undefined
  );

  const trips = useMemo(() => {
    if (!rawTripsData?.trips) return [];
    
    return rawTripsData.trips.filter(trip => {
      const tripDate = new Date(trip.startTime);
      const isSameYear = tripDate.getFullYear() === selectedDate.getFullYear();
      const isSameMonth = tripDate.getMonth() === selectedDate.getMonth();
      
      if (filterGrain === "Year") return isSameYear;
      if (filterGrain === "Month") return isSameYear && isSameMonth;
      if (filterGrain === "Week") {
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
  }, [rawTripsData, selectedDate, filterGrain]);

  const groupedTrips: Record<string, Trip[]> = {};
  trips.forEach(trip => {
    const date = new Date(trip.startTime);
    const dateKey = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long' }).toUpperCase();
    if (!groupedTrips[dateKey]) groupedTrips[dateKey] = [];
    groupedTrips[dateKey].push(trip);
  });

  const sortedDateKeys = Object.keys(groupedTrips).sort((a, b) => {
     return new Date(groupedTrips[b][0].startTime).getTime() - new Date(groupedTrips[a][0].startTime).getTime();
  });


    // if (isLoading) {
    //   return (
    //     <View className="flex-1 items-center justify-center pt-20">
    //       <LoadingModal visible={true} />
    //     </View>
    //   );
    // }

  return (
    <View className="flex-1">
      <LoadingModal visible={isLoading} />
      <DateNavigator
        selectedDate={selectedDate}
        onChange={setSelectedDate}
        grain={filterGrain}
        onFilterPress={() => setIsFilterSheetVisible(true)}
      />

      <TouchableOpacity 
        onPress={onAddTrip}
        className="border border-[#00AEB5] rounded-full h-[40px] items-center justify-center mb-8 mt-4"
      >
        <Text className="text-[#00AEB5] text-[0.875rem] font-lexendSemiBold">
          + Add new trip
        </Text>
      </TouchableOpacity>

      {trips.length === 0 ? (
        <ActivityEmptyState tabName="Trips" />
      ) : (
        sortedDateKeys.map(dateKey => (
          <View key={dateKey}>
            <Text className="text-[#879090] text-[0.875rem] font-lexendMedium mb-4">
              {dateKey}
            </Text>
            {groupedTrips[dateKey].map((trip, idx) => (
              <TripCard 
                key={trip.id || idx} 
                trip={trip} 
                onPressDetails={onTripPress}
                onEdit={onEditTrip}
                onDelete={onDeleteTrip}
              />
            ))}
          </View>
        ))
      )}

      {trips.length > 0 && (
        <Text className="text-[#ADADAD] text-[0.75rem] font-lexendRegular text-center mt-10 mb-20">
          No more trips for this period
        </Text>
      )}

      <FilterGrainSheet 
        visible={isFilterSheetVisible}
        onClose={() => setIsFilterSheetVisible(false)}
        selectedGrain={filterGrain}
        onSelect={setFilterGrain}
      />
    </View>
  );
};

export default TripsTab;
