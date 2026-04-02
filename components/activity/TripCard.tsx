import Location from "@/assets/icons/location.svg";
import LocationRound from "@/assets/icons/locationRound.svg";
import { Trip } from "@/types/activity";
import { formatDuration, formatTime } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Line } from "react-native-svg";
import Route from "@/assets/icons/route.svg";
import Info from "@/assets/icons/info.svg";

interface TripCardProps {
  trip: Trip;
  onPressDetails?: (trip: Trip) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onPressDetails }) => {
  const [showInsights, setShowInsights] = useState(false);
  const startTimeStr = formatTime(trip.startTime);
  const endTimeStr = trip.endTime ? formatTime(trip.endTime) : "In Progress";
  const durationStr = formatDuration(trip.durationMins);

  const activeInsights = [
    trip.insights?.ecoScore !== undefined ? "Eco Score" : null,
    (trip.insights?.hardBrakeCount ?? 0) > 0 ? "Hard Brakes" : null,
    (trip.insights?.rapidAccelerationCount ?? 0) > 0
      ? "Rapid Acceleration"
      : null,
    (trip.insights?.speedingDurationMins ?? 0) > 0 ? "Speeding" : null,
    (trip.insights?.idleDurationMins ?? 0) > 0 ? "Idle Time" : null,
  ].filter(Boolean);

  const insightCount = activeInsights.length;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPressDetails?.(trip)}
      className={`border border-[#F0F0F0] rounded-[6px]  mb-6 shadow-sm ${trip.source === "obd_gps" ? "bg-[#E6F7F8] border-[#AFEDEF]" : "bg-white"}`}
    >
      <View className="py-2">
        {trip.source === "obd_gps" && (
          <View className=" items-center justify-center gap-2">
            <Text className="text-[#29D7DE] text-[10px] font-lexendMedium">
              Detected automatically by your motibuddie
            </Text>
          </View>
        )}
      </View>
      <View className="flex-row items-start gap-3 px-4 py-2">
        {/* Timeline indicator */}
        <View className="items-center">
          <Location width={24} height={24} />
          <View className="my-1">
            <Svg height="40" width="2">
              <Line
                x1="1"
                y1="0"
                x2="1"
                y2="40"
                stroke="#29D7DE"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            </Svg>
          </View>
          <LocationRound width={24} height={24} />
        </View>

        <View className="flex-1 gap-6">
          <View>
            <Text
              className="text-[#00343F] text-[16px] font-lexendMedium"
              numberOfLines={1}
            >
              {trip.origin?.address || "Unknown Origin"}
            </Text>
            <Text
              className="text-[#979595] text-[11px] font-lexendRegular"
              numberOfLines={1}
            >
              {trip.description || "Start Location"}
            </Text>
          </View>

          <View className="w-full">
            <Svg height="1" width="100%">
              <Line
                x1="0"
                y1="0.5"
                x2="100%"
                y2="0.5"
                stroke="#EBEBEB"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            </Svg>
          </View>
          <View>
            <Text
              className="text-[#00343F] text-[16px] font-lexendMedium"
              numberOfLines={1}
            >
              {trip.destination?.address || "Unknown Destination"}
            </Text>
            <Text
              className="text-[#979595] text-[11px] font-lexendRegular"
              numberOfLines={1}
            >
              {trip.description || "Destination Location"}
            </Text>
          </View>
        </View>

        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={16} color="#ADADAD" />
        </TouchableOpacity>
      </View>

      <View className="h-[1px] bg-[#F0F0F0] my-2" />

      <View className="flex-row items-center justify-between px-4 py-2">
        <View className="flex-row items-center gap-1">
          <Ionicons name="alarm-outline" size={24} color="#ADADAD" />
          <View>
            <Text className="text-[#979595] text-[8px] font-lexendMedium">
              Time
            </Text>
            <Text className="text-[#ACA669] text-[11px] font-lexendRegular">
              {startTimeStr} - {endTimeStr}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1">
            <Text className="text-[#A39A35] text-[10px] font-lexendRegular">
              {durationStr}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Route width={15} height={15} />
            <Text className="text-[#00AEB5] text-[14px] font-lexendMedium">
              {trip.distanceKm}km
            </Text>
          </View>
        </View>
      </View>
      {trip.source === "obd_gps" && trip.insights && (
        <View className="bg-[#AFEDEF] border-t border-[#AFEDEF]">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowInsights(!showInsights)}
            className="px-4 py-2 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-2">
              <Info width={24} height={24} />
              <Text className="text-[#202A2A] text-[12px] font-lexendRegular">
                {insightCount === 1 ? "Insight" : "Insights"}
              </Text>
            </View>
           <View className="flex-row items-center gap-1">
             <View className="border border-[#29D7DE] bg-[#29D7DE] rounded-full items-center justify-center h-[26px] w-[35px]">
              <Text className="text-[#006C70] text-[14px] font-lexendRegular ">
                {insightCount}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color='#ADADAD'/>
           </View>
          </TouchableOpacity>

          {showInsights && (
            <View className="px-4 pb-3 flex-row flex-wrap gap-x-4 gap-y-2 border-t border-[#9EDEDF] pt-2">
              {trip.insights.ecoScore !== undefined && (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="leaf" size={12} color="#00343F" />
                  <Text className="text-[#00343F] text-[10px] font-lexendRegular">
                    Eco Score: {trip.insights.ecoScore}%
                  </Text>
                </View>
              )}
              {trip.insights.hardBrakeCount !== undefined &&
                trip.insights.hardBrakeCount > 0 && (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="warning" size={12} color="#D9534F" />
                    <Text className="text-[#D9534F] text-[10px] font-lexendRegular">
                      {trip.insights.hardBrakeCount} Hard Brakes
                    </Text>
                  </View>
                )}
              {trip.insights.rapidAccelerationCount !== undefined &&
                trip.insights.rapidAccelerationCount > 0 && (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="speedometer" size={12} color="#00343F" />
                    <Text className="text-[#00343F] text-[10px] font-lexendRegular">
                      {trip.insights.rapidAccelerationCount} Rapid Accel
                    </Text>
                  </View>
                )}
              {trip.insights.idleDurationMins !== undefined &&
                trip.insights.idleDurationMins > 0 && (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="hourglass" size={12} color="#00343F" />
                    <Text className="text-[#00343F] text-[10px] font-lexendRegular">
                      {Math.round(trip.insights.idleDurationMins)}m Idle
                    </Text>
                  </View>
                )}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default TripCard;
