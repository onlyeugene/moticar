import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { useCreateMilestone } from "@/hooks/useActivity";
import { Ionicons } from "@expo/vector-icons";
import Speedometer from "@/assets/icons/car/speedometer.svg";

interface AddMileageSheetProps {
  visible: boolean;
  onClose: () => void;
  carId: string;
  initialMileage?: number;
}

export default function AddMileageSheet({
  visible,
  onClose,
  carId,
  initialMileage = 0,
}: AddMileageSheetProps) {
  const [mileage, setMileage] = useState(initialMileage.toString());
  const [description, setDescription] = useState("");
  
  const { mutate: createMilestone, isPending } = useCreateMilestone();

  const handleSave = () => {
    const numericMileage = parseInt(mileage);
    if (!carId || isNaN(numericMileage) || numericMileage <= initialMileage) return;


    createMilestone(
      {
        carId,
        mileage: numericMileage,
        description: description || "Manual mileage log",
      },
      {
        onSuccess: () => {
          onClose();
          setDescription("");
        },
      }
    );
  };

  const isInvalid = parseInt(mileage) <= initialMileage;

  const headerRight = (
    <TouchableOpacity
      onPress={handleSave}
      disabled={isPending || !mileage || isInvalid}
      className={`px-6 py-2 rounded-full ${isPending || !mileage || isInvalid ? "bg-[#29D7DE]/50" : "bg-[#29D7DE]"}`}
    >

      {isPending ? (
        <ActivityIndicator size="small" color="#00343F" />
      ) : (
        <Text className="text-[#00343F] font-lexendBold text-[14px]">
          Save
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Enter Mileage"
      headerRight={headerRight}
      height="50%"
    >
      <View className="px-4 pt-4">
        {/* Mileage Input Section */}
        <View 
          className="bg-white rounded-[12px] p-5 mb-4 flex-row items-center"
          style={styles.shadow}
        >
          <View className="mr-4">
            <Speedometer width={24} height={24} />
          </View>
          <View className="flex-1">
            <Text className="text-[#8B8B8B] text-[12px] font-lexendRegular mb-1">
              Current Mileage (km)
            </Text>
            <TextInput
              placeholder="e.g. 50,000"
              placeholderTextColor="#ADADAD"
              className={`text-[#00343F] font-lexendBold text-[18px] p-0 ${isInvalid ? "text-red-500" : ""}`}
              value={mileage}
              onChangeText={setMileage}
              keyboardType="numeric"
            />
          </View>
        </View>

        {isInvalid && (
          <View className="px-1 mb-4 flex-row items-center gap-1">
            <Ionicons name="alert-circle" size={14} color="#EF4444" />
            <Text className="text-red-500 font-lexendRegular text-[12px]">
              Mileage must be higher than {initialMileage.toLocaleString()} km
            </Text>
          </View>
        )}


        {/* Description Section */}
        <View 
          className="bg-white rounded-[12px] p-5 mb-6"
          style={styles.shadow}
        >
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="document-text-outline" size={18} color="#8B8B8B" />
            <Text className="text-[#8B8B8B] text-[12px] font-lexendRegular">
              Notes / Description
            </Text>
          </View>
          <TextInput
            placeholder="e.g. Morning commute, Trip to Lagos"
            placeholderTextColor="#ADADAD"
            className="text-[#00343F] font-lexendRegular text-[14px] p-0"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <Text className="text-[#4A8588] font-lexendRegular text-[12px] text-center px-6">
          This reading will update your car's total mileage and help track maintenance schedules.
        </Text>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
});

