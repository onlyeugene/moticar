import CameraPlusIcon from "@/assets/icons/cameraplus.svg";
import { ExpenseCategory, ExpenseItem } from "@/types/expense";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { format } from "date-fns";
import BottomSheet from "../shared/BottomSheet";
import ScanIcon from '@/assets/icons/scan.svg'

// Icons

// Dynamic Icons (Fallback mapping)

import { useLogExpense } from "@/hooks/useExpenses";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Technician } from "@/types/technician";
import { getCurrencySymbol } from "@/utils/currency";
import DatePickerSheet from "./DatePickerSheet";
import TechnicianSheet from "./TechnicianSheet";
import AddTechnicianSheet from "./AddTechnicianSheet";
import PriceRuler from "./PriceRuler";

import { CategoryIcon } from "./ExpenseCategorySheet";

// Icons
import TagIcon from "@/assets/new/tag.svg";
import PriceIcon from "@/assets/new/price.svg";
import CalendarIcon from "@/assets/icons/calendar.svg";
import PhotoIcon from "@/assets/new/image.svg";
import WalletIcon from "@/assets/new/wallet.svg";
import NotesIcon from "@/assets/new/notes.svg";
import TechnicianIcon from "@/assets/new/technician.svg";
import CostIcon from "@/assets/new/cost.svg";

interface LogExpenseSheetProps {
  visible: boolean;
  onClose: () => void;
  category: ExpenseCategory | null;
  onSuccess?: () => void;
}

interface FieldRowProps {
  label?: string;
  icon?: React.FC<any>;
  children?: React.ReactNode;
  noBorder?: boolean;
  rightElement?: React.ReactNode;
  onPress?: () => void;
}

const FieldRow = ({
  label,
  icon: Icon,
  children,
  noBorder = false,
  rightElement,
  onPress,
}: FieldRowProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={0.7}
    className={`py-4 ${noBorder ? "" : "border-b border-[#F0F0F0]"}`}
  >
    <View className="flex-row items-center gap-2 mb-1">
      {Icon && (
        <View className="w-6 h-6 items-center justify-center">
          <Icon width={20} height={20} />
        </View>
      )}
      <View className="flex-1 flex-row justify-between items-center">
        {label && (
          <Text className="text-[#8B8B8B] text-[12px] font-lexendRegular">
            {label}
          </Text>
        )}
        {rightElement}
      </View>
    </View>
    {children && <View>{children}</View>}
  </TouchableOpacity>
);

export default function LogExpenseSheet({
  visible,
  onClose,
  category,
  onSuccess,
}: LogExpenseSheetProps) {
  const user = useAuthStore((state) => state.user);
  const { selectedCarId } = useAppStore();
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);

  const { mutate: logExpense, isPending } = useLogExpense();

  // Form State
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "Cash" | "Bank Transfer" | "Debit Card" | null
  >(null);
  const [notes, setNotes] = useState("");
  const [extraCosts, setExtraCosts] = useState<ExpenseItem[]>([]);
  const [dynamicFields, setDynamicFields] = useState<Record<string, string>>(
    {},
  );
  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);
  const [receipts, setReceipts] = useState<string[]>([]);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTechnicianSheetVisible, setIsTechnicianSheetVisible] =
    useState(false);
  const [isAddTechnicianSheetVisible, setIsAddTechnicianSheetVisible] =
    useState(false);

  useEffect(() => {
    if (visible && category) {
      const budgetRecommendedValue =
        category.budgetRecommended || category.recommendedBudget || 0;

      setName("");
      setAmount(
        budgetRecommendedValue > 0 ? budgetRecommendedValue.toString() : "",
      );
      setDate(null);
      setPaymentMethod(null);
      setNotes("");
      setExtraCosts([]);
      setDynamicFields({});

      // Auto-populate technician
      const techField = category.fields?.find((f) => f.name === "technicianId");
      if (category.lastTechnicianId) {
        const lastTechOption = techField?.options?.find(
          (opt) =>
            typeof opt === "object" && opt.value === category.lastTechnicianId,
        );

        if (typeof lastTechOption === "object") {
          setSelectedTechnician({
            _id: lastTechOption.value,
            id: lastTechOption.value,
            name: lastTechOption.label,
            specialty: "",
            phone: "",
          } as Technician);
        } else {
          setSelectedTechnician(null);
        }
      } else if (
        techField &&
        techField.options &&
        techField.options.length === 1
      ) {
        const onlyTech = techField.options[0];
        if (typeof onlyTech === "object" && "value" in onlyTech) {
          setSelectedTechnician({
            _id: onlyTech.value,
            id: onlyTech.value,
            name: onlyTech.label,
            specialty: "",
            phone: "",
          } as Technician);
        } else {
          setSelectedTechnician(null);
        }
      } else {
        setSelectedTechnician(null);
      }

      setReceipts([]);
    }
  }, [visible, category]);

  if (!category) return null;

  const budgetRecommended =
    category.budgetRecommended || category.recommendedBudget || 0;
  const spent = category.totalSpentThisMonth || 0;
  const budgetLeft = budgetRecommended - spent;
  const isOverBudget = budgetLeft < 0;

  const handleAddExtraCost = () => {
    setExtraCosts([...extraCosts, { name: "", price: 0, qty: 1 }]);
  };

  const updateExtraCost = (
    index: number,
    field: keyof ExpenseItem,
    value: any,
  ) => {
    const newCosts = [...extraCosts];
    newCosts[index] = { ...newCosts[index], [field]: value };
    setExtraCosts(newCosts);
  };

  const removeExtraCost = (index: number) => {
    setExtraCosts(extraCosts.filter((_, i) => i !== index));
  };

  const totalExtraSum = extraCosts.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0,
  );

  const handleSave = () => {
    if (!selectedCarId || !name || !amount || !paymentMethod || !date) {
      // Basic validation
      console.warn("Missing required fields");
      return;
    }

    const payload: any = {
      carId: selectedCarId,
      category: category.name,
      name,
      amount: parseFloat(amount),
      date: date.toISOString(),
      paymentMethod,
      notes,
      items: extraCosts.filter((item) => item.name && item.price),
      metadata: { ...dynamicFields },
      receiptUrl: receipts[0],
    };

    if (selectedTechnician) {
      payload.technicianId = selectedTechnician.id;
    }

    logExpense(payload, {
      onSuccess: () => {
        onSuccess?.();
        onClose();
      },
      onError: (err) => {
        console.error("Failed to log expense:", err);
      },
    });
  };

  const title = (
    <View className="flex-row items-center gap-3">
      <View className="w-10 h-10 rounded-full bg-[#FBE74C] items-center justify-center">
        <CategoryIcon name={category.name} size={20} />
      </View>
      <View>
        <Text className="text-[#00343F] text-[18px] font-lexendBold">
          {category.name}
        </Text>
        <Text className="text-[#8B8B8B] text-[12px] font-lexendRegular">
         Recommeded  <Text className="font-lexendBold text-[#29D7DE] text-[13px]">
          {currencySymbol} {budgetRecommended.toLocaleString()}
         </Text>
        </Text>
      </View>
    </View>
  );

  const headerLeft = (
    <TouchableOpacity onPress={onClose} className="p-2">
      <Ionicons name="close" size={24} color="#586A6B" />
    </TouchableOpacity>
  );

  const isFormValid = !!name && !!amount && !!paymentMethod && !!date;

  const headerRight = (
    <View className="flex-row items-center gap-2">
      <TouchableOpacity className="w-12 h-12 rounded-full bg-white border border-[#E0E0E0] items-center justify-center">
        <ScanIcon width={24}/>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSave}
        disabled={isPending || !isFormValid}
        className={`bg-[#29D7DE] px-6 py-2 rounded-full ${isPending || !isFormValid ? "opacity-30" : ""}`}
      >
        {isPending ? (
          <ActivityIndicator size="small" color="#00343F" />
        ) : (
          <Text className="text-[#00343F] font-lexendBold text-[14px]">
            Save
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={title as any}
      headerRight={headerRight}
      backgroundColor="#F0F0F0"
    >
      <View className="flex-1 pb-10">
        {/* Budget Left Banner */}
        <View
          className="px-4 py-2 flex-row justify-center items-center rounded-t-[8px]"
          style={{ backgroundColor: isOverBudget ? "#FFDCAC" : "#E3FFAC" }}
        >
          <Text className={`text-[#8B8B8B] text-[12px] font-lexendRegular`}>
            Budget Left
          </Text>
          <Text
            className={`${isOverBudget ? "text-[#C7755C]" : "text-[#5CC785]"} text-[14px] font-lexendBold ml-2`}
          >
            {isOverBudget ? "-" : ""} {currencySymbol}{" "}
            {Math.abs(budgetLeft).toLocaleString()} of{" "}
            <Text className="text-[#C5BF8A] line-through">
              {currencySymbol} {budgetRecommended.toLocaleString()}
            </Text>
          </Text>
        </View>

        {/* Card 1: Core Details */}
        <View className="bg-white px-4 mb-1 rounded-none pt-7">
          {/* Expense Name */}
          <View className="mt-2 flex-row gap-3">
            <TagIcon />
            <View className="flex-1">
              <TextInput
                className="text-[#00343F] font-lexendBold text-[12px] pb-4 px-4 border-b border-[#F0F0F0]"
                placeholder="Give your expense a name"
                placeholderTextColor="#B4B1B1"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Amount Section */}
          <View className="py-4 border-[#F0F0F0]">
            <Text className="text-[#9BBABB] text-[12px] font-lexendRegular text-center mb-2">
              Enter amount
            </Text>
            <TextInput
              className="text-[#00343F] font-lexendBold text-center text-[32px] mb-2"
              placeholder={`${currencySymbol} 0`}
              placeholderTextColor="#B4B1B1"
              keyboardType="numeric"
              value={amount}
              onChangeText={(val) => {
                // Ensure only numbers and a single decimal point
                const numericValue = val.replace(/[^0-9.]/g, "");
                setAmount(numericValue);
              }}
            />

            {/* Price Ruler Section */}
            <View className="h-24">
              <PriceRuler
                value={parseFloat(amount) || 0}
                onValueChange={(val) => setAmount(val.toString())}
              />
            </View>

            {category.lastSimilarExpense ? (
              <Text className="text-[#81B4B4] text-[12px] font-lexendRegular text-center mb-4">
                Last similar expense: {currencySymbol}{" "}
                {category.lastSimilarExpense.amount.toLocaleString()} on{" "}
                {format(new Date(category.lastSimilarExpense.date), "d MMMM")}
              </Text>
            ) : (
              <Text className="text-[#81B4B4] text-[12px] font-lexendRegular text-center mb-4">
                No previous similar expenses recorded
              </Text>
            )}

            {/* Recommendation Box */}
            <View className="bg-[#FFFBE6] p-4 rounded-xl mb-4">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-[#00AEB5] font-lexendMedium text-[12px]">
                  Recommendation
                </Text>
                <Text className="text-[#00AEB5] font-lexendBold text-[14px]">
                  {currencySymbol} {budgetRecommended.toLocaleString()}
                </Text>
              </View>
              <Text className="text-[#9BBABB] text-[10px] font-lexendRegular leading-4">
                From similar car riders who own your kind of vehicle. This might
                vary from yours based on usage.
              </Text>
            </View>
          </View>

          {/* Date Field */}
          <FieldRow
          noBorder
            label="Date"
            icon={CalendarIcon}
            onPress={() => setIsDatePickerVisible(true)}
            rightElement={
              <View className="flex-row items-center gap-2">
                <Text
                  className={`font-lexendMedium text-[14px] ${date ? "text-[#00343F]" : "text-[#B4B1B1]"}`}
                >
                  {date
                    ? date.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Select date of event"}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#C1C3C3" />
              </View>
            }
          />
        </View>

  
        {/* Card 2: Receipt Upload */}
        <View className="bg-white px-4 mb-1 rounded-none py-2">
          <FieldRow
          noBorder
            label="Upload any image proof or receipt"
            icon={PhotoIcon}
            onPress={() => console.log("Upload receipt")}
            rightElement={
              <View className="flex-row items-center gap-2">
               {receipts.length > 0 ? (
                <View className="flex-row justify-between items-center h-[50px]">
                  <View className="flex-row gap-2">
                    {receipts.slice(0, 4).map((uri, i) => (
                      <View
                        key={i}
                        className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden"
                      >
                        <Image source={{ uri }} className="w-full h-full" />
                      </View>
                    ))}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#C1C3C3" />
                </View>
              ) : (
                <View className="flex-row items-center gap-2">
                  <View className="w-20 h-20 bg-[#F5F5F5] rounded-xl items-center justify-center">
                    <View className="bg-white w-[60px] h-[60px] rounded-xl border border-dashed border-[#D0D0D0] items-center justify-center">
                     <CameraPlusIcon />
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#C1C3C3" />
                </View>
              )}
              </View>
            }
          />
        </View>

        {/* Dynamic Fields */}
        {category.fields?.map((field) => {
          if (field.name === "technicianId") return null;

          return (
            <View key={field._id || field.name} className="bg-white px-4 mb-1 rounded-none py-2">
              <FieldRow
                noBorder
                label={field.label}
                icon={field.name.toLowerCase().includes("station") ? TagIcon : TagIcon} // Simple logic for icons, can be improved
              >
                <TextInput
                  className="text-[#00343F] font-lexendRegular text-[14px] pb-2 border-b border-[#F0F0F0]"
                  placeholder={`Enter ${field.label}`}
                  placeholderTextColor="#A0A0A0"
                  value={dynamicFields[field.name] || ""}
                  onChangeText={(val) =>
                    setDynamicFields({ ...dynamicFields, [field.name]: val })
                  }
                />
              </FieldRow>
            </View>
          );
        })}

        {/* Card 3: Technician (Conditional) */}
        {category.fields?.some((f) => f.name === "technicianId") && (
          <View className="bg-white px-4 mb-1 rounded-none py-2">
            <FieldRow
              noBorder
              label="Technician"
              icon={TechnicianIcon}
              onPress={() => setIsTechnicianSheetVisible(true)}
              rightElement={
                <View className="flex-row items-center gap-2">
                  {selectedTechnician ? (
                    <View className="items-end">
                      <Text className="text-[#00343F] font-lexendBold text-[14px]">
                        {selectedTechnician.name}
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-[#B4B1B1] font-lexendRegular text-[14px]">
                      Select
                    </Text>
                  )}
                  <Ionicons name="chevron-forward" size={18} color="#C1C3C3" />
                </View>
              }
            />
          </View>
        )}

        {/* Card 4: Method of Payment */}
        <View className="bg-white px-4 mb-1 rounded-none py-4">
          <FieldRow label="Method of Payment" icon={WalletIcon} noBorder />
          <View className="flex-row gap-2 mt-2 ml-8">
            {["Cash", "Bank Transfer", "Debit Card"].map((method) => (
              <TouchableOpacity
                key={method}
                onPress={() => setPaymentMethod(method as any)}
                className={`flex-1 h-[45px] items-center justify-center rounded-xl transition-all ${
                  paymentMethod === method
                    ? "bg-[#E6F7F7] border border-[#00AEB5]"
                    : "bg-[#F5F5F5]"
                }`}
              >
                <Text
                  className={`text-[12px] font-lexendMedium ${
                    paymentMethod === method
                      ? "text-[#00AEB5]"
                      : "text-[#A0A0A0]"
                  }`}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Card 5: Extra Costs */}
        <View className="bg-white px-4 mb-1 rounded-none py-4">
          <FieldRow
            label="Did you incur any extra cost?"
            icon={CostIcon}
            noBorder
            rightElement={
              <TouchableOpacity onPress={handleAddExtraCost}>
                <Ionicons name="add" size={24} color="#C1C3C3" />
              </TouchableOpacity>
            }
          />

          {extraCosts.length > 0 && (
            <View className="flex-row gap-2 mb-2 px-1 ml-8">
              <Text className="flex-[2] text-[#B4B1B1] text-[10px] font-lexendRegular">
                Item
              </Text>
              <Text className="flex-1 text-[#B4B1B1] text-[10px] font-lexendRegular">
                Price
              </Text>
              <View className="w-14 items-center">
                <Text className="text-[#B4B1B1] text-[10px] font-lexendRegular">
                  Qty
                </Text>
              </View>
              <View className="w-6" />
            </View>
          )}

          <View className="ml-8">
            {extraCosts.map((item, index) => (
              <View key={index} className="flex-row gap-2 mb-3 items-center">
                <TextInput
                  className="flex-[2] bg-[#F9F9F9] border border-[#F0F0F0] rounded-lg p-3 text-[12px] font-lexendRegular"
                  placeholder="Item"
                  value={item.name}
                  onChangeText={(val) => updateExtraCost(index, "name", val)}
                />
                <TextInput
                  className="flex-1 bg-[#F9F9F9] border border-[#F0F0F0] rounded-lg p-3 text-[12px] font-lexendRegular"
                  placeholder="Price"
                  keyboardType="numeric"
                  value={item.price.toString()}
                  onChangeText={(val) =>
                    updateExtraCost(index, "price", parseFloat(val) || 0)
                  }
                />
                <TextInput
                  className="w-14 bg-[#F9F9F9] border border-[#F0F0F0] rounded-lg p-3 text-[12px] font-lexendRegular text-center"
                  placeholder="Qty"
                  keyboardType="numeric"
                  value={item.qty?.toString() || ""}
                  onChangeText={(val) =>
                    updateExtraCost(index, "qty", parseInt(val) || 0)
                  }
                />
                <TouchableOpacity onPress={() => removeExtraCost(index)}>
                  <Ionicons
                    name="close-circle-outline"
                    size={24}
                    color="#EE6969"
                  />
                </TouchableOpacity>
              </View>
            ))}
            {extraCosts.length > 0 && (
              <Text className="text-right text-[#00AEB5] text-[12px] font-lexendMedium mt-1">
                Total: {currencySymbol} {totalExtraSum.toLocaleString()}
              </Text>
            )}
          </View>
        </View>

        {/* Card 6: Notes */}
        <View className="bg-white px-4 mb-1 rounded-none py-4">
          <FieldRow label="Notes/Description" icon={NotesIcon} noBorder />
          <TextInput
            className="text-[#00343F] font-lexendRegular text-[14px] pb-2 border-b border-[#F0F0F0] min-h-[60px]"
            placeholder="Write a brief note..."
            placeholderTextColor="#A0A0A0"
            multiline
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>
      </View>

      <DatePickerSheet
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        initialDate={date || new Date()}
        onSelect={(newDate) => setDate(newDate)}
      />

      <TechnicianSheet
        visible={isTechnicianSheetVisible}
        onClose={() => setIsTechnicianSheetVisible(false)}
        onSelect={(tech: Technician) => {
          setSelectedTechnician(tech);
          setIsTechnicianSheetVisible(false);
        }}
        onAdd={() => {
          setIsTechnicianSheetVisible(false);
          setIsAddTechnicianSheetVisible(true);
        }}
      />

      <AddTechnicianSheet
        visible={isAddTechnicianSheetVisible}
        onClose={() => setIsAddTechnicianSheetVisible(false)}
        onSuccess={() => {
          // Success logic if needed, e.g. toast or refetch
        }}
      />
    </BottomSheet>
  );
}
