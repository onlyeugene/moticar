import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import Obd from "@/assets/icons/buddie.svg";

interface MotiBuddieCrossSellSheetProps {
  visible: boolean;
  onClose: () => void;
  onDontShowAgain: (val: boolean) => void;
  onLearnMore: () => void;
  onGetOne: () => void;
}

export default function MotiBuddieCrossSellSheet({
  visible,
  onClose,
  onDontShowAgain,
  onLearnMore,
  onGetOne,
}: MotiBuddieCrossSellSheetProps) {
  const [dontShow, setDontShow] = useState(false);

  const handleToggle = () => {
    const newVal = !dontShow;
    setDontShow(newVal);
    onDontShowAgain(newVal);
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      height="65%"
      backgroundColor="#FDEF56"
      showCloseButton={true}
      title
    >
      <View className="flex-1 px-8 py-4">
        {/* OBD Icon Container */}
        <View className="items-center">
          <View className="w-[144px] h-[149px] rounded-full bg-[#29D7DE] items-center justify-center">
          <Obd />
        </View>

        <Text className="text-[#00343F] font-lexendBold text-[18px] text-center mb-4 mt-5">
          You are better off with a buddie!
        </Text>

        <Text className="text-[#00343F] font-lexendRegular text-[14px] text-center mb-10 leading-6">
          MotiBuddie is your eye on the car that helps with • log trips, track
          mileage, detect engine issues & predict maintenance
        </Text>
        </View>

        <TouchableOpacity
          onPress={handleToggle}
          className="flex-row items-center mb-10 gap-2"
        >
          <View
            className={`w-5 h-5 rounded-[6px] border  ${dontShow ? "bg-[#B8F2F4] border-[#29D7DE]" : "border-[#00232A33]"}`}
          >
            {dontShow && <Ionicons name="checkmark" size={14} color="#00AEB5" />}
          </View>
          <Text className="text-[#695858] font-lexendRegular text-[14px]">
            Don't show me this again
          </Text>
        </TouchableOpacity>

        <View className="w-full gap-4 flex-row">
          <TouchableOpacity
            onPress={onLearnMore}
            className="flex-1 py-4 rounded-full w-full border border-[#00343F] items-center"
          >
            <Text className="text-[#00343F] font-lexendSemiBold text-[14px]">
              Learn More
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onGetOne}
            className="flex-1 py-4 rounded-full w-full bg-[#00343F] items-center"
          >
            <Text className="text-[#FFFFFF] font-lexendBold text-[14px]">
              Get one today!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
}
