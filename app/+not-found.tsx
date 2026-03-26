import Container from "@/components/shared/container";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <ScreenBackground>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Container>
        <View className="flex-1 items-center justify-center -mt-20">
          <Ionicons name="alert-circle-outline" size={80} color="#43E4E9" />

          <Text className="text-white text-[28px] font-lexendBold mt-6 text-center">
            Lost in the Clouds?
          </Text>

          <Text className="text-[#9BBABB] font-lexendRegular text-[16px] mt-4 text-center px-8">
            This screen doesn't exist or has been moved to another destination.
          </Text>

          <Link href="/" className="mt-12">
            <View className="bg-[#29D7DE] px-8 py-4 rounded-full active:opacity-90">
              <Text className="text-[#00343F] font-lexendBold text-[16px]">
                Go to home screen
              </Text>
            </View>
          </Link>
        </View>
      </Container>
    </ScreenBackground>
  );
}
