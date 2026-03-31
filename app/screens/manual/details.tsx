import BodyIcon from "@/assets/icons/car/body.svg";
import CalendarIcon from "@/assets/icons/car/calendar.svg";
import CylinderIcon from "@/assets/icons/car/cylinder.svg";
import DriveIcon from "@/assets/icons/car/drive.svg";
import FuelIcon from "@/assets/icons/car/fuel.svg";
import HorseIcon from "@/assets/icons/car/horse.svg";
import SegmentIcon from "@/assets/icons/car/segment.svg";
import TransmissionIcon from "@/assets/icons/car/transmission.svg";
import SpecItem from "@/components/car/SpecItem";
import { CarLogo } from "@/components/shared/CarLogo";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useCarDetails, useCreateCar } from "@/hooks/useCars";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { Ionicons } from "@expo/vector-icons";
import SpeedometerIcon from "@/assets/icons/car/speedometer.svg";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
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
    bodyColor: "---",
  });

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<{
    key: string;
    label: string;
    type: "text" | "picker" | "numeric";
    options?: string[];
  } | null>(null);
  const [tempValue, setTempValue] = useState("");

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
        bodyColor: f.bodyColor || prev.bodyColor || "---",
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
    type: "text" | "picker" | "numeric",
    options?: string[],
  ) => {
    setEditingField({ key, label, type, options });
    const val = carData[key as keyof typeof carData] || "";
    setTempValue(String(val).replace(/,/g, ""));
    setModalVisible(true);
  };

  const saveEdit = () => {
    if (editingField) {
      setCarData((prev) => ({ ...prev, [editingField.key]: tempValue }));
    }
    setModalVisible(false);
  };

  const getYearOptions = () => {
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

  return (
    <View className="flex-1 bg-black/60">
      <ScreenBackground>
        <Pressable className="h-[20%]" onPress={() => router.back()} />

        <View className="flex-1 bg-white rounded-t-[20px]">
          <View className="bg-[#E8E7DC] px-6 pt-6 rounded-t-[20px]">
            <View className="flex-row justify-between items-center">
              <View className="flex-1" />
              <Text className="text-[#9BBABB] font-lexendMedium text-[12px]">
                This is what we got
              </Text>
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex-1 items-end"
              >
                <Ionicons name="close" size={24} color="#101828" />
              </TouchableOpacity>
            </View>

            <View className="items-center mb-6 ">
              <View className="">
                <CarLogo make={params.make || ""} size={48} />
              </View>
              <Text className="text-[#00343F] font-lexendSemiBold text-[20px] text-center uppercase">
                {params.make} {params.model} {carData.engine !== "N/A" ? carData.engine : ""}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-center gap-2 mb-8 px-6 pt-6">
            <View className="h-[1px] flex-1 bg-[#D0CCA6]" />
            <Text className="text-[#D0CCA6] font-lexendMedium text-[10px] uppercase tracking-widest">
              Expected Features
            </Text>
            <View className="h-[1px] flex-1 bg-[#D0CCA6]" />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            <View className="flex-row flex-wrap px-6">
              <SpecItem
                icon={CalendarIcon}
                label="Year of Production:"
                value={carData.year}
                hasDropdown={true}
                onPress={() => openEditor("year", "Year of Production", "picker", getYearOptions())}
              />
              <SpecItem
                icon={FuelIcon}
                label="Fuel Type"
                value={carData.fuelType}
                hasDropdown={true}
                onPress={() => openEditor("fuelType", "Fuel Type", "picker", ["Petrol", "Diesel", "Electric", "Hybrid"])}
              />
              <SpecItem
                icon={TransmissionIcon}
                label="Transmission"
                value={carData.transmission}
                hasDropdown={true}
                onPress={() => openEditor("transmission", "Transmission", "picker", ["Automatic", "Manual"])}
              />
              <SpecItem
                icon={CylinderIcon}
                label="Engine"
                value={carData.engine}
                hasDropdown={true}
                onPress={() => openEditor("engine", "Engine Size", "text")}
              />
              <SpecItem
                icon={CylinderIcon}
                label="Cylinder"
                value={carData.cylinder}
                hasDropdown={true}
                onPress={() => openEditor("cylinder", "Cylinder", "text")}
              />
              <SpecItem
                icon={HorseIcon}
                label="Horse Power"
                value={carData.horsepower}
                hasDropdown={true}
                onPress={() => openEditor("horsepower", "Horse Power", "text")}
              />
              <SpecItem
                icon={DriveIcon}
                label="Drive Type"
                value={carData.driveType}
                hasDropdown={true}
                onPress={() => openEditor("driveType", "Drive Type", "picker", ["FWD", "RWD", "AWD", "4WD"])}
              />
              <SpecItem
                icon={BodyIcon}
                label="Body Style"
                value={carData.bodyStyle}
                hasDropdown={true}
                onPress={() => openEditor("bodyStyle", "Body Style", "text")}
              />
              <SpecItem
                icon={SegmentIcon}
                label="Segment"
                value={carData.segment}
                hasDropdown={true}
                onPress={() => openEditor("segment", "Segment", "text")}
              />
              <SpecItem
                icon={BodyIcon}
                label="Body Color"
                value={carData.bodyColor}
                hasDropdown={true}
                onPress={() =>
                  openEditor("bodyColor", "Body Color", "picker", [
                    "White",
                    "Black",
                    "Grey",
                    "Silver",
                    "Blue",
                    "Red",
                    "Green",
                    "Brown/Beige",
                    "Yellow",
                    "Orange",
                    "Gold",
                    "Bronze",
                    "Purple",
                    "Turquoise/Teal",
                    "Maroon",
                    "Pink",
                  ])
                }
              />
            </View>
          </ScrollView>

          <View className="absolute bottom-10 left-6 right-6">
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

        {/* Universal Edit Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable 
            className="flex-1 bg-black/40 justify-center items-center px-10"
            onPress={() => setModalVisible(false)}
          >
            <View className="bg-white rounded-3xl w-full p-6 shadow-xl" onStartShouldSetResponder={() => true}>
              <Text className="text-[#00343F] font-lexendBold text-lg mb-4">
                Edit {editingField?.label}
              </Text>

              {editingField?.type === "text" || editingField?.type === "numeric" ? (
                <View className="border border-[#D0CCA6] rounded-xl px-4 py-2 mb-6">
                  <TextInput
                    value={tempValue}
                    onChangeText={setTempValue}
                    autoFocus={true}
                    keyboardType={editingField?.type === "numeric" ? "numeric" : "default"}
                    className="text-[#00343F] font-lexendMedium py-2 text-[16px]"
                    placeholderTextColor="#9BBABB"
                  />
                </View>
              ) : (
                <ScrollView className="max-h-60 mb-6">
                  {editingField?.options?.map((opt, idx) => (
                    <TouchableOpacity
                      key={idx}
                      className={`py-4 border-b border-[#9BBABB]/10 ${tempValue === opt ? "bg-[#29D7DE]/10 rounded-[4px]" : ""}`}
                      onPress={() => setTempValue(opt)}
                    >
                      <Text className={`font-lexendMedium px-2 ${tempValue === opt ? "text-[#29D7DE]" : "text-[#00343F]"}`}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <View className="flex-row gap-4">
                <TouchableOpacity 
                  onPress={() => setModalVisible(false)}
                  className="flex-1 h-12 rounded-xl items-center justify-center border border-[#9BBABB]"
                >
                  <Text className="font-lexendMedium text-[#9BBABB]">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={saveEdit}
                  className="flex-1 h-12 rounded-xl items-center justify-center bg-[#FBE74C]"
                >
                  <Text className="font-lexendMedium text-[#00343F]">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
      </ScreenBackground>
    </View>
  );
}
