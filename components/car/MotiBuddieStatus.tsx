import MotiBuddieIcon from "@/assets/icons/motibuddie.svg";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import MotiIcon from "@/assets/icons/device.svg";

interface MotiBuddieStatusProps {
  plate?: string;
}

export function MotiBuddieStatus({ plate }: MotiBuddieStatusProps) {
  return (
    <View className="bg-[#013037] p-5 rounded-[20px] flex-row items-start mb-8 gap-4">
      <View
        className="items-center justify-center bg-[#29D7DE] h-14 w-14 rounded-full"
        style={{
          shadowColor: "#29D7DE",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 20,
          elevation: 20,
        }}
      >
        <MotiIcon width={35} height={19} />
      </View>
      <View className="flex-1">
        <Text className="text-white text-[16px] font-lexendBold mb-0.5">
          motibuddie detected
        </Text>
        <Text className="text-[#29D7DE] text-[10px] font-lexendBold mb-2">
          ID: {plate || "12121212311"}
        </Text>
        <Text className="text-[#BCBCBC] text-[10px] font-lexendRegular leading-[17px] mb-3">
          Nothing to be alarmed about. Your device can now read about your car.
          You have a buddie to count on.
        </Text>
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-2">
           <View className="bg-[#FEF597] px-2 py-2 rounded-full">
             <Ionicons name="location" size={13} color="#013037" />
           </View>
            <Text className="text-[#FBE74C] text-[10px] font-lexendRegular">
              Detected in Ikoyi, Lagos
            </Text>
          </View>
          <Text className="text-[#77A287] text-[10px] font-lexendRegular">
            453km away
          </Text>
        </View>
      </View>
    </View>
  );
}
