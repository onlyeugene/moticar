import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CarDocument } from "@/types/car";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "../shared/BottomSheet";
import { DocumentCategory } from "../document-forms/types";
import Body from "@/assets/icons/body.svg";
import { useDeleteDocument } from "@/hooks/useDocuments";

interface DocumentManagementSheetProps {
  visible: boolean;
  onClose: () => void;
  documents: CarDocument[];
  onUpload: (type: string) => void;
  uploadingType: string | null;
  carId: string;
  onAddRequest: (category: DocumentCategory, doc?: CarDocument) => void;
  onPreviewRequest: (url: string) => void;
}

export default function DocumentManagementSheet({
  visible,
  onClose,
  documents,
  onUpload,
  uploadingType,
  carId,
  onAddRequest,
  onPreviewRequest,
}: DocumentManagementSheetProps) {
  const { mutate: deleteDoc } = useDeleteDocument();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const documentTypes = [
    { name: "MOT", type: "MOT" },
    { name: "Vehicle Licence", type: "Vehicle License" },
    { name: "Road Tax", type: "Road Tax" },
    { name: "Insurance", type: "Insurance" },
    { name: "Service History", type: "Service History" },
    { name: "Driver’s License", type: "Driver’s License" },
    { name: "Emissions / Inspection", type: "Emissions / Inspection" },
  ];

  const getDocInfo = (type: string) => {
    const doc = documents?.find((d) => d.type === type);
    if (!doc)
      return {
        id: null,
        date: null,
        status: 'No data recorded',
        fileUrl: null,
      };

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
      month: "long",
      year: "numeric",
    });

    const fileUrl =
      doc.fileUrl ||
      (doc as any).documentUrl ||
      (doc as any).url ||
      (doc as any).photoUrl ||
      (doc as any).scannedPhotoUrl;

    const status =
      diffDays < 0 ? "Expired" : diffDays <= 30 ? "Pending" : "Active";

    // Extra meta info to show in the list
    const meta =
      doc.vin ||
      doc.licenseNumber ||
      doc.certificateNumber ||
      doc.policyNumber ||
      "";

    return {
      id: doc._id || (doc as any).id,
      date: `Added ${formattedDate}`,
      status,
      fileUrl,
      meta: meta.length > 20 ? meta.substring(0, 17) + "..." : meta,
    };
  };

  const getDocInfoForEntry = (entry: { name: string, type: string, id: string }) => {
    const doc = documents.find(d => d._id === entry.id);
    if (!doc) return getDocInfo('none');

    const expiryDate = doc.expiryDate ? new Date(doc.expiryDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let status = "Active";
    if (expiryDate) {
        const expire = new Date(expiryDate);
        expire.setHours(0, 0, 0, 0);
        const diffTime = expire.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        status = diffDays < 0 ? "Expired" : diffDays <= 30 ? "Pending" : "Active";
    } else if ((doc as any).doesNotExpire) {
        status = "Active";
    }

    const inputDate = doc.createdAt ? new Date(doc.createdAt) : (doc.issueDate ? new Date(doc.issueDate) : null);
    const formattedDate = inputDate ? inputDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }) : "";

    return {
      id: doc._id,
      date: formattedDate ? `Added ${formattedDate}` : "",
      status,
      fileUrl: doc.fileUrl || (doc as any).receiptUrl,
      meta: (doc as any).subCategory || ""
    };
  };

  const handleDelete = (docId: string, typeName: string) => {
    Alert.alert(
      "Delete Document",
      `Are you sure you want to delete your ${typeName} document?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setDeletingId(docId);
            deleteDoc(
              { carId, docId },
              {
                onSuccess: () => {
                  Alert.alert("Success", "Document deleted successfully");
                },
                onSettled: () => {
                  setDeletingId(null);
                }
              },
            );
          },
        },
      ],
    );
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Car Documents"
      height="90%"
      backgroundColor="#F5F5F5"
      headerRight={
        <TouchableOpacity
          onPress={() => onAddRequest("New Entry")}
          className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-sm"
        >
          <Ionicons name="add" size={24} color="#00AEB5" />
        </TouchableOpacity>
      }
    >
      <View className="flex-1 px-2 pt-2 pb-10">
        {[...documentTypes, ...documents.filter(d => d.type === 'New Entry').map(d => ({ name: (d as any).documentName || 'Other Document', type: 'New Entry', id: d._id }))].map((doc, index) => {
          const info = doc.type === 'New Entry' ? getDocInfoForEntry(doc as any) : getDocInfo(doc.type);

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => {
                const docObj = doc.type === 'New Entry' ? documents.find(d => d._id === (doc as any).id) : documents.find((d) => d.type === doc.type);
                const hasEntries =
                  docObj && (docObj.vin || docObj.expiryDate || docObj.amount || docObj.issueDate || (docObj as any).documentName);

                if (hasEntries) {
                  onAddRequest(doc.type as DocumentCategory, docObj);
                } else if (info.fileUrl) {
                  onPreviewRequest(info.fileUrl);
                } else {
                  onAddRequest(doc.type as DocumentCategory);
                }
              }}
              onLongPress={() => {
                if (info.id) handleDelete(info.id, doc.name);
              }}
              className="flex-row items-start justify-between p-4 bg-white rounded-[16px] mb-3"
            >
              <View className="flex-row items-center gap-4 flex-1">
                <View className="flex-1 gap-2">
                  <Text className="text-[#050505] text-[1rem] font-lexendSemiBold">
                    {doc.name}
                  </Text>

                  <View>
                    {info.status ? (
                      <View
                        className={`flex-row items-center gap-2 ${
                          info.status === "Active"
                            ? ""
                            : info.status === "Pending"
                              ? ""
                              : ""
                        }`}
                      >
                        {info.status === "Active" ? (
                          <Ionicons name="checkmark" color={'#1ED760'} />
                        ) : info.status === "Expired" ? (
                          <Ionicons name="close" color='#B30303' />
                        ) : (
                          ''
                        )}
                        <Text
                          className={`text-[0.75rem] font-lexendMedium ${
                            info.status === "Active"
                              ? "text-[#1ED760]"
                              : info.status === "Expired"
                                ? "text-[#B30303]"
                                : "text-[#B4B1B1]"
                          }`}
                        >
                          {info.status}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <View className="">
                    <Text className="text-[#00AEB5] text-[0.75rem] font-lexendRegular">
                      {info.date}
                    </Text>
                    {/* {info.meta ? (
                      <>
                        <View className="w-1 h-1 rounded-full bg-[#D9D9D9]" />
                        <Text className="text-[#00AEB5] text-[0.75rem] font-lexendMedium">
                          {info.meta}
                        </Text>
                      </>
                    ) : null} */}
                  </View>
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={() => {
                    if (info.id) {
                      handleDelete(info.id, doc.name);
                    } else {
                      onAddRequest(doc.type as DocumentCategory);
                    }
                  }}
                  disabled={!!deletingId}
                  className="p-1"
                >
                  {deletingId && deletingId === info.id ? (
                    <ActivityIndicator size="small" color="#B4B1B1" />
                  ) : (
                    <Ionicons
                      name={info.id ? "trash-outline" : "chevron-forward"}
                      size={20}
                      color="#B4B1B1"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomSheet>
  );
}
