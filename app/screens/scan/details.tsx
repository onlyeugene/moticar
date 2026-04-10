import BodyIcon from "@/assets/details/body.svg";
import CylinderIcon from "@/assets/details/cylinder.svg";
import DriveIcon from "@/assets/details/drivetype.svg";
import FuelIcon from "@/assets/details/fuel.svg";
import TransmissionIcon from "@/assets/details/gear.svg";
import HorseIcon from "@/assets/details/horse.svg";
import CalendarIcon from "@/assets/details/year.svg";
import SegmentIcon from "@/assets/details/segment.svg";
import Engine from "@/assets/details/engine.svg";
import SpecItem from "@/components/car/SpecItem";
import AttributeEditSheet, {
  EditMode,
} from "@/components/scan/AttributeEditSheet";
import { CarLogo } from "@/components/shared/CarLogo";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ScanDetailsScreen() {
  const { scannedCarData, setScannedCarData, setScanningProgress } =
    useAppStore();

  const [editSheetVisible, setEditSheetVisible] = useState(false);
  const [editingField, setEditingField] = useState<{
    key: string;
    label: string;
    mode: EditMode;
    options?: string[];
  } | null>(null);
  const [tempValue, setTempValue] = useState<any>("");

  if (!scannedCarData) {
    return (
      <ScreenBackground>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white font-lexendMedium mb-4">
            No car data found
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[#FBE74C] px-6 py-3 rounded-full"
          >
            <Text className="text-[#00343F] font-lexendBold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenBackground>
    );
  }

  const openEditor = (
    key: string,
    label: string,
    mode: EditMode,
    options?: string[],
  ) => {
    setEditingField({ key, label, mode, options });
    setTempValue(scannedCarData[key] || "");
    setEditSheetVisible(true);
  };

  const saveEdit = (newValue: any) => {
    if (editingField) {
      setScannedCarData({ ...scannedCarData, [editingField.key]: newValue });
    }
    setEditSheetVisible(false);
  };

  const handleConfirm = () => {
    setScanningProgress({ picturesCompleted: true });
    router.replace("/screens/scan/scan");
  };

  const detailItems = [
    {
      label: "Year of Production",
      key: "yearRange",
      value: scannedCarData.yearRange || scannedCarData.year?.toString() || "",
      icon: CalendarIcon,
      mode: "chips" as const,
      options: ["2013-2018", "2013", "2014", "2015", "2016", "2017", "2018"],
      isEditable: true,
    },
    {
      label: "Fuel Type",
      key: "fuelType",
      value: scannedCarData.fuelType || "",
      icon: FuelIcon,
      mode: "chips" as const,
      options: ["Petrol", "Diesel", "Electric", "Hybrid"],
      isEditable: true,
    },
    {
      label: "Gearbox",
      key: "transmission",
      value: scannedCarData.transmission || "",
      icon: TransmissionIcon,
      mode: "toggle" as const,
      options: ["Automatic", "Manual"],
      isEditable: true,
    },
    {
      label: "Engine",
      key: "engineDesc",
      value: scannedCarData.engineDesc || scannedCarData.engine || "",
      icon: Engine,
      mode: "input" as const,
      isEditable: false,
    },
    {
      label: "Cylinder",
      key: "cylinder",
      value: scannedCarData.cylinder || "N/A",
      icon: CylinderIcon,
      mode: "input" as const,
      isEditable: false,
    },
    {
      label: "Horse Power",
      key: "horsepower",
      value: scannedCarData.horsepower || "N/A",
      icon: HorseIcon,
      mode: "input" as const,
      isEditable: false,
    },
    {
      label: "Drive Type",
      key: "driveType",
      value: scannedCarData.driveType || "",
      icon: DriveIcon,
      mode: "chips" as const,
      options: [
        "All-Wheel Drive (AWD)",
        "Four-Wheel Drive (4WD)",
        "Rear-Wheel Drive (RWD)",
        "Front-Wheel Drive (FWD)",
      ],
      isEditable: true,
    },
    {
      label: "Body Style",
      key: "bodyStyle",
      value: scannedCarData.bodyStyle || "",
      icon: BodyIcon,
      mode: "chips" as const,
      options: ["SUV", "Sedan", "Coupe", "Hatchback", "Convertible"],
      isEditable: false,
    },
    {
      label: "Segment",
      key: "segment",
      value: scannedCarData.segment || "",
      icon: SegmentIcon,
      mode: "chips" as const,
      options: ["Compact SUV", "Mid-size SUV", "Luxury SUV"],
      isEditable: false,
    },
    {
      label: "Body Color",
      key: "color",
      value: scannedCarData.color || "",
      icon: BodyIcon,
      mode: "color" as const,
      isEditable: true,
    },
    {
      label: "Doors",
      key: "doors",
      value: scannedCarData.doors || "5",
      icon: () => (
        <MaterialCommunityIcons name="car-door" size={16} color="#29D7DE" />
      ),
      mode: "chips" as const,
      isEditable: false,
    },
  ];

  // Helper to chunk items into rows of 2
  const chunkedItems = [];
  for (let i = 0; i < detailItems.length; i += 2) {
    chunkedItems.push(detailItems.slice(i, i + 2));
  }

  return (
    <View className="flex-1 bg-black/60">
      <ScreenBackground>
        <Pressable className="h-[12%]" onPress={() => router.back()} />

        <View className="bg-[#E8E7DC] rounded-t-[20px] shadow-2xl overflow-hidden px-6 pt-4 pb-4">
          <View className="items-center">
            <Text className="text-[#8B8B8B] font-lexendRegular text-[12px] mb-3">
              This is what we got
            </Text>

            <View className="items-center">
              <View className="w-[48px] h-[48px] bg-white rounded-[10px] items-center justify-center border border-gray-50 mb-3">
                <CarLogo make={scannedCarData.make || ""} size={40} />
              </View>
              <Text className="text-[#00343F] font-lexendBold text-[20px] text-center mb-3">
                {scannedCarData.make}{" "}
                {scannedCarData.carModel || scannedCarData.model}
              </Text>

              <TouchableOpacity
                onPress={() => openEditor("plate", "Plate Number", "input")}
                activeOpacity={0.7}
                className="bg-white h-[44px] px-8 rounded-lg border border-[#00000033] items-center justify-center"
              >
                <Text className="text-[#00AEB5] font-ukNumberPlate text-[18px] uppercase tracking-wider">
                  {(scannedCarData.plate || "").replace(/-/g, " ")}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute top-[-10px] right-0 p-2"
            >
              <Ionicons name="close" size={24} color="#00343F" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 bg-white">

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            className="px-5"
          >
          <View className="items-center mb-3 mt-5">
            <Text className="text-[#A8A477] font-lexendMedium text-[12px] uppercase tracking-widest">
              Expected Features
            </Text>
          </View>
            <View className="bg-white rounded-[20px] border border-[#D6D5CA] overflow-hidden">
              {chunkedItems.map((row, rowIndex) => (
                <View key={rowIndex}>
                  <View className="flex-row">
                    {row.map((item, itemIndex) => (
                      <View key={item.key} className="flex-1 py-4 px-4">
                        <SpecItem
                          icon={item.icon}
                          label={item.label}
                          value={item.value?.toString()}
                          hasDropdown={item.isEditable}
                          onPress={
                            item.isEditable
                              ? () =>
                                  openEditor(
                                    item.key,
                                    item.label,
                                    item.mode,
                                    item.options,
                                  )
                              : undefined
                          }
                        />
                      </View>
                    ))}
                    {row.length === 1 && <View className="flex-1" />}
                  </View>
                  {rowIndex < chunkedItems.length - 1 && (
                    <View className="h-[1px] bg-[#D6D5CA] mx-2" />
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="px-6 py-10 bg-white">
          <TouchableOpacity
            onPress={handleConfirm}
            activeOpacity={0.8}
            className="h-16 rounded-[24px] items-center justify-center bg-[#FBE74C]"
          >
            <Text className="text-[#00343F] font-lexendBold text-lg">
              That's correct
            </Text>
          </TouchableOpacity>
        </View>

        <AttributeEditSheet
          visible={editSheetVisible}
          onClose={() => setEditSheetVisible(false)}
          onSave={saveEdit}
          title={editingField?.label || ""}
          mode={editingField?.mode || "chips"}
          options={editingField?.options}
          initialValue={tempValue}
        />
      </ScreenBackground>
    </View>
  );
}
