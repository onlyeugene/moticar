import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { format, isToday, isYesterday } from "date-fns";
import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import PriceRuler from "../sheets/PriceRuler";
import Photo from "@/assets/icons/camera_icon.svg";
import Calendar from '@/assets/icons/calendar.svg'
import Award from '@/assets/icons/award.svg'
import Certificate from '@/assets/icons/certificate.svg'
import Speedometer from '@/assets/icons/speedo.svg'
import Building from '@/assets/icons/building.svg'

// ─── Section Card ─────────────────────────────────────────────────────────────

export function SectionCard({
  children,
  noPadding,
  backgroundColor,
  margin
}: {
  children: React.ReactNode;
  noPadding?: boolean;
  backgroundColor?: string;
  margin?: string;
}) {
  return (
    <View className={`${backgroundColor ? backgroundColor : 'bg-white'} px-5 ${noPadding ? "py-0" : "py-5"} ${margin ? margin : "mb-1"}`}>
      {children}
    </View>
  );
}

// ─── Icon Mapping ─────────────────────────────────────────────────────────────

function RenderIcon({ icon }: { icon?: string }) {
  if (!icon) return null;

  const iconName = icon.toLowerCase();
  if (iconName.includes("calendar")) return <Calendar width={24} height={24} />;
  if (iconName.includes("certificate") || iconName.includes("business"))
    return <Certificate width={24} height={24} />;
  if (iconName.includes("award") || iconName.includes("ribbon"))
    return <Award width={24} height={24} />;
  if (iconName.includes("speedo"))
    return <Speedometer width={24} height={24} />;
  if (iconName.includes("building"))
    return <Building width={24} height={24} />;
  if (
    iconName.includes("image") ||
    iconName.includes("camera") ||
    iconName.includes("photo")
  )
    return <Photo width={24} height={24} />;

  // Default fallback
  return <Certificate width={24} height={24} />;
}

// ─── Input Field ──────────────────────────────────────────────────────────────

export function FormInput({
  label,
  icon,
  value,
  onChange,
  placeholder,
  required = false,
  multiline = false,
  align,
  underline = false,
}: {
  label?: string;
  icon?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  align?: "start" | "end" | "center";
  underline?: boolean;
}) {
  return (
    <View className={`flex-row items-start py-4 border-[#F5F5F5]`}>
      {icon && (
        <View className="mr-3 mt-0.5">
          <RenderIcon icon={icon} />
        </View>
      )}
      <View
        className={`flex-1 ${align ? "flex-row items-center justify-between" : ""}`}
      >
        {label && (
          <Text
            className={`text-[#707676] font-lexendRegular text-[12px] ${align ? "" : "mb-1"}`}
          >
            {label} {required && <Text className="text-[#00AEB5]">*</Text>}
          </Text>
        )}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#C1C3C3"
          value={value}
          onChangeText={onChange}
          multiline={multiline}
          className={`text-[#202A2A] font-lexendMedium text-[14px] ${underline ? "border-b border-[#DEDEDE]" : ""} ${align === "end" ? "text-right" : ""} ${multiline ? "min-h-[40px] pt-1" : ""}`}
        />
      </View>
    </View>
  );
}

// ─── Pill Selector ────────────────────────────────────────────────────────────

export function PillSelector({
  label,
  options,
  selected,
  onSelect,
  required = false,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  required?: boolean;
}) {
  return (
    <View className="py-4">
      <Text className="text-[#8B8B8B] font-lexendRegular text-[12px] mb-3">
        {label} {required && <Text className="text-[#00AEB5]">*</Text>}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            className={`px-6 py-2.5 rounded-[8px] border items-center justify-center flex-1 ${
              selected === opt
                ? "bg-[#00AEB5] border-[#00AEB5]"
                : "border-[#E2E2E2]"
            }`}
          >
            <Text
              className={`font-lexendRegular text-[12px] ${
                selected === opt ? "text-white" : "text-[#495353]"
              }`}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Date Select Row ──────────────────────────────────────────────────────────

export function DateSelectRow({
  label,
  icon,
  date,
  onPress,
  required = false,
  showExpiryShortcut = false,
}: {
  label: string;
  icon?: string;
  date: Date | null;
  onPress: () => void;
  required?: boolean;
  showExpiryShortcut?: boolean;
}) {
  return (
    <View className="flex-row items-center py-2 border-[#F5F5F5]">
      <View className="mr-3">
        <Calendar width={24} height={24} />
      </View>
      <View className="flex-1">
        <Text className="text-[#8B8B8B] font-lexendRegular text-[12px]">
          {label} {required && <Text className="text-[#00AEB5] text-[12px]">*</Text>}
        </Text>
      </View>
      <TouchableOpacity onPress={onPress} className="flex-row items-center">
        {showExpiryShortcut && !date && (
          <View className="bg-[#F5F5F5] px-2 py-1 rounded-md mr-2">
            <Text className="text-[#8B8B8B] text-[12px]">+ 12</Text>
          </View>
        )}
        <Text
          className={`font-lexendRegular text-[14px] ${date ? "text-[#001A1F]" : "text-[#C1C3C3]"}`}
        >
          {date ? format(date, "d MMMM, yyyy") : "Select date"}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#ADADAD"
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>
    </View>
  );
}

// ─── Amount Block ─────────────────────────────────────────────────────────────

export function AmountBlock({
  label = "Cost",
  value,
  onChange,
  required = true,
}: {
  label?: string;
  value: number;
  onChange: (v: number) => void;
  required?: boolean;
}) {
  return (
    <View className="py-6 items-center">
      <Text className="text-[#8B8B8B] font-lexendRegular text-[12px] mb-1">
        {label} {required && <Text className="text-[#00AEB5]">*</Text>}
      </Text>
      <Text className="text-[#001A1F] font-lexendBold text-[34px] mb-4">
        ₦{value.toLocaleString()}
      </Text>
      <PriceRuler value={value} onValueChange={onChange} />
    </View>
  );
}

// ─── Document Upload ──────────────────────────────────────────────────────────

export function DocumentUpload({
  label,
  url,
  onPress,
  icon = "image-outline",
}: {
  label: string;
  url: string | null;
  onPress: () => void;
  icon?: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  // Safety timeout for loading state
  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 10000); // 10s timeout
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <View className="flex-row items-start gap-3  bg-white rounded-[12px]  border-[#F0F0F0]">
      <View className="">
        <Photo width={24} height={24} />
      </View>
      <Text className="flex-1 text-[#8B8B8B] font-lexendRegular text-[13px]">
        {label}
      </Text>
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center gap-4"
      >
        <View className=" bg-[#F0F0F0] p-1 rounded-[4px] overflow-hidden">
          <View className="w-[60px] h-[45px] bg-white p-1 border border-dashed border-[#C1C3C3] rounded-[4px] items-center justify-center">
            {url ? (
              <Image
                key={url}
                source={{ uri: String(url).trim() }}
                className="w-full h-full"
                resizeMode="cover"
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                onError={(e) => {
                  console.log(
                    "Image load error for URL:",
                    url,
                    e.nativeEvent.error,
                  );
                  setLoading(false);
                }}
              />
            ) : (
              <Ionicons name="add" size={20} color="#8B8B8B" />
            )}
          </View>
          {loading && (
            <View className="absolute inset-0 bg-white/70 items-center justify-center">
              <ActivityIndicator size="small" color="#00AEB5" />
            </View>
          )}
        </View>
        <Ionicons name="chevron-forward" size={24} color="#C1C3C3" />
      </TouchableOpacity>
    </View>
  );
}

// ─── Parts Replaced ───────────────────────────────────────────────────────────

export function PartsReplacedList({
  items,
  onAdd,
  onRemove,
  onChange,
}: {
  items: Array<{ id: string; item: string }>;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, text: string) => void;
}) {
  return (
    <View className="py-4">
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color="#8B8B8B"
            style={{ marginRight: 12 }}
          />
          <Text className="text-[#8B8B8B] font-lexendRegular text-[12px]">
            Parts replaced
          </Text>
        </View>
        <TouchableOpacity onPress={onAdd}>
          <Ionicons name="add" size={22} color="#8B8B8B" />
        </TouchableOpacity>
      </View>
      {items.map((item) => (
        <View key={item.id} className="flex-row items-center mb-2 ml-8 pl-1">
          <TextInput
            placeholder="Item"
            placeholderTextColor="#C1C3C3"
            value={item.item}
            onChangeText={(text) => onChange(item.id, text)}
            className="flex-1 bg-[#F5F5F5] px-3 py-2 rounded-md text-[#001A1F] font-lexendRegular text-[14px]"
          />
          <TouchableOpacity onPress={() => onRemove(item.id)} className="ml-3">
            <Ionicons name="close" size={20} color="#FF4D4F" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
