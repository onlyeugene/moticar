import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CarDocument } from "@/types/car";
import Calendar from "@/assets/icons/calendar.svg";

interface DocumentManagementSheetProps {
  visible: boolean;
  onClose: () => void;
  documents: CarDocument[];
  onUpload: (type: string) => void;
  uploadingType: string | null;
}

export default function DocumentManagementSheet({
  visible,
  onClose,
  documents,
  onUpload,
  uploadingType,
}: DocumentManagementSheetProps) {
  const [hasChanges, setHasChanges] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const documentTypes = [
    { name: "Vehicle License", type: "Vehicle License" },
    { name: "Tax", type: "Tax" },
    { name: "Insurance Status", type: "Insurance Status" },
    { name: "MOT", type: "MOT" },
  ];

  const getDocInfo = (type: string) => {
    const doc = documents?.find((d) => d.type === type);
    if (!doc)
      return {
        date: "Select date of event",
        color: "text-[#B4B1B1]",
        sub: "Date of expiry",
        status: "",
        statusColor: "text-[#B4B1B1]",
        icon: null,
        fileUrl: null,
      };

    const expiryDate = new Date(doc.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expire = new Date(expiryDate);
    expire.setHours(0, 0, 0, 0);

    const diffTime = expire.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = expiryDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    if (diffDays < 0) {
      return {
        date: formattedDate,
        color: "text-[#050505]",
        sub: "Date of expiry",
        status: "Inactive",
        statusColor: "text-[#FF4D4D]",
        icon: <Ionicons name="close-circle" size={12} color="#FF4D4D" />,
        fileUrl: doc.fileUrl,
      };
    } else if (diffDays <= 30) {
      return {
        date: formattedDate,
        color: "text-[#050505]",
        sub: "Date of expiry",
        status: `Expires in ${diffDays} days`,
        statusColor: "text-[#F2994A]",
        icon: <Ionicons name="alert-circle" size={12} color="#F2994A" />,
        fileUrl: doc.fileUrl,
      };
    } else {
      return {
        date: formattedDate,
        color: "text-[#050505]",
        sub: "Date of expiry",
        status: "Active",
        statusColor: "text-[#27AE60]",
        icon: <Ionicons name="checkmark-circle" size={12} color="#27AE60" />,
        fileUrl: doc.fileUrl,
      };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <View className="bg-[#F0F0F0] rounded-t-[20px] p-6 pb-12">
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#7A7A7C" />
              </TouchableOpacity>
              <Text className="text-[#00343F] text-[16px] font-lexendBold">
                Vehicle License
              </Text>
            </View>
            <TouchableOpacity
              disabled={!hasChanges}
              className={`${hasChanges ? "bg-[#29D7DE]" : "bg-[#29D7DE]/60"} px-6 py-3 rounded-full`}
            >
              <Text
                className={`${hasChanges ? "text-[#00343F]" : "text-[#00343F]/60"} font-lexendBold text-[14px]`}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {documentTypes.map((doc, index) => {
              const info = getDocInfo(doc.type);
              const isFirst = index === 0;
              const isLast = index === documentTypes.length - 1;
              const isUploading = uploadingType === doc.type;

              return (
                <View
                  key={index}
                  className={`flex-row items-center justify-between p-5 bg-white ${isFirst ? "rounded-t-[12px]" : ""} ${isLast ? "rounded-b-[12px]" : ""} mb-[2px]`}
                >
                  <TouchableOpacity
                    className="flex-row items-center gap-4 flex-1"
                    onPress={() => {
                      if (info.fileUrl) {
                        setPreviewUrl(info.fileUrl);
                      }
                    }}
                  >
                    <View className="">
                      <Calendar />
                    </View>
                    <View>
                      <Text className="text-[#050505] text-[16px] font-lexendRegular">
                        {doc.name}
                      </Text>
                      <Text className="text-[#8B8B8B] text-[12px] font-lexendRegular">
                        {info.sub}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      className="items-end"
                      onPress={() => {
                        if (info.fileUrl) {
                          setPreviewUrl(info.fileUrl);
                        }
                      }}
                    >
                      <Text
                        className={`${info.color} text-[14px] font-lexendRegular`}
                      >
                        {info.date}
                      </Text>
                      {info.status ? (
                        <View className="flex-row items-center gap-1">
                          {info.icon}
                          <Text
                            className={`${info.statusColor} text-[10px] font-lexendRegular`}
                          >
                            {info.status}
                          </Text>
                        </View>
                      ) : null}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => onUpload(doc.type)}
                      disabled={!!uploadingType}
                    >
                      {isUploading ? (
                        <ActivityIndicator size="small" color="#00AEB5" />
                      ) : (
                        <Ionicons
                      name="chevron-forward"
                          size={20}
                      color="#B4B1B1"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            <TouchableOpacity className="mt-8 border border-[#013037] py-4 rounded-full items-center w-[60%] mx-auto">
              <Text className="text-[#013037] font-lexendSemiBold text-[14px]">
                Enter another car document
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Pressable>

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
                className="w-full h-full"
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
    </Modal>
  );
}
