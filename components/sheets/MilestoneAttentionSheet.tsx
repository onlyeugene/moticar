import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { useResolveMilestone } from "@/hooks/useActivity";
import { useUserCars } from "@/hooks/useCars";

interface MilestoneAttentionSheetProps {
  visible: boolean;
  onClose: () => void;
  milestone: any;
  carId: string;
}

export default function MilestoneAttentionSheet({
  visible,
  onClose,
  milestone,
  carId,
}: MilestoneAttentionSheetProps) {
  const { data: carsData } = useUserCars();
  const car = carsData?.cars?.find((c) => c.id === carId || (c as any)._id === carId);
  const currentManualMileage = car?.mileage || 0;

  const [selectedMileage, setSelectedMileage] = useState<number | null>(null);
  const { mutate: resolveMilestone, isPending } = useResolveMilestone();

  const handleConfirm = () => {
    if (!selectedMileage) return;

    resolveMilestone(
      {
        id: milestone.id,
        data: {
          status: "confirmed",
          mileage: selectedMileage,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Attention Needed"
      height="50%"
      backgroundColor="#001C21"
    >
      <View className="px-4">
        <Text className="text-[#81B4B4] font-lexendRegular text-[0.875rem] mb-6">
          We detected a discrepancy in your mileage readings. Please select the correct value to continue tracking accurately.
        </Text>

        <Text className="text-[#4FB8C8] font-lexendBold text-[0.75rem] uppercase mb-4 tracking-wider">
          SELECT ONE MILEAGE
        </Text>

        {/* Moticode Option */}
        <TouchableOpacity
          onPress={() => setSelectedMileage(milestone.mileage)}
          className={`flex-row items-center justify-between p-5 rounded-2xl mb-4 border ${
            selectedMileage === milestone.mileage
              ? "bg-[#00343F] border-[#00AEB5]"
              : "bg-transparent border-[#09515D]"
          }`}
        >
          <View className="flex-row items-center gap-4">
            <View className={`w-10 h-10 rounded-full items-center justify-center ${selectedMileage === milestone.mileage ? 'bg-[#00AEB5]' : 'bg-[#002D35]'}`}>
              <Ionicons name="bluetooth" size={20} color={selectedMileage === milestone.mileage ? "#00343F" : "#00AEB5"} />
            </View>
            <View>
              <Text className="text-white font-lexendBold text-[1.125rem]">
                {milestone.mileage.toLocaleString()}
              </Text>
              <Text className="text-[#81B4B4] font-lexendRegular text-[0.75rem]">
                From Moticode
              </Text>
            </View>
          </View>
          {selectedMileage === milestone.mileage && (
            <Ionicons name="checkmark-circle" size={24} color="#00AEB5" />
          )}
        </TouchableOpacity>

        {/* Manual Option */}
        <TouchableOpacity
          onPress={() => setSelectedMileage(currentManualMileage)}
          className={`flex-row items-center justify-between p-5 rounded-2xl mb-8 border ${
            selectedMileage === currentManualMileage
              ? "bg-[#00343F] border-[#00AEB5]"
              : "bg-transparent border-[#09515D]"
          }`}
        >
          <View className="flex-row items-center gap-4">
            <View className={`w-10 h-10 rounded-full items-center justify-center ${selectedMileage === currentManualMileage ? 'bg-[#00AEB5]' : 'bg-[#002D35]'}`}>
              <Ionicons name="create" size={20} color={selectedMileage === currentManualMileage ? "#00343F" : "#00AEB5"} />
            </View>
            <View>
              <Text className="text-white font-lexendBold text-[1.125rem]">
                {currentManualMileage.toLocaleString()}
              </Text>
              <Text className="text-[#81B4B4] font-lexendRegular text-[0.75rem]">
                From Manual Entry
              </Text>
            </View>
          </View>
          {selectedMileage === currentManualMileage && (
            <Ionicons name="checkmark-circle" size={24} color="#00AEB5" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleConfirm}
          disabled={!selectedMileage || isPending}
          className={`w-full py-4 rounded-full items-center ${
            !selectedMileage || isPending ? "bg-[#29D7DE]/50" : "bg-[#29D7DE]"
          }`}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#00343F" />
          ) : (
            <Text className="text-[#00343F] font-lexendBold text-[1rem]">
              Confirm mileage
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
