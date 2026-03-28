import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { Text, View } from "react-native";
export default function ActivityScreen() {
  return (
    <ScreenBackground
    style={{
      backgroundColor: 'white'
    }}
    >
      <View className="mt-20 px-4">
        <Text className="text-[26px] font-lexendMedium ">Activity</Text>

        <View className="h-full bg-white">

        </View>
      </View>
    </ScreenBackground>
  );
}
