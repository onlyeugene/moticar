import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  DimensionValue,
  Alert,
} from "react-native";
import { DocumentCategory, DocumentFormState, CATEGORY_DEFAULTS } from "../document-forms/types";
import { MOTForm } from "../document-forms/MOTForm";
import { VehicleLicenseForm } from "../document-forms/VehicleLicenseForm";
import { RoadTaxForm } from "../document-forms/RoadTaxForm";
import { ServiceHistoryForm } from "../document-forms/ServiceHistoryForm";
import { DriversLicenseForm } from "../document-forms/DriversLicenseForm";
import { InsuranceForm } from "../document-forms/InsuranceForm";
import { EmissionsInspectionForm } from "../document-forms/EmissionsInspectionForm";
import { NewEntryForm } from "../document-forms/NewEntryForm";
import { useCarById } from "@/hooks/useCars";
import { useCreateDocument, useScanDocument, useUpdateDocument, useDeleteDocument } from "@/hooks/useDocuments";
import BottomSheet from "../shared/BottomSheet";
import ImageCropper from "../shared/ImageCropper";
import * as ImagePicker from "expo-image-picker";
import ScanIcon from "@/assets/icons/scan.svg";
import Pen from "@/assets/icons/pen.svg";
import Trash from "@/assets/icons/trash.svg";
import { ActivityIndicator } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";

interface AddDocumentSheetProps {
  visible: boolean;
  onClose: () => void;
  category: DocumentCategory;
  carId: string;
  initialData?: Partial<DocumentFormState> & { _id?: string };
}

const FORM_MAP: Record<DocumentCategory, React.ComponentType<any>> = {
  "MOT": MOTForm,
  "Vehicle License": VehicleLicenseForm,
  "Road Tax": RoadTaxForm,
  "Service History": ServiceHistoryForm,
  "Driver’s License": DriversLicenseForm,
  "Insurance": InsuranceForm,
  "Emissions / Inspection": EmissionsInspectionForm,
  "New Entry": NewEntryForm,
};

const SHEET_HEIGHTS: Record<DocumentCategory, DimensionValue> = {
  "MOT": "94%",
  "Vehicle License": "65%",
  "Road Tax": "94%",
  "Service History": "94%",
  "Driver’s License": "55%",
  "Insurance": "94%",
  "Emissions / Inspection": "60%",
  "New Entry": "94%",
};

const CATEGORY_FIELDS: Record<DocumentCategory, (keyof DocumentFormState)[]> = {
  "MOT": ["testDate", "expiryDate", "mileage", "result", "testCentreName", "certificateNumber", "amount", "documentUrl", "notes"],
  "Vehicle License": ["vin", "issueDate", "expiryDate", "issuingAuthority", "documentUrl", "notes"],
  "Road Tax": ["frequency", "startDate", "expiryDate", "amount", "issuingAuthority", "paymentStatus", "paymentMethod", "receiptUrl", "notes"],
  "Insurance": ["provider", "policyNumber", "coverageType", "startDate", "expiryDate", "amount", "paymentPlan", "receiptUrl", "notes"],
  "Service History": ["serviceDate", "mileage", "serviceType", "garageName", "partsReplaced", "amount", "invoiceUrl", "notes"],
  "Driver’s License": ["licenseNumber", "expiryDate", "documentUrl", "notes"],
  "Emissions / Inspection": ["testDate", "expiryDate", "result", "documentUrl", "notes"],
  "New Entry": ["documentName", "subCategory", "issueDate", "expiryDate", "doesNotExpire", "amount", "issuingAuthority", "paymentFrequency", "receiptUrl", "notes"],
};

export default function AddDocumentSheet({
  visible,
  onClose,
  category,
  carId,
  initialData,
}: AddDocumentSheetProps) {
  const user = useAuthStore(state => state.user);
  const { data: carData } = useCarById(carId);
  const car = carData?.car;

  const [formState, setFormState] = useState<DocumentFormState>({
    ...CATEGORY_DEFAULTS,
  });
  
  const [cropperVisible, setCropperVisible] = useState(false);
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<keyof DocumentFormState | 'scan' | null>(null);
  const [isEditing, setIsEditing] = useState(!initialData?._id);

  const { mutate: scanDoc, isPending: isScanning } = useScanDocument();
  const { mutate: createDoc, isPending: isSaving } = useCreateDocument();
  const { mutate: updateDoc, isPending: isUpdating } = useUpdateDocument();
  const { mutate: deleteDoc, isPending: isDeleting } = useDeleteDocument();

  const sheetHeight = SHEET_HEIGHTS[category] || "94%";

  useEffect(() => {
    if (visible) {
      if (initialData) {
        // Map fields explicitly to avoid state pollution and key mismatches
        const newState = { ...CATEGORY_DEFAULTS };
        
        // Map direct fields
        Object.keys(CATEGORY_DEFAULTS).forEach(key => {
          if ((initialData as any)[key] !== undefined) {
            (newState as any)[key] = (initialData as any)[key];
          }
        });

        // Ensure amount is a number
        if ((initialData as any).amount !== undefined) {
            newState.amount = Number((initialData as any).amount);
        }

        // Map Dates correctly
        newState.expiryDate = initialData.expiryDate ? new Date(initialData.expiryDate) : null;
        newState.issueDate = (initialData as any).issueDate ? new Date((initialData as any).issueDate) : null;
        newState.testDate = (initialData as any).testDate ? new Date((initialData as any).testDate) : null;
        newState.serviceDate = (initialData as any).serviceDate ? new Date((initialData as any).serviceDate) : null;
        newState.startDate = (initialData as any).startDate ? new Date((initialData as any).startDate) : null;

        // Priority URL mapping
        newState.documentUrl = 
          (initialData as any).fileUrl || 
          (initialData as any).documentUrl || 
          (initialData as any).url || 
          (initialData as any).photoUrl || 
          null;
        
        // Handle receipt/invoice URLs too
        newState.receiptUrl = (initialData as any).receiptUrl || null;
        newState.invoiceUrl = (initialData as any).invoiceUrl || null;

        setFormState(newState);
        setIsEditing(false);
      } else {
        setFormState({ ...CATEGORY_DEFAULTS });
        setIsEditing(true);
      }
    }
  }, [visible, category, initialData]);

  // Auto-fill expiry date to +1 year when a start/issue date is selected
  useEffect(() => {
    const referenceDate = formState.issueDate || formState.testDate || formState.startDate;
    // Only auto-fill if we have a reference date and expiry date hasn't been set yet (or is manually cleared)
    // and we are currently in a state where auto-filling makes sense (not just loading initial data)
    if (referenceDate && !formState.expiryDate && !formState.doesNotExpire) {
      const nextYear = new Date(referenceDate);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setFormState(prev => ({ ...prev, expiryDate: nextYear }));
    }
  }, [formState.issueDate, formState.testDate, formState.startDate]);

  const handlePickImage = async (field: keyof Pick<DocumentFormState, 'documentUrl' | 'receiptUrl' | 'invoiceUrl'>) => {
    Alert.alert("Select Photo", "Choose a source", [
      { text: "Take Photo", onPress: () => initiatePick(field, "camera") },
      { text: "Choose from Gallery", onPress: () => initiatePick(field, "library") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const initiatePick = async (field: keyof DocumentFormState | 'scan', source: "camera" | "library") => {
    try {
      let result;
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ["images"],
        quality: 1,
      };

      if (source === "camera") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Permission Denied", "Camera access is required");
          return;
        }
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPendingImageUri(result.assets[0].uri);
        setActiveField(field);
        setCropperVisible(true);
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const handleCropped = (uri: string) => {
    setCropperVisible(false);
    if (!uri || !activeField) return;

    if (activeField === 'scan') {
      processScan(uri);
    } else {
      setFormState((prev) => ({
        ...prev,
        [activeField]: uri,
      }));
    }
    setActiveField(null);
    setPendingImageUri(null);
  };

  const handleScan = async () => {
    Alert.alert("Scan Document", "Choose a source", [
      { text: "Take Photo", onPress: () => initiatePick('scan', "camera") },
      { text: "Choose from Gallery", onPress: () => initiatePick('scan', "library") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const processScan = (uri: string) => {
    const file = {
      uri,
      name: "scan.jpg",
      type: "image/jpeg",
    };

    scanDoc({ file, type: category }, {
      onSuccess: (response) => {
        if (response.data || response.ocrData) {
          const ocr = response.ocrData || response.data;
          // Map OCR fields to form state
          setFormState(prev => ({
            ...prev,
            documentUrl: response.document?.fileUrl || response.photoUrl || prev.documentUrl,
            vin: ocr.vin || prev.vin,
            expiryDate: ocr.expiryDate ? new Date(ocr.expiryDate) : prev.expiryDate,
            issueDate: ocr.dateIssued ? new Date(ocr.dateIssued) : prev.issueDate,
            testDate: ocr.testDate ? new Date(ocr.testDate) : prev.testDate,
            serviceDate: ocr.serviceDate ? new Date(ocr.serviceDate) : prev.serviceDate,
            startDate: ocr.startDate ? new Date(ocr.startDate) : prev.startDate,
            mileage: ocr.mileage?.toString() || prev.mileage,
            amount: ocr.amount || ocr.cost || prev.amount,
            result: ocr.result || prev.result,
            testCentreName: ocr.testCentreName || prev.testCentreName,
            certificateNumber: ocr.certificateNumber || prev.certificateNumber,
            issuingAuthority: ocr.issuingAuthority || prev.issuingAuthority,
            licenseNumber: ocr.licenseNumber || ocr.licenseNumber || prev.licenseNumber,
            policyNumber: ocr.policyNumber || prev.policyNumber,
            provider: ocr.provider || prev.provider,
            garageName: ocr.garageName || prev.garageName,
          }));
          Alert.alert("Scan Successful", "We've pre-filled the form with data from your document. Please review and save.");
        }
      },
      onError: (err: any) => {
        Alert.alert("Scan Failed", err.response?.data?.message || err.message || "Could not extract data from this document.");
      }
    });
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSave = useCallback(async () => {
    // Basic validation
    if (!category || isProcessing) return;

    setIsProcessing(true);

    // 1. Get the allowed fields for this category
    const allowedFields = CATEGORY_FIELDS[category];

    // 2. Filter the formState to ONLY include allowed fields
    const filteredData = Object.keys(formState).reduce((acc: any, key) => {
      if (allowedFields.includes(key as keyof DocumentFormState)) {
        const value = (formState as any)[key];
        // 3. Still filter out empty values to keep the payload clean, but allow nulls
        if (value !== "" && value !== undefined) {
          if (key === 'partsReplaced' && Array.isArray(value)) {
            acc[key] = value.filter(p => p.item && p.item.trim() !== "");
          } else {
            acc[key] = value;
          }
        }
      }
      return acc;
    }, {});

    const isExisting = !!initialData?._id;

    const performSave = async (finalData: any) => {
      const payload = {
        ...finalData,
        type: category,
        expiryDate: finalData.doesNotExpire ? null : finalData.expiryDate,
        fileUrl: finalData.documentUrl,
        currency: user?.preferredCurrency || 'NGN',
        documentName: finalData.documentName,
        subCategory: finalData.subCategory,
        paymentFrequency: finalData.paymentFrequency
      };

      if (isExisting) {
        updateDoc({ carId, docId: initialData!._id!, data: payload }, {
          onSuccess: () => {
            Alert.alert("Success", "Document updated successfully");
            onClose();
          },
          onError: (err: any) => {
            Alert.alert("Error", err.response?.data?.message || err.message || "Failed to update document");
          },
          onSettled: () => setIsProcessing(false)
        });
      } else {
        createDoc({ carId, data: payload }, {
          onSuccess: () => {
            Alert.alert("Success", "Document saved successfully");
            onClose();
          },
          onError: (err: any) => {
            Alert.alert("Error", err.response?.data?.message || err.message || "Failed to save document");
          },
          onSettled: () => setIsProcessing(false)
        });
      }
    };

    // Check if we need to upload any local URIs first
    const localUri = formState.documentUrl?.startsWith('file://') ? formState.documentUrl : null;
    
    if (localUri) {
      // Need to upload to Cloudinary first
      const file = { uri: localUri, name: "upload.jpg", type: "image/jpeg" };
      scanDoc({ file, type: category }, {
        onSuccess: (response) => {
          const remoteUrl = response.document?.fileUrl || response.photoUrl;
          if (remoteUrl) {
            performSave({ ...filteredData, documentUrl: remoteUrl });
          } else {
            Alert.alert("Upload Error", "Could not get a remote URL for your image. Please try again.");
            setIsProcessing(false);
          }
        },
        onError: (err: any) => {
          Alert.alert("Upload Error", "Failed to upload image to Cloudinary. " + (err.message || ""));
          setIsProcessing(false);
        }
      });
    } else {
      performSave(filteredData);
    }
  }, [category, formState, carId, createDoc, updateDoc, scanDoc, onClose, initialData, isProcessing]);

  const handleDelete = useCallback(() => {
    if (!initialData?._id) return;

    Alert.alert(
      "Delete Document",
      `Are you sure you want to delete this ${category} document?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteDoc({ carId, docId: initialData._id! }, {
              onSuccess: () => {
                Alert.alert("Success", "Document deleted successfully");
                onClose();
              },
              onError: (err: any) => {
                Alert.alert("Error", err.response?.data?.message || err.message || "Failed to delete document");
              }
            });
          }
        }
      ]
    );
  }, [initialData?._id, category, carId, deleteDoc, onClose]);


  const ActiveForm = FORM_MAP[category];

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      height={sheetHeight}
      backgroundColor="#F5F5F5"
      title={
        <View className="flex-1">
          <Text className="text-[#00AEB5] font-lexendRegular text-[11px] mb-0.5">
            Car Documents
          </Text>
          <Text className="text-[#001A1F] font-lexendBold text-[22px]">
            {category}
          </Text>
        </View>
      }
      headerRight={
        <View className="flex-row items-center gap-3">
          {initialData?._id ? (
            <>
              {isEditing ? (
                <>
                  <TouchableOpacity
                    onPress={() => setIsEditing(false)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-white rounded-full shadow-sm"
                  >
                    <Text className="text-[#8B8B8B] font-lexendMedium text-[14px]">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSave}
                    disabled={isProcessing || isUpdating}
                    className="px-6 py-2.5 bg-[#29D7DE] rounded-full shadow-sm"
                  >
                    {isUpdating || isProcessing ? (
                      <ActivityIndicator size="small" color="#00343F" />
                    ) : (
                      <Text className="text-[#00343F] font-lexendBold text-[14px]">Save</Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={handleDelete}
                    disabled={isDeleting || isProcessing}
                    className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-sm"
                  >
                    {isDeleting ? (
                      <ActivityIndicator size="small" color="#FF3B30" />
                    ) : (
                      <Trash width={18} height={18} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsEditing(true)}
                    disabled={isProcessing}
                    className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-sm"
                  >
                    <Pen width={18} height={18} />
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleScan}
                disabled={isScanning || isProcessing}
                className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-sm"
              >
                {isScanning && !isProcessing ? (
                  <ActivityIndicator size="small" color="#00AEB5" />
                ) : (
                  <ScanIcon width={20} height={20} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={isProcessing}
                className={`px-6 py-2.5 rounded-full ${isProcessing ? "bg-[#29D7DE]" : "bg-[#29D7DE]/50"}`}
              >
                <Text className="text-[#00343F] font-lexendBold text-[14px]">
                  {isProcessing ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      }
    >
      <View className="pb-10 pt-2">
        {ActiveForm && (
          <ActiveForm
            state={formState}
            setState={setFormState}
            carId={carId}
            vin={car?.vin}
            plate={car?.plate}
            onPickImage={handlePickImage}
            isEditing={isEditing}
          />
        )}
      </View>

      <ImageCropper
        visible={cropperVisible}
        imageUri={pendingImageUri}
        onClose={() => {
          setCropperVisible(false);
          setPendingImageUri(null);
          setActiveField(null);
        }}
        onCrop={handleCropped}
      />
    </BottomSheet>
  );
}

