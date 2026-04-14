import ManualIcon from "@/assets/icons/manual.svg";
import MotiBuddieIcon from "@/assets/icons/motibuddie.svg";
import CarIcon from "@/assets/icons/takepic.svg";
import Container from "@/components/shared/container";
import CurrencySelector from "@/components/shared/CurrencySelector";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useUpdateProfile } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const options = [
  {
    id: 1,
    title: "Plug motiBuddie",
    description: "Get better precision on your car info using OBD2 device",
    icon: MotiBuddieIcon,
  },
  {
    id: 2,
    title: "Take Pictures",
    description: "Get info by taking 3 photos of your car",
    icon: CarIcon,
  },
  {
    id: 3,
    title: "Enter Manually",
    description: "Doing it the crude way and entering data",
    icon: ManualIcon,
  },
];
export default function AddCar() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const updateProfile = useUpdateProfile();
  const { showSnackbar } = useSnackbar();
  const resetScanningState = useAppStore((state) => state.resetScanningState);

  // Clear scanning state on mount for a clean slate
  React.useEffect(() => {
    resetScanningState();
  }, []);

  const handleSkip = () => {
    updateProfile.mutate(
      { onboardingCompleted: true },
      {
        onSuccess: () => {
          router.replace("/(tabs)");
        },
        onError: () => {
          showSnackbar({
            type: "error",
            message: "Failed to skip onboarding",
            description: "Please try again.",
          });
        },
      },
    );
  };

  return (
    <ScreenBackground>
      <Container>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            <View className="flex-row items-center gap-4">
              {/* <CurrencySelector variant="auth" /> */}
              <Pressable
                onPress={handleSkip}
                disabled={updateProfile.isPending}
                className="flex-row items-center gap-2"
              >
                {updateProfile.isPending ? (
                  <ActivityIndicator size="small" color="#00AEB5" />
                ) : (
                  <>
                    <Text className="text-[#00AEB5] font-lexendMedium text-[16px]">
                      Skip
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#00AEB5"
                    />
                  </>
                )}
              </Pressable>
            </View>
          </View>

          <View className="mt-8">
            <Text className="text-white text-[26px] font-lexendMedium">
              Add your car details
            </Text>
            <Text className="text-[#9BBABB] font-lexendRegular text-[14px] mt-2 leading-6">
              Start by adding the details of your personal car for a {"\n"}rich
              user experience
            </Text>
          </View>

          <View className="mt-10 gap-4">
            {/* Option 1: Plug motiBuddie (Featured Card) */}
            <Pressable
              onPress={() => setSelectedOption(1)}
              className={`w-full p-6 border rounded-[20px] items-center ${
                selectedOption === 1 ? "border-[#00AEB5]" : "border-[#09515D]"
              }`}
            >
              <View className="mb-4">
                <MotiBuddieIcon width={68} height={52} />
              </View>
              <Text className="text-white text-[16px] font-lexendMedium text-center">
                Plug motiBuddie
              </Text>
              <Text className="text-[#9BBABB] text-[12px] font-lexendRegular text-center mt-2">
                Get better precision on your car info using OBD2 device
              </Text>

              <View className="flex-row gap-4 mt-4 items-end">
                <Pressable>
                  <Text className="text-primary font-lexendRegular text-[12px]">
                    Where to plug
                  </Text>
                </Pressable>
                <View className="rounded-full border border-[#9BBABB] bg-[#9BBABB] h-[2px] w-[2px]" />
                <Pressable>
                  <Text className="text-primary font-lexendRegular text-[12px]">
                    Where to Buy
                  </Text>
                </Pressable>
              </View>
            </Pressable>

            {/* Grid for Option 2 & 3 */}
            <View className="flex-row gap-4">
              {/* Take Pictures */}
              <Pressable
                onPress={() => setSelectedOption(2)}
                className={`flex-1 p-8 border rounded-[20px] items-center min-h-[180px] justify-between ${
                  selectedOption === 2 ? "border-[#00AEB5]" : "border-[#09515D]"
                }`}
              >
                <View className="items-center">
                  <View className="">
                    <CarIcon width={67} height={67} />
                  </View>
                </View>
                <View>
                  <Text className="text-white text-[16px] font-lexendBold text-center">
                    Take Pictures
                  </Text>
                  <Text className="text-[#9BBABB] text-[12px] font-lexendRegular text-center">
                    Get info by taking 3 photos of your car
                  </Text>
                </View>
              </Pressable>

              {/* Enter Manually */}
              <Pressable
                onPress={() => setSelectedOption(3)}
                className={`flex-1 p-8 border rounded-[20px] items-center min-h-[180px] justify-between ${
                  selectedOption === 3 ? "border-[#00AEB5]" : "border-[#09515D]"
                }`}
              >
                <View className="items-center">
                  <View className="">
                    <ManualIcon width={62} height={68} />
                  </View>
                </View>
                <View>
                  <Text className="text-white text-[16px] font-lexendBold text-center">
                    Enter Manually
                  </Text>
                  <Text className="text-[#9BBABB] text-[12px] font-lexendRegular text-center">
                    Doing it the crude way and entering data
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        <View className="mb-10">
          <Pressable
            disabled={!selectedOption}
            onPress={() => {
              if (selectedOption === 1) {
                router.replace("/screens/motibuddie/plug");
              } else if (selectedOption === 2) {
                router.replace("/screens/scan/scan");
              } else if (selectedOption === 3) {
                router.replace("/screens/manual/search");
              } else {
                
              }
            }}
            className={`w-full h-[54px] rounded-full items-center justify-center ${
              !selectedOption ? "bg-[#09515D]/60" : "bg-[#29D7DE]"
            }`}
          >
            <Text className="font-lexendBold text-[16px] text-[#00343F]">
              Next
            </Text>
          </Pressable>
        </View>
      </Container>
    </ScreenBackground>
  );
}
