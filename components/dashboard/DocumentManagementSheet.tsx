import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CarDocument } from "@/types/car";
import Calendar from "@/assets/icons/calendar.svg";

interface DocumentManagementSheetProps {
  visible: boolean;
  onClose: () => void;
  documents: CarDocument[];
}

export default function DocumentManagementSheet({
  visible,
  onClose,
  documents,
}: DocumentManagementSheetProps) {
  const [hasChanges, setHasChanges] = React.useState(false);

  const documentTypes = [
    { name: "Vehicle License", icon: "calendar-outline" },
    { name: "Tax", icon: "calendar-outline" },
    { name: "Insurance Status", icon: "calendar-outline" },
    { name: "MOT", icon: "calendar-outline" },
  ];

  const getDocInfo = (type: string) => {
    const doc = documents?.find((d) => d.type === type);
    if (!doc)
      return {
        date: "Select date of event",
        color: "text-[#B4B1B1]",
        sub: "Date of expiry",
        status: "",
      };

    // Simple expiration logic
    const expiryDate = new Date(doc.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const monthsLeft = Math.floor(diffDays / 30);

    return {
      date: expiryDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      color: "text-[#050505]",
      sub: "Date of expiry",
      status: diffDays > 0 ? `${monthsLeft} months left` : "Expired",
    };
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
              const info = getDocInfo(doc.name);
              const isFirst = index === 0;
              const isLast = index === documentTypes.length - 1;
              return (
                <View
                  key={index}
                  className={`flex-row items-center justify-between p-5 bg-white ${isFirst ? "rounded-t-[12px]" : ""} ${isLast ? "rounded-b-[12px]" : ""} mb-[2px]`}
                >
                  <View className="flex-row items-center gap-4 flex-1">
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
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View className="items-end">
                      <Text
                        className={`${info.color} text-[14px] font-lexendRegular`}
                      >
                        {info.date}
                      </Text>
                      {info.status ? (
                        <Text className="text-[#27AE60] text-[10px] font-lexendRegular">
                          {info.status}
                        </Text>
                      ) : null}
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#B4B1B1"
                    />
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
    </Modal>
  );
}
