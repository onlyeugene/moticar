import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useUpdateProfile } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import DatePickerSheet from "./DatePickerSheet";
import GenderSelectionSheet from "./GenderSelectionSheet";
import { format } from "date-fns";
import Pen from '@/assets/icons/pen.svg'
import * as ImagePicker from "expo-image-picker";
import { uploadService } from "@/services/api/uploadService";
import ImageCropper from "../shared/ImageCropper";
import { ActivityIndicator, Alert } from "react-native";

interface EditProfileSheetProps {
  visible: boolean;
  onClose: () => void;
}

const ROW_ICON_COLOR = "#ACB7B7";

function ProfileRow({
  icon,
  label,
  value,
  subtext,
  subtextColor,
  textSize,
  textColor,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label?: string;
  value?: string;
  subtext?: string;
  subtextColor?: string;
  onPress?: () => void;
  textSize?: string;
  textColor?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F4F4]"
    >
      <View className="flex-row items-center flex-1 mr-2">
        <Ionicons name={icon} size={20} color={ROW_ICON_COLOR} />
        <View className="ml-4">
          <Text className="text-[#8B8B8B] font-lexendRegular text-[12px]">
            {label}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className={`${textColor || "text-[#00343F]"} font-lexendRegular ${textSize || "text-[14px]"}`}>
          {value || "—"}
        </Text>
        {subtext ? (
          <Text
            className="text-[10px] font-lexendRegular mt-0.5"
            style={{ color: subtextColor || "#34A853" }}
          >
            {subtext}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default function EditProfileSheet({
  visible,
  onClose,
}: EditProfileSheetProps) {
  const user = useAuthStore((state) => state.user);
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { showSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name || "");
  const [usernameValue, setUsernameValue] = useState(user?.username || "");
  const [dobValue, setDobValue] = useState<Date | null>(user?.dob ? new Date(user.dob) : null);
  const [genderValue, setGenderValue] = useState(user?.gender || "");
  const [avatarValue, setAvatarValue] = useState(user?.avatar || "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderSheet, setShowGenderSheet] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const [cropperVisible, setCropperVisible] = useState(false);
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // We use our own cropper
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPendingImageUri(result.assets[0].uri);
        setCropperVisible(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showSnackbar({
        type: 'error',
        message: 'Error',
        description: 'Failed to pick image',
      });
    }
  };

  const handleCropped = async (uri: string) => {
    setCropperVisible(false);
    if (!uri) return;

    setIsUploading(true);
    try {
      const response = await uploadService.uploadImage(uri, 'avatars');
      const imageUrl = response?.url || response?.secure_url;
      
      if (imageUrl) {
        setAvatarValue(imageUrl);
        showSnackbar({
          type: 'success',
          message: 'Uploaded',
          description: 'Image ready to be saved',
        });
        setIsUploading(false);
      } else {
        throw new Error('Image URL not found in response');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showSnackbar({
        type: 'error',
        message: 'Error',
        description: 'Failed to upload image',
      });
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    updateProfile(
      { 
        name: nameValue,
        username: usernameValue,
        dob: dobValue?.toISOString(), 
        gender: genderValue,
        avatar: avatarValue
      },
      {
        onSuccess: () => {
          showSnackbar({
            type: "success",
            message: "Profile Updated",
            description: "Your details have been saved.",
          });
          setIsEditing(false);
        },
      },
    );
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Your Account"
      height="80%"
      backgroundColor="#F0F0F0"
      scrollable={false}
      headerRight={
        isEditing ? (
          <TouchableOpacity
            onPress={handleSave}
            disabled={isPending}
            className="bg-[#00AEB5] px-5 py-1.5 rounded-full"
          >
            <Text className="text-white font-lexendSemiBold text-[14px]">
              {isPending ? "..." : "Save"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            className="w-12 h-12 rounded-full bg-[#FFFFFF] border-[#E0E0E0] border items-center justify-center"
          >
            <Pen />
          </TouchableOpacity>
        )
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{  }}
      >
        {/* Avatar block */}

        {/* Card with rows */}
        <View className="mx-2 bg-[#FFFFFF] rounded-[12px] overflow-hidden">
          <View className="items-center mt-4 mb-6">
            <View className="relative">
                <View className="w-[124px] h-[124px] rounded-full bg-[#00AEB5]/20 items-center justify-center border-4 border-[#F4EBFF] overflow-hidden">
                {avatarValue ? (
                  <Image 
                    source={{ uri: avatarValue }} 
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-[#00AEB5] font-lexendBold text-[32px]">
                    {initials}
                  </Text>
                )}
                {isUploading && (
                  <View className="absolute inset-0 bg-black/30 items-center justify-center">
                    <ActivityIndicator size="small" color="#fff" />
                  </View>
                )}
              </View>
              {isEditing && (
                <TouchableOpacity 
                  onPress={handlePickImage}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 bg-[#00AEB5] w-7 h-7 rounded-full items-center justify-center border-2 border-white"
                >
                  <Ionicons name="camera-outline" size={14} color="#fff" />
                </TouchableOpacity>
              )}
            </View>

            {/* UserID badge */}
            <View className="bg-[#29D7DE] px-4 py-1 rounded-full mt-3">
              <Text className="text-[#00343F] font-lexendRegular text-[12px]">
                userID: {user?.id?.slice(0, 12) || "—"}
              </Text>
            </View>
          </View>
          {isEditing ? (
            <>
              <View className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F4F4]">
                <View className="flex-row items-center">
                  <Ionicons
                    name="pricetag-outline"
                    size={20}
                    color={ROW_ICON_COLOR}
                  />
                  <Text className="text-[#879090] font-lexendRegular text-[12px] ml-4">Name</Text>
                </View>
                <TextInput
                  value={nameValue}
                  onChangeText={setNameValue}
                  placeholderTextColor="#9BBABB"
                  className="text-[#013037] font-lexendRegular text-[24px]"
                />
              </View>
              <View className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F4F4]">
                <View className="flex-row items-center">
                  <Ionicons
                    name="person-circle-outline"
                    size={20}
                    color={ROW_ICON_COLOR}
                  />
                  <Text className="text-[#879090] font-lexendRegular text-[12px] ml-4">Username</Text>
                </View>
                <TextInput
                  value={usernameValue}
                  onChangeText={setUsernameValue}
                  placeholder="Username"
                  placeholderTextColor="#9BBABB"
                  className="text-[#013037] font-lexendRegular text-[16px]"
                />
              </View>
              <TouchableOpacity 
                onPress={() => setShowDatePicker(true)}
                className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F4F4]"
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={ROW_ICON_COLOR}
                  />
                  <Text className="text-[#879090] font-lexendRegular text-[12px] ml-4">DOB</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className={`font-lexendRegular text-[14px] ${dobValue ? "text-[#00343F]" : "text-[#9BBABB]"}`}>
                    {dobValue ? format(dobValue, "MMMM d, yyyy") : "Date of Birth"}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#7BA0A3" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setShowGenderSheet(true)}
                className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F4F4]"
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="male-female-outline"
                    size={20}
                    color={ROW_ICON_COLOR}
                  />
                  <Text className="text-[#879090] font-lexendRegular text-[12px] ml-4">Gender</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className={`font-lexendRegular text-[14px] ${genderValue ? "text-[#00343F]" : "text-[#9BBABB]"}`}>
                    {genderValue || "Gender"}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#7BA0A3" />
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <ProfileRow
                icon="pricetag-outline"
                value={user?.name}
                textSize="text-[24px]"
                textColor="text-[#013037]"
              />
              <ProfileRow
                icon="person-circle-outline"
                value={user?.username ? `@${user.username}` : undefined}
                textSize="text-[16px]"
                textColor="text-[#2A2A2A]"
              />
              <ProfileRow
                icon="calendar-outline"
                label="Date of Birth"
                value={user?.dob ? format(new Date(user.dob), "MMMM d, yyyy") : undefined}
                textSize="text-[14px]"
                textColor="text-[#2A2A2A]"
                subtext=""
              />
              <ProfileRow
                icon="male-female-outline"
                label="Gender"
                value={user?.gender}
                textSize="text-[14px]"
                textColor="text-[#2A2A2A]"
              />
            </>
          )}



          <ProfileRow 
            icon="mail-outline"
            label="Email address"
            value={user?.email}
            textSize="text-[14px]"
            textColor="text-[#C4C4C4]"
          />
        </View>

        {/* Footer */}
        <Text className="text-center text-[#646060] font-lexendRegular text-[12px] mt-6">
          Account created {user?.createdAt}
        </Text>
      </ScrollView>

      {/* Internal Sheets */}
      <DatePickerSheet
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={(date) => {
          setDobValue(date);
          setShowDatePicker(false);
        }}
        initialDate={dobValue || undefined}
        maxDate={new Date()}
        title="Date of Birth"
      />

      <GenderSelectionSheet
        visible={showGenderSheet}
        onClose={() => setShowGenderSheet(false)}
        onSelect={(gender) => {
          setGenderValue(gender);
          setShowGenderSheet(false);
        }}
        currentGender={genderValue}
      />

      <ImageCropper
        visible={cropperVisible}
        imageUri={pendingImageUri}
        onClose={() => {
          setCropperVisible(false);
          setPendingImageUri(null);
        }}
        onCrop={handleCropped}
      />
    </BottomSheet>
  );
}
