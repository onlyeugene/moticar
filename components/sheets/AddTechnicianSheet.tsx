import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import BottomSheet from "../shared/BottomSheet";
import {
  TECHNICIAN_CATEGORIES,
  TechnicianCategory,
  Technician,
} from "@/types/technician";
import { useAddTechnician, useUpdateTechnician } from "@/hooks/useTechnicians";
import { useUploadImage } from "@/hooks/useUpload";
import TechnicianSpecialtySheet from "./TechnicianSpecialtySheet";
import Spanner from "@/assets/icons/spanner.svg";

// Icons
import TagIcon from "@/assets/new/tag.svg";
import PhotoIcon from "@/assets/new/image.svg";
import NotesIcon from "@/assets/new/notes.svg";
import TechnicianIcon from "@/assets/new/technician.svg";
import LocationIcon from "@/assets/icons/marker.svg";
import PhoneIcon from "@/assets/icons/phone_tech.svg";
import Edit from "@/assets/icons/edit_tech.svg";
import MailIcon from "@/assets/icons/mail.svg";

interface AddTechnicianSheetProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  technician?: Technician | null;
}

interface FieldRowProps {
  label?: string;
  icon?: React.FC<any> | keyof typeof Ionicons.glyphMap;
  children?: React.ReactNode;
  noBorder?: boolean;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  required?: string;
}

const FieldRow = ({
  label,
  icon: Icon,
  children,
  noBorder = false,
  rightElement,
  onPress,
  required,
}: FieldRowProps) => {
  const isIonicon = typeof Icon === "string";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
      className={`py-4 ${noBorder ? "" : "border-b border-[#F0F0F0]"}`}
    >
      <View className="flex-row items-center gap-4 mb-1">
        {Icon && (
          <View className="w-6 h-6 items-center justify-center">
            {isIonicon ? (
              <Ionicons name={Icon as any} size={20} color="#29D7DE" />
            ) : (
              <Icon width={20} height={20} color="#29D7DE" />
            )}
          </View>
        )}
        <View className="flex-1 flex-row justify-between items-center">
          <View className="flex-row  items-start gap-1 ">
            {label && (
            <Text className="text-[#8B8B8B] text-[12px] font-lexendRegular">
              {label}
            </Text>
          )}
          {required && (
            <Text className="text-[#00AEB5] text-[12px] font-lexendBold">
              {required}
            </Text>
          )}
          </View>
          {rightElement}
        </View>
      </View>
      {children && <View>{children}</View>}
    </TouchableOpacity>
  );
};

export default function AddTechnicianSheet({
  visible,
  onClose,
  onSuccess,
  technician,
}: AddTechnicianSheetProps) {
  const addMutation = useAddTechnician();
  const updateMutation = useUpdateTechnician();
  const { mutateAsync: uploadImage } = useUploadImage();

  const isEditing = !!technician;
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    specialty: "" as TechnicianCategory,
    phone: "",
    email: "",
    location: "",
    notes: "",
    avatarUrl: "",
  });

  const [isSpecialtySheetVisible, setIsSpecialtySheetVisible] = useState(false);

  // Sync form when technician changes (edit mode)
  useEffect(() => {
    if (technician && visible) {
      setForm({
        name: technician.name || "",
        specialty: (technician.specialty as TechnicianCategory) || ("" as TechnicianCategory),
        phone: technician.phone || "",
        email: technician.email || "",
        location: technician.location || "",
        notes: technician.notes || "",
        avatarUrl: technician.avatarUrl || "",
      });
    } else if (!visible) {
      // Reset form when closing
      setForm({
        name: "",
        specialty: "" as TechnicianCategory,
        phone: "",
        email: "",
        location: "",
        notes: "",
        avatarUrl: "",
      });
    }
  }, [technician, visible]);

  const handleSaveTechnician = async () => {
    if (!form.name || !form.phone) return;

    try {
      setIsUploading(true);
      let avatarUrl = form.avatarUrl;

      // Handle image upload if it's a local URI
      if (avatarUrl && (avatarUrl.startsWith("file://") || avatarUrl.startsWith("content://") || !avatarUrl.startsWith("http"))) {
        try {
          const uploadResult = await uploadImage({
            uri: avatarUrl,
            folder: "avatars",
          });
          avatarUrl = uploadResult.url;
        } catch (uploadError) {
          console.error("Image upload failed, proceeding with original URL:", uploadError);
          // Optional: You could stop here if you want to force successful uploads
        }
      }

      const finalData = { ...form, avatarUrl };

      if (isEditing && technician) {
        await updateMutation.mutateAsync({
          id: technician._id || technician.id || "",
          data: finalData,
        });
      } else {
        await addMutation.mutateAsync(finalData);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(
        isEditing
          ? "Failed to update technician:"
          : "Failed to add technician:",
        error,
      );
      Alert.alert("Error", "Failed to save technician details. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need camera roll permissions to upload a photo.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setForm({ ...form, avatarUrl: result.assets[0].uri });
    }
  };

  const isPending = addMutation.isPending || updateMutation.isPending;
  const isFormValid = !!form.name && !!form.phone;

  const headerRight = (
    <View className="flex-row items-center gap-3">
      <TouchableOpacity
        onPress={pickImage}
        className="w-11 h-11 rounded-full bg-white border border-gray-100 items-center justify-center shadow-sm"
      >
        <Ionicons name="camera-outline" size={22} color="#00343F" />
      </TouchableOpacity>
    <TouchableOpacity
        onPress={handleSaveTechnician}
        disabled={isPending || isUploading || !isFormValid}
        className={`bg-[#9DE8EB] px-6 py-3 rounded-full items-center justify-center ${isPending || isUploading || !isFormValid ? "opacity-30" : ""}`}
      >
        {isPending || isUploading ? (
          <ActivityIndicator size="small" color="#00343F" />
        ) : (
          <Text className="text-[#00343F] font-lexendBold text-[15px]">
            Save
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <BottomSheet
        visible={visible}
        onClose={onClose}
        title={isEditing ? "Edit Details" : "Add New Technician"}
        headerRight={headerRight}
        scrollable={true}
        height="85%"
        backgroundColor="#F5F5F5"
      >
        <View className="flex-1 pb-10">
          {/* Section 1: Name and Avatar */}
          <View className="bg-white px-4 mb-1 rounded-none pt-2">
            <View className="mt-4 flex-row gap-3">
              <View className="flex-1">
                <Text className="text-[#8B8B8B] text-[12px] font-lexendRegular mb-3">
                  Full Name
                </Text>
                <TextInput
                  className="text-[#00343F] font-lexendRegular text-[14px] pb-4 border-b border-[#F0F0F0]"
                  placeholder="Give your technician a name"
                  placeholderTextColor="#B4B1B1"
                  value={form.name}
                  onChangeText={(name) => setForm({ ...form, name })}
                />
              </View>
            </View>

            {/* Specialty Field */}
            <FieldRow
              label="Speciality"
              required="*"
              icon={Spanner}
              onPress={() => setIsSpecialtySheetVisible(true)}
              rightElement={
                <View className="flex-row items-center gap-2">
                  <Text
                    className={`font-lexendRegular text-[14px] ${form.specialty ? "text-[#00343F]" : "text-[#ACB7B7]"}`}
                  >
                    {form.specialty || "Select"}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#C1C3C3" />
                </View>
              }
            />

            {/* Location Field */}
          </View>

          <View className="bg-white mb-1 px-4">
            <FieldRow
              label="Location"
              icon={LocationIcon}
              noBorder
              rightElement={
                <View className="flex-row items-center gap-2 ">
                  <TextInput
                    className="text-right font-lexendRegular text-[14px] text-[#ACB7B7]"
                    placeholder="Select"
                    placeholderTextColor="#ACB7B7"
                    value={form.location}
                    onChangeText={(location) => setForm({ ...form, location })}
                  />
                  <Ionicons name="chevron-forward" size={18} color="#C1C3C3" />
                </View>
              }
            />
          </View>
          {/* Section 2: Contact Info */}
          <View className="bg-white px-4 mb-1 rounded-none pt-2">
            {/* Phone Number */}
            <FieldRow label="Phone Number" icon={PhoneIcon}>
              <TextInput
                className="text-[#00343F] font-lexendMedium text-[14px] pb-2 ml-10 pt-3 border-b border-[#F0F0F0]"
                placeholder="+234"
                placeholderTextColor="#B4B1B1"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(phone) => setForm({ ...form, phone })}
              />
            </FieldRow>

          </View>


            {/* Email Address */}
            <View className="bg-white px-4 mb-1">
               <FieldRow label="Email Address" icon={MailIcon} noBorder>
              <TextInput
                className="text-[#00343F] font-lexendMedium text-[14px] pb-2 pt-3 ml-10 border-b border-[#F0F0F0]"
                placeholder="Enter email"
                placeholderTextColor="#B4B1B1"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(email) => setForm({ ...form, email })}
              />
            </FieldRow>
            </View>



          {/* Section 3: Notes */}
          <View className="bg-white px-4 mb-1 rounded-none pt-2">
            <FieldRow label="Notes/Description" icon={NotesIcon} noBorder>
              <TextInput
                className="text-[#00343F] font-lexendRegular text-[14px] ml-10 px-4 border-b border-[#F0F0F0] py-4"
                placeholder="Write a brief note for your preference"
                placeholderTextColor="#B4B1B1"
                multiline
                value={form.notes}
                onChangeText={(notes) => setForm({ ...form, notes })}
              />
            </FieldRow>
          </View>

          {/* Hidden Image Preview if picked */}
          {form.avatarUrl ? (
            <View className="items-center mt-4">
              <View className="relative">
                <Image
                  source={{ uri: form.avatarUrl }}
                  className="w-20 h-20 rounded-full border-2 border-white"
                />
                <TouchableOpacity
                  onPress={() => setForm({ ...form, avatarUrl: "" })}
                  className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm"
                >
                  <Ionicons name="close-circle" size={20} color="#EE6969" />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
        <TechnicianSpecialtySheet
          visible={isSpecialtySheetVisible}
          onClose={() => setIsSpecialtySheetVisible(false)}
          currentSpecialty={form.specialty}
          onSelect={(specialty) => setForm({ ...form, specialty })}
        />
      </BottomSheet>
    </>
  );
}
