import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ScreenBackground } from "@/components/ScreenBackground";
import Container from "@/components/shared/container";
import { Ionicons } from "@expo/vector-icons";
import { useCarDetails, useCreateCar } from "@/hooks/useCars";
import { useSnackbar } from "@/providers/SnackbarProvider";
import BodyIcon from "@/assets/icons/car/body.svg";
import CylinderIcon from "@/assets/icons/car/cylinder.svg";
import DriveIcon from "@/assets/icons/car/drive.svg";
import FuelIcon from "@/assets/icons/car/fuel.svg";
import HorseIcon from "@/assets/icons/car/horse.svg";
import SegmentIcon from "@/assets/icons/car/segment.svg";
import TransmissionIcon from "@/assets/icons/car/transmission.svg";
import CalendarIcon from "@/assets/icons/car/calendar.svg";
import SpecItem from "@/components/car/SpecItem";

export default function CarDetailsScreen() {
  const params = useLocalSearchParams<{
    make: string;
    model: string;
    year: string;
    class: string;
    fuelType: string;
    engine?: string;
    transmission?: string;
    brandKeys?: string;
  }>();

  const isMounted = useRef(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const { data: detailsData, isLoading } = useCarDetails({
    make: params.make,
    model: params.model,
    year: parseInt(params.year),
  });

  const details = detailsData?.details;
  const features = details?.features;

  const { mutate: createCar, isPending: isSubmitting } = useCreateCar();

  const handleConfirm = () => {
    createCar(
      {
        make: params.make,
        carModel: params.model,
        year: parseInt(params.year),
        mileage: 0,
        plate: "",
        vin: "",
        fuelType: params.fuelType,
        color: "",
        condition: "Newly Purchased",
      },
      {
        onSuccess: (data: any) => {
          const finalId = data?.car?._id || data?.id;
          if (isMounted.current && finalId) {
            router.replace({
              pathname: "/screens/manual/final",
              params: { 
                carId: finalId,
                recommendedBudget: detailsData?.recommendedBudget || 0
              },
            });
          }
        },
        onError: (error: any) => {
          if (isMounted.current) {
            showSnackbar({
              type: "error",
              message: "Failed to add car",
              description:
                error?.response?.data?.message || "Something went wrong",
            });
          }
        },
      },
    );
  };


  return (
    <View className="flex-1 bg-black/60">
      <ScreenBackground>
        {/* Dimmed top part to simulate transparency */}
        <Pressable className="h-[20%]" onPress={() => router.back()} />

        {/* Bottom Sheet Container */}
        <View className="flex-1 bg-white rounded-t-[40px]">
          <View className="bg-[#E8E7DC] px-6 pt-6 rounded-t-[40px]">
            <View className="flex-row justify-between items-center">
              <View className="flex-1" />
              <Text className="text-[#9BBABB] font-lexendMedium text-sm">
                This is what we got
              </Text>
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex-1 items-end"
              >
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>

            <View className="items-center mb-6 ">
              <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center mb-2">
                <Ionicons name="car-sport" size={32} color="#000" />
              </View>
              <Text className="text-[#00343F] font-lexendSemiBold text-[20px] text-center uppercase">
                {params.make} {params.model} {params.engine}
              </Text>
            </View>
          </View>
          {/* Separator */}
          <View className="flex-row items-center justify-center gap-2 mb-8 px-6 pt-6">
            <View className="h-[1px] flex-1 bg-[#D0CCA6]" />
            <Text className="text-[#D0CCA6] font-lexendMedium text-[10px] uppercase tracking-widest">
              Expected Features
            </Text>
            <View className="h-[1px] flex-1 bg-[#D0CCA6]" />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View className="flex-row flex-wrap px-6 ">
              <SpecItem
                icon={CalendarIcon}
                label="Year of Production:"
                value={selectedRange || features?.yearRange || params.year}
                hasDropdown={true}
                onPress={() => setShowYearPicker(true)}
              />
              <SpecItem
                icon={FuelIcon}
                label="Fuel Type"
                value={features?.fuelType || params.fuelType || "N/A"}
              />
              <SpecItem
                icon={TransmissionIcon}
                label="Transmission"
                value={features?.transmission || params.transmission || "N/A"}
              />
              <SpecItem
                icon={CylinderIcon}
                label="Engine"
                value={features?.engine || params.engine || "N/A"}
              />
              <SpecItem
                icon={CylinderIcon}
                label="Cylinder"
                value={features?.cylinder || "N/A"}
              />
              <SpecItem
                icon={HorseIcon}
                label="Horse Power"
                value={features?.horsepower || "N/A"}
              />
              <SpecItem
                icon={DriveIcon}
                label="Drive Type"
                value={features?.driveType || "N/A"}
              />
              <SpecItem
                icon={BodyIcon}
                label="Body Style"
                value={features?.bodyStyle || params.class || "N/A"}
              />
              <SpecItem
                icon={SegmentIcon}
                label="Segment"
                value={features?.segment || "N/A"}
              />
              <SpecItem
                icon={BodyIcon}
                label="Body Color"
                value={features?.bodyColor || "---"}
              />
            </View>
          </ScrollView>

          {/* Action Button */}
          <View className="absolute bottom-10 left-6 right-6">
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isSubmitting}
              activeOpacity={0.8}
              className={`h-16 rounded-full items-center justify-center ${isSubmitting ? "bg-[#FBE74C]/60" : "bg-[#FBE74C]"}`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#00343F" />
              ) : (
                <Text className="text-[#00343F] font-lexendBold text-lg">
                  That's correct
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Simplistic Year Picker Overlay */}
        {showYearPicker && (
          <Pressable
            className="absolute inset-0 bg-black/40 justify-center items-center px-10"
            onPress={() => setShowYearPicker(false)}
          >
            <View className="bg-white rounded-3xl w-full p-6 shadow-xl">
              <Text className="text-[#00343F] font-lexendBold text-lg mb-4">
                Select Production Year
              </Text>
              <ScrollView className="max-h-60">
                {[features?.yearRange || params.year].map((range, idx) => (
                  <TouchableOpacity
                    key={idx}
                    className="py-4 border-b border-[#9BBABB]/10"
                    onPress={() => {
                      setSelectedRange(range);
                      setShowYearPicker(false);
                    }}
                  >
                    <Text className="text-[#00343F] font-lexendMedium">
                      {range}
                    </Text>
                  </TouchableOpacity>
                ))}
                <Text className="text-[#9BBABB] font-lexendRegular text-xs mt-4">
                  These are the detected possible ranges for this model.
                </Text>
              </ScrollView>
            </View>
          </Pressable>
        )}
      </ScreenBackground>
    </View>
  );
}
