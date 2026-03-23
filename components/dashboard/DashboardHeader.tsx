import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserCars } from "@/hooks/useCars";
import { useAppStore } from "@/store/useAppStore";
import { CarIcon } from "@/utils/carIconHelper";

export default function DashboardHeader() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: carsData } = useUserCars();
  const { selectedCarId, setSelectedCarId } = useAppStore();

  const cars = carsData?.cars || [];
  
  // Find currently selected car or default to first
  const selectedCar = cars.find(c => (c.id || (c as any)._id) === selectedCarId) || cars[0];

  useEffect(() => {
    // If we have cars but no selection yet, set default
    if (cars.length > 0 && !selectedCarId) {
      setSelectedCarId(cars[0].id || (cars[0] as any)._id);
    }
  }, [cars, selectedCarId]);

  return (
    <View className="flex-row items-center justify-between px-5 pt-4 pb-2 z-[1000]">
      <View className="flex-row items-center gap-3 flex-1">
        <TouchableOpacity 
          onPress={() => setShowDropdown(!showDropdown)}
          className="flex-row items-center gap-4 flex-1"
        >
          <CarIcon make={selectedCar?.make || ""} size={48} />
          <View>
            <Text className="text-white font-lexendBold text-[16px]">
              {selectedCar?.make || "Loading..."}
            </Text>
            <Text className="text-[#7AE6EB] font-lexendSemiBold text-[14px]">
              {selectedCar?.plate || "..."}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={24} color="#C1C3C3" />
        </TouchableOpacity>

        {showDropdown && (
          <>
            <Pressable 
              className="absolute inset-0 bg-transparent h-[2000px] w-[1000px] -translate-x-[500px] -translate-y-[500px]"
              onPress={() => setShowDropdown(false)}
            />
            <View className="absolute top-14 left-0 w-64 bg-[#00232A] rounded-2xl p-2 shadow-2xl border border-[#09515D] z-[1001]">
              {cars.map((car, index) => {
                const carId = car.id || (car as any)._id;
                return (
                  <TouchableOpacity
                    key={carId || `car-${index}`}
                    onPress={() => {
                      setSelectedCarId(carId);
                      setShowDropdown(false);
                    }}
                    className={`py-3 px-4 rounded-xl mb-1 flex-row items-center gap-3 ${selectedCarId === carId ? 'bg-[#00AEB5]/20' : ''}`}
                  >
                    <CarIcon make={car.make} size={32} />
                    <View>
                      <Text className={`text-[15px] font-lexendSemiBold ${selectedCarId === car.id ? 'text-[#00AEB5]' : 'text-white'}`}>
                        {car.make} {car.model}
                      </Text>
                      <Text className="text-[#9BBABB] font-lexendRegular text-[12px] mt-0.5">
                        {car.plate}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
              {cars.length === 0 && (
                <Text className="text-white/50 text-center py-4 font-lexendRegular">No cars found</Text>
              )}
            </View>
          </>
        )}
      </View>

      <View className="flex-row items-center gap-3">
        <View className="border-l h-8 border-[#0F6778] mx-2" />
        <View className="flex-row items-center gap-5">
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          <Ionicons name="menu" size={24} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
}
