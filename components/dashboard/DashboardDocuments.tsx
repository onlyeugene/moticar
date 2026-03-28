import Body from "@/assets/icons/body.svg";
import { useUploadDocument } from "@/hooks/useCars";
import { CarDocument } from "@/types/car";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import DocumentManagementSheet from "../sheets/DocumentManagementSheet";
// Using expo-image-picker if available, otherwise fallback to Alert
import * as ImagePicker from "expo-image-picker";

interface DashboardDocumentsProps {
  carId: string;
  documents?: CarDocument[];
}

const DOC_ICON_MAP: Record<string, React.FC<any>> = {
  "MOT": Body,
  "Vehicle License": Body,
  "Tax": Body,
  "Insurance Status": Body,
};

export default function DashboardDocuments({
  carId,
  documents = [],
}: DashboardDocumentsProps) {
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const { mutate: uploadDoc } = useUploadDocument();

  const documentTypes = [
    { name: "MOT", type: "MOT" },
    { name: "Vehicle Licence", type: "Vehicle License" },
    { name: "Tax", type: "Tax" },
    { name: "Insurance Status", type: "Insurance Status" },
  ];

  const handlePickDocument = async (type: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setUploadingType(type);
        uploadDoc(
          {
            carId,
            type,
            file: { uri: asset.uri, type: "image/jpeg", name: "document.jpg" },
          },
          {
            onSuccess: () => {
              setUploadingType(null);
              Alert.alert(
                "Success",
                `${type} uploaded and processed successfully`,
              );
            },
            onError: (error) => {
              setUploadingType(null);
              Alert.alert(
                "Upload Failed",
                "Could not upload document. Please try again.",
              );
              console.error(error);
            },
          },
        );
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert(
        "Error",
        "Please ensure expo-image-picker is installed: npx expo install expo-image-picker",
      );
    }
  };

  const renderDocCard = (label: string, type: string) => {
    const doc = documents.find((d) => d.type === type);
    const hasData = !!doc;
    const isUploading = uploadingType === type;
    const isExpired = doc?.status === "expired";
    const IconComp = DOC_ICON_MAP[type] || Body;

    return (
      <View
        key={type}
        className="bg-[#F5F5F5] p-3 rounded-[12px] mt-5 w-[48.5%]"
      >
        <View className="flex-row justify-between items-start ">
          <View className="rounded-full bg-white px-3 py-2 mt-2">
            <IconComp width={19} />
          </View>
          <TouchableOpacity
            onPress={() => handlePickDocument(type)}
            disabled={!!uploadingType}
            className={`rounded-full bg-white p-3 ${uploadingType ? "opacity-50" : ""}`}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#00AEB5" />
            ) : (
              <Ionicons
                name={hasData ? "arrow-redo-outline" : "add"}
                size={18}
                color="#00AEB5"
              />
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-5">
          <Text className="text-[#050505] text-[16px] font-lexendRegular">
            {label}
          </Text>
          <Text 
            className={`text-[12px] font-lexendRegular ${isExpired ? "text-[#FF4D4D]" : "text-[#B4B1B1]"}`}
          >
            {hasData
              ? `Expires: ${new Date(doc.expiryDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}`
              : "No data recorded"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="bg-white p-2 rounded-[12px]">
      <View className="flex-row justify-between items-center px-1">
        <Text className="text-[#036D7D] text-[20px] font-lexendMedium">
          Car Documents
        </Text>
        <TouchableOpacity onPress={() => setIsSheetVisible(true)}>
          <Ionicons name="grid-outline" size={18} color="#C0C0C0" />
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {documentTypes.map((dt) => renderDocCard(dt.name, dt.type))}
      </View>

      <DocumentManagementSheet
        visible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
        documents={documents}
      />
    </View>
  );
}
