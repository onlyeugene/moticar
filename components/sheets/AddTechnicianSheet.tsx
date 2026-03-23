import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator
} from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { TECHNICIAN_CATEGORIES, TechnicianCategory } from "@/types/technician";
import { useAddTechnician } from "@/hooks/useTechnicians";

interface AddTechnicianSheetProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddTechnicianSheet({ visible, onClose, onSuccess }: AddTechnicianSheetProps) {
  const addMutation = useAddTechnician();

  // Form state for new technician
  const [form, setForm] = useState({
    name: "",
    specialty: "Mechanic" as TechnicianCategory,
    phone: "",
    location: "",
  });

  const handleSaveTechnician = async () => {
    if (!form.name || !form.phone) return;
    try {
      await addMutation.mutateAsync({
        name: form.name,
        specialty: form.specialty,
        phone: form.phone,
        location: form.location,
      });
      setForm({ name: "", specialty: "Mechanic", phone: "", location: "" });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to add technician:", error);
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Add New Technician"
      scrollable={true}
      height="60%"
      backgroundColor="#FFFFFF"
    >
      <View className="flex-1 px-4 pb-10">
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
          className={`bg-[#00343F] h-[55px] rounded-full flex-row items-center justify-center mb-6 ${(!form.name || !form.phone) ? "opacity-50" : ""}`}
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
          onPress={onClose}
        >
          <Text className="text-[#7A7A7C] text-[14px] font-lexend-medium">Cancel</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
