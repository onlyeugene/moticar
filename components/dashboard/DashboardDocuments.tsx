import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Body from "@/assets/icons/body.svg";
import { CarDocument } from "@/types/car";
import { useUploadDocument } from "@/hooks/useCars";
import DocumentManagementSheet from "./DocumentManagementSheet";
// Using expo-image-picker if available, otherwise fallback to Alert
import * as ImagePicker from "expo-image-picker";

interface DashboardDocumentsProps {
  carId: string;
  documents?: CarDocument[];
}

export default function DashboardDocuments({ carId, documents = [] }: DashboardDocumentsProps) {
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const { mutate: uploadDoc, isPending } = useUploadDocument();

  const documentTypes = [
    { name: "MOT", type: "MOT" },
    { name: "Vehicle Licence", type: "Vehicle License" },
    { name: "Tax", type: "Tax" },
    { name: "Insurance Status", type: "Insurance Status" },
  ];

  const handlePickDocument = async (type: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        uploadDoc({ 
          carId, 
          type, 
          file: { uri: asset.uri, type: 'image/jpeg', name: 'document.jpg' } 
        }, {
          onSuccess: () => {
            Alert.alert("Success", `${type} uploaded and processed successfully`);
          },
          onError: (error) => {
            Alert.alert("Upload Failed", "Could not upload document. Please try again.");
            console.error(error);
          }
        });
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Please ensure expo-image-picker is installed: npx expo install expo-image-picker");
    }
  };

  const renderDocCard = (label: string, type: string) => {
    const doc = documents.find(d => d.type === type);
    const hasData = !!doc;
    
    return (
      <View key={type} className="bg-[#F5F5F5] p-3 rounded-[12px] mt-5 w-[48.5%]">
        <View className="flex-row justify-between items-start ">
          <View className="rounded-full bg-white px-3 py-2 mt-2">
            <Body width={19} />
          </View>
          <TouchableOpacity 
            onPress={() => handlePickDocument(type)}
            disabled={isPending}
            className={`rounded-full bg-white p-3 ${isPending ? 'opacity-50' : ''}`}
          >
            <Ionicons 
              name={hasData ? "arrow-redo-outline" : "add"} 
              size={18} 
              color="#00AEB5" 
            />
          </TouchableOpacity>
        </View>
        <View className="mt-5">
          <Text className="text-[#050505] text-[16px] font-lexendRegular">
            {label}
          </Text>
          <Text className="text-[#B4B1B1] text-[12px] font-lexendRegular">
            {hasData ? `Expires: ${new Date(doc.expiryDate).toLocaleDateString()}` : "No data recorded"}
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
        {documentTypes.map(dt => renderDocCard(dt.name, dt.type))}
      </View>

      <DocumentManagementSheet 
        visible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
        documents={documents}
      />
    </View>
  );
}
