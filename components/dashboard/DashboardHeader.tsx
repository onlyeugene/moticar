import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserCars } from "@/hooks/useCars";
import { useAppStore } from "@/store/useAppStore";
import { router } from "expo-router";
import { CarIcon } from "@/utils/carIconHelper";
import { Car } from "@/types/car";
import Circle from "@/assets/icons/circle.svg";
import Crown from "@/assets/icons/crown.svg";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useNotifications } from "@/hooks/useNotifications";

export default function DashboardHeader() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: carsData, isLoading } = useUserCars();
  const { data: notificationsData } = useNotifications();
  const { selectedCarId, setSelectedCarId, setDiagnosticActive } =
    useAppStore();

  const hasUnread = notificationsData?.notifications.some(n => !n.isRead);

  const cars = carsData?.cars || [];

  // Find currently selected car or default to first
  const selectedCar =
    cars.find((c) => (c.id || (c as any)._id) === selectedCarId) || cars[0];

  useEffect(() => {
    // If we have cars, ensure the selection is valid
    if (cars.length > 0) {
      const isValid = cars.some(
        (c) => (c.id || (c as any)._id) === selectedCarId,
      );
      if (!isValid) {
        setSelectedCarId(cars[0].id || (cars[0] as any)._id);
      }
    }
  }, [cars, selectedCarId]);

  const renderCarCard = (car: Car) => {
    const isSelected = (car.id || car._id) === selectedCarId;
    return (
      <TouchableOpacity
        key={car.id || car._id}
        onPress={() => {
          setSelectedCarId(car.id || car._id);
          setIsExpanded(false);
        }}
        className={`w-[280px] p-4 rounded-[8px] border mr-4 relative ${
          isSelected
            ? "border-[#1A8798] border-2 bg-[#002E35]"
            : "border-[#09515D] bg-[#00232A]"
        }`}
      >
        <View className="flex-row items-start">
          <View className="flex-row items-start gap-3 flex-1 pr-8">
            <CarIcon make={car.make} size={40} color="#FFFFFF" />
            <View className="flex-1 flex-col gap-1">
              <View className="flex-row items-center gap-2">
                <Text
                  className="text-[#FFFFFF] font-lexendBold text-[16px] max-w-[85%]"
                  numberOfLines={1}
                >
                  {car.make} {car.carModel}
                </Text>
                {car.entryMethod === "obd" ? (
                  <View className="w-[6px] h-[6px] rounded-full bg-[#78FF25]" />
                ) : (
                  <View className="w-[6px] h-[6px] rounded-full bg-[#3F8E8E]" />
                )}
              </View>

              <Text className="text-[#7AE6EB] font-ukNumberPlate uppercase text-[14px] mb-3">
                {car.plate}
              </Text>

              <View className="flex-row items-center gap-2">
                <View className="bg-[#5E9597] px-2 py-1 rounded-[6px]">
                  <Text className="text-[#002E35] text-[10px] font-lexendMedium uppercase">
                    {car.bodyStyle || "SUV"}
                  </Text>
                </View>
                <View className="bg-[#5E9597] px-2 py-1 rounded-[6px]">
                  <Text className="text-[#002E35] text-[10px] font-lexendMedium">
                    {car.year}
                  </Text>
                </View>
                <View className="bg-[#5E9597] px-2 py-1 rounded-[6px]">
                  <Text className="text-[#002E35] text-[10px] font-lexendMedium uppercase">
                    {car.fuelType || "PETROL"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {isSelected && (
            <View className="absolute top-0 right-0">
              <Circle width={26} height={26} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      layout={LinearTransition}
      className="z-[1000] overflow-hidden"
    >
      {isExpanded ? (
        <Animated.View
          key="expanded"
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          className="px-5 pt-4 pb-6"
        >
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-white font-lexendBold text-[16px]">
              Select a car
            </Text>
            <TouchableOpacity onPress={() => setIsExpanded(false)}>
              <Ionicons name="chevron-up" size={24} color="#C1C3C3" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {cars.map((car) => renderCarCard(car))}
            <TouchableOpacity
              onPress={() => {
                setIsExpanded(false);
                router.push("/(onboarding)");
              }}
              className="w-[140px] p-4 rounded-[20px] border border-dashed border-[#09515D] items-center justify-center bg-[#00232A]/50"
            >
              <View className="w-10 h-10 rounded-full bg-[#09515D] items-center justify-center mb-2">
                <Ionicons name="add" size={24} color="#29D7DE" />
              </View>
              <Text className="text-[#29D7DE] font-lexendBold text-[12px] text-center">
                Add New Car
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      ) : (
        <Animated.View
          key="collapsed"
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          className="flex-row items-center justify-between px-5 pt-4 pb-2"
        >
          {/* Left: car icon + info */}
          <TouchableOpacity
            onPress={() => {
              if (cars.length === 0) {
                router.push("/(onboarding)");
              } else {
                setIsExpanded(true);
              }
            }}
            className="flex-row items-center gap-1 flex-1 mr-4"
          >
            <CarIcon make={selectedCar?.make || ""} size={48} />

            <View className="flex-1">
              {/* Car name + status dot */}
              <View className="flex-row items-start">
                <Text
                  className="text-white font-lexendBold text-[16px] shrink"
                  numberOfLines={1}
                >
                  {isLoading
                    ? "Loading..."
                    : `${selectedCar?.make || "Add a Car"} ${selectedCar?.carModel || ""}`}
                </Text>
                <View className="mt-2 flex-row gap-1 px-2">
                  <View
                    className={`w-[6px] h-[6px] rounded-full shrink-0 ${
                      selectedCar?.entryMethod === "obd"
                        ? "bg-[#78FF25]"
                        : "bg-[#3F8E8E]"
                    }`}
                  />
                  <Ionicons
                    name="chevron-down"
                    size={14}
                    color="#C1C3C3"
                    className="shrink-0"
                  />
                </View>
              </View>

              {/* Plate + PRO badge */}
              <View className="flex-row items-center gap-1.5">
                <Text className="text-[#7AE6EB] font-ukNumberPlate text-[14px] uppercase">
                  {selectedCar?.plate || "No plate registered"}
                </Text>
                {selectedCar && (
                  <View className="bg-[#EBE07A] px-1.5 py-0.5 rounded-full flex-row items-center gap-1">
                    <Crown width={12} />
                    <Text className="text-[#001013] font-lexendBold text-[10px]">
                      PRO
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>

          {/* Right: divider + icons — fixed width so they never shift */}
          <View className="flex-row items-center gap-4 shrink-0">
            <View className="w-[1px] h-10 bg-[#0F6778]" />
            <TouchableOpacity onPress={() => router.push("/screens/notifications")}>
              <View className="relative">
                <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
                {hasUnread && (
                  <View className="absolute top-0 right-0 w-[10px] h-[10px] bg-[#FF4B4B] rounded-full border-2 border-[#002E35]" />
                )}
              </View>
            </TouchableOpacity>
            <Ionicons name="menu" size={24} color="#FFFFFF" />
          </View>
        </Animated.View>
      )}

      <View>
        {selectedCar?.entryMethod === "obd" ? (
          <TouchableOpacity
            onPress={() => setDiagnosticActive(true)}
            className="border-[#29D7DE] border w-11/12 my-5 mx-auto items-center justify-center h-[40px] rounded-[32px]"
          >
            <Text className="text-[#00AEB5] font-lexendSemiBold text-[14px]">
              Diagnostic Check
            </Text>
          </TouchableOpacity>
        ) : (
          // <TouchableOpacity
          //   onPress={() => router.push("/screens/motibuddie/imei")}
          //   className="border-[#C1C3C3] border w-11/12 my-5 mx-auto items-center justify-center h-[40px] rounded-[32px]"
          // >
          //   <Text className="text-[#C1C3C3] font-lexendSemiBold text-[14px]">
          //     Connect MotiBuddie
          //   </Text>
          // </TouchableOpacity>
          ''
        )}
      </View>
    </Animated.View>
  );
}
