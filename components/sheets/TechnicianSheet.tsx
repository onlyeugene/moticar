import React, { useState, useMemo } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image, 
  ActivityIndicator,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "../shared/BottomSheet";
import { Technician, TECHNICIAN_CATEGORIES, TechnicianCategory } from "@/types/technician";
import { useTechnicians, useAddTechnician } from "@/hooks/useTechnicians";

interface TechnicianSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (technician: Technician) => void;
}

export default function TechnicianSheet({ visible, onClose, onSelect }: TechnicianSheetProps) {
  const { data, isLoading } = useTechnicians();
  const technicians = data?.technicians || [];
  const addMutation = useAddTechnician();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TechnicianCategory | "All">("All");
  const [isAdding, setIsAdding] = useState(false);

  // Form state for new technician
  const [form, setForm] = useState({
    name: "",
    specialty: "Mechanic" as TechnicianCategory,
    phone: "",
    location: "",
  });

  const filteredTechnicians = useMemo(() => {
    return technicians.filter(tech => {
      const matchesSearch = tech.name.toLowerCase().includes(search.toLowerCase()) || 
                            tech.phone.includes(search);
      const matchesCategory = selectedCategory === "All" || tech.specialty === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [technicians, search, selectedCategory]);

  const handleSaveTechnician = async () => {
    if (!form.name || !form.phone) return;
    try {
      await addMutation.mutateAsync({
        name: form.name,
        specialty: form.specialty,
        phone: form.phone,
        location: form.location,
      });
      setIsAdding(false);
      setForm({ name: "", specialty: "Mechanic", phone: "", location: "" });
    } catch (error) {
      console.error("Failed to add technician:", error);
    }
  };

  const renderAddForm = () => (
    <View className="flex-1">
      <Text className="text-[14px] font-lexend-medium text-[#00343F] mb-2 mt-2">Full Name</Text>
      <TextInput 
        className="bg-[#F9F9F9] rounded-xl h-[50px] px-4 border border-gray-100 font-lexend-regular text-[#00343F] mb-3"
        placeholder="e.g. Bolaji Auto" 
        value={form.name}
        onChangeText={(name) => setForm({...form, name})}
      />

      <Text className="text-[14px] font-lexend-medium text-[#00343F] mb-2">Specialty</Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {TECHNICIAN_CATEGORIES.map((cat) => (
          <TouchableOpacity 
            key={cat}
            className={`px-4 py-2 rounded-full border ${form.specialty === cat ? "bg-[#29D7DE] border-[#29D7DE]" : "bg-white border-gray-100"}`}
            onPress={() => setForm({...form, specialty: cat})}
          >
            <Text className={`text-[12px] font-lexend-regular ${form.specialty === cat ? "text-white font-lexend-medium" : "text-[#586A6B]"}`}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-[14px] font-lexend-medium text-[#00343F] mb-2">Phone Number</Text>
      <TextInput 
        className="bg-[#F9F9F9] rounded-xl h-[50px] px-4 border border-gray-100 font-lexend-regular text-[#00343F] mb-3"
        placeholder="080..." 
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(phone) => setForm({...form, phone})}
      />

      <Text className="text-[14px] font-lexend-medium text-[#00343F] mb-2">Location (Optional)</Text>
      <TextInput 
        className="bg-[#F9F9F9] rounded-xl h-[50px] px-4 border border-gray-100 font-lexend-regular text-[#00343F] mb-4"
        placeholder="e.g. Ikeja, Lagos" 
        value={form.location}
        onChangeText={(location) => setForm({...form, location})}
      />

      <TouchableOpacity 
        className={`bg-[#00343F] h-[55px] rounded-full flex-row items-center justify-center mb-3 ${(!form.name || !form.phone) ? "opacity-50" : ""}`}
        onPress={handleSaveTechnician}
        disabled={addMutation.isPending || !form.name || !form.phone}
      >
        {addMutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-[16px] font-lexend-bold">Save Technician</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="h-12 items-center justify-center" 
        onPress={() => setIsAdding(false)}
      >
        <Text className="text-[#7A7A7C] text-[14px] font-lexend-medium">Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={isAdding ? "Add New Technician" : "Select Technician"}
      scrollable={true}
      height="60%"
    >
      <View className="flex-1 px-5 pb-5">
        {isAdding
          ? renderAddForm()
          : (
            <View className="flex-1">
              {/* Search Bar */}
              <View className="flex-row items-center bg-[#F9F9F9] rounded-xl px-4 h-[50px] border border-gray-100 mb-4">
                <TextInput 
                  className="flex-1 font-lexend-regular text-[#00343F]"
                  placeholder="Search technicians..."
                  placeholderTextColor="#CCC"
                  value={search}
                  onChangeText={setSearch}
                />
                <Ionicons name="search" size={20} color="#CCC" />
              </View>

              {/* Categories */}
              <View className="mb-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {["All", ...TECHNICIAN_CATEGORIES].map((item) => (
                    <TouchableOpacity 
                      key={item}
                      className={`px-4 py-2 rounded-full border ${selectedCategory === item ? "bg-[#29D7DE] border-[#29D7DE]" : "bg-white border-gray-100"}`}
                      onPress={() => setSelectedCategory(item as any)}
                    >
                      <Text className={`text-[12px] font-lexend-regular ${selectedCategory === item ? "text-white font-lexend-medium" : "text-[#586A6B]"}`}>
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
                  <Ionicons name="people-outline" size={60} color="#E0E0E0" />
                  <Text className="text-[18px] font-lexend-bold text-[#00343F] mt-4">No technicians found</Text>
                  <Text className="text-[14px] font-lexend-regular text-[#9BBABB] text-center mt-2">
                    {search ? "Try adjusting your search" : "Start by adding your favorite technicians"}
                  </Text>
                </View>
              ) : (
                <View className="pb-5">
                  {filteredTechnicians.map((item, index) => (
                    <View key={(item as any).id || (item as any)._id || index}>
                      <TouchableOpacity 
                        className="flex-row items-center py-4"
                        onPress={() => onSelect(item)}
                      >
                        {item.avatarUrl ? (
                          <Image source={{ uri: item.avatarUrl }} className="w-11 h-11 rounded-full bg-gray-100" />
                        ) : (
                          <View className="w-11 h-11 rounded-full bg-gray-50 items-center justify-center border border-dashed border-gray-200">
                            <Ionicons name="person" size={20} color="#B4B1B1" />
                          </View>
                        )}
                        <View className="flex-1 ml-4">
                          <Text className="text-[16px] font-lexend-medium text-[#00343F]">{item.name}</Text>
                          <Text className="text-[12px] font-lexend-regular text-[#9BBABB]">{item.specialty}</Text>
                        </View>
                        <Text className="text-[14px] font-lexend-medium text-[#29D7DE]">{item.phone}</Text>
                      </TouchableOpacity>
                      {index < filteredTechnicians.length - 1 && (
                        <View className="h-[1px] bg-[#F0F0F0]" />
                      )}
                    </View>
                  ))}
                  
                  {/* Add New Button */}
                  <TouchableOpacity 
                    className="flex-row items-center justify-center gap-2 mt-6 py-4 bg-[#F9F9F9] rounded-xl border border-dashed border-gray-200"
                    onPress={() => setIsAdding(true)}
                  >
                    <Ionicons name="add-circle" size={24} color="#29D7DE" />
                    <Text className="text-[#00343F] font-lexend-medium text-[14px]">Add New Technician</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
      </View>
    </BottomSheet>
  );
}
