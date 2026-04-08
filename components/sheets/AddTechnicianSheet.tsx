import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator
} from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { TECHNICIAN_CATEGORIES, TechnicianCategory, Technician } from "@/types/technician";
import { useAddTechnician, useUpdateTechnician } from "@/hooks/useTechnicians";

interface AddTechnicianSheetProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  technician?: Technician | null;
}

export default function AddTechnicianSheet({ 
  visible, 
  onClose, 
  onSuccess,
  technician 
}: AddTechnicianSheetProps) {
  const addMutation = useAddTechnician();
  const updateMutation = useUpdateTechnician();

  const isEditing = !!technician;

  // Form state
  const [form, setForm] = useState({
    name: "",
    specialty: "Mechanic" as TechnicianCategory,
    phone: "",
    location: "",
    notes: "",
  });

  // Sync form when technician changes (edit mode)
  useEffect(() => {
    if (technician && visible) {
      setForm({
        name: technician.name || "",
        specialty: (technician.specialty as TechnicianCategory) || "Mechanic",
        phone: technician.phone || "",
        location: technician.location || "",
        notes: technician.notes || "",
      });
    } else if (!visible) {
      // Reset form when closing
      setForm({
        name: "",
        specialty: "Mechanic",
        phone: "",
        location: "",
        notes: "",
      });
    }
  }, [technician, visible]);

  const handleSaveTechnician = async () => {
    if (!form.name || !form.phone) return;
    
    try {
      if (isEditing && technician) {
        await updateMutation.mutateAsync({
          id: technician._id || technician.id || "",
          data: form,
        });
      } else {
        await addMutation.mutateAsync(form);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(isEditing ? "Failed to update technician:" : "Failed to add technician:", error);
    }
  };

  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={isEditing ? "Edit Technician" : "Add New Technician"}
      scrollable={true}
      height="75%"
      backgroundColor="#FFFFFF"
    >
      <View className="flex-1 px-4 pb-10">
        <Text className="text-[14px] font-lexendRegular text-[#00343F] mb-2 mt-2">Full Name</Text>
        <TextInput 
          className="bg-[#F9F9F9] rounded-xl h-[50px] px-4 border border-gray-100 font-lexendRegular text-[#00343F] mb-3"
          placeholder="e.g. Bolaji Auto" 
          value={form.name}
          onChangeText={(name) => setForm({...form, name})}
        />

        <Text className="text-[14px] font-lexendRegular text-[#00343F] mb-2">Specialty</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {TECHNICIAN_CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat}
              className={`px-4 py-2 rounded-full border ${form.specialty === cat ? "bg-[#29D7DE] border-[#29D7DE]" : "bg-white border-gray-100"}`}
              onPress={() => setForm({...form, specialty: cat})}
            >
              <Text className={`text-[12px] font-lexendRegular ${form.specialty === cat ? "text-white" : "text-[#586A6B]"}`}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-[14px] font-lexendRegular text-[#00343F] mb-2">Phone Number</Text>
        <TextInput 
          className="bg-[#F9F9F9] rounded-xl h-[50px] px-4 border border-gray-100 font-lexendRegular text-[#00343F] mb-3"
          placeholder="080..." 
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(phone) => setForm({...form, phone})}
        />

        <Text className="text-[14px] font-lexendRegular text-[#00343F] mb-2">Location (Optional)</Text>
        <TextInput 
          className="bg-[#F9F9F9] rounded-xl h-[50px] px-4 border border-gray-100 font-lexendRegular text-[#00343F] mb-3"
          placeholder="e.g. Ikeja, Lagos" 
          value={form.location}
          onChangeText={(location) => setForm({...form, location})}
        />

        <Text className="text-[14px] font-lexendRegular text-[#00343F] mb-2">Notes (Optional)</Text>
        <TextInput 
          className="bg-[#F9F9F9] rounded-xl h-[80px] px-4 pt-4 border border-gray-100 font-lexendRegular text-[#00343F] mb-4 text-start"
          placeholder="Add any extra details here..." 
          multiline
          value={form.notes}
          onChangeText={(notes) => setForm({...form, notes})}
        />

        <TouchableOpacity 
          className={`bg-[#00343F] h-[55px] rounded-full flex-row items-center justify-center mb-6 ${(!form.name || !form.phone) ? "opacity-50" : ""}`}
          onPress={handleSaveTechnician}
          disabled={isPending || !form.name || !form.phone}
        >
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-[16px] font-lexendBold">
                {isEditing ? "Update Details" : "Save Technician"}
            </Text>
          )}
        </TouchableOpacity>
        
      </View>
    </BottomSheet>
  );
}
