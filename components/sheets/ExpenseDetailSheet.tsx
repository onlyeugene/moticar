import React, { useState, useEffect, createElement } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  useUpdateExpense,
  useDeleteExpense,
  useUploadReceipts,
} from "@/hooks/useExpenses";
import { Expense } from "@/types/expense";
import { Technician } from "@/types/technician";
import BottomSheet from "../shared/BottomSheet";
import { CATEGORY_COLORS } from "@/constants/Colors";
import { getRelativeTime } from "@/utils/date";
import Cost from "@/assets/new/cost.svg";
import TechnicianIcon from "@/assets/new/technician.svg";
import Price from "@/assets/new/price.svg";
import Edit from "@/assets/new/edit.svg";
import Photo from "@/assets/new/image.svg";
import Tag from "@/assets/new/tag.svg";
import Calendar from "@/assets/icons/calendar.svg";
import Notes from "@/assets/new/notes.svg";
import Wallet from "@/assets/new/wallet.svg";
import DeleteIcon from "@/assets/new/delete.svg";
import CameraPlusIcon from "@/assets/icons/cameraplus.svg";

import DatePickerSheet from "./DatePickerSheet";
import TechnicianSheet from "./TechnicianSheet";

interface ExpenseDetailSheetProps {
  visible: boolean;
  onClose: () => void;
  expense: Expense | null;
  currencySymbol: string;
}

export default function ExpenseDetailSheet({
  visible,
  onClose,
  expense,
  currencySymbol,
}: ExpenseDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpense, setEditedExpense] = useState<Expense | null>(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTechnicianSheetVisible, setIsTechnicianSheetVisible] =
    useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const updateMutation = useUpdateExpense();
  const deleteMutation = useDeleteExpense();
  const { mutate: uploadReceipts } = useUploadReceipts();

  useEffect(() => {
    if (expense) {
      setEditedExpense(expense);
    } else {
      setIsEditing(false);
    }
  }, [expense]);

  if (!expense || !editedExpense) return null;

  const color = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS["Others"];

  const getRelativeDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) return "Today";
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return "";
  };

  const DetailRow = ({
    icon: Icon,
    label,
    value,
    subValue,
    children,
    valueClassName,
    alignRight,
    isEditable,
    onValueChange,
    keyboardType,
    multiline,
    noBorder,
    showChevron,
    onPress,
  }: any) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
      className={`flex-row items-start py-5 ${noBorder ? "" : "border-b border-[#F0F0F0]"}`}
    >
      <View className="w-8 mt-1">
        {typeof Icon === "function" ? (
          <Icon width={24} height={24} color="#B4B1B1" />
        ) : (
          Icon
        )}
      </View>
      <View className="flex-1 ml-2 ">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            {label && (
              <Text className="text-[#9BBABB] text-[12px] font-lexendRegular">
                {label}
              </Text>
            )}
            <View className="flex-row justify-between items-center">
              <View
                className={`flex-1 ${alignRight ? "items-end" : "items-start"}`}
              >
                {isEditable && !children ? (
                  <TextInput
                    value={value?.toString()}
                    onChangeText={onValueChange}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    editable={isEditing}
                    className={`text-[#1A3B41] font-lexendMedium ${valueClassName || "text-[16px]"} ${alignRight ? "text-right" : "text-left"} border-b border-[#1018280D] py-2 w-full`}
                    autoFocus={isEditable === "auto" && isEditing}
                  />
                ) : (
                  <Text
                    className={`text-[#1A3B41] font-lexendMedium ${valueClassName || "text-[16px]"}`}
                  >
                    {value}
                  </Text>
                )}
                {subValue && !isEditing && (
                  <Text className="text-[#27AE60] text-[10px] font-lexendRegular mt-0.5">
                    {subValue}
                  </Text>
                )}
              </View>
              {isEditing && showChevron && (
                <View className="mt-1 ml-2">
                  <Ionicons name="chevron-forward" size={18} color="#C1C3C3" />
                </View>
              )}
            </View>
          </View>
        </View>
        {children && <View className="">{children}</View>}
      </View>
    </TouchableOpacity>
  );

  const handleSave = () => {
    if (editedExpense && expense) {
      updateMutation.mutate(
        {
          id: expense.id || (expense as any)._id,
          data: {
            name: editedExpense.name,
            amount: editedExpense.amount,
            date: editedExpense.date,
            category: editedExpense.category,
            currency: editedExpense.currency,
            notes: editedExpense.notes,
            paymentMethod: editedExpense.paymentMethod,
            items: editedExpense.items,
            metadata: editedExpense.metadata,
            receipts: editedExpense.receipts,
            originalAmount: editedExpense.originalAmount,
            originalCurrency: editedExpense.originalCurrency,
            technicianId:
              typeof editedExpense.technicianId === "object"
                ? editedExpense.technicianId?._id ||
                  (editedExpense.technicianId as any)?.id
                : editedExpense.technicianId,
          },
        },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        },
      );
    }
  };

  const handleDelete = () => {
    if (!expense) return;

    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteMutation.mutate(expense.id || (expense as any)._id, {
              onSuccess: () => onClose(),
            }),
        },
      ],
    );
  };

  const handleDateSelect = (date: Date) => {
    updateField("date", date.toISOString());
  };

  const updateField = (field: keyof Expense, value: any) => {
    if (editedExpense) {
      setEditedExpense({ ...editedExpense, [field]: value });
    }
  };

  const showImageSourceOptions = (
    onSelect: (source: "camera" | "library") => void,
  ) => {
    Alert.alert(
      "Select Receipt Source",
      "Would you like to take a photo or choose from your gallery?",
      [
        {
          text: "Take Photo",
          onPress: () => onSelect("camera"),
        },
        {
          text: "Choose from Gallery",
          onPress: () => onSelect("library"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  };

  const pickImage = async (source: "camera" | "library") => {
    let result;
    if (source === "camera") {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow camera access to take a photo.",
        );
        return null;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    }

    if (!result.canceled && result.assets && result.assets[0]) {
      return result.assets[0];
    }
    return null;
  };

  const handleAddReceipt = () => {
    showImageSourceOptions(async (source) => {
      const asset = await pickImage(source);
      if (asset) {
        setIsUploading(true);
        uploadReceipts([asset], {
          onSuccess: (data: any) => {
            if (data.urls && data.urls.length > 0) {
              const currentReceipts = editedExpense.receipts || [];
              updateField("receipts", [...currentReceipts, ...data.urls]);
            }
            setIsUploading(false);
          },
          onError: (err: any) => {
            console.error("Failed to upload receipt:", err);
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Failed to upload the receipt.";
            Alert.alert("Error", errorMessage);
            setIsUploading(false);
          },
        });
      }
    });
  };

  const handleRemoveReceipt = (index: number) => {
    const currentReceipts = editedExpense.receipts || [];
    updateField(
      "receipts",
      currentReceipts.filter((_, i) => i !== index),
    );
  };

  const updateMetadata = (field: string, value: any) => {
    if (editedExpense) {
      setEditedExpense({
        ...editedExpense,
        metadata: { ...editedExpense.metadata, [field]: value },
      });
    }
  };

  const headerRight = (
    <View className="flex-row items-center gap-3">
      {isEditing ? (
        <TouchableOpacity
          onPress={handleSave}
          className="bg-[#29D7DE] px-8 py-2 rounded-full"
        >
          <Text className="text-[#00343F] font-lexendBold text-[14px]">
            Save
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => setIsEditing(true)}
          className="bg-white p-2 rounded-full border border-gray-100"
        >
          {createElement(Edit, { width: 24, height: 24, color: "#7A7A7C" })}
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={handleDelete}
        disabled={deleteMutation.isPending}
        className="bg-white p-2 rounded-full border border-gray-100"
      >
        <DeleteIcon
          width={24}
          height={24}
          color={deleteMutation.isPending ? "#CCC" : undefined}
        />
      </TouchableOpacity>
    </View>
  );

  const dateStr = new Date(editedExpense.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const title = (
    <View className="flex-row items-center gap-3">
      <View
        style={{ backgroundColor: "#FBE74C" }}
        className="p-2 rounded-full w-10 h-10 items-center justify-center"
      >
        <Ionicons name="settings" size={20} color="#002D36" />
      </View>
      <View>
        <Text className="text-[#00343F] text-[16px] font-lexendBold">
          {editedExpense.category}
        </Text>
        {editedExpense.metadata?.recommendedBudget && (
          <Text className="text-[#9BBABB] text-[10px] font-lexendRegular">
            Recommended{" "}
            <Text className="text-[#29D7DE]">
              {currencySymbol}{" "}
              {editedExpense.metadata.recommendedBudget.toLocaleString()}
            </Text>
          </Text>
        )}
      </View>
    </View>
  );

  const extraCostsTotal = (editedExpense.items || []).reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  const Card = ({ children, className, roundedTop, roundedBottom }: any) => (
    <View
      className={`bg-white px-4 mb-1 ${roundedTop ? "rounded-t-[12px]" : ""} ${roundedBottom ? "rounded-b-[12px]" : ""} ${className || ""}`}
    >
      {children}
    </View>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={title as any}
      headerRight={headerRight}
      backgroundColor="#F0F0F0"
      height="80%"
    >
      <View className="mt-1">
        {/* Card 1: Tag, Amount, and Date */}
        <Card roundedTop>
          <DetailRow
            icon={Tag}
            value={editedExpense.name || "--"}
            valueClassName="text-[18px] text-[#1A3B41] font-lexendBold"
            isEditable
            onValueChange={(val: string) => updateField("name", val)}
            alignRight
            noBorder
          />

          <View className={` pb-5 pt-3`}>
            <View className="flex-row items-start">
              <View className="w-8 mt-1">
                <Price width={24} height={24} color="#B4B1B1" />
              </View>
              <View className="flex-1 ml-2">
                {isEditing ? (
                  <View className="flex-row items-center border border-[#1018280D] rounded-lg h-[54px] mt-2 overflow-hidden">
                    <View className="w-14 items-center justify-center border-r border-[#1018280D]  h-full">
                      <Text className="text-gray-400 text-[20px] font-lexendMedium">
                        {currencySymbol}
                      </Text>
                    </View>
                    <TextInput
                      value={editedExpense.amount.toString()}
                      onChangeText={(val) =>
                        updateField("amount", parseFloat(val) || 0)
                      }
                      keyboardType="numeric"
                      className="flex-1 px-4 text-center text-[28px] font-lexendBold text-[#00343F]"
                    />
                  </View>
                ) : (
                  <View className="items-end">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-[32px] font-lexendBold text-[#1A3B41]">
                        {currencySymbol}
                        {editedExpense.amount.toLocaleString()}
                      </Text>
                      {!!editedExpense.originalCurrency &&
                        editedExpense.originalCurrency !==
                          editedExpense.currency && (
                          <TouchableOpacity
                            onPress={() => {
                              Alert.alert(
                                "Currency Conversion",
                                `This expense was originally logged in ${editedExpense.originalCurrency}. The original amount was ${editedExpense.originalCurrency} ${editedExpense.originalAmount?.toLocaleString()}.`
                              );
                            }}
                            className="bg-white p-1.5 rounded-full shadow-sm"
                          >
                            <Ionicons
                              name="help-circle"
                              size={20}
                              color="#00AEB5"
                            />
                          </TouchableOpacity>
                        )}
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>

          <DetailRow
            icon={Calendar}
            label="Date"
            value={dateStr}
            subValue={getRelativeDayLabel(editedExpense.date)}
            alignRight
            showChevron
            noBorder
            onPress={isEditing ? () => setIsDatePickerVisible(true) : undefined}
          />
        </Card>

        {/* Card 2: Image proof/receipt */}
        <Card>
          <DetailRow
            icon={Photo}
            label={
              isEditing
                ? "Upload any image proof or receipt"
                : "Image proof or receipt"
            }
            value=""
            showChevron={isEditing}
            noBorder
          >
            <View className="flex-row items-center gap-2 mt-2 pb-2">
              <View>
                <View className="flex-row gap-2">
                  {(editedExpense.receipts || []).map((uri, index) => (
                    <View key={`${uri}-${index}`} className="relative">
                      <TouchableOpacity
                        onPress={() => setSelectedImage(uri)}
                        activeOpacity={0.8}
                        className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden"
                      >
                        <Image source={{ uri }} className="w-full h-full" />
                      </TouchableOpacity>
                      {isEditing && (
                        <TouchableOpacity
                          onPress={() => handleRemoveReceipt(index)}
                          className="absolute -top-1 -right-1 bg-white rounded-full shadow-sm z-10"
                        >
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color="#EE6969"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}

                  {isEditing && (
                    <>
                      {isUploading ? (
                        <View className="w-16 h-16 bg-[#F5F5F5] rounded-lg items-center justify-center">
                          <ActivityIndicator size="small" color="#29D7DE" />
                        </View>
                      ) : (editedExpense.receipts || []).length < 5 ? (
                        <TouchableOpacity
                          onPress={handleAddReceipt}
                          className="w-16 h-16 bg-[#F5F5F5] rounded-lg items-center justify-center border border-dashed border-[#D0D0D0]"
                        >
                          <CameraPlusIcon width={24} height={24} />
                        </TouchableOpacity>
                      ) : null}
                    </>
                  )}
                </View>
              </View>
            </View>
          </DetailRow>
        </Card>

        {/* Card 3: Technician */}
        <Card>
          <DetailRow
            icon={TechnicianIcon}
            label="Technician"
            value={
              (typeof editedExpense.technicianId === "object"
                ? editedExpense.technicianId?.name
                : editedExpense.metadata?.workshopName) || "--"
            }
            valueClassName="text-[14px]"
            alignRight
            showChevron
            noBorder
            onPress={
              isEditing ? () => setIsTechnicianSheetVisible(true) : undefined
            }
          >
            <View className="flex-row items-center justify-end gap-1 mt-1 pb-2">
              <Ionicons
                name="phone-portrait-outline"
                size={14}
                color="#27AE60"
              />
              <Text className="text-[#27AE60] text-[11px] font-lexendRegular">
                {(typeof editedExpense.technicianId === "object"
                  ? editedExpense.technicianId?.phone
                  : editedExpense.metadata?.technicianPhone) || "--"}
              </Text>
            </View>
          </DetailRow>
        </Card>

        {/* Card 4: Method of Payment */}
        <Card>
          <DetailRow
            icon={Wallet}
            label="Method of Payment"
            value={isEditing ? "" : editedExpense.paymentMethod}
            valueClassName="text-[14px]"
            alignRight
            noBorder
          >
            {isEditing ? (
              <View className="flex-row gap-2 mt-2 pb-2">
                {["Cash", "Bank Transfer", "Debit Card"].map((method) => (
                  <TouchableOpacity
                    key={method}
                    onPress={() => updateField("paymentMethod", method as any)}
                    className={`flex-1 flex-row items-center justify-center p-3 rounded-xl ${editedExpense.paymentMethod === method ? "bg-[#00AEB5]" : "bg-[#F5F5F5]"}`}
                  >
                    <Text
                      className={`text-[12px] font-lexendMedium ${editedExpense.paymentMethod === method ? "text-[#FFFFFF]" : "text-[#A0A0A0]"}`}
                    >
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </DetailRow>
        </Card>

        {/* Card 5: Extra Costs (if existing) */}
        {editedExpense.items && editedExpense.items.length > 0 && (
          <Card>
            <DetailRow
              icon={Cost}
              label="Did you incur any extra cost?"
              value=""
              noBorder
            >
              <View className="flex-col w-full mt-1 pb-2">
                {editedExpense.items.map((item, idx) => (
                  <View key={idx} className="flex-row items-center gap-2 mb-2">
                    <View className="flex-1 bg-white h-[44px] justify-center px-4 rounded-[4px] border border-[#1018280D] shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]">
                      <Text className="text-[#00343F] font-lexendBold text-[12px]">
                        {item.name}
                      </Text>
                    </View>
                    <View className="bg-white h-[44px] min-w-[100px] justify-center items-center rounded-[4px] border border-[#1018280D] shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]">
                      <Text className="text-[#00343F] font-lexendBold text-[12px]">
                        {currencySymbol} {item.price.toLocaleString()}
                      </Text>
                    </View>
                    <View className="w-12 bg-white h-[44px] justify-center items-center rounded-[4px] border border-[#1018280D] shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]">
                      <Text className="text-[#00343F] font-lexendBold text-[12px]">
                        {item.qty}
                      </Text>
                    </View>
                    {isEditing && (
                      <TouchableOpacity className="ml-1">
                        <Ionicons
                          name="close-circle-outline"
                          size={20}
                          color="#EE6969"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <View className="items-end mt-1">
                  <Text className="text-[#00AEB5] font-lexendRegular text-[12px] ">
                    Total sum : {currencySymbol}{" "}
                    {extraCostsTotal.toLocaleString()}
                  </Text>
                </View>
              </View>
            </DetailRow>
          </Card>
        )}

        {/* Card 6: Notes/Description */}
        <Card roundedBottom>
          <DetailRow icon={Notes} label="Notes/Description" value="" noBorder>
            {isEditing ? (
              <View className="pb-4">
                <TextInput
                  value={editedExpense.notes || ""}
                  onChangeText={(val) => updateField("notes", val)}
                  multiline
                  placeholder="Enter notes..."
                  placeholderTextColor="#A0A0A0"
                  className="  rounded-lg border-b border-[#1018280D] mt-2 text-[#586A6B] font-lexendRegular p-3"
                  style={{ textAlignVertical: "top" }}
                />
              </View>
            ) : (
              <View className="mt-2 pb-4">
                <View className="border-b py-4 border-[#DEDEDE]">
                  <Text className="text-[13px] text-[#586A6B] font-lexendRegular">
                    {editedExpense.notes || ""}
                  </Text>
                </View>
              </View>
            )}
          </DetailRow>
        </Card>

        {isEditing && (
          <TouchableOpacity
            onPress={() => setIsEditing(false)}
            className="mt-4 mb-8 border border-[#29D7DE] py-4 rounded-full items-center"
          >
            <Text className="text-[#00343F] font-lexendBold text-[16px]">
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Full-screen Image Preview Modal */}
      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View className="flex-1 bg-black/90 items-center justify-center">
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            className="absolute top-12 right-6 z-10 bg-white/10 p-2 rounded-full"
          >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-full"
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      <DatePickerSheet
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onSelect={handleDateSelect}
        initialDate={new Date(editedExpense.date)}
      />

      <TechnicianSheet
        visible={isTechnicianSheetVisible}
        onClose={() => setIsTechnicianSheetVisible(false)}
        onSelect={(tech: Technician) => {
          updateField("technicianId", tech);
          setIsTechnicianSheetVisible(false);
        }}
        onAdd={() => {
          setIsTechnicianSheetVisible(false);
          // Assuming there's an AddTechnicianSheet we might want to open,
          // but for now just closing is fine or we can add the state if needed.
        }}
      />
    </BottomSheet>
  );
}
