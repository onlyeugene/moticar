import Container from "@/components/shared/container";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

const scanOptions = [
  {
    id: 1,
    title: "Take a picture of your car",
    description: "We will try to make it very easy to get \nonly the needed details",
    completed: true,
  },
  {
    id: 2,
    title: "Capture your primary Vehicle paper",
    description: "Cutting down the time to manually \nenter the details of your car only",
    completed: false,
  }, 
];

export default function CarConfirmed() {
  const [isConfirmed, setIsConfirmed] = React.useState(true);

  return (
    <ScreenBackground>
      <Container>
        <View className="flex-row w-full items-center">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          <View className="items-center justify-center flex-1 flex-row gap-4">
            <View className="w-[42px] h-[10px] rounded-full bg-[#29D7DE]" />
            <View className="w-[42px] h-[10px] rounded-full bg-[#29D7DE]" />
          </View>
        </View>

        <View className="flex-1">
          <View className="px-2 mt-5">
            <Text className="text-[26px] font-lexendMedium text-[#FFFFFF]">
              Add your first car!
            </Text>
            <Text className="text-[14px] font-lexendRegular text-[#9BBABB] mt-2">
              Start by adding the details of your personal car for a rich user
              experience
            </Text>
          </View>

          <View className="gap-3 mt-5">
            {scanOptions.map((scan) => (
              <TouchableOpacity
                key={scan.id}
                onPress={() => {
                  if (scan.id === 2) router.push("/screens/scan/license");
                }}
                className={`border rounded-[10px] px-[10px] py-[20px] flex-row justify-between items-center ${
                  scan.completed ? "border-[#29D7DE]/30 bg-[#29D7DE]/5" : "border-[#2D5157]"
                }`}
              >
                <View className="flex-row items-start gap-2">
                  {scan.completed ? (
                    <View className="rounded-full bg-[#29D7DE] w-[24px] h-[24px] items-center justify-center">
                      <Ionicons name="checkmark" size={16} color="#00232A" />
                    </View>
                  ) : (
                    <View className="rounded-full border border-[#9BBABB] w-[24px] h-[24px] items-center justify-center">
                      <Text className="text-[#FFFFFF] font-lexendBold text-[11px]">
                        {scan.id}
                      </Text>
                    </View>
                  )}
                  <View className="flex-1">
                    <Text
                      className={`text-[16px] font-lexendSemiBold ${
                        scan.completed ? "text-[#29D7DE]" : "text-[#87ECF0]"
                      }`}
                      numberOfLines={2}
                    >
                      {scan.title}
                    </Text>
                    <Text 
                      className="text-[#9BBABB] text-[14px] font-lexendRegular mt-1"
                      numberOfLines={2}
                    >
                      {scan.description}
                    </Text>
                  </View>
                </View>
                {!scan.completed && <Ionicons name="chevron-forward" color="#506D72" size={20} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="pb-8 pt-4">
          <Pressable
            className="flex-row items-start gap-3 mb-6"
            onPress={() => setIsConfirmed(!isConfirmed)}
          >
            <View
              className={`w-5 h-5 rounded border ${
                isConfirmed ? "border-[#29D7DE] bg-[#29D7DE]" : "border-[#29D7DE] bg-[#B8F2F4]"
              } items-center justify-center mt-0.5`}
            >
              {isConfirmed && <Ionicons name="checkmark" size={16} color="#00232A" />}
            </View>
            <Text className="text-[#FFFFFF] text-[14px] font-lexendRegular flex-1">
              I can confirm that the pictures of the car {'\n'}taken is mine
            </Text>
          </Pressable>

          <TouchableOpacity
            className="w-full h-[50px] bg-[#29D7DE] rounded-full items-center justify-center"
            onPress={() => router.push("/screens/scan/license")}
          >
            <Text className="font-lexendBold text-[16px] text-[#00343F]">
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </Container>
    </ScreenBackground>
  );
}
