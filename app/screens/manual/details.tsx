import BodyIcon from "@/assets/details/body.svg";
import CylinderIcon from "@/assets/details/cylinder.svg";
import DriveIcon from "@/assets/details/drivetype.svg";
import EngineIcon from "@/assets/details/engine.svg";
import FuelIcon from "@/assets/details/fuel.svg";
import TransmissionIcon from "@/assets/details/gear.svg";
import HorseIcon from "@/assets/details/horse.svg";
import SegmentIcon from "@/assets/details/segment.svg";
import CalendarIcon from "@/assets/details/year.svg";
import SpecItem from "@/components/car/SpecItem";
import AttributeEditSheet, {
  EditMode,
} from "@/components/scan/AttributeEditSheet";
import { CarLogo } from "@/components/shared/CarLogo";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useCarDetails } from "@/hooks/useCars";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
    availableYears?: string;
    availableFuelTypes?: string;
    availableGearboxes?: string;
  }>();

  const isMounted = useRef(false);
  const { showSnackbar } = useSnackbar();

  // Local state for all fields
  const [carData, setCarData] = useState({
    year: params.year || "",
    fuelType: params.fuelType || "",
    transmission: params.transmission || "",
    engine: params.engine || "",
    cylinder: "N/A",
    horsepower: "N/A",
    driveType: "N/A",
    bodyStyle: params.class || "",
    segment: "N/A",
    bodyColor: "White",
    doors: "4",
  });

  // Modal states
  const [editSheetVisible, setEditSheetVisible] = useState(false);
  const [editingField, setEditingField] = useState<{
    key: string;
    label: string;
    mode: EditMode;
    options?: string[];
  } | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const { data: detailsData } = useCarDetails({
    make: params.make || "",
    model: params.model || "",
    year: params.year ? parseInt(params.year) : 0,
  });

  useEffect(() => {
    if (detailsData?.details?.features) {
      const f = detailsData.details.features;
      setCarData((prev) => ({
        ...prev,
        fuelType: f.fuelType || prev.fuelType,
        transmission: f.transmission || prev.transmission,
        engine: f.engine || prev.engine,
        cylinder: f.cylinder || prev.cylinder || "N/A",
        horsepower: f.horsepower || prev.horsepower || "N/A",
        driveType: f.driveType || prev.driveType || "N/A",
        bodyStyle: f.bodyStyle || prev.bodyStyle || "N/A",
        segment: f.segment || prev.segment || "N/A",
        bodyColor: f.bodyColor || prev.bodyColor || "White",
        doors: f.doors || "5",
      }));
    }
  }, [detailsData]);

  const handleConfirm = () => {
    const fullCarData = {
      make: params.make || "",
      carModel: params.model || "",
      year: parseInt(carData.year),
      color: carData.bodyColor === "---" ? "" : carData.bodyColor,
      // Technical specs
      bodyStyle: carData.bodyStyle,
      engineDesc: carData.engine,
      fuelType: carData.fuelType,
      transmission: carData.transmission,
      driveType: carData.driveType,
      segment: carData.segment,
      cylinder: carData.cylinder,
      horsepower: carData.horsepower,
      fuelCapacity: detailsData?.details?.features?.fuelCapacity,
      tireSize: detailsData?.details?.features?.tireSize,
      topSpeed: detailsData?.details?.features?.topSpeed,
      acceleration: detailsData?.details?.features?.acceleration,
      brakesFront: detailsData?.details?.features?.brakesFront,
      brakesRear: detailsData?.details?.features?.brakesRear,
      yearRange: detailsData?.details?.features?.yearRange,
    };

    router.replace({
      pathname: "/screens/manual/final",
      params: {
        carDataJson: JSON.stringify(fullCarData),
        recommendedBudget: detailsData?.recommendedBudget || 0,
      },
    });
  };

  const openEditor = (
    key: string,
    label: string,
    mode: EditMode,
    options?: string[],
  ) => {
    setEditingField({ key, label, mode, options });
    setEditSheetVisible(true);
  };

  const availableYearsList = React.useMemo(() => {
    try {
      return params.availableYears ? JSON.parse(params.availableYears).map((y: any) => y.toString()) : [];
    } catch {
      return [];
    }
  }, [params.availableYears]);

  const availableFuelTypesList = React.useMemo(() => {
    try {
      return params.availableFuelTypes ? JSON.parse(params.availableFuelTypes) : ["Petrol", "Diesel", "Electric", "Hybrid"];
    } catch {
      return ["Petrol", "Diesel", "Electric", "Hybrid"];
    }
  }, [params.availableFuelTypes]);

  const availableGearboxList = React.useMemo(() => {
    if (!params.availableGearboxes) return ["Automatic", "Manual"];
    const split = params.availableGearboxes.split("/").map(s => s.trim());
    return split.length > 0 ? split : ["Automatic", "Manual"];
  }, [params.availableGearboxes]);

  const saveEdit = (newValue: any) => {
    if (editingField) {
      setCarData((prev) => ({ ...prev, [editingField.key]: newValue }));
    }
    setEditSheetVisible(false);
  };

  const getYearOptions = () => {
    if (availableYearsList.length > 0) return availableYearsList;
    
    const availableYears = detailsData?.details?.features?.availableYears;
    if (availableYears && availableYears.length > 0) {
      return availableYears.map((y: any) => y.toString());
    }

    const range = detailsData?.details?.features?.yearRange;
    if (range && range.includes("-")) {
      const [start, end] = range.split("-").map((s) => parseInt(s.trim()));
      const years = [];
      for (let i = end; i >= start; i--) {
        years.push(i.toString());
      }
      return years;
    }
    return [params.year || new Date().getFullYear().toString()];
  };

  const detailItems = [
    {
      label: "Year of Production",
      key: "year",
      value: carData.year,
      icon: CalendarIcon,
      mode: "chips" as const,
      options: getYearOptions(),
      isEditable: true,
    },
    {
      label: "Fuel Type",
      key: "fuelType",
      value: carData.fuelType,
      icon: FuelIcon,
      mode: "chips" as const,
      options: availableFuelTypesList,
      isEditable: true,
    },
    {
      label: "Gearbox",
      key: "transmission",
      value: carData.transmission,
      icon: TransmissionIcon,
      mode: "toggle" as const,
      options: availableGearboxList,
      isEditable: true,
    },
    {
      label: "Engine",
      key: "engine",
      value: carData.engine,
      icon: EngineIcon,
      mode: "input" as const,
      isEditable: true,
    },
    {
      label: "Cylinder",
      key: "cylinder",
      value: carData.cylinder,
      icon: CylinderIcon,
      mode: "input" as const,
      isEditable: false,
    },
    {
      label: "Horse Power",
      key: "horsepower",
      value: carData.horsepower,
      icon: HorseIcon,
      mode: "input" as const,
      isEditable: false,
    },
    {
      label: "Drive Type",
      key: "driveType",
      value: carData.driveType,
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
      value: carData.bodyStyle,
      icon: BodyIcon,
      mode: "input" as const,
      isEditable: false,
    },
    {
      label: "Segment",
      key: "segment",
      value: carData.segment,
      icon: SegmentIcon,
      mode: "input" as const,
      isEditable: false,
    },
    {
      label: "Body Color",
      key: "bodyColor",
      value: carData.bodyColor,
      icon: BodyIcon,
      mode: "color" as const,
      isEditable: true,
    },
    {
      label: "Doors",
      key: "doors",
      value: carData.doors,
      icon: () => (
        <MaterialCommunityIcons name="car-door" size={18} color="#29D7DE" />
      ),
      mode: "input" as const,
      isEditable: true,
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
        <Pressable
          className="h-[15%]"
          onPress={() => router.replace("/(onboarding)")}
        />

        <View className="flex-1 bg-white rounded-t-[20px] overflow-hidden">
          {/* Header Section */}
          <View className="bg-[#E8E7DC] px-6 pt-6 pb-4">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-1" />
              <Text className="text-[#767674] font-lexendRegular text-[14px]">
                This is what we got
              </Text>
              <TouchableOpacity
                onPress={() => router.replace("/(onboarding)")}
                className="flex-1 items-end"
              >
                <Ionicons name="close" size={24} color="#101828" />
              </TouchableOpacity>
            </View>

            <View className="items-center mb-4">
              <View className="w-[48px] h-[48px] bg-white rounded-[10px] items-center justify-center border border-gray-50 mb-3 shadow-sm">
                <CarLogo make={params.make || ""} size={40} />
              </View>
              <Text className="text-[#00343F] font-lexendBold text-[20px] text-center uppercase">
                {params.make} {params.model}
              </Text>
            </View>
          </View>

          <View className="items-center mt-6">
            <Text className="text-[#A8A477] font-lexendMedium text-[12px] uppercase tracking-widest">
              Expected Features
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
            className="flex-1 mt-4"
          >
            <View className="px-5">
              <View className="bg-white rounded-[20px] border border-[#D6D5CA] overflow-hidden">
                {chunkedItems.map((row, rowIndex) => (
                  <View key={rowIndex}>
                    <View className="flex-row">
                      {row.map((item, itemIndex) => (
                        <View key={item.key} className="flex-1 py-4 px-7">
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
                          {/* {itemIndex === 0 && row.length === 2 && (
                            <View className="absolute right-0 top-4 bottom-4 w-[1px] bg-[#D6D5CA]" />
                          )} */}
                        </View>
                      ))}
                      {row.length === 1 && <View className="flex-1" />}
                    </View>
                    {rowIndex < chunkedItems.length - 1 && (
                      <View className="h-[1px] bg-[#D6D5CA]" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Action Button */}
          <View className="pt-4 pb-12 px-6">
            <TouchableOpacity
              onPress={handleConfirm}
              activeOpacity={0.8}
              className="h-16 rounded-full items-center justify-center bg-[#FBE74C]"
            >
              <Text className="text-[#00343F] font-lexendBold text-lg">
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
              ? carData[editingField.key as keyof typeof carData]
              : ""
          }
        />
      </ScreenBackground>
    </View>
  );
}
