import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { CarLogo } from "@/components/shared/CarLogo";
import SpecItem from "@/components/car/SpecItem";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { carService } from "@/services/api/carService";
import { obdService } from "@/services/api/obdService";
import { useAppStore } from "@/store/useAppStore";
import { LoadingModal } from "@/components/ui/LoadingModal";
import AttributeEditSheet, { EditMode } from "@/components/scan/AttributeEditSheet";
import { useSnackbar } from "@/providers/SnackbarProvider";

// Icons
import CalendarIcon from "@/assets/icons/car/calendar.svg";
import FuelIcon from "@/assets/icons/car/fuel.svg";
import TransmissionIcon from "@/assets/icons/car/transmission.svg";
import CylinderIcon from "@/assets/icons/car/cylinder.svg";
import DriveIcon from "@/assets/icons/car/drive.svg";
import BodyIcon from "@/assets/icons/car/body.svg";
import SegmentIcon from "@/assets/icons/car/segment.svg";
import SpeedometerIcon from "@/assets/icons/car/speedometer.svg";
import EngineIcon from "@/assets/icons/car/engine.svg";

export default function MotiBuddieDetails() {
  const params = useLocalSearchParams<{ carId?: string }>();
  const selectedCarIdFromStore = useAppStore((state) => state.selectedCarId);
  const { showSnackbar } = useSnackbar();
  
  // Use param carId first, fallback to store
  const carId = params.carId || selectedCarIdFromStore;

  const [carData, setCarData] = useState({
    make: "Detected",
    model: "Vehicle",
    year: "",
    mileage: "0",
    vin: "---",
    transmission: "---",
    engine: "---",
    fuelType: "---",
    driveType: "---",
    bodyStyle: "---",
    segment: "---",
    plate: "",
  });

  // Modal states for editing
  const [editSheetVisible, setEditSheetVisible] = useState(false);
  const [editingField, setEditingField] = useState<{
    key: string;
    label: string;
    mode: EditMode;
    options?: string[];
  } | null>(null);

  // Fetch the actual car details
  const { data: carResponse, isLoading, isError } = useQuery({
    queryKey: ["carDetails", carId],
    queryFn: () => (carId ? carService.getCarById(carId) : null),
    enabled: !!carId,
  });

  useEffect(() => {
    if (carResponse?.car) {
      const car = carResponse.car;
      setCarData({
        make: car.make || "Detected",
        model: car.carModel || car.model || "Vehicle",
        year: car.year?.toString() || "",
        mileage: car.mileage?.toLocaleString() || "0",
        vin: car.vin || "---",
        transmission: car.transmission || "---",
        engine: car.engineDesc || car.engine || "---",
        fuelType: car.fuelType || "---",
        driveType: car.driveType || "---",
        bodyStyle: car.bodyStyle || "---",
        segment: car.segment || "---",
        plate: car.plate || "",
      });
    }
  }, [carResponse]);

  const openEditor = (key: string, label: string, mode: EditMode, options?: string[]) => {
    setEditingField({ key, label, mode, options });
    setEditSheetVisible(true);
  };

  const saveEdit = (newValue: any) => {
    if (editingField) {
      setCarData((prev) => ({ ...prev, [editingField.key]: newValue }));
    }
    setEditSheetVisible(false);
  };

  const handleConfirm = async () => {
    try {
      if (!carId) return;

      // 1. Update car with any edited details
      await carService.updateCar(carId, {
        make: carData.make,
        carModel: carData.model,
        year: parseInt(carData.year) || undefined,
        vin: carData.vin !== "---" ? carData.vin : undefined,
        transmission: carData.transmission !== "---" ? carData.transmission : undefined,
        engineDesc: carData.engine !== "---" ? carData.engine : undefined,
        fuelType: carData.fuelType !== "---" ? carData.fuelType : undefined,
        driveType: carData.driveType !== "---" ? carData.driveType : undefined,
        bodyStyle: carData.bodyStyle !== "---" ? carData.bodyStyle : undefined,
        segment: carData.segment !== "---" ? carData.segment : undefined,
      });

      // 2. Activate the car
      await obdService.activateCar(carId);
      
      showSnackbar({ message: "Vehicle successfully activated!", type: "success" });
      router.replace("/(tabs)/car");
    } catch (error) {
      console.error("Activation failed:", error);
      showSnackbar({ message: "Could not activate vehicle. Please try again.", type: "error" });
    }
  };

  const detailItems = [
    {
      label: "Year of Production",
      key: "year",
      value: carData.year || "Tap to add",
      icon: CalendarIcon,
      mode: "chips" as const,
      options: ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"],
      isEditable: true,
    },
    {
      label: "Fuel Type",
      key: "fuelType",
      value: carData.fuelType || "Tap to add",
      icon: FuelIcon,
      mode: "chips" as const,
      options: ["Petrol", "Diesel", "Electric", "Hybrid"],
      isEditable: true,
    },
    {
      label: "Transmission",
      key: "transmission",
      value: carData.transmission || "Tap to add",
      icon: TransmissionIcon,
      mode: "toggle" as const,
      options: ["Automatic", "Manual"],
      isEditable: true,
    },
    {
      label: "Engine",
      key: "engine",
      value: carData.engine || "Tap to add",
      icon: EngineIcon,
      mode: "input" as const,
      isEditable: true,
    },
    {
      label: "Drive Type",
      key: "driveType",
      value: carData.driveType || "Tap to add",
      icon: DriveIcon,
      mode: "chips" as const,
      options: ["FWD", "RWD", "AWD", "4WD"],
      isEditable: true,
    },
    {
      label: "Body Style",
      key: "bodyStyle",
      value: carData.bodyStyle || "Tap to add",
      icon: BodyIcon,
      mode: "chips" as const,
      options: ["Sedan", "SUV", "Hatchback", "Coupe", "Truck"],
      isEditable: true,
    },
  ];

  const chunkedItems = [];
  for (let i = 0; i < detailItems.length; i += 2) {
    chunkedItems.push(detailItems.slice(i, i + 2));
  }

  if (isLoading) return <LoadingModal visible={true} />;

  if (isError || (!carId && !isLoading)) {
    return (
      <ScreenBackground>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
          <Text className="text-white font-lexendMedium text-[18px] mt-4 text-center">
            We couldn't retrieve your vehicle details.
          </Text>
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mt-8 bg-[#FBE74C] px-10 py-4 rounded-full"
          >
            <Text className="text-[#00343F] font-lexendBold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <View className="flex-1 bg-black/60">
      <ScreenBackground>
        <Pressable className="h-[12%]" onPress={() => router.back()} />

        {/* Header Section Card */}
        <View className="bg-[#E8E7DC] rounded-t-[20px] shadow-2xl overflow-hidden px-6 pt-6 pb-6">
          <View className="items-center">
            <Text className="text-[#8B8B8B] font-lexendRegular text-[12px] mb-3">
              This is what we got
            </Text>

            <View className="items-center">
              <View className="w-[56px] h-[56px] bg-white rounded-[12px] items-center justify-center border border-gray-100 mb-3 shadow-sm">
                <CarLogo make={carData.make} size={42} />
              </View>
              <Text className="text-[#00343F] font-lexendBold text-[22px] text-center mb-1">
                {carData.make} {carData.model}
              </Text>
              
              <View className="flex-row items-center gap-2 mb-4">
                <SpeedometerIcon width={14} height={14} fill="#9BBABB" />
                <Text className="text-[#918E69] font-lexendRegular text-[13px]">
                  Mileage — {carData.mileage}
                </Text>
              </View>

              {carData.plate ? (
                <View className="bg-white h-[40px] px-6 rounded-lg border border-[#00000022] items-center justify-center">
                  <Text className="text-[#00AEB5] font-ukNumberPlate text-[16px] uppercase tracking-wider">
                    {carData.plate.replace(/-/g, " ")}
                  </Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute top-0 right-0 p-2"
            >
              <Ionicons name="close" size={24} color="#00343F" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Section */}
        <View className="flex-1 bg-white">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            className="flex-1"
          >
            {/* Divider */}
            <View className="items-center my-6">
              <Text className="text-[#A8A477] font-lexendMedium text-[11px] uppercase tracking-[3px]">
                Expected Features
              </Text>
            </View>

            {/* VIN Display */}
            <View className="px-6 mb-6">
              <TouchableOpacity 
                onPress={() => openEditor("vin", "VIN Number", "input")}
                className="flex-row items-center justify-between bg-[#F9F9F7] p-4 rounded-xl border border-[#EFEEE7]"
              >
                <View className="flex-row items-center gap-3">
                  <Ionicons name="barcode-outline" size={20} color="#9BBABB" />
                  <View>
                    <Text className="text-[#9BBABB] font-lexendRegular text-[10px] uppercase">Vehicle Identification Number</Text>
                    <Text className="text-[#00343F] font-lexendMedium text-[15px]">{carData.vin}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#D6D5CA" />
              </TouchableOpacity>
            </View>

            {/* Specs Grid */}
            <View className="px-5">
              <View className="bg-white rounded-[20px] border border-[#D6D5CA] overflow-hidden">
                {chunkedItems.map((row, rowIndex) => (
                  <View key={rowIndex}>
                    <View className="flex-row">
                      {row.map((item) => (
                        <View key={item.key} className="flex-1 py-4 px-6">
                          <SpecItem
                            icon={item.icon}
                            label={item.label}
                            value={item.value?.toString()}
                            hasDropdown={item.isEditable}
                            onPress={() => openEditor(item.key, item.label, item.mode, item.options)}
                          />
                        </View>
                      ))}
                      {row.length === 1 && <View className="flex-1" />}
                    </View>
                    {rowIndex < chunkedItems.length - 1 && (
                      <View className="h-[1px] bg-[#D6D5CA] mx-4" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Persistent Footer Button */}
          <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pt-4 pb-10 shadow-lg">
            <TouchableOpacity
              onPress={handleConfirm}
              activeOpacity={0.8}
              className="h-[64px] rounded-full items-center justify-center bg-[#FBE74C]"
            >
              <Text className="text-[#00343F] font-lexendBold text-[18px]">
                That's correct
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Edit Modal */}
        <AttributeEditSheet
          visible={editSheetVisible}
          onClose={() => setEditSheetVisible(false)}
          onSave={saveEdit}
          title={editingField?.label || ""}
          mode={editingField?.mode || "chips"}
          options={editingField?.options}
          initialValue={editingField ? carData[editingField.key as keyof typeof carData] : ""}
        />
      </ScreenBackground>
    </View>
  );
}
