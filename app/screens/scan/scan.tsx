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
    description:
      "We will try to make it very easy to get \nonly the needed details",
  },
  {
    id: 2,
    title: "Capture your primary Vehicle paper",
    description:
      "Cutting down the time to manually \nenter the details of your car only",
  },
];
export default function Scan() {
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  return (
    <ScreenBackground>
      <Container>
        <View className="flex-row w-full items-center">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          <View className="items-center justify-center flex-1 flex-row  gap-4">
            <View className="w-[42px] h-[10px] rounded-full  bg-[#29D7DE] " />
            <View className="w-[42px] h-[10px] rounded-full  bg-[#09515D] " />
          </View>
          {/* <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/screens/manual/details",
                params: { make: "", model: "", year: "" },
              })
            }
          >
            <View className="flex-row items-center">
              <Text className="text-[#29D7DE] font-lexendMedium text-lg mr-1">
                Skip
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#29D7DE" />
            </View>
          </TouchableOpacity> */}
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
              <View
                key={scan.id}
                className="border rounded-[10px] px-[10px] py-[20px] border-[#2D5157] flex-row justify-between items-center"
              >
                <View className="flex-row items-start gap-2">
                  <View className="rounded-full border border-[#9BBABB]  w-[24px] h-[24px] items-center justify-center">
                    <Text className="text-[#FFFFFF] font-lexendBold text-[11px]">
                      {scan.id}
                    </Text>
                  </View>
                  <View>
                    <Text
                      className="text-[#87ECF0] text-[16px] font-lexendSemiBold"
                      numberOfLines={2}
                    >
                      {scan.title}
                    </Text>
                    <Text
                      className="text-[#9BBABB] text-[14px] font-lexendRegular "
                      numberOfLines={2}
                    >
                      {scan.description}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" color="#506D72" />
              </View>
            ))}
          </View>
        </View>

        <View className="pb-8 pt-4">
          <Pressable 
            className="flex-row items-start gap-3 mb-6"
            onPress={() => setIsConfirmed(!isConfirmed)}
          >
            <View className={`w-5 h-5 rounded border ${isConfirmed ? 'border-[#29D7DE] bg-[#29D7DE]' : 'border-[#29D7DE] bg-[#B8F2F4]'} items-center justify-center mt-0.5`}>
              {isConfirmed && <Ionicons name="checkmark" size={16} color="#00232A" />}
            </View>
            <Text className="text-[#FFFFFF] text-[14px] font-lexendRegular flex-1">
              I can confirm that the pictures of the car {'\n'}taken is mine
            </Text>
          </Pressable>
          
          <Pressable 
            disabled={!isConfirmed}
            className={`w-full h-[50px] rounded-full items-center justify-center ${isConfirmed ? 'bg-[#29D7DE]' : 'bg-[#29D7DE]/10'}`}
            onPress={() => router.push("/screens/scan/pictures")}
          >
            <Text className={`font-lexendBold text-[16px] ${isConfirmed ? 'text-[#00343F]' : 'text-[#00343F]'}`}>
              Next
            </Text>
          </Pressable>
        </View>
      </Container>
    </ScreenBackground>
  );
}
