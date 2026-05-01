import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { CarLogo } from "@/components/shared/CarLogo";
import SpecItem from "@/components/car/SpecItem";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AttributeEditSheet, { EditMode } from "@/components/scan/AttributeEditSheet";
import { useSnackbar } from "@/providers/SnackbarProvider";

// Icons
import CalendarIcon from "@/assets/icons/car/calendar.svg";
import FuelIcon from "@/assets/icons/car/fuel.svg";
import TransmissionIcon from "@/assets/icons/car/transmission.svg";
import DriveIcon from "@/assets/icons/car/drive.svg";
import BodyIcon from "@/assets/icons/car/body.svg";
import SpeedometerIcon from "@/assets/icons/car/speedometer.svg";
import EngineIcon from "@/assets/icons/car/engine.svg";

type CarData = {
  make: string;
  model: string;
  year: string;
  mileage: string;
  vin: string;
  transmission: string;
  engine: string;
  fuelType: string;
  driveType: string;
  bodyStyle: string;
  segment: string;
  plate: string;
};

export default function MotiBuddieDetails() {
  const params = useLocalSearchParams<{
    imei?: string;
    prefillData?: string;
    // Legacy params (upgrade flow — car already exists)
    carId?: string;
  }>();

  const { showSnackbar } = useSnackbar();

  // Parse prefill data from connecting screen
  const prefill = React.useMemo(() => {
    if (!params.prefillData) return null;
    try {
      return JSON.parse(params.prefillData);
    } catch {
      return null;
    }
  }, [params.prefillData]);

  const [carData, setCarData] = useState<CarData>({
    make: prefill?.make || "Unknown",
    model: prefill?.carModel || "Vehicle",
    year: prefill?.year?.toString() || "",
    mileage: prefill?.mileage?.toLocaleString() || "0",
    vin: prefill?.vin || "---",
    transmission: prefill?.transmission || "---",
    engine: prefill?.engineDesc || "---",
    fuelType: prefill?.fuelType || "---",
    driveType: prefill?.driveType || "---",
    bodyStyle: prefill?.bodyStyle || "---",
    segment: prefill?.segment || "---",
    plate: prefill?.plate || "",
  });

  const [editSheetVisible, setEditSheetVisible] = useState(false);
  const [editingField, setEditingField] = useState<{
    key: string;
    label: string;
    mode: EditMode;
    options?: string[];
  } | null>(null);

  const openEditor = (
    key: string,
    label: string,
    mode: EditMode,
    options?: string[],
  ) => {
    setEditingField({ key, label, mode, options });
    setEditSheetVisible(true);
  };

  const saveEdit = (newValue: any) => {
    if (editingField) {
      setCarData((prev) => ({ ...prev, [editingField.key]: newValue }));
    }
    setEditSheetVisible(false);
  };

  // "That's correct" — navigate to Final Details screen
  // Final Details handles budget, purchase date, condition, plate
  // and calls POST /cars + POST /obd/link-device
  const handleConfirm = () => {
    if (!carData.make || carData.make === "Unknown") {
      showSnackbar({
        message: "Please confirm your car make and model",
        type: "error",
      });
      return;
    }

    router.push({
      pathname: "/screens/motibuddie/final-details",
      params: {
        imei: params.imei || "",
        make: carData.make,
        carModel: carData.model,
        year: carData.year,
        mileage: carData.mileage.replace(/,/g, ""),
        vin: carData.vin !== "---" ? carData.vin : "",
        transmission: carData.transmission !== "---" ? carData.transmission : "",
        engineDesc: carData.engine !== "---" ? carData.engine : "",
        fuelType: carData.fuelType !== "---" ? carData.fuelType : "",
        driveType: carData.driveType !== "---" ? carData.driveType : "",
        bodyStyle: carData.bodyStyle !== "---" ? carData.bodyStyle : "",
        segment: carData.segment !== "---" ? carData.segment : "",
        plate: carData.plate || "",
      },
    });
  };

  const detailItems = [
    {
      label: "Year of Production",
      key: "year",
      value: carData.year || "Tap to add",
      icon: CalendarIcon,
      mode: "chips" as const,
      options: Array.from({ length: 30 }, (_, i) =>
        (new Date().getFullYear() - i).toString(),
      ),
      isEditable: true,
    },
    {
      label: "Fuel Type",
      key: "fuelType",
      value: carData.fuelType !== "---" ? carData.fuelType : "Tap to add",
      icon: FuelIcon,
      mode: "chips" as const,
      options: ["Petrol", "Diesel", "Electric", "Hybrid"],
      isEditable: true,
    },
    {
      label: "Transmission",
      key: "transmission",
      value:
        carData.transmission !== "---" ? carData.transmission : "Tap to add",
      icon: TransmissionIcon,
      mode: "toggle" as const,
      options: ["Automatic", "Manual"],
      isEditable: true,
    },
    {
      label: "Engine",
      key: "engine",
      value: carData.engine !== "---" ? carData.engine : "Tap to add",
      icon: EngineIcon,
      mode: "input" as const,
      isEditable: true,
    },
    {
      label: "Drive Type",
      key: "driveType",
      value: carData.driveType !== "---" ? carData.driveType : "Tap to add",
      icon: DriveIcon,
      mode: "chips" as const,
      options: ["FWD", "RWD", "AWD", "4WD"],
      isEditable: true,
    },
    {
      label: "Body Style",
      key: "bodyStyle",
      value: carData.bodyStyle !== "---" ? carData.bodyStyle : "Tap to add",
      icon: BodyIcon,
      mode: "chips" as const,
      options: ["Sedan", "SUV", "Hatchback", "Coupe", "Truck", "Van"],
      isEditable: true,
    },
  ];

  const chunkedItems = [];
  for (let i = 0; i < detailItems.length; i += 2) {
    chunkedItems.push(detailItems.slice(i, i + 2));
  }

  return (
    <View className="flex-1 bg-black/60">
      <ScreenBackground>
        <Pressable className="h-[12%]" onPress={() => router.back()} />

        {/* Header Card */}
        <View className="bg-[#E8E7DC] rounded-t-[20px] shadow-2xl overflow-hidden px-6 pt-6 pb-6">
          <View className="items-center">
            <Text className="text-[#8B8B8B] font-lexendRegular text-[0.75rem] mb-3">
              This is what we got
            </Text>

            <View className="items-center">
              <View className="w-[56px] h-[56px] bg-white rounded-[12px] items-center justify-center border border-gray-100 mb-3 shadow-sm">
                <CarLogo make={carData.make} size={42} />
              </View>
              <Text className="text-[#00343F] font-lexendBold text-[1.375rem] text-center mb-1">
                {carData.make} {carData.model}
              </Text>

              <View className="flex-row items-center gap-2 mb-4">
                <SpeedometerIcon width={14} height={14} fill="#9BBABB" />
                <Text className="text-[#918E69] font-lexendRegular text-[0.8125rem]">
                  Mileage — {carData.mileage}
                </Text>
              </View>

              {carData.plate ? (
                <View className="bg-white h-[40px] px-6 rounded-lg border border-[#00000022] items-center justify-center">
                  <Text className="text-[#00AEB5] font-ukNumberPlate text-[1rem] uppercase tracking-wider">
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

        {/* Content */}
        <View className="flex-1 bg-white">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            className="flex-1"
          >
            <View className="items-center my-6">
              <Text className="text-[#A8A477] font-lexendMedium text-[0.6875rem] uppercase tracking-[3px]">
                Expected Features
              </Text>
            </View>

            {/* VIN */}
            <View className="px-6 mb-6">
              <TouchableOpacity
                onPress={() => openEditor("vin", "VIN Number", "input")}
                className="flex-row items-center justify-between bg-[#F9F9F7] p-4 rounded-xl border border-[#EFEEE7]"
              >
                <View className="flex-row items-center gap-3">
                  <Ionicons name="barcode-outline" size={20} color="#9BBABB" />
                  <View>
                    <Text className="text-[#9BBABB] font-lexendRegular text-[0.625rem] uppercase">
                      Vehicle Identification Number
                    </Text>
                    <Text className="text-[#00343F] font-lexendMedium text-[0.9375rem]">
                      {carData.vin}
                    </Text>
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
                            onPress={() =>
                              openEditor(
                                item.key,
                                item.label,
                                item.mode,
                                item.options,
                              )
                            }
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

          {/* Footer */}
          <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pt-4 pb-10 shadow-lg">
            <TouchableOpacity
              onPress={handleConfirm}
              activeOpacity={0.8}
              className="h-[64px] rounded-full items-center justify-center bg-[#FBE74C]"
            >
              <Text className="text-[#00343F] font-lexendBold text-[1.125rem]">
                That's correct
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <AttributeEditSheet
          visible={editSheetVisible}
          onClose={() => setEditSheetVisible(false)}
          onSave={saveEdit}
          title={editingField?.label || ""}
          mode={editingField?.mode || "chips"}
          options={editingField?.options}
          initialValue={
            editingField
              ? carData[editingField.key as keyof CarData]
              : ""
          }
        />
      </ScreenBackground>
    </View>
  );
}