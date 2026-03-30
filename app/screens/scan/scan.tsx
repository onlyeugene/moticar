import Container from "@/components/shared/container";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useAppStore } from "@/store/useAppStore";
import { useCreateCar } from "@/hooks/useCars";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const { scanningProgress, scannedCarData, setScanningProgress } = useAppStore();
  const { mutate: createCar, isPending: isSubmitting } = useCreateCar();
  const { showSnackbar } = useSnackbar();

  const handleFinalize = () => {
    if (!scannedCarData) {
      showSnackbar({
        type: "error",
        message: "Missing car details",
        description: "Please complete the scanning steps first.",
      });
      return;
    }

    createCar(
      {
        make: scannedCarData.make || "",
        carModel: scannedCarData.model || "",
        year: parseInt(scannedCarData.year) || 0,
        mileage: 0,
        plate: scannedCarData.plateNumber || "",
        vin: scannedCarData.vin || "",
        fuelType: scannedCarData.fuelType,
        color: scannedCarData.color,
        transmission: scannedCarData.transmission,
        engineDesc: scannedCarData.engineSize,
        bodyStyle: scannedCarData.bodyStyle,
        condition: "Used",
      },
      {
        onSuccess: (data: any) => {
          showSnackbar({
            type: "success",
            message: "Car Added",
            description: "Your vehicle has been successfully registered.",
          });
          // Reset progress and redirect
          setScanningProgress({
            picturesCompleted: false,
            licenseCompleted: false,
          });
          router.replace("/(tabs)");
        },
        onError: (error: any) => {
          showSnackbar({
            type: "error",
            message: "Upload Failed",
            description: error?.response?.data?.message || "Something went wrong.",
          });
        },
      },
    );
  };

  const options = [
    {
      id: 1,
      title: "Take a picture of your car",
      description:
        "We will try to make it very easy to get \nonly the needed details",
      completed: scanningProgress.picturesCompleted,
    },
    {
      id: 2,
      title: "Capture your primary Vehicle paper",
      description:
        "Cutting down the time to manually \nenter the details of your car only",
      completed: scanningProgress.licenseCompleted,
    },
  ];
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
          <View className="gap-3 mt-5">
            {options.map((scan) => (
              <TouchableOpacity
                key={scan.id}
                disabled={scan.completed}
                onPress={() => {
                  if (scan.id === 1) router.push("/screens/scan/pictures");
                  if (scan.id === 2) router.push("/screens/scan/license");
                }}
                className={`border rounded-[10px] px-[10px] py-[20px] flex-row justify-between items-center ${
                  scan.completed
                    ? "border-[#29D7DE]/30 bg-[#29D7DE]/5"
                    : "border-[#2D5157]"
                }`}
              >
                <View className="flex-row items-start gap-2">
                  <View
                    className={`rounded-full border w-[24px] h-[24px] items-center justify-center ${
                      scan.completed
                        ? "border-[#29D7DE] bg-[#29D7DE]"
                        : "border-[#9BBABB]"
                    }`}
                  >
                    {scan.completed ? (
                      <Ionicons name="checkmark" size={16} color="#00232A" />
                    ) : (
                      <Text className="text-[#FFFFFF] font-lexendBold text-[11px]">
                        {scan.id}
                      </Text>
                    )}
                  </View>
                  <View>
                    <Text
                      className={`text-[16px] font-lexendSemiBold ${
                        scan.completed ? "text-[#29D7DE]" : "text-[#87ECF0]"
                      }`}
                      numberOfLines={1}
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
                {!scan.completed && (
                  <Ionicons name="chevron-forward" color="#506D72" />
                )}
              </TouchableOpacity>
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
          
          <TouchableOpacity
            disabled={
              !isConfirmed ||
              isSubmitting ||
              (!scanningProgress.picturesCompleted &&
                !scanningProgress.licenseCompleted)
            }
            className={`w-full h-[50px] rounded-full items-center justify-center ${
              isConfirmed && !isSubmitting ? "bg-[#29D7DE]" : "bg-[#29D7DE]/10"
            }`}
            onPress={
              scanningProgress.picturesCompleted &&
              scanningProgress.licenseCompleted
                ? handleFinalize
                : () => router.push("/screens/scan/pictures")
            }
          >
            {isSubmitting ? (
              <ActivityIndicator color="#00343F" />
            ) : (
              <Text className="font-lexendBold text-[16px] text-[#00343F]">
                {scanningProgress.picturesCompleted &&
                scanningProgress.licenseCompleted
                  ? "Finalize Analysis"
                  : "Next"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Container>
    </ScreenBackground>
  );
}
