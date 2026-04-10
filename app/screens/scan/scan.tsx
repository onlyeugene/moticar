import Container from "@/components/shared/container";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { CarLogo } from "@/components/shared/CarLogo";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

export default function Scan() {
  const { scanningProgress, scannedCarData } = useAppStore();
  const { picturesCompleted, licenseCompleted } = scanningProgress;
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  const scanOptions = [
    {
      id: 1,
      title: "Take a picture of your car",
      description:
        "We will try to make it very easy to get \nonly the needed details",
      completed: picturesCompleted,
      route: "/screens/scan/pictures",
    },
    {
      id: 2,
      title: "Capture your primary Vehicle paper",
      description:
        "Cutting down the time to manually \nenter the details of your car only",
      completed: licenseCompleted,
      route: "/screens/scan/license",
    },
  ];

  const handleNext = () => {
    if (!picturesCompleted) {
      router.push("/screens/scan/pictures");
    } else if (!licenseCompleted) {
      router.push("/screens/scan/license");
    } else if (isConfirmed) {
      router.push("/screens/scan/finalize");
    }
  };

  const handleBack = () => {
    router.replace("/(onboarding)");
  };

  const isFlowComplete = picturesCompleted && licenseCompleted;

  return (
    <ScreenBackground>
      <Container>
        {/* Header with Progress Bar */}
        <View className="flex-row w-full items-center">
          <Pressable onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          <View className="items-center justify-center flex-1 flex-row gap-4">
            <View
              className={`w-[42px] h-[10px] rounded-full ${picturesCompleted ? "bg-[#29D7DE]" : "bg-[#29D7DE]"}`}
            />
            <View
              className={`w-[42px] h-[10px] rounded-full ${licenseCompleted ? "bg-[#29D7DE]" : "bg-[#09515D]"}`}
            />
          </View>

          {/* <TouchableOpacity 
            onPress={() => {
              const { resetScanningState } = useAppStore.getState();
              resetScanningState();
            }}
            className="px-2"
          >
            <Text className="text-[#29D7DE] font-lexendMedium text-[14px]">
              Reset
            </Text>
          </TouchableOpacity> */}
        </View>

        <View className="flex-1">
          {/* Title and Subtitle */}
          <View className="px-2 mt-5">
            <Text className="text-[26px] font-lexendMedium text-[#FFFFFF]">
              Add your first car!
            </Text>
            <Text className="text-[14px] font-lexendRegular text-[#9BBABB] mt-2">
              Start by adding the details of your personal car for a rich user
              experience
            </Text>
          </View>

          {/* Dynamic Steps List */}
          <View className="gap-3 mt-8">
            {scanOptions.map((scan) => (
              <TouchableOpacity
                key={scan.id}
                activeOpacity={0.7}
                onPress={() => {
                  if (scan.completed) {
                    const dest =
                      scan.id === 1
                        ? "/screens/scan/details"
                        : "/screens/scan/license-details";
                    router.push(dest as any);
                  } else {
                    router.push(scan.route as any);
                  }
                }}
                className={`border rounded-[10px] px-[10px] py-[20px] flex-row justify-between items-center ${
                  scan.completed
                    ? "border-[#29D7DE]/30 bg-[#29D7DE]/5"
                    : "border-[#2D5157]"
                }`}
              >
                <View className="flex-row items-start gap-3">
                  {scan.completed ? (
                    <View className="rounded-full bg-[#29D7DE] w-[24px] h-[24px] items-center justify-center">
                      <Ionicons name="checkmark" size={16} color="#00232A" />
                    </View>
                  ) : (
                    <View
                      className={`rounded-full border w-[24px] h-[24px] items-center justify-center ${
                        scan.id === 1 || picturesCompleted
                          ? "border-[#29D7DE]"
                          : "border-[#9BBABB]"
                      }`}
                    >
                      <Text
                        className={`font-lexendBold text-[11px] ${
                          scan.id === 1 || picturesCompleted
                            ? "text-[#29D7DE]"
                            : "text-[#FFFFFF]"
                        }`}
                      >
                        {scan.id}
                      </Text>
                    </View>
                  )}
                  <View className="">
                    <Text
                      className={`text-[16px] font-lexendSemiBold ${
                        scan.completed ? "text-[#87ECF0]/60" : "text-[#87ECF0]"
                      }`}
                      numberOfLines={2}
                    >
                      {scan.title}
                    </Text>
                    <Text
                      className={`text-[14px] font-lexendRegular mt-1 ${
                        scan.completed ? "text-[#9BBABB]/50" : "text-[#9BBABB]"
                      }`}
                      numberOfLines={2}
                    >
                      {scan.description}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" color={"#506D72"} size={18} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Car Summary Result Card (Appears after Step 1) */}
          {picturesCompleted && scannedCarData && (
            <TouchableOpacity
              onPress={() => router.push("/screens/scan/details")}
              activeOpacity={0.8}
              className="mt-8 bg-[#002126]  rounded-[10px] p-4 flex-row items-center gap-4"
            >
              <View className="items-center justify-center">
                <CarLogo make={scannedCarData.make || ""} size={48} />
              </View>
              <View className="flex-1">
                <Text className="text-white font-lexendBold text-[16px]">
                  {scannedCarData.make} {scannedCarData.model}{" "}
                  {scannedCarData.year}
                </Text>
                <Text className="text-[#29D7DE] font-ukNumberPlate text-[12px] mt-0.5 uppercase tracking-wider">
                  {(scannedCarData.plate || "No Plate Detected").replace(
                    /-/g,
                    " ",
                  )}
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color="#29D7DE" />
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom Confirmation & Next Button */}
        <View className="pb-8 pt-4">
          <Pressable
            className="flex-row items-start gap-3 mb-6"
            onPress={() => setIsConfirmed(!isConfirmed)}
          >
            <View
              className={`w-5 h-5 rounded border ${
                isConfirmed
                  ? "border-[#29D7DE] bg-[#29D7DE]"
                  : "border-[#29D7DE] bg-transparent"
              } items-center justify-center mt-0.5`}
            >
              {isConfirmed && (
                <Ionicons name="checkmark" size={16} color="#00232A" />
              )}
            </View>
            <Text className="text-[#FFFFFF] text-[14px] font-lexendRegular flex-1">
              I can confirm that the pictures of the car {"\n"}taken is mine
            </Text>
          </Pressable>

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={picturesCompleted && !isConfirmed}
            className={`w-full h-[56px] rounded-full items-center justify-center ${
              picturesCompleted && !isConfirmed
                ? "bg-[#29D7DE]/20"
                : "bg-[#29D7DE]"
            }`}
            onPress={handleNext}
          >
            <Text className="font-lexendBold text-[16px] text-[#00343F]">
              {isFlowComplete ? "Finish Setup" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </Container>
    </ScreenBackground>
  );
}
