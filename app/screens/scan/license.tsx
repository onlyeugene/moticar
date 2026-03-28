import Container from "@/components/shared/container";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useCarScanning } from "@/hooks/useCarScanning";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

export default function LicenseScan() {
  const [image, setImage] = useState<string | null>(null);
  const { isLicenseLoading: isLoading, scanVehicleLicense } = useCarScanning();
  const setScanningProgress = useAppStore((state) => state.setScanningProgress);

  const handleImageSourceSelection = () => {
    Alert.alert("Select Photo", "Choose how you want to add the license picture", [
      {
        text: "Take Photo",
        onPress: () => pickImage("camera"),
      },
      {
        text: "Choose from Gallery",
        onPress: () => pickImage("gallery"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const pickImage = async (source: "camera" | "gallery") => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert(
        "Permission Required",
        `Permission to access ${
          source === "camera" ? "camera" : "media library"
        } is required!`
      );
      return;
    }

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    };

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    if (!image || isLoading) return;

    try {
      await scanVehicleLicense(image);
      
      setScanningProgress({ licenseCompleted: true });
      Alert.alert("Success", "License paper scanned successfully!", [
        {
          text: "Continue",
          onPress: () => router.push("/screens/scan/scan"),
        },
      ]);
    } catch (error: any) {
      console.error("License Scanning Error:", error);
      Alert.alert("Scanning Failed", error.message);
    }
  };

  return (
    <ScreenBackground>
      <Container>
        {/* Header with Progress Bar */}
        <View className="flex-row w-full items-center">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          <View className="items-center justify-center flex-1 flex-row gap-4">
            <View className="w-[42px] h-[10px] rounded-full bg-[#29D7DE]" />
            <View className="w-[15px] h-[10px] rounded-full bg-[#29D7DE]" />
            <View className="w-[42px] h-[10px] rounded-full bg-[#09515D]" />
          </View>
        </View>

        <ScrollView
          className="flex-1 mt-10"
          showsVerticalScrollIndicator={false}
        >
          {/* Title and Subtitle */}
          <View className="px-2">
            <Text className="text-[32px] font-lexendMedium text-[#FFFFFF]">
              Vehicle setup
            </Text>
            <Text className="text-[14px] font-lexendRegular text-[#9BBABB] mt-2 leading-5">
              Upload your vehicle primary paper to extract details like your chassis number, engine number etc
            </Text>
          </View>

          {/* Main Upload Slot */}
          <View className="items-center mt-12 px-2">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleImageSourceSelection}
              className="w-full h-[220px] border-2 border-dashed border-[#506D72] rounded-[16px] items-center justify-center bg-white/5 overflow-hidden"
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <Ionicons name="document-text-outline" size={48} color="#506D72" />
                  <Text className="text-[#506D72] font-lexendMedium mt-4">
                    Tap to upload vehicle paper
                  </Text>
                </View>
              )}

              {/* Camera Icon Overlay */}
              <View className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-[#FBE74C] items-center justify-center">
                <Ionicons name="camera" size={24} color="#00232A" />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Button Area */}
        <View className="pb-8">
          <Pressable
            disabled={!image || isLoading}
            className={`w-full h-[56px] rounded-full items-center justify-center active:opacity-80 ${
              image && !isLoading ? "bg-[#29D7DE]" : "bg-[#093D45]"
            }`}
            onPress={handleNext}
          >
            {isLoading ? (
              <ActivityIndicator color="#00232A" />
            ) : (
              <Text
                className={`font-lexendBold text-[16px] ${
                  image ? "text-[#00232A]" : "text-[#1E5B64]"
                }`}
              >
                Next
              </Text>
            )}
          </Pressable>
        </View>
      </Container>
      
      {/* Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 bg-black/40 items-center justify-center z-50">
          <View className="bg-white p-6 rounded-2xl items-center shadow-xl">
            <ActivityIndicator size="large" color="#29D7DE" />
            <Text className="mt-4 font-lexendMedium text-[#00343F]">
              Scanning your document...
            </Text>
            <Text className="text-[12px] text-[#9BA0A0] mt-1">
              Extracting chassis and engine data
            </Text>
          </View>
        </View>
      )}
    </ScreenBackground>
  );
}
