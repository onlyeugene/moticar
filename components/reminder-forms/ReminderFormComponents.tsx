/**
 * Shared sub-components used across all reminder category forms.
 */
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { format, isToday, isYesterday } from "date-fns";
import React from "react";
import { Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import DatePickerSheet from "../sheets/DatePickerSheet";
import PriceRuler from "../sheets/PriceRuler";
import TimePickerSheet from "../sheets/TimePickerSheet";
import { useAuthStore } from "@/store/useAuthStore";
import { getCurrencySymbol } from "@/utils/currency";

// ─── Name Field ───────────────────────────────────────────────────────────────

export function SectionCard({ children }: { children: React.ReactNode }) {
  return <View className="bg-white px-4 py-5 mb-1 mx-2">{children}</View>;
}

export function NameField({
  value,
  onChange,
  placeholder = "Give your reminder a name",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <SectionCard>
      <Text className="text-[#8B8B8B] font-lexendRegular text-[0.75rem] mb-3">
        Name of Reminder
      </Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#C1C3C3"
        value={value}
        onChangeText={onChange}
        className="text-[#001A1F] font-lexendRegular text-[0.875rem] border-b py-4 px-4 border-[#EFEFEF]"
      />
    </SectionCard>
  );
}

// ─── Pill Selector ────────────────────────────────────────────────────────────

export function PillSelector({
  label,
  icon,
  options,
  selected,
  onSelect,
  required = true,
}: {
  label: string;
  icon?: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  required?: boolean;
}) {
  return (
    <View className="flex-row items-start mb-1">
      {icon && (
        <MaterialCommunityIcons
          name={icon as any}
          size={18}
          color="#8B8B8B"
          style={{ marginTop: 2, marginRight: 12 }}
        />
      )}
      <View className="flex-1">
        <Text className="text-[#8B8B8B] font-lexendRegular text-[0.75rem] mb-3">
          {label} {required && <Text className="text-[#00AEB5]">*</Text>}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => onSelect(opt)}
              className={`px-4 py-2.5 rounded-[8px] border ${
                selected === opt
                  ? "bg-[#00AEB5] border-[#00AEB5]"
                  : "bg-[#F5F5F5] border-[#F0F0F0]"
              }`}
            >
              <Text
                className={`font-lexendRegular text-[0.75rem] ${
                  selected === opt ? "text-white" : "text-[#8B8B8B]"
                }`}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Date + Time Row ──────────────────────────────────────────────────────────

export function DateTimeRow({
  label,
  required,
  date,
  time,
  onPressDate,
  onPressTime,
}: {
  label: string;
  required?: boolean;
  date: Date | null;
  time?: string;
  onPressDate: () => void;
  onPressTime: () => void;
}) {
  const relative = date
    ? isToday(date)
      ? "Today"
      : isYesterday(date)
        ? "Yesterday"
        : ""
    : "";

  return (
    <View>
      <TouchableOpacity
        onPress={onPressDate}
        className="flex-row items-center py-4 border-b border-[#F5F5F5]"
      >
        <Ionicons
          name="calendar-outline"
          size={18}
          color="#8B8B8B"
          style={{ marginRight: 12 }}
        />
        <Text className="flex-1 text-[#8B8B8B] font-lexendRegular text-[0.8125rem]">
          {label}
          {required && <Text className="text-[#00AEB5]"> *</Text>}
        </Text>
        <View className="items-end">
          {date ? (
            <>
              <Text className="text-[#001A1F] font-lexendRegular text-[0.8125rem]">
                {format(date, "d MMMM, yyyy")}
              </Text>
              {relative ? (
                <Text className="text-[#00AEB5] text-[0.625rem] font-lexendRegular mt-0.5">
                  {relative}
                </Text>
              ) : null}
            </>
          ) : (
            <Text className="text-[#C1C3C3] font-lexendRegular text-[0.8125rem]">
              Select date
            </Text>
          )}
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#C1C3C3"
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>

      {/* Time row — only shown after date is picked */}
      {date && (
        <TouchableOpacity
          onPress={onPressTime}
          className="flex-row items-center py-4 border-b border-[#F5F5F5]"
        >
          <Ionicons
            name="time-outline"
            size={18}
            color="#8B8B8B"
            style={{ marginRight: 12 }}
          />
          <Text className="flex-1 text-[#8B8B8B] font-lexendRegular text-[0.8125rem]">
            Time
          </Text>
          <Text
            className={`font-lexendRegular text-[0.8125rem] ${
              time ? "text-[#001A1F]" : "text-[#C1C3C3]"
            }`}
          >
            {time || "12:00 (midnight default)"}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#C1C3C3"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Date Row (without time — for secondary dates like lastServiceDate) ────────

export function DateRow({
  label,
  required,
  date,
  onPress,
}: {
  label: string;
  required?: boolean;
  date: Date | null;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-4 border-b border-[#F5F5F5]"
    >
      <Ionicons
        name="calendar-outline"
        size={18}
        color="#8B8B8B"
        style={{ marginRight: 12 }}
      />
      <Text className="flex-1 text-[#8B8B8B] font-lexendRegular text-[0.8125rem]">
        {label}
        {required && <Text className="text-[#00AEB5]"> *</Text>}
      </Text>
      <Text
        className={`font-lexendRegular text-[0.8125rem] ${date ? "text-[#001A1F]" : "text-[#C1C3C3]"}`}
      >
        {date ? format(date, "d MMMM, yyyy") : "Select date"}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color="#C1C3C3"
        style={{ marginLeft: 6 }}
      />
    </TouchableOpacity>
  );
}

// ─── Amount Block ─────────────────────────────────────────────────────────────

export function AmountBlock({
  label = "Enter Amount",
  value,
  onChange,
}: {
  label?: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const user = useAuthStore(state => state.user);
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);

  return (
    <SectionCard>
      <Text className="text-[#8B8B8B] font-lexendRegular text-[0.75rem] mb-1 text-center">
        {label} <Text className="text-[#00AEB5]">*</Text>
      </Text>
      <Text className="text-[#001A1F] font-lexendBold text-[34px] text-center mb-2">
        {currencySymbol}{value.toLocaleString()}
      </Text>
      <PriceRuler value={value} onValueChange={onChange} unitPrefix={currencySymbol} />
    </SectionCard>
  );
}

// ─── Payment Method ───────────────────────────────────────────────────────────

export function PaymentMethod({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <View className="flex-row items-center mb-1">
      <Ionicons
        name="wallet-outline"
        size={18}
        color="#8B8B8B"
        style={{ marginRight: 12 }}
      />
      <View className="flex-1">
        <Text className="text-[#8B8B8B] font-lexendRegular text-[0.75rem] mb-3">
          Method of Payment
        </Text>
        <View className="flex-row gap-2">
          {["Cash", "Tag", "Auto-billing"].map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => onSelect(opt)}
              className={`flex-1 py-2.5 rounded-[8px] items-center border ${
                selected === opt
                  ? "bg-[#00AEB5] border-[#00AEB5]"
                  : "bg-[#EEEEEE] border-[#EEEEEE]"
              }`}
            >
              <Text
                className={`font-lexendRegular text-[0.75rem] ${
                  selected === opt ? "text-white" : "text-[#AFB4B4]"
                }`}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Severity Picker ──────────────────────────────────────────────────────────

export function SeverityPicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <View>
      <Text className="text-[#8B8B8B] font-lexendRegular text-[0.75rem] mb-3">
        Tag Severity
      </Text>
      <View className="flex-row gap-2">
        {["Urgent", "Mid", "Low"].map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            className={`flex-1 py-2.5 rounded-[8px] items-center border ${
              selected === opt
                ? "bg-[#00AEB5] border-[#00AEB5]"
                : "bg-[#EEEEEE] border-[#EEEEEE]"
            }`}
          >
            <Text
              className={`font-lexendRegular text-[0.75rem] ${
                selected === opt ? "text-white" : "text-[#AFB4B4]"
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

// ─── Email Toggle ─────────────────────────────────────────────────────────────

export function EmailToggle({
  value,
  onChange,
  email,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  email: string;
}) {
  return (
    <SectionCard>
      <View className="flex-row items-center gap-4">
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: "#002D36", true: "#036D7D" }}
          ios_backgroundColor="#002D36"
          thumbColor="white"
        />
        <View className="flex-1">
          <Text className="text-[#000000] font-lexendMedium text-[0.875rem] mb-0.5">
            Also remind me via email
          </Text>
          <Text className="text-[#8B8B8B] font-lexendRegular text-[0.6875rem]">
            we'll send a reminder to {email}
          </Text>
        </View>
      </View>
    </SectionCard>
  );
}

// ─── Notes Field ──────────────────────────────────────────────────────────────

export function NotesField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <SectionCard>
      <Text className="text-[#8B8B8B] font-lexendRegular text-[0.75rem] mb-3">
        Notes/Description
      </Text>
      <TextInput
        placeholder="Write a brief note for your preference"
        placeholderTextColor="#C1C3C3"
        value={value}
        onChangeText={onChange}
        multiline
        className="text-[#001A1F] font-lexendRegular text-[0.875rem] min-h-[60px]"
      />
    </SectionCard>
  );
}

// ─── useDateTimePicker hook ────────────────────────────────────────────────────
// Shared hook for managing date + time picker visibility within form components

export function useDateTimePicker() {
  const [showDate, setShowDate] = React.useState(false);
  const [showTime, setShowTime] = React.useState(false);
  return { showDate, setShowDate, showTime, setShowTime };
}

// ─── DateTimePickerPair ───────────────────────────────────────────────────────
// Renders both DatePickerSheet and TimePickerSheet together

export function DateTimePickerPair({
  showDate,
  showTime,
  date,
  time,
  onDateClose,
  onDateSelect,
  onTimeClose,
  onTimeSelect,
  dateTitle,
}: {
  showDate: boolean;
  showTime: boolean;
  date: Date | null;
  time?: string;
  onDateClose: () => void;
  onDateSelect: (d: Date) => void;
  onTimeClose: () => void;
  onTimeSelect: (t: string) => void;
  dateTitle?: string;
}) {
  return (
    <>
      <DatePickerSheet
        visible={showDate}
        onClose={onDateClose}
        onSelect={onDateSelect}
        initialDate={date || new Date()}
        title={dateTitle || "Select Date"}
      />
      <TimePickerSheet
        visible={showTime}
        onClose={onTimeClose}
        onSelect={onTimeSelect}
        initialTime={time || "00:00"}
        title="Set Reminder Time"
      />
    </>
  );
}
