import Container from "@/components/shared/container";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useCarScanning } from "@/hooks/useCarScanning";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import ImageCropper from "@/components/shared/ImageCropper";
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
  const setScannedLicenseData = useAppStore(
    (state) => state.setScannedLicenseData,
  );
  const setScanningProgress = useAppStore((state) => state.setScanningProgress);
  
  // Cropping State
  const [croppingVisible, setCroppingVisible] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const handleImageSourceSelection = () => {
    Alert.alert(
      "Select Photo",
      "Choose how you want to add the license picture",
      [
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
      ],
    );
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
        } is required!`,
      );
      return;
    }

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      allowsEditing: false, // Use our custom cropper
      quality: 0.8,
    };

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageToCrop(result.assets[0].uri);
      setCroppingVisible(true);
    }
  };

  const handleCropComplete = (croppedUri: string) => {
    setImage(croppedUri);
    setCroppingVisible(false);
    setImageToCrop(null);
  };

  const handleNext = async () => {
    if (!image || isLoading) return;

    try {
      const response = await scanVehicleLicense(image);

      if (response && response.licenseData) {
        // 1. Validation: Check if it's a valid document
        if (response.licenseData.isDocument === false) {
          Alert.alert(
            "Invalid Document",
            response.licenseData.error || "The uploaded image is not a valid vehicle license. Please try again."
          );
          return;
        }

        // 2. Formatting: Replace - with spaces in plate number as requested
        const formattedData = { ...response.licenseData };
        if (formattedData.plate) {
          formattedData.plate = formattedData.plate.replace(/-/g, " ");
        }
        if (formattedData.plateNumber) {
          formattedData.plateNumber = formattedData.plateNumber.replace(/-/g, " ");
        }

        setScannedLicenseData({
          ...formattedData,
          photoUrl: response.photoUrl || image,
        });
        router.push("/screens/scan/license-details");
      } else {
        throw new Error("Could not extract data from the license.");
      }
    } catch (error: any) {
      console.error("License Scanning Error:", error);
      Alert.alert(
        "Scanning Failed",
        "Something went wrong. Please check your internet connection and try again."
      );
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
            <View className="w-[42px] h-[10px] rounded-full bg-[#29D7DE]" />
          </View>
        </View>

        <ScrollView
          className="flex-1 mt-10"
          showsVerticalScrollIndicator={false}
        >
          {/* Title and Subtitle */}
          <View className="px-2">
            <Text className="text-[26px] font-lexendMedium text-[#FFFFFF]">
              Capture your primary{"\n"}vehicle license
            </Text>
            <Text className="text-[14px] font-lexendRegular text-[#9BBABB] mt-2 leading-5">
              You would typically find it pasted on the right side of{"\n"}your
              windscreen or your compartment section.
            </Text>
          </View>

          {/* Main Upload Slot */}
          <View className="items-center relative mt-12">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleImageSourceSelection}
              className="w-[320px] h-[230px] border-2 border-dashed border-[#506D72] rounded-[12px] items-center justify-center"
            >
              {image ? (
                 <Image
                  source={{ uri: image }}
                  className="w-full h-full p-3 bg-black rounded-[12px]"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <Ionicons name="image" size={24} color="#506D72" />
                </View>
              )}

              {/* Camera Icon Overlay */}
              <View className="absolute -bottom-4 -right-4 w-[32px] h-[32px] rounded-full bg-[#FBE74C] items-center justify-center">
                <Ionicons name="camera-outline" size={16} color="#00232A" />
              </View>
            </TouchableOpacity>
            <View className="mt-2">
              <Text className="text-[#FFFFFF] font-lexendRegular text-[12px]">
                Front
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button Area */}
        <View className="pb-8">
          <Pressable
            disabled={!image || isLoading}
            className={`w-11/12 mx-auto h-[56px] rounded-full items-center justify-center active:opacity-80 ${
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

      {/* Image Cropper */}
      <ImageCropper
        visible={croppingVisible}
        imageUri={imageToCrop}
        onClose={() => {
          setCroppingVisible(false);
          setImageToCrop(null);
        }}
        onCrop={handleCropComplete}
      />
    </ScreenBackground>
  );
}
