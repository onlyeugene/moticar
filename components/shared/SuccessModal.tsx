import { View, Text, Modal, Pressable, TouchableOpacity } from "react-native";
import ConfettiIcon from "@/assets/icons/confetti.svg";
import { BlurView } from "expo-blur";

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  message?: string;
}

export default function SuccessModal({
  visible,
  onClose,
  message,
}: SuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView
        intensity={50}
        tint="dark"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <View className="flex-1  justify-center items-center px-6">
        <Pressable className="absolute inset-0" onPress={onClose} />
        <View className="bg-[#B8F2F4]  w-full overflow-hidden rounded-[8px]">
          <View className="items-center justify-center  py-10">
            <View className="mb-6 items-center justify-center">
              <ConfettiIcon
               width={186} height={128} 
               />
            </View>

            <Text className="text-[#00343F] text-[1.5rem] font-lexendMedium text-center">
              Success!
            </Text>

            <Text className="text-[#00343F] text-[0.875rem] font-lexendRegular text-center ">
              You have successfully added an {"\n"}expense to your timeline
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
