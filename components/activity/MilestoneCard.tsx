import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import Speedometer from '@/assets/icons/speed.svg'

interface MilestoneCardProps {
  milestone: {
    id: string;
    mileage: number;
    source: "manual" | "moticode";
    description?: string;
    status: "pending" | "confirmed" | "rejected";
    timestamp: string;
  };
  delta?: number;
  gpsDistance?: number;
  onResolve?: () => void;
}



export default function MilestoneCard({ 
  milestone, 
  delta, 
  gpsDistance,
  onResolve 
}: MilestoneCardProps) {
  const isPending = milestone.status === "pending";
  const isMoticode = milestone.source === "moticode";

  return (
    <View className="p-4 mb-2">
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-start gap-4">
          <View className="items-center w-10">
            <Speedometer width={28} height={28} />
            <Text className="text-[#AFB4B4] font-lexendRegular text-[10px] mt-1">
              {format(new Date(milestone.timestamp), "HH:mm")}
            </Text>
          </View>
          
          <View className="flex-1">
            <View className="flex-row items-baseline gap-2">
              <Text className="text-[#001A1F] font-lexendMedium text-[16px]">
                {milestone.mileage.toLocaleString()}
              </Text>
              {delta !== undefined && delta > 0 && (
                <Text className="text-[#919D9D] font-lexendRegular text-[14px]">
                  + {delta.toLocaleString()}
                </Text>
              )}
            </View>
            <Text className="text-[#5D8689] font-lexendRegular text-[10px]">
              {milestone.description || (isMoticode ? "Moticode auto-sync" : "Manual mileage update")}
            </Text>
          </View>
        </View>

        <View className="items-end">
          {gpsDistance !== undefined && gpsDistance > 0 && (
            <Text className="text-[#00AEB5] font-lexendMedium text-[12px]">
              + approx. {gpsDistance.toFixed(0)}km
            </Text>
          )}
          
          {isPending && (
            <TouchableOpacity
              onPress={onResolve}
              className="bg-[#002D35] px-3 py-1.5 rounded-full mt-2"
            >
              <Text className="text-white font-lexendBold text-[10px]">Action needed</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
