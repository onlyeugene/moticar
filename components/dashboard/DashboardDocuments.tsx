import Body from "@/assets/icons/body.svg";
import { useUploadDocument } from "@/hooks/useCars";
import { CarDocument } from "@/types/car";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  Modal,
  Image,
} from "react-native";
import DocumentManagementSheet from "../sheets/DocumentManagementSheet";
import * as ImagePicker from "expo-image-picker";
import ArrowRight from "@/assets/icons/arrow_right.svg";
import AddDocumentSheet from "../sheets/AddDocumentSheet";
import { DocumentCategory, DocumentFormState } from "../document-forms/types";
import ImageCropper from "../shared/ImageCropper";
import ArrowUp from "@/assets/icons/arrow_right.svg";

interface DashboardDocumentsProps {
  carId: string;
  documents?: CarDocument[];
}

const DOC_ICON_MAP: Record<string, React.FC<any>> = {
  MOT: Body,
  "Vehicle License": Body,
  "Road Tax": Body,
  Insurance: Body,
  "Service History": Body,
  "Driver’s License": Body,
  "Emissions / Inspection": Body,
};

export default function DashboardDocuments({
  carId,
  documents = [],
}: DashboardDocumentsProps) {
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [isAddSheetVisible, setIsAddSheetVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<DocumentCategory>("MOT");
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<
    (Partial<DocumentFormState> & { _id?: string }) | null
  >(null);
  const [cropperVisible, setCropperVisible] = useState(false);
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);

  const { mutate: uploadDoc } = useUploadDocument();

  const documentTypes = [
    { name: "MOT", type: "MOT" },
    { name: "Vehicle Licence", type: "Vehicle License" },
    { name: "Road Tax", type: "Road Tax" },
    { name: "Insurance", type: "Insurance" },
    { name: "Service History", type: "Service History" },
    { name: "Driver’s License", type: "Driver’s License" },
    { name: "Emissions / Inspection", type: "Emissions / Inspection" },
  ];

  const handlePickDocument = async (type: string) => {
    Alert.alert("Upload Document", "Choose a source", [
      {
        text: "Take Photo",
        onPress: () => initiatePick(type, "camera"),
      },
      {
        text: "Choose from Gallery",
        onPress: () => initiatePick(type, "library"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const initiatePick = async (type: string, source: "camera" | "library") => {
    try {
      let result;
      if (source === "camera") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            "Permission Denied",
            "Camera access is required to take photos.",
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          quality: 1,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUploadingType(type);
        setPendingImageUri(result.assets[0].uri);
        setCropperVisible(true);
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const handleCropped = (uri: string) => {
    setCropperVisible(false);
    if (!uploadingType || !uri) return;

    uploadDoc(
      {
        carId,
        type: uploadingType,
        file: { uri, type: "image/jpeg", name: "document.jpg" },
      },
      {
        onSuccess: () => {
          setUploadingType(null);
          setPendingImageUri(null);
          Alert.alert(
            "Success",
            `${uploadingType} uploaded and processed successfully`,
          );
        },
        onError: (error) => {
          setUploadingType(null);
          setPendingImageUri(null);
          Alert.alert(
            "Upload Failed",
            "Could not upload document. Please try again.",
          );
          console.error(error);
        },
      },
    );
  };

  const handleManageSheetClose = useCallback(() => {
    setIsSheetVisible(false);
  }, []);

  const handleAddSheetClose = useCallback(() => {
    setIsAddSheetVisible(false);
  }, []);

  const renderDocCard = (label: string, type: string) => {
    const doc = documents.find((d) => d.type === type);
    const hasData = !!doc;
    const isUploading = uploadingType === type;
    const IconComp = DOC_ICON_MAP[type] || Body;

    let statusText = "No data recorded";
    let statusColor = "text-[#B4B1B1]";
    let StatusIcon = null;

    if (hasData) {
      const expiryDate = new Date(doc.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expire = new Date(expiryDate);
      expire.setHours(0, 0, 0, 0);

      const diffTime = expire.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const inputDate = doc.createdAt ? new Date(doc.createdAt) : expiryDate;
      const formattedDate = inputDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      if (diffDays < 0) {
        statusText = `Inactive `;
        statusColor = "text-[#B30303]";
        StatusIcon = <Ionicons name="close" size={16} color="#B30303" />;
      } else if (diffDays <= 30) {
        StatusIcon = (
          <Ionicons name="alert-circle-outline" size={16} color="#EAA535" />
        );
        statusText = `Expires in ${diffDays} days`;
        statusColor = "text-[#EAA535]";
      } else {
        statusText = `Active`;
        statusColor = "text-[#1ED760]";
        StatusIcon = <Ionicons name="checkmark" size={16} color="#1ED760" />;
      }
    }

    return (
      <Pressable
        key={type}
        onPress={() => {
          const doc = documents.find((d) => d.type === type);
          const hasEntries =
            doc && (doc.vin || doc.expiryDate || doc.amount || doc.issueDate);

          if (hasEntries) {
            setSelectedCategory(type as DocumentCategory);
            setSelectedDocument(doc as any);
            setIsAddSheetVisible(true);
          } else {
            const fileUrl =
              doc?.fileUrl ||
              (doc as any)?.documentUrl ||
              (doc as any)?.url ||
              (doc as any)?.photoUrl ||
              (doc as any)?.scannedPhotoUrl;
            if (fileUrl) {
              setPreviewUrl(fileUrl);
            } else {
              setSelectedCategory(type as DocumentCategory);
              setSelectedDocument(null);
              setIsAddSheetVisible(true);
            }
          }
        }}
        className="bg-[#F5F5F5] p-3 rounded-[12px] mt-5 w-[48.5%]"
      >
        <View className="flex-row justify-between items-start">
          <View className="rounded-full bg-white px-3 py-2 mt-2">
            <IconComp width={19} />
          </View>

          <TouchableOpacity
            onPress={() => handlePickDocument(type)}
            disabled={!!uploadingType}
            className={`rounded-full ${hasData ? "" : "bg-white"} p-3 ${uploadingType ? "opacity-50" : ""}`}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#00AEB5" />
            ) : hasData ? (
              <ArrowUp width={24} color={"#797979"} />
            ) : (
              <Ionicons name="add" size={19} color="#00AEB5" />
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-5">
          <Text className="text-[#050505] text-[1rem] font-lexendRegular">
            {label}
          </Text>
          <View className="flex-row items-center mt-1 gap-1">
            {StatusIcon}
            <Text className={`text-[0.75rem] font-lexendMedium ${statusColor}`}>
              {statusText}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="bg-white p-4 rounded-[12px]">
      <View className="flex-row justify-between items-center px-1">
        <Text className="text-[#036D7D] text-[1.25rem] font-lexendMedium">
          Car Documents
        </Text>
        <TouchableOpacity onPress={() => setIsSheetVisible(true)}>
          <ArrowRight width={24} height={24} />
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {documentTypes.slice(0, 4).map((dt) => renderDocCard(dt.name, dt.type))}
      </View>

      <DocumentManagementSheet
        visible={isSheetVisible}
        onClose={handleManageSheetClose}
        documents={documents}
        onUpload={(type) => handlePickDocument(type)}
        uploadingType={uploadingType}
        carId={carId}
        onAddRequest={(cat, doc) => {
          setSelectedCategory(cat);
          setSelectedDocument(doc ? (doc as any) : null);
          setIsSheetVisible(false);
          setTimeout(() => {
            setIsAddSheetVisible(true);
          }, 450);
        }}
        onPreviewRequest={(url) => {
          setIsSheetVisible(false);
          // Small delay to let the sheet close before opening the preview modal
          setTimeout(() => setPreviewUrl(url), 300);
        }}
      />

      <AddDocumentSheet
        key={`${selectedCategory}-${selectedDocument?._id || "new"}`}
        visible={isAddSheetVisible}
        onClose={handleAddSheetClose}
        category={selectedCategory}
        initialData={selectedDocument || undefined}
        carId={carId}
      />

      <ImageCropper
        visible={cropperVisible}
        imageUri={pendingImageUri}
        onClose={() => {
          setCropperVisible(false);
          setUploadingType(null);
          setPendingImageUri(null);
        }}
        onCrop={handleCropped}
      />

      {/* 🚀 Centralized Full-Screen Image Preview Modal */}
      <Modal
        visible={!!previewUrl}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewUrl(null)}
      >
        <Pressable
          className="flex-1 bg-black/90 justify-center items-center"
          onPress={() => setPreviewUrl(null)}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="w-[90%] h-[70%] bg-white rounded-2xl overflow-hidden"
          >
            {previewUrl && (
              <Image
                source={{ uri: previewUrl }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            )}
            <TouchableOpacity
              className="absolute top-4 right-4 bg-black/50 rounded-full p-2"
              onPress={() => setPreviewUrl(null)}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        </Pressable>
      </Modal>
    </View>
  );
}
