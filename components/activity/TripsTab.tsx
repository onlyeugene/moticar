import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Trip } from "@/types/activity";
import TripCard from "./TripCard";
import ActivityEmptyState from "./ActivityEmptyState";

interface TripsTabProps {
  trips?: Trip[];
  onAddTrip?: () => void;
  onTripPress?: (trip: Trip) => void;
}

const TripsTab: React.FC<TripsTabProps> = ({ trips = [], onAddTrip, onTripPress }) => {
  if (trips.length === 0) {
    return (
      <View className="flex-1 px-4">
        <TouchableOpacity 
          onPress={onAddTrip}
          className="border border-[#29D7DE] rounded-full h-[40px] items-center justify-center flex-row gap-2 mb-8"
        >
          {/* <Ionicons name="add" size={20} color="#00AEB5" /> */}
          <Text className="text-[#00AEB5] text-[14px] font-lexendMedium">
            + Add new trip
          </Text>
        </TouchableOpacity>
          <ActivityEmptyState tabName="Trips" />
      </View>
    );
  }

  // Group trips by date
  const groupedTrips: Record<string, Trip[]> = {};
  trips.forEach(trip => {
    const date = new Date(trip.startTime);
    const dateKey = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long' }).toUpperCase();
    if (!groupedTrips[dateKey]) groupedTrips[dateKey] = [];
    groupedTrips[dateKey].push(trip);
  });

  const sortedDateKeys = Object.keys(groupedTrips).sort((a, b) => {
     // Naive sort for presentation, usually backend sorts by date
     return new Date(groupedTrips[b][0].startTime).getTime() - new Date(groupedTrips[a][0].startTime).getTime();
  });

  return (
    <View className="">
      <TouchableOpacity 
        onPress={onAddTrip}
        className=" border border-[#00AEB5] rounded-full h-[40px] items-center justify-center mb-8"
      >
        <Text className="text-[#00AEB5] text-[14px] font-lexendSemiBold">
          + Add new trip
        </Text>
      </TouchableOpacity>

      {sortedDateKeys.map(dateKey => (
        <View key={dateKey}>
          {/* Date Header */}
          <Text className="text-[#879090] text-[14px] font-lexendMedium mb-4">
            {dateKey}
          </Text>

          {groupedTrips[dateKey].map((trip, idx) => (
            <TripCard 
              key={trip.id || idx} 
              trip={trip} 
              onPressDetails={onTripPress}
            />
          ))}
        </View>
      ))}

      <Text className="text-[#ADADAD] text-[12px] font-lexendRegular text-center mt-10 mb-20">
        No more trips for this period
      </Text>
    </View>
  );
};

export default TripsTab;
