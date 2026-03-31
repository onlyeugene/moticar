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
import { useAppStore } from "@/store/useAppStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ScanDetailsScreen() {
  const { scannedCarData, setScannedCarData, setScanningProgress } = useAppStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<{
    key: string;
    label: string;
    type: "text" | "picker";
    options?: string[];
  } | null>(null);
  const [tempValue, setTempValue] = useState("");

  if (!scannedCarData) {
    return (
      <ScreenBackground>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white font-lexendMedium mb-4">No car data found</Text>
          <TouchableOpacity onPress={() => router.back()} className="bg-[#FBE74C] px-6 py-3 rounded-full">
            <Text className="text-[#00343F] font-lexendBold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenBackground>
    );
  }

  const openEditor = (
    key: string,
    label: string,
    type: "text" | "picker",
    options?: string[],
  ) => {
    setEditingField({ key, label, type, options });
    setTempValue(scannedCarData[key] || "");
    setModalVisible(true);
  };

  const saveEdit = () => {
    if (editingField) {
      setScannedCarData({ ...scannedCarData, [editingField.key]: tempValue });
    }
    setModalVisible(false);
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
      type: "text" as const,
    },
    {
      label: "Fuel Type",
      key: "fuelType",
      value: scannedCarData.fuelType || "",
      icon: FuelIcon,
      type: "picker" as const,
      options: ["Petrol", "Diesel", "Electric", "Hybrid"],
    },
    {
      label: "Gearbox",
      key: "transmission",
      value: scannedCarData.transmission || "",
      icon: TransmissionIcon,
      type: "picker" as const,
      options: ["Automatic", "Manual"],
    },
    {
      label: "Engine Size",
      key: "engineDesc",
      value: scannedCarData.engineDesc || scannedCarData.engine || "",
      icon: CylinderIcon,
      type: "text" as const,
    },
    {
      label: "Cylinder",
      key: "cylinder",
      value: scannedCarData.cylinder || "",
      icon: CylinderIcon,
      type: "text" as const,
    },
    {
      label: "Horse Power",
      key: "horsepower",
      value: scannedCarData.horsepower || "",
      icon: HorseIcon,
      type: "text" as const,
    },
    {
      label: "Drive Type",
      key: "driveType",
      value: scannedCarData.driveType || "",
      icon: DriveIcon,
      type: "picker" as const,
      options: ["FWD", "RWD", "AWD", "4WD"],
    },
    {
      label: "Body Style",
      key: "bodyStyle",
      value: scannedCarData.bodyStyle || "",
      icon: BodyIcon,
      type: "text" as const,
    },
    {
      label: "Doors",
      key: "doors",
      value: scannedCarData.doors || "",
      icon: () => <MaterialCommunityIcons name="car-door" size={20} color="#29D7DE" />,
      type: "picker" as const,
      options: ["2", "3", "4", "5"],
    },
    {
      label: "Segment",
      key: "segment",
      value: scannedCarData.segment || "",
      icon: SegmentIcon,
      type: "text" as const,
    },
    {
      label: "Body Color",
      key: "color",
      value: scannedCarData.color || "",
      icon: BodyIcon,
      type: "picker" as const,
      options: [
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
      ],
    },
  ];

  return (
    <View className="flex-1 bg-black/60">
      <ScreenBackground>
        <Pressable className="h-[20%]" onPress={() => router.back()} />

        <View className="flex-1 bg-white rounded-t-[20px]">
          <View className="bg-[#E8E7DC] px-6 pt-6 rounded-t-[20px]">
            <View className="flex-row justify-between items-center">
              <View className="flex-1" />
              <Text className="text-[#767674] font-lexendRegular text-[14px]">
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
                <CarLogo make={scannedCarData.make || ""} size={48} />
              </View>
              <Text className="text-[#00343F] font-lexendSemiBold text-[20px] text-center uppercase">
                {scannedCarData.make} {scannedCarData.carModel || scannedCarData.model}
              </Text>
             <View className="bg-[#FFFFFF] px-3 h-[44px] items-center justify-center mt-2 rounded-[4px] shadow-sm">
               <Text className="text-[#006C70] font-ukNumberPlate text-[18px] text-center uppercase">
                {(scannedCarData.plate || "").replace(/-/g, " ")}
              </Text>
             </View>
            </View>
          </View>

          <View className="flex-row items-center justify-center gap-2 mb-8 px-6 pt-6">
            {/* <View className="h-[1px] flex-1 bg-[#D0CCA6]" /> */}
            <Text className="text-[#A8A477] font-lexendMedium text-[12px]">
              Expected Features
            </Text>
            {/* <View className="h-[1px] flex-1 bg-[#D0CCA6]" /> */}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            <View className="flex-row flex-wrap px-6">
              {detailItems.map((item, index) => (
                <SpecItem
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  value={item.value?.toString()}
                  hasDropdown={true}
                  onPress={() => openEditor(item.key, item.label, item.type, item.options)}
                />
              ))}
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

              {editingField?.type === "text" ? (
                <View className="border border-[#D0CCA6] rounded-xl px-4 py-2 mb-6">
                  <TextInput
                    value={tempValue?.toString()}
                    onChangeText={setTempValue}
                    autoFocus={true}
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
                      <Text className={`font-lexendMedium px-2  ${tempValue === opt ? "text-[#29D7DE]" : "text-[#00343F]"}`}>
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
