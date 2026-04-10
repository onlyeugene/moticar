import CalendarIcon from "@/assets/details/year.svg";
import EngineIcon from "@/assets/details/engine.svg";
import SpecItem from "@/components/car/SpecItem";
import AttributeEditSheet, { EditMode } from "@/components/scan/AttributeEditSheet";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useAppStore } from "@/store/useAppStore";
import { ScannedLicenseData } from "@/types/app";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LicenseDetailsScreen() {
  const { scannedLicenseData, setScannedLicenseData, setScanningProgress } = useAppStore();

  const [editSheetVisible, setEditSheetVisible] = useState(false);
  const [editingField, setEditingField] = useState<{
    key: keyof ScannedLicenseData;
    label: string;
    mode: EditMode;
    multiline?: boolean;
    keyboardType?: "default" | "numeric";
  } | null>(null);

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

  const openEditor = (key: keyof ScannedLicenseData, label: string, mode: EditMode, multiline = false, keyboardType: "default" | "numeric" = "default") => {
    setEditingField({ key, label, mode, multiline, keyboardType });
    setEditSheetVisible(true);
  };

  const saveEdit = (newValue: any) => {
    if (editingField) {
      setScannedLicenseData({ ...scannedLicenseData, [editingField.key]: newValue });
    }
    setEditSheetVisible(false);
  };

  const handleConfirm = () => {
    setScanningProgress({ licenseCompleted: true });
    router.replace("/screens/scan/scan");
  };

  const HorizontalDivider = () => (
    <View className="h-[1px] bg-[#D6D5CA]" />
  );

  const VerticalDottedDivider = () => (
    <View className="border-l border-[#7AE6EB] border-dashed my-1" />
    
  );

  return (
    <View className="flex-1 bg-black/60">
      <ScreenBackground>
        <Pressable className="h-[15%]" onPress={() => router.back()} />

        <View className="flex-1 bg-white rounded-t-[20px] overflow-hidden">
          {/* Header Section */}
          <View className="bg-[#E8E7DC] px-6 pt-6 pb-4">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-1" />
              <Text className="text-[#767674] font-lexendRegular text-[14px] text-center">
                This is what we got
              </Text>
              <TouchableOpacity
                onPress={() => router.replace("/(onboarding)")}
                className="flex-1 items-end"
              >
                <Ionicons name="close" size={24} color="#101828" />
              </TouchableOpacity>
            </View>

            {/* License Image Preview */}
            <View className="items-center">
               <View className="w-[280px] h-[160px] bg-gray-200 overflow-hidden border border-[#D0CCA6] rounded-xl shadow-sm">
                 {scannedLicenseData.photoUrl ? (
                    <Image 
                      source={{ uri: scannedLicenseData.photoUrl }} 
                      className="w-full h-full" 
                      resizeMode="cover"
                    />
                 ) : (
                    <View className="flex-1 items-center justify-center">
                      <Ionicons name="image-outline" size={32} color="#9BBABB" />
                    </View>
                 )}
               </View>
            </View>
          </View>

          <View className="items-center mt-8">
            <Text className="text-[#A8A477] font-lexendMedium text-[12px] uppercase tracking-widest">
              Information Extracted
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140 }}
            className="mt-4"
          >
            <View className="px-6">
              <View className="bg-white rounded-[24px] border border-[#D6D5CA] overflow-hidden">
                {/* Chassis Number Row */}
                <View className="py-2">
                  <SpecItem
                    icon={CalendarIcon}
                    label="Chasis Number"
                    value={scannedLicenseData.vin || "---"}
                    centered
                    hasDropdown
                    onPress={() => openEditor("vin", "Chasis Number", "input")}
                  />
                </View>

                <HorizontalDivider />

                {/* Engine Number Row */}
                <View className="py-2">
                  <SpecItem
                    icon={CalendarIcon}
                    label="Engine Number"
                    value={scannedLicenseData.engineNumber || "---"}
                    centered
                    hasDropdown
                    onPress={() => openEditor("engineNumber", "Engine Number", "input")}
                  />
                </View>

                <HorizontalDivider />

                {/* Address Row */}
                <View className="py-2 px-6">
                  <SpecItem
                    icon={CalendarIcon}
                    label="Address"
                    value={scannedLicenseData.ownerAddress || "---"}
                    centered
                    hasDropdown
                    onPress={() => openEditor("ownerAddress", "Address", "input", true)}
                  />
                </View>

                <HorizontalDivider />

                {/* Dates Section */}
                <View className="flex-row">
                  <View className="flex-1 py-1">
                    <SpecItem
                      icon={CalendarIcon}
                      label="Date Issued"
                      value={scannedLicenseData.dateIssued || "---"}
                      centered
                      hasDropdown
                      onPress={() => openEditor("dateIssued", "Date Issued", "date")}
                    />
                  </View>
                  
                  <VerticalDottedDivider />

                  <View className="flex-1 py-1">
                    <SpecItem
                      icon={CalendarIcon}
                      label="Expiry Date"
                      value={scannedLicenseData.expiryDate || "---"}
                      centered
                      hasDropdown
                      onPress={() => openEditor("expiryDate", "Expiry Date", "date")}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Button */}
          <View className="absolute bottom-10 left-6 right-6">
            <TouchableOpacity
              onPress={handleConfirm}
              activeOpacity={0.8}
              className="h-16 rounded-[24px] items-center justify-center bg-[#FBE74C]"
            >
              <Text className="text-[#00343F] font-lexendBold text-[16px]">
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
          mode={editingField?.mode || "input"}
          initialValue={editingField ? scannedLicenseData[editingField.key] : ""}
          multiline={editingField?.multiline}
          keyboardType={editingField?.keyboardType}
        />
      </ScreenBackground>
    </View>
  );
}
