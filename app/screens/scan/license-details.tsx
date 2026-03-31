import CalendarIcon from "@/assets/icons/car/calendar.svg";
import CylinderIcon from "@/assets/icons/car/cylinder.svg";
import EngineIcon from "@/assets/icons/car/engine.svg";
import SpecItem from "@/components/car/SpecItem";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LicenseDetailsScreen() {
  const { scannedLicenseData, setScannedLicenseData, setScanningProgress } = useAppStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<{
    key: string;
    label: string;
  } | null>(null);
  const [tempValue, setTempValue] = useState("");

  if (!scannedLicenseData) {
    return (
      <ScreenBackground>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white font-lexendMedium mb-4">No license data found</Text>
          <TouchableOpacity onPress={() => router.back()} className="bg-[#FBE74C] px-6 py-3 rounded-full">
            <Text className="text-[#00343F] font-lexendBold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenBackground>
    );
  }

  const openEditor = (key: string, label: string) => {
    setEditingField({ key, label });
    setTempValue((scannedLicenseData as any)[key] || "");
    setModalVisible(true);
  };

  const saveEdit = () => {
    if (editingField) {
      setScannedLicenseData({ ...scannedLicenseData, [editingField.key]: tempValue });
    }
    setModalVisible(false);
  };

  const handleConfirm = () => {
    setScanningProgress({ licenseCompleted: true });
    router.replace("/screens/scan/scan");
  };

  const detailItems = [
    {
      label: "Chassis Number",
      key: "vin",
      value: scannedLicenseData.vin || "",
      icon: (props: any) => <Ionicons name="barcode-outline" size={20} color="#29D7DE" {...props} />,
    },
    {
      label: "Engine Number",
      key: "engineNumber",
      value: scannedLicenseData.engineNumber || "",
      icon: EngineIcon,
    },
    {
      label: "Address",
      key: "ownerAddress",
      value: scannedLicenseData.ownerAddress || "",
      icon: (props: any) => <Ionicons name="location-outline" size={20} color="#29D7DE" {...props} />,
    },
    {
      label: "Date Issued",
      key: "dateIssued",
      value: scannedLicenseData.dateIssued || "",
      icon: CalendarIcon,
    },
    {
      label: "Expiry Date",
      key: "expiryDate",
      value: scannedLicenseData.expiryDate || "",
      icon: CalendarIcon,
    },
  ];

  return (
    <View className="flex-1 bg-black/60">
      <ScreenBackground>
        {/* Transparent top area to simulate bottom sheet behavior */}
        <Pressable className="h-[20%]" onPress={() => router.back()} />

        <View className="flex-1 bg-white rounded-t-[20px] overflow-hidden">
          {/* Header Section */}
          <View className="bg-[#E8E7DC] px-6 pt-6 pb-4">
            <View className="flex-row justify-between items-center mb-4">
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

            {/* License Image Preview */}
            <View className="items-center mb-">
               <View className="w-[356px] h-[208px] bg-gray-200 overflow-hidden border border-[#D0CCA6]">
                 {scannedLicenseData.photoUrl ? (
                    <Image 
                      source={{ uri: scannedLicenseData.photoUrl }} 
                      className="w-full h-full" 
                      resizeMode="cover"
                    />
                 ) : (
                    <View className="flex-1 items-center justify-center">
                      <Ionicons name="image-outline" size={48} color="#9BBABB" />
                    </View>
                 )}
               </View>
            </View>
          </View>

          <View className="flex-row items-center justify-center gap-2 mb-2 px-6 pt-6">
            <View className="w-full border-[#9BA5A5] border-dashed border-[0.5px]" />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140 }}
          >
            <View className="px-6">
              {/* Chasis Number */}
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => openEditor("vin", "Chasis Number")}
                className="items-center py-4"
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <Ionicons name="calendar-outline" size={16} color="#9BA5A5" />
                  <Text className="text-[#9BA5A5] font-lexendRegular text-[12px]">Chasis Number</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-[#202A2A] font-lexendSemiBold text-[14px] uppercase">
                    {scannedLicenseData.vin || "---"}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color="#9BA5A5" />
                </View>
              </TouchableOpacity>

              <View className="w-full border-[#7AE6EB] border-dashed border-[0.5px]" />

              {/* Engine Number */}
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => openEditor("engineNumber", "Engine Number")}
                className="items-center py-4"
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <Ionicons name="calendar-outline" size={16} color="#9BA5A5" />
                  <Text className="text-[#9BA5A5] font-lexendRegular text-[12px]">Engine Number</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-[#202A2A] font-lexendSemiBold text-[14px] uppercase">
                    {scannedLicenseData.engineNumber || "---"}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color="#9BA5A5" />
                </View>
              </TouchableOpacity>

              <View className="w-full border-[#7AE6EB] border-dashed border-[0.5px]" />

              {/* Address */}
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => openEditor("ownerAddress", "Address")}
                className="items-center py-4"
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <Ionicons name="calendar-outline" size={16} color="#9BA5A5" />
                  <Text className="text-[#9BA5A5] font-lexendRegular text-[12px]">Address</Text>
                </View>
                <View className="flex-row items-center justify-center px-4">
                  <Text className="text-[#202A2A] font-lexendSemiBold text-[14px] text-center leading-6 mr-2">
                    {scannedLicenseData.ownerAddress || "---"}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color="#9BA5A5" />
                </View>
              </TouchableOpacity>

              <View className="w-full border-[#7AE6EB] border-dashed border-[0.5px]" />

              {/* Dates Row */}
              <View className="flex-row py-4">
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => openEditor("dateIssued", "Date Issued")}
                  className="flex-1 items-center"
                >
                  <View className="flex-row items-center gap-2 mb-2">
                    <Ionicons name="calendar-outline" size={16} color="#9BA5A5" />
                    <Text className="text-[#9BA5A5] font-lexendRegular text-[12px]">Date Issued</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-[#202A2A] font-lexendSemiBold text-[14px]">
                      {scannedLicenseData.dateIssued || "---"}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#9BA5A5" />
                  </View>
                </TouchableOpacity>

                <View className="w-[1px] h-full bg-[#7AE6EB] border-dashed" />

                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => openEditor("expiryDate", "Expiry Date")}
                  className="flex-1 items-center"
                >
                  <View className="flex-row items-center gap-2 mb-2">
                    <Ionicons name="calendar-outline" size={16} color="#9BA5A5" />
                    <Text className="text-[#9BA5A5] font-lexendRegular text-[12px]">Expiry Date</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-[#202A2A] font-lexendSemiBold text-[14px]">
                      {scannedLicenseData.expiryDate || "---"}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#9BA5A5" />
                  </View>
                </TouchableOpacity>
              </View>
              
              <View className="w-full border-[#7AE6EB] border-dashed border-[0.5px]" />
            </View>
          </ScrollView>

          {/* Action Button */}
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

        {/* Edit Modal */}
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

              <View className="border border-[#D0CCA6] rounded-xl px-4 py-2 mb-6">
                <TextInput
                  value={tempValue?.toString()}
                  onChangeText={setTempValue}
                  autoFocus={true}
                  className="text-[#00343F] font-lexendMedium py-2 text-[16px]"
                  placeholderTextColor="#9BBABB"
                />
              </View>

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
