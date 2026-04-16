import CameraPlusIcon from "@/assets/icons/cameraplus.svg";
import { ExpenseCategory, ExpenseItem } from "@/types/expense";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { format } from "date-fns";
import { BlurView } from "expo-blur";
import BottomSheet from "../shared/BottomSheet";
import ScanIcon from "@/assets/icons/scan.svg";

import BearingsIcon from "@/assets/parts/bearings.svg";
import BeltsIcon from "@/assets/parts/belts.svg";
import BodyIcon from "@/assets/parts/body.svg";
import CarPartsIcon from "@/assets/parts/carParts-5.svg";
import DampingIcon from "@/assets/parts/damping.svg";
import CoolingIcon from "@/assets/parts/engineCoolingSystem.svg";
import FilterIcon from "@/assets/parts/filter.svg";
import FuelIcon from "@/assets/parts/fuel.svg";
import GasketIcon from "@/assets/parts/gasket.svg";
import OilIcon from "@/assets/parts/oil.svg";
import SensorsIcon from "@/assets/parts/sensors.svg";
import SteeringIcon from "@/assets/parts/steering.svg";
import SuspensionIcon from "@/assets/parts/suspension.svg";
import TowbarParts1Icon from "@/assets/parts/towbarParts-1.svg";
import TowbarPartsIcon from "@/assets/parts/towbarParts.svg";
import TransmissionIcon from "@/assets/parts/transmission.svg";
import TyresIcon from "@/assets/parts/tyres.svg";
import WiperIcon from "@/assets/parts/wiper.svg";

import { CategoryIcon } from "./ExpenseCategorySheet";

// Icons

// Dynamic Icons (Fallback mapping)

import {
  useLogExpense,
  useScanReceipt,
  useUploadReceipts,
} from "@/hooks/useExpenses";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserCars } from "@/hooks/useCars";
import { useActivitySpends } from "@/hooks/useActivity";
import { Technician } from "@/types/technician";
import { getCurrencySymbol } from "@/utils/currency";
import DatePickerSheet from "./DatePickerSheet";
import TechnicianSheet from "./TechnicianSheet";
import AddTechnicianSheet from "./AddTechnicianSheet";
import PriceRuler from "./PriceRuler";
import ItemSelectionSheet from "./ItemSelectionSheet";

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

  const { data: carsData } = useUserCars();
  const selectedCar = carsData?.cars?.find(
    (c: any) => (c.id || c._id) === selectedCarId,
  );

  const { mutate: logExpense, isPending } = useLogExpense();
  const { mutate: scanReceipt, isPending: isScanning } = useScanReceipt();
  const { mutate: uploadReceipts, isPending: isUploading } =
    useUploadReceipts();

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

  const currentMonth = date
    ? (date.getMonth() + 1).toString()
    : (new Date().getMonth() + 1).toString();
  const currentYear = date
    ? date.getFullYear().toString()
    : new Date().getFullYear().toString();

  const { data: spendData } = useActivitySpends(
    selectedCarId || "",
    currentMonth,
    currentYear,
  );
  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);
  const [extractedTechnicianName, setExtractedTechnicianName] = useState("");
  const [extractedTechnicianSpecialty, setExtractedTechnicianSpecialty] =
    useState("");
  const [partsCost, setPartsCost] = useState<number | null>(null);
  const [laborCost, setLaborCost] = useState<number | null>(null);
  const [originalAmount, setOriginalAmount] = useState<number | null>(null);
  const [originalCurrency, setOriginalCurrency] = useState<string | null>(null);
  const [receipts, setReceipts] = useState<string[]>([]);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTechnicianSheetVisible, setIsTechnicianSheetVisible] =
    useState(false);
  const [isAddTechnicianSheetVisible, setIsAddTechnicianSheetVisible] =
    useState(false);
  const [isItemSheetVisible, setIsItemSheetVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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
      setExtractedTechnicianName("");
      setExtractedTechnicianSpecialty("");
      setPartsCost(null);
      setLaborCost(null);
      setOriginalAmount(null);
      setOriginalCurrency(null);

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

  // Use car's monthly budget as primary, fallback to category recommendation
  const totalBudget = selectedCar?.monthlyBudget || budgetRecommended;
  const spentSoFar = spendData?.totalSpend || 0;
  const currentAmount = parseFloat(amount) || 0;

  // Budget left = Total Budget - (Already Spent + Current Input)
  const budgetLeft = totalBudget - (spentSoFar + currentAmount);
  const isOverBudget = budgetLeft < 0;

  const isAccessories = category.name === "Accessories & Parts";

  const handleAddExtraCost = () => {
    setActiveIndex(extraCosts.length);
    setExtraCosts([...extraCosts, { name: "", price: 0, qty: 0 }]);
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

  const triggerScan = () => {
    showImageSourceOptions(async (source) => {
      const asset = await pickImage(source);
      if (asset) {
        scanReceipt(asset, {
          onSuccess: (data) => {
            if (data.name) setName(data.name);
            if (data.amount) setAmount(data.amount.toString());
            if (data.date) setDate(new Date(data.date));
            if (data.notes) setNotes(data.notes);
            if (data.technicianName)
              setExtractedTechnicianName(data.technicianName);
            if (data.technicianSpecialty)
              setExtractedTechnicianSpecialty(data.technicianSpecialty);
            if (data.partsCost) {
              setPartsCost(data.partsCost);
              setExtraCosts((prev) => [
                ...prev,
                { name: "Parts", price: data.partsCost!, qty: 1 },
              ]);
            }
            if (data.laborCost) {
              setLaborCost(data.laborCost);
              setExtraCosts((prev) => [
                ...prev,
                { name: "Labor", price: data.laborCost!, qty: 1 },
              ]);
            }
            if (data.originalAmount) setOriginalAmount(data.originalAmount);
            if (data.originalCurrency)
              setOriginalCurrency(data.originalCurrency);
            if (data.receiptUrl) {
              setReceipts((prev) => [...prev, data.receiptUrl!]);
            }
          },
          onError: (err: any) => {
            console.error("Failed to scan receipt:", err);
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Failed to process the receipt.";
            Alert.alert("Error", errorMessage);
          },
        });
      }
    });
  };

  const triggerUpload = () => {
    showImageSourceOptions(async (source) => {
      const asset = await pickImage(source);
      if (asset) {
        uploadReceipts([asset], {
          onSuccess: (data) => {
            if (data.urls && data.urls.length > 0) {
              setReceipts((prev) => [...prev, ...data.urls]);
            }
          },
          onError: (err: any) => {
            console.error("Failed to upload receipt:", err);
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Failed to upload the receipt.";
            Alert.alert("Error", errorMessage);
          },
        });
      }
    });
  };

  const removeReceipt = (index: number) => {
    setReceipts((prev) => prev.filter((_, i) => i !== index));
  };

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
      metadata: {
        ...dynamicFields,
        partsCost,
        laborCost,
      },
      receipts,
      technicianName: selectedTechnician ? undefined : extractedTechnicianName,
      technicianSpecialty: selectedTechnician
        ? undefined
        : extractedTechnicianSpecialty,
    };

    if (selectedTechnician) {
      payload.technicianId = selectedTechnician.id || selectedTechnician._id;
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
          Recommeded{" "}
          <Text className="font-lexendBold text-[#29D7DE] text-[13px]">
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
      <TouchableOpacity
        onPress={triggerScan}
        disabled={isScanning}
        className="w-12 h-12 rounded-full bg-white border border-[#E0E0E0] items-center justify-center"
      >
        {isScanning ? (
          <ActivityIndicator size="small" color="#29D7DE" />
        ) : (
          <ScanIcon width={24} />
        )}
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
      height="90%"
    >
      <View className="flex-1 pb-10">
        {isScanning && (
          <BlurView
            intensity={20}
            tint="light"
            className="absolute inset-0 z-50 items-center justify-center bg-white/30"
          >
            <View className="bg-white p-6 rounded-2xl shadow-xl items-center gap-4">
              <ActivityIndicator size="large" color="#29D7DE" />
              <Text className="text-[#00343F] font-lexendMedium text-[14px]">
                Scanning receipt...
              </Text>
            </View>
          </BlurView>
        )}
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
              {currencySymbol} {totalBudget.toLocaleString()}
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
            <View className="flex-row items-center justify-center gap-2 mb-2">
              <Text className="text-[#00343F] font-lexendBold text-[32px]">
                {currencySymbol}
              </Text>
              <TextInput
                className="text-[#00343F] font-lexendBold text-center text-[32px]"
                placeholder="0"
                placeholderTextColor="#B4B1B1"
                keyboardType="numeric"
                value={amount}
                onChangeText={(val) => {
                  // Ensure only numbers and a single decimal point
                  const numericValue = val.replace(/[^0-9.]/g, "");
                  setAmount(numericValue);
                }}
              />
            </View>

            {originalAmount && originalCurrency && (
              <Text className="text-[#8B8B8B] text-[10px] font-lexendRegular text-center -mt-1 mb-2">
                Converted from {originalCurrency}{" "}
                {originalAmount.toLocaleString()}
              </Text>
            )}

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
            onPress={triggerUpload}
            rightElement={
              <View className="flex-row items-center gap-2">
                <View>
                  <View className="flex-row gap-2">
                    {receipts.map((uri, index) => (
                      <View key={`${uri}-${index}`} className="relative">
                        <View className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                          <Image source={{ uri }} className="w-full h-full" />
                        </View>
                        <TouchableOpacity
                          onPress={() => removeReceipt(index)}
                          className="absolute -top-1 -right-1 bg-white rounded-full shadow-sm z-10"
                        >
                          <Ionicons
                            name="close-circle"
                            size={18}
                            color="#EE6969"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}

                    {isUploading ? (
                      <View className="w-12 h-12 bg-[#F5F5F5] rounded-lg items-center justify-center">
                        <ActivityIndicator size="small" color="#29D7DE" />
                      </View>
                    ) : receipts.length < 5 ? (
                      <TouchableOpacity
                        onPress={triggerUpload}
                        className="w-12 h-12 bg-[#F5F5F5] rounded-lg items-center justify-center border border-dashed border-[#D0D0D0]"
                      >
                        <CameraPlusIcon width={20} height={20} />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#C1C3C3"
                  className="ml-2"
                />
              </View>
            }
          />
        </View>

        {/* Dynamic Fields */}
        {category.fields?.map((field) => {
          if (field.name === "technicianId") return null;

          return (
            <View
              key={field._id || field.name}
              className="bg-white px-4 mb-1 rounded-none py-2"
            >
              <FieldRow
                noBorder
                label={field.label}
                icon={
                  field.name.toLowerCase().includes("station")
                    ? TagIcon
                    : TagIcon
                } // Simple logic for icons, can be improved
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
                  ) : extractedTechnicianName ? (
                    <View className="items-end">
                      <Text className="text-[#00AEB5] font-lexendBold text-[14px]">
                        {extractedTechnicianName}
                      </Text>
                      <Text className="text-[#8B8B8B] text-[10px] font-lexendRegular">
                        New entry from scan
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
                  paymentMethod === method ? "bg-[#00AEB5] " : "bg-[#F5F5F5]"
                }`}
              >
                <Text
                  className={`text-[12px] font-lexendMedium ${
                    paymentMethod === method
                      ? "text-[#FFFFFF]"
                      : "text-[#A0A0A0]"
                  }`}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Card 5: Extra Costs / Cost of Item */}
        <View className="bg-white px-4 mb-1 rounded-none py-4">
          <FieldRow
            label={
              isAccessories ? "Cost of Item" : "Did you incur any extra cost?"
            }
            icon={CostIcon}
            noBorder
            rightElement={
              <TouchableOpacity onPress={handleAddExtraCost}>
                <Ionicons name="add" size={24} color="#C1C3C3" />
              </TouchableOpacity>
            }
          />

          <View className="ml-8 ">
            {isAccessories ? (
              /* Accessories Mode: Chips + Price/Qty inputs for selected item */
              <View>
                <View className="flex-row items-center mb-4 ">
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-grow-0 "
                  >
                    <View
                      className={`flex-row gap-2 pr-2 ${extraCosts.length > 0 ? "border p-1 rounded-full border-[#E6E6E6]" : ""}`}
                    >
                      {extraCosts.map((item, index) => {
                        const PART_ICONS: Record<string, any> = {
                          Towbar: TowbarPartsIcon,
                          Bearings: BearingsIcon,
                          "Car Accessories": CarPartsIcon,
                          Suspension: SuspensionIcon,
                          "Oils & Fluids": OilIcon,
                          "Gasket & Sealing Rings": GasketIcon,
                          "Tow Parts": TowbarParts1Icon,
                          Wiper: WiperIcon,
                          Body: BodyIcon,
                          Tyres: TyresIcon,
                          Steering: SteeringIcon,
                          Filters: FilterIcon,
                          Gasket: GasketIcon,
                          "Fuel Supply": FuelIcon,
                          Damping: DampingIcon,
                          Sensors: SensorsIcon,
                          "Belts/Chains/Rollers": BeltsIcon,
                          Transmission: TransmissionIcon,
                          "Cooling System": CoolingIcon,
                        };
                        const PartIcon = PART_ICONS[item.name] || TagIcon;
                        const isSelected = activeIndex === index;

                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => setActiveIndex(index)}
                            className={`flex-row items-center gap-2 px-3 py-2 rounded-full ${
                              isSelected
                                ? "bg-[#ECECEC]"
                                : "bg-white border border-[#EFEFEF]"
                            }`}
                          >
                            <PartIcon width={16} height={16} color="#00343F" />
                            <Text className="text-[#4B4B4B] text-[12px] font-lexendRegular">
                              {item.name || "Item"}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>

                  <TouchableOpacity
                    onPress={() => setIsItemSheetVisible(true)}
                    className="w-10 h-10 rounded-full bg-[#F0F0F0] items-center justify-center border border-[#E0E0E0] ml-2"
                  >
                    <Ionicons name="grid-outline" size={18} color="#00343F" />
                  </TouchableOpacity>
                </View>

                {extraCosts.length > 0 && activeIndex < extraCosts.length && (
                  <View className="flex-row gap-3 items-center mb-3">
                    <View className="flex-1 border-b border-[#F0F0F0]  px-3 py-3">
                      <TextInput
                        className="text-[#00343F] font-lexendRegular text-[14px]"
                        placeholder="Price"
                        placeholderTextColor="#B4B1B1"
                        keyboardType="numeric"
                        value={
                          extraCosts[activeIndex].price > 0
                            ? extraCosts[activeIndex].price.toString()
                            : ""
                        }
                        onChangeText={(val) =>
                          updateExtraCost(
                            activeIndex,
                            "price",
                            parseFloat(val) || 0,
                          )
                        }
                      />
                    </View>
                    <View className="w-24 border-b border-[#F0F0F0]  px-3 py-3">
                      <TextInput
                        className="text-[#00343F] font-lexendRegular text-[14px] text-center"
                        placeholder="Qty"
                        placeholderTextColor="#B4B1B1"
                        keyboardType="numeric"
                        value={
                          extraCosts[activeIndex].qty > 0
                            ? extraCosts[activeIndex].qty.toString()
                            : ""
                        }
                        onChangeText={(val) =>
                          updateExtraCost(
                            activeIndex,
                            "qty",
                            parseInt(val) || 0,
                          )
                        }
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => removeExtraCost(activeIndex)}
                    >
                      <Ionicons
                        name="close"
                        size={24}
                        color="#EE6969"
                        opacity={0.6}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              /* Generic Mode: 3-column rows */
              extraCosts.map((item, index) => (
                <View key={index} className="flex-row gap-2 mb-3 items-center">
                  <View className="flex-[2] bg-white border-b border-[#F0F0F0] px-3 py-3">
                    <TextInput
                      className="text-[#00343F] font-lexendRegular text-[12px]"
                      placeholder="Item"
                      placeholderTextColor="#B4B1B1"
                      value={item.name}
                      onChangeText={(val) =>
                        updateExtraCost(index, "name", val)
                      }
                    />
                  </View>
                  <View className="flex-1 bg-white border-b border-[#F0F0F0] px-3 py-3">
                    <TextInput
                      className="text-[#00343F] font-lexendRegular text-[12px]"
                      placeholder="Price"
                      placeholderTextColor="#B4B1B1"
                      keyboardType="numeric"
                      value={item.price > 0 ? item.price.toString() : ""}
                      onChangeText={(val) =>
                        updateExtraCost(index, "price", parseFloat(val) || 0)
                      }
                    />
                  </View>
                  <View className="w-16  border-b border-[#F0F0F0] px-2 py-3">
                    <TextInput
                      className="text-[#00343F] font-lexendRegular text-[12px] text-center"
                      placeholder="Qty"
                      placeholderTextColor="#B4B1B1"
                      keyboardType="numeric"
                      value={item.qty > 0 ? item.qty.toString() : ""}
                      onChangeText={(val) =>
                        updateExtraCost(index, "qty", parseInt(val) || 0)
                      }
                    />
                  </View>
                  <TouchableOpacity onPress={() => removeExtraCost(index)}>
                    <Ionicons
                      name="close"
                      size={24}
                      color="#EE6969"
                      opacity={0.6}
                    />
                  </TouchableOpacity>
                </View>
              ))
            )}

            {extraCosts.length > 0 && (
              <View className="flex-row justify-end mx-5 mt-2">
                <Text className="text-[#00AEB5] font-lexendRegular text-[12px]">
                  Total sum : {currencySymbol} {totalExtraSum.toLocaleString()}
                </Text>
              </View>
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
        initialDate={date || undefined}
        maxDate={new Date()}
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

      <ItemSelectionSheet
        visible={isItemSheetVisible}
        onClose={() => setIsItemSheetVisible(false)}
        onSelect={(itemLabel) => {
          const newItem = { name: itemLabel, price: 0, qty: 0 };
          setExtraCosts([...extraCosts, newItem]);
          setActiveIndex(extraCosts.length);
        }}
      />
    </BottomSheet>
  );
}
