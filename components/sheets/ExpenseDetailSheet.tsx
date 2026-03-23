import React, { useState, useEffect, createElement } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useUpdateExpense, useDeleteExpense } from "@/hooks/useExpenses";
import { Expense } from "@/types/expense";
import BottomSheet from "../shared/BottomSheet";
import { CATEGORY_COLORS } from "@/constants/Colors";
import { getRelativeTime } from "@/utils/date";
import Cost from "@/assets/new/cost.svg";
import Technician from "@/assets/new/technician.svg";
import Price from "@/assets/new/price.svg";
import Edit from "@/assets/new/edit.svg";
import Photo from "@/assets/new/image.svg";
import Tag from "@/assets/new/tag.svg";
import Calendar from "@/assets/icons/calendar.svg";
import Notes from "@/assets/new/notes.svg";
import Wallet from "@/assets/new/wallet.svg";
import DeleteIcon from "@/assets/new/delete.svg";

import DatePickerSheet from "./DatePickerSheet";


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

  const updateMutation = useUpdateExpense();
  const deleteMutation = useDeleteExpense();

  useEffect(() => {
    if (expense) {
      setEditedExpense(expense);
    } else {
      setIsEditing(false);
    }
  }, [expense]);

  if (!expense || !editedExpense) return null;

  const color = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS["Others"];

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
    onPress
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
              <View className={`flex-1 ${alignRight ? "items-end" : "items-start"}`}>
                {isEditing && isEditable && !children ? (
                  <TextInput
                    value={value?.toString()}
                    onChangeText={onValueChange}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    className={`text-[#1A3B41] font-lexendMedium ${valueClassName || "text-[16px]"} ${alignRight ? "text-right" : "text-left"} border-b border-blue-200 py-1 w-full`}
                    autoFocus={isEditable === "auto"}
                  />
                ) : (
                  <Text className={`text-[#1A3B41] font-lexendMedium ${valueClassName || "text-[16px]"}`}>
                    {value}
                  </Text>
                )}
                {subValue && !isEditing && (
                  <Text className="text-[#27AE60] text-[10px] font-lexendRegular">
                    {subValue}
                  </Text>
                )}
              </View>
            </View>
          </View>
          {isEditing && showChevron && (
            <View className="mt-1 ml-2">
              <Ionicons name="chevron-forward" size={18} color="#C1C3C3" />
            </View>
          )}
        </View>
        {children && <View className="">{children}</View>}
      </View>
    </TouchableOpacity>
  );

  const handleSave = () => {
    if (editedExpense && expense) {
      updateMutation.mutate({
        id: expense.id || (expense as any)._id,
        data: {
          name: editedExpense.name,
          amount: editedExpense.amount,
          date: editedExpense.date,
          category: editedExpense.category,
          notes: editedExpense.notes,
          paymentMethod: editedExpense.paymentMethod,
          items: editedExpense.items,
          metadata: editedExpense.metadata,
        }
      }, {
        onSuccess: () => {
          setIsEditing(false);
        }
      });
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
          onPress: () => deleteMutation.mutate(expense.id || (expense as any)._id, {
            onSuccess: () => onClose()
          }) 
        },
      ]
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

  const updateMetadata = (field: string, value: any) => {
    if (editedExpense) {
      setEditedExpense({
        ...editedExpense,
        metadata: { ...editedExpense.metadata, [field]: value }
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
          <Text className="text-[#00343F] font-lexendBold text-[14px]">Save</Text>
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
        <DeleteIcon width={24} height={24} color={deleteMutation.isPending ? "#CCC" : undefined} />
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
        style={{ backgroundColor: '#FBE74C' }} 
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
            Recommended <Text className="text-[#29D7DE]">{currencySymbol} {editedExpense.metadata.recommendedBudget.toLocaleString()}</Text>
          </Text>
        )}
      </View>
    </View>
  );

  const extraCostsTotal = (editedExpense.items || []).reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={title as any}
      headerRight={headerRight}
      backgroundColor="#F0F0F0"
    >
      <View className="mt-2 bg-white rounded-[12px] px-4">
        {/* Description Row */}
        <DetailRow 
          icon={Tag} 
          value={editedExpense.name || "--"} 
          valueClassName="text-[18px] text-[#1A3B41] font-lexendBold"
          isEditable
          onValueChange={(val: string) => updateField("name", val)}
          noBorder
          alignRight
        />

        {/* Amount Row */}
        <View className={`border-b border-[#F0F0F0] pb-5 pt-2`}>
          <View className="flex-row items-start">
            <View className="w-8 mt-1">
               <Price width={24} height={24} color="#B4B1B1" />
            </View>
            <View className="flex-1 ml-2">
              {isEditing ? (
                <View className="flex-row items-center border border-gray-200 rounded-lg h-[54px] mt-2 overflow-hidden bg-white">
                  <View className="w-14 items-center justify-center border-r border-gray-100 bg-gray-50 h-full">
                    <Text className="text-gray-400 text-[20px] font-lexendMedium">{currencySymbol}</Text>
                  </View>
                  <TextInput
                    value={editedExpense.amount.toString()}
                    onChangeText={(val) => updateField("amount", parseFloat(val) || 0)}
                    keyboardType="numeric"
                    className="flex-1 px-4 text-center text-[28px] font-lexendBold text-[#00343F]"
                  />
                </View>
              ) : (
                <View className="items-end">
                   <Text className="text-[32px] font-lexendBold text-[#1A3B41]">
                     {currencySymbol}{editedExpense.amount.toLocaleString()}
                   </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Date Row */}
        <DetailRow 
          icon={Calendar} 
          label="Date"
          value={dateStr}
          subValue={getRelativeTime(editedExpense.date)}
          alignRight
          showChevron
          onPress={isEditing ? () => setIsDatePickerVisible(true) : undefined}
        />

        {/* Photos Row */}
        <DetailRow 
          icon={Photo} 
          label={isEditing ? "Upload any image proof or receipt" : "Image proof or receipt"}
          value=""
          showChevron
        >
          <View className="flex-row gap-2 mt-2">
            {editedExpense.receiptUrl ? (
              <View className="flex-row gap-2">
                {[1, 2, 3].map((i) => (
                  <View key={i} className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <Image 
                      source={{ uri: editedExpense.receiptUrl }} 
                      className="w-full h-full"
                    />
                  </View>
                ))}
              </View>
            ) : null}
            {isEditing && (
               <View className="w-12 h-12 bg-white rounded-lg border border-dashed border-gray-300 items-center justify-center">
                 <Ionicons name="add" size={24} color="#C1C3C3" />
               </View>
            )}
          </View>
        </DetailRow>

        {/* Technician Row */}
        <DetailRow 
          icon={Technician} 
          label="Technician"
          value={editedExpense.metadata?.workshopName || "--"}
          valueClassName="text-[14px]"
          alignRight
          isEditable
          onValueChange={(val: string) => updateMetadata("workshopName", val)}
          showChevron
        >
           <View className="flex-row items-center justify-end gap-1 mt-1">
             <Ionicons name="phone-portrait-outline" size={14} color="#27AE60" />
             {isEditing ? (
               <TextInput
                 value={editedExpense.metadata?.technicianPhone}
                 onChangeText={(val) => updateMetadata("technicianPhone", val)}
                 keyboardType="phone-pad"
                 className="text-[#27AE60] text-[11px] font-lexendRegular border-b border-green-100"
               />
             ) : (
               <Text className="text-[#27AE60] text-[11px] font-lexendRegular">
                 {editedExpense.metadata?.technicianPhone || "--"}
               </Text>
             )}
           </View>
        </DetailRow>

        {/* Payment Method Row */}
        <DetailRow 
          icon={Wallet} 
          label="Method of Payment"
          value={isEditing ? "" : editedExpense.paymentMethod}
          valueClassName="text-[14px]"
          alignRight
        >
          {isEditing ? (
            <View className="flex-row gap-2 mt-2">
              {['Cash', 'Bank Transfer', 'Debit Card'].map((method) => (
                <TouchableOpacity 
                  key={method}
                  onPress={() => updateField("paymentMethod", method as any)}
                  className={`flex-1 flex-row items-center justify-center p-3 rounded-xl ${editedExpense.paymentMethod === method ? 'bg-[#29D7DE]' : 'bg-[#F5F5F5]'}`}
                >
                  <Text className={`text-[12px] font-lexendMedium ${editedExpense.paymentMethod === method ? 'text-[#00343F]' : 'text-[#A0A0A0]'}`}>
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </DetailRow>

        {/* Extra Cost Row */}
        {editedExpense.items && editedExpense.items.length > 0 && (
          <DetailRow 
            icon={Cost} 
            label="Did you incur any extra cost?"
            value=""
          >
            <View className="flex-col w-full mt-1">
              {editedExpense.items.map((item, idx) => (
                <View key={idx} className="flex-row items-center gap-2 mb-2">
                  <View className="flex-1 bg-white h-[44px] justify-center px-4 rounded-[4px] shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]">
                    <Text className="text-[#00343F] font-lexendBold text-[12px]">{item.name}</Text>
                  </View>
                  <View className="bg-white h-[44px] min-w-[100px] justify-center items-center rounded-[4px] shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]">
                    <Text className="text-[#00343F] font-lexendBold text-[12px]">{currencySymbol} {item.price.toLocaleString()}</Text>
                  </View>
                  <View className="w-12 bg-white h-[44px] justify-center items-center rounded-[4px] shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]">
                    <Text className="text-[#00343F] font-lexendBold text-[12px]">{item.qty}</Text>
                  </View>
                  {isEditing && (
                    <TouchableOpacity className="ml-1">
                      <Ionicons name="close-circle-outline" size={20} color="#EE6969" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <View className="items-end mt-1">
                <Text className="text-[#00AEB5] font-lexendRegular text-[12px] ">
                  Total sum : {currencySymbol} {extraCostsTotal.toLocaleString()}
                </Text>
              </View>
            </View>
          </DetailRow>
        )}

        {/* Notes Row */}
        <DetailRow 
          icon={Notes} 
          label="Notes/Description"
          value={editedExpense.notes || "--"}
          valueClassName={`text-[13px] text-[#586A6B] ${isEditing ? 'bg-[#F9F9F9] p-3 rounded-lg border border-gray-100 mt-2' : 'border-b border-[#DEDEDE] pb-2'}`}
          isEditable
          multiline
          onValueChange={(val: string) => updateField("notes", val)}
        />

        {isEditing && (
          <TouchableOpacity 
            onPress={() => setIsEditing(false)}
            className="mt-8 mb-4 border border-[#29D7DE] py-4 rounded-full items-center"
          >
            <Text className="text-[#00343F] font-lexendBold text-[16px]">Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      <DatePickerSheet
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onSelect={handleDateSelect}
        initialDate={new Date(editedExpense.date)}
      />
    </BottomSheet>
  );
}
