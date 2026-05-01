import { useTechnicians, useDeleteTechnician } from "@/hooks/useTechnicians";
import {
  Technician,
  TECHNICIAN_CATEGORIES,
  TechnicianCategory,
} from "@/types/technician";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import BottomSheet from "../shared/BottomSheet";
import Empty from "@/assets/icons/empty.svg";

interface TechnicianSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (technician: Technician) => void;
  onAdd: () => void;
}

export const Header = ({ onClose }: { onClose: () => void }) => (
  <View className="flex-row items-center justify-between flex-1">
    <TouchableOpacity onPress={onClose}>
      <Ionicons name="chevron-back" size={24} color="#1A3B41" />
    </TouchableOpacity>
    <Text className="text-[#00343F] font-lexendMedium text-[0.875rem]">
      Add Technician
    </Text>
    <TouchableOpacity onPress={onClose}>
      <Ionicons name="close" size={24} color="#1A3B41" />
    </TouchableOpacity>
  </View>
);

export default function TechnicianSheet({
  visible,
  onClose,
  onSelect,
  onAdd,
}: TechnicianSheetProps) {
  const { data, isLoading } = useTechnicians();
  const { mutate: deleteTechnician } = useDeleteTechnician();
  const technicians = data?.technicians || [];

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    TechnicianCategory | "All"
  >("All");

  const handleDelete = (tech: Technician) => {
    Alert.alert(
      "Delete Technician",
      `Are you sure you want to delete ${tech.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTechnician(tech.id || (tech as any)._id),
        },
      ],
    );
  };

  const filteredTechnicians = useMemo(() => {
    return technicians.filter((tech) => {
      const matchesSearch =
        tech.name.toLowerCase().includes(search.toLowerCase()) ||
        (tech.phone || "").includes(search);
      const matchesCategory =
        selectedCategory === "All" || tech.specialty === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [technicians, search, selectedCategory]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      title={<Header onClose={onClose} />}
      scrollable={true}
      height="60%"
      backgroundColor="#FFFFFF"
    >
      <View className="flex-1 px-2 pb-5">
        <View className="flex-1">
          {/* Search Bar */}
          <View className="flex-row items-center bg-[#F8F8F8] rounded-xl px-4 h-[50px] border border-[#D4D4D4] mb-4">
            <TextInput
              className="flex-1 font-lexend-regular text-[#00343F]"
              placeholder="Search technicians..."
              placeholderTextColor="#9A9A9A"
              value={search}
              onChangeText={setSearch}
            />
            <Ionicons name="search" size={20} color="#D4D4D4" />
          </View>

          {/* Categories */}
          <View className="mb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {["All", ...TECHNICIAN_CATEGORIES].map((item) => (
                <TouchableOpacity
                  key={item}
                  className={`px-4 py-2 rounded-full border ${selectedCategory === item ? "bg-[#7AE6EB] border-[#7AE6EB]" : "bg-white border-[#C1C3C3]"}`}
                  onPress={() => setSelectedCategory(item as any)}
                >
                  <Text
                    className={`text-[0.6875rem] font-lexendRegular ${selectedCategory === item ? "text-[#425658]" : "text-[#425658]"}`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Technician List */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#29D7DE" className="mt-12" />
          ) : filteredTechnicians.length === 0 ? (
            <View className="flex-1 items-center justify-center mt-10 px-10">
              <Empty />
              <Text className="text-[1.125rem] font-lexendRegular text-[#00343F] mt-4">
                No technicians found
              </Text>
              <Text className="text-[0.875rem] font-lexendRegular text-[#9BBABB] text-center mt-2">
                {search
                  ? "Try adjusting your search"
                  : "Start by adding your favorite technicians"}
              </Text>
            </View>
          ) : (
            <View className="pb-56">
              {filteredTechnicians.map((item, index) => (
                <View key={(item as any).id || (item as any)._id || index}>
                  <TouchableOpacity
                    onPress={() => onSelect(item)}
                    onLongPress={() => handleDelete(item)}
                    delayLongPress={500}
                    className="flex-row items-center py-4 border-b border-[#DFDFDF]"
                  >
                    {item.avatarUrl ? (
                      <Image
                        source={{ uri: item.avatarUrl }}
                        className="w-11 h-11 rounded-full bg-gray-100"
                      />
                    ) : (
                      <View className="w-11 h-11 rounded-full bg-gray-50 items-center justify-center border border-dashed border-gray-200">
                        <Ionicons name="person" size={20} color="#B4B1B1" />
                      </View>
                    )}
                    <View className="flex-1 ml-4">
                      <Text className="text-[0.875rem] font-lexendRegular text-[#101828]">
                        {item.name}
                      </Text>
                    </View>
                    <Text className="text-[0.875rem] font-lexendRegular text-[#00AEB5]">
                      {item.phone}
                    </Text>
                  </TouchableOpacity>
                  {index < filteredTechnicians.length - 1 && (
                    <View className="h-[1px] bg-[#F0F0F0]" />
                  )}
                </View>
              ))}

              {/* Add New Button */}
              <View className="bg-white bottom-0 absolute flex-1 w-full ">
                <TouchableOpacity
                  className="flex-row items-center justify-center gap-2 mt-6 py-6 bg-[#00343F] rounded-full"
                  onPress={onAdd}
                >
                  <Text className="text-[#FFFFFF] font-lexendBold text-[0.875rem]">
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </BottomSheet>
  );
}
