import Container from "@/components/shared/container";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useAppStore } from "@/store/useAppStore";
import { useCarScanning } from "@/hooks/useCarScanning";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import ImageCropper from "@/components/shared/ImageCropper";
import {
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

const uploadOptions = [
  { id: "perspective", label: "Vehicle photo" },
];

export default function Pictures() {
  const [images, setImages] = useState<Record<string, string>>({});
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  
  // Cropping State
  const [croppingVisible, setCroppingVisible] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const setScanningProgress = useAppStore((state) => state.setScanningProgress);
  const tempCapturedImage = useAppStore((state) => state.tempCapturedImage);
  const setTempCapturedImage = useAppStore(
    (state) => state.setTempCapturedImage,
  );
  const setScannedCarData = useAppStore((state) => state.setScannedCarData);
  const scannedCarData = useAppStore((state) => state.scannedCarData);

  const { isLoading, scanCarPhotos } = useCarScanning();

  // Handle image handoff from Custom Camera
  useEffect(() => {
    if (tempCapturedImage && activeSlot) {
      // Trigger cropper instead of saving directly
      setImageToCrop(tempCapturedImage);
      setCroppingVisible(true);
      // We keep activeSlot so we know where to save after cropping
      setTempCapturedImage(null);
    }
  }, [tempCapturedImage, activeSlot]);

  const pickFromGallery = async (id: string | "more") => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Permission to access media library is required!",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false, // Use our custom cropper
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setActiveSlot(id);
      setImageToCrop(result.assets[0].uri);
      setCroppingVisible(true);
    }
  };

  const handleCropComplete = (croppedUri: string) => {
    if (activeSlot === "more") {
      setAdditionalImages((prev) => [...prev, croppedUri]);
    } else if (activeSlot) {
      setImages((prev) => ({ ...prev, [activeSlot]: croppedUri }));
    }
    setCroppingVisible(false);
    setImageToCrop(null);
    setActiveSlot(null);
  };

  const openCustomCamera = (id: string | "more") => {
    setActiveSlot(id);

    let type = "perspective";
    let label = "Vehicle photo";
    let step = "1";

    if (id === "more") {
      type = "perspective";
      label = "Additional view";
      step = (
        Object.keys(images).length +
        additionalImages.length +
        1
      ).toString();
    }

    router.push({
      pathname: "/screens/scan/camera",
      params: {
        type,
        label,
        step,
        totalSteps: "1",
      },
    });
  };

  const handleImageSourceSelection = (id: string | "more") => {
    Alert.alert("Add Photo", "Choose how you want to add the vehicle picture", [
      {
        text: "Take Photo",
        onPress: () => openCustomCamera(id),
      },
      {
        text: "Choose from Gallery",
        onPress: () => pickFromGallery(id),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const isNextEnabled = uploadOptions.every((opt) => !!images[opt.id]);

  const handleNext = async () => {
    if (!isNextEnabled || isLoading) return;

    try {
      const data = await scanCarPhotos({ images, additionalImages });
      setScannedCarData(data);
      router.push("/screens/scan/details");
    } catch (error: any) {
      console.error("Scanning Error:", error);
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
            <View className="w-[42px] h-[10px] rounded-full bg-[#09515D]" />
          </View>
        </View>

        <ScrollView
          className="flex-1 mt-10"
          showsVerticalScrollIndicator={false}
        >
          {/* Title and Subtitle */}
          <View className="px-2">
            <Text className="text-[2rem] font-lexendMedium text-[#FFFFFF]">
              Take pictures
            </Text>
            <Text className="text-[0.875rem] font-lexendRegular text-[#9BBABB] mt-2 leading-5">
              Ensure you are in a well lit area so that data gathered can be
              close to accurate as much as possible
            </Text>
          </View>

          {/* Image Upload Slot */}
          <View className="items-center mt-12 px-2">
            {uploadOptions.map((option) => (
              <View key={option.id} className="items-center w-full">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleImageSourceSelection(option.id)}
                  className="w-full h-[240px] border-2 border-dashed border-[#506D72] rounded-[12px] items-center justify-center mb-4 bg-white/5"
                >
                  {images[option.id] ? (
                    <Image
                      source={{ uri: images[option.id] }}
                      className="w-full h-full rounded-[10px]"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="items-center">
                      <Ionicons name="image-outline" size={48} color="#506D72" />
                      <Text className="text-[#506D72] font-lexendMedium mt-2">
                        Tap to capture or upload
                      </Text>
                    </View>
                  )}

                  {/* Camera Icon Overlay */}
                  <View className="absolute bottom-[-12px] -right-2 w-12 h-12 rounded-full bg-[#FBE74C] items-center justify-center shadow-lg">
                    <Ionicons name="camera" size={24} color="#00232A" />
                  </View>
                </TouchableOpacity>
                <Text className="text-[#C1C3C3] font-lexendMedium text-[1rem]">
                  {option.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Additional Images horizontal list */}
          {additionalImages.length > 0 && (
            <View className="mt-8 px-2">
              <Text className="text-[#FFFFFF] font-lexendMedium mb-4">
                Additional Pictures
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                  {additionalImages.map((uri, index) => (
                    <Image
                      key={index}
                      source={{ uri }}
                      className="w-[80px] h-[100px] rounded-[8px]"
                    />
                  ))}
                  <TouchableOpacity
                    onPress={() => handleImageSourceSelection("more")}
                    className="w-[80px] h-[100px] border-2 border-dashed border-[#506D72] rounded-[8px] items-center justify-center bg-white/5"
                  >
                    <Ionicons name="add" size={24} color="#506D72" />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          )}
        </ScrollView>

        {/* Bottom Button Area */}
        <View className="pb-8 gap-3">
          <Pressable
            disabled={!isNextEnabled || isLoading}
            className={`w-full h-[56px] rounded-full items-center justify-center active:opacity-80 ${
              isNextEnabled && !isLoading ? "bg-[#29D7DE]" : "bg-[#093D45]"
            }`}
            onPress={handleNext}
          >
            {isLoading ? (
              <ActivityIndicator color="#00232A" />
            ) : (
              <Text
                className={`font-lexendBold text-[1rem] ${
                  isNextEnabled ? "text-[#00232A]" : "text-[#1E5B64]"
                }`}
              >
                Next
              </Text>
            )}
          </Pressable>

          {isNextEnabled && !isLoading && (
            <TouchableOpacity
              onPress={() => handleImageSourceSelection("more")}
              className="w-full h-[56px] border border-[#29D7DE] rounded-full flex-row items-center gap-1 justify-center"
            >
              <Ionicons name="add" size={16} color="#29D7DE" />
              <Text className="text-[#29D7DE] font-lexendBold text-[1rem]">
                Add more
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Container>

      {/* Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 bg-black/40 items-center justify-center z-50">
          <View className="bg-white p-6 rounded-2xl items-center shadow-xl">
            <ActivityIndicator size="large" color="#29D7DE" />
            <Text className="mt-4 font-lexendMedium text-[#00343F]">
              Recognizing your vehicle...
            </Text>
            <Text className="text-[0.75rem] text-[#9BA0A0] mt-1">
              This might take a few seconds
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
          setActiveSlot(null);
        }}
        onCrop={handleCropComplete}
      />
    </ScreenBackground>
  );
}
