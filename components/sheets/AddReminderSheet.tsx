import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Switch,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "../shared/BottomSheet";
import DatePickerSheet from "./DatePickerSheet";
import { useCreateReminder } from "@/hooks/useActivity";
import { useAuthStore } from "@/store/useAuthStore";
import { format } from "date-fns";

interface AddReminderSheetProps {
  visible: boolean;
  onClose: () => void;
  category: string;
  carId: string;
}

const FREQUENCIES = ["One-Time", "Repeat"];
const SEVERITIES = ["Urgent", "Mid", "Low"];

export default function AddReminderSheet({
  visible,
  onClose,
  category,
  carId,
}: AddReminderSheetProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [frequency, setFrequency] = useState("");
  const [severity, setSeverity] = useState("");
  const [emailNotify, setEmailNotify] = useState(true);
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const user = useAuthStore((state) => state.user);
  const { mutate: createReminder, isPending } = useCreateReminder();

  const handleSave = () => {
    if (!name || !amount || !date) return;

    createReminder(
      {
        carId,
        category,
        name,
        amount: parseFloat(amount),
        date: date.toISOString(),
        frequency,
        severity,
        emailNotify,
        notes,
      },
      {
        onSuccess: () => {
          onClose();
          // Reset form
          setName("");
          setAmount("");
          setDate(new Date());
          setFrequency("One-Time");
          setSeverity("Mid");
          setEmailNotify(true);
          setNotes("");
        },
      },
    );
  };

  const headerRight = (
    <TouchableOpacity
      onPress={handleSave}
      disabled={isPending || !name || !amount}
      className={`px-6 py-2 rounded-full ${isPending || !name || !amount ? "bg-[#29D7DE]/50" : "bg-[#29D7DE]"}`}
    >
      <Text className="text-[#00343F] font-lexendBold text-[14px]">
        {isPending ? "Saving..." : "Save"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <BottomSheet
        visible={visible}
        onClose={onClose}
        title="Reminder"
        headerRight={headerRight}
        height="85%"
      >
        <ScrollView
          className="flex-1  pt-2"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-[#1A3B41] font-lexendBold text-[24px] mb-6">
            {category}
          </Text>

          <View className="bg-white py-4 px-4 rounded-t-[12px] ">
            {/* Name of Reminder */}
            <View className="mb-6">
              <Text className="text-[#8B8B8B] font-lexendRegular text-[12px] mb-2 px-1">
                Name of Reminder
              </Text>
              <View
                className="border-b border-[#DEDEDE] px-4 py-4"
                style={styles.inputShadow}
              >
                <TextInput
                  placeholder="Give your reminder a name"
                  placeholderTextColor="#C1C3C3"
                  value={name}
                  onChangeText={setName}
                  className="text-[#ACB7B7] font-lexendRegular text-[14px] p-0"
                />
              </View>
            </View>

            {/* Amount */}
            <View className="mb-6">
              <Text className="text-[#8B8B8B] font-lexendRegular text-[12px] mb-2 px-1">
                Amount
              </Text>
              <View
                className="border border-[#DEDEDE] rounded-[8px] px-4  flex-row items-center"
                style={styles.inputShadow}
              >
                <View className="border-r border-[#DEDEDE] py-4 pr-2 ">
                  <Text className="text-[#ACB7B7] font-lexendMedium text-[24px] mr-2">
                    ₦
                  </Text>
                </View>
                <TextInput
                  placeholder="0"
                  placeholderTextColor="#C1C3C3"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  className="flex-1 text-[#ACB7B7] text-center font-lexendRegular text-[24px] p-0"
                />
              </View>
            </View>

            {/* Date Selector */}
            <View className="mb-6 flex-row justify-between items-center">
              <Text className="text-[#8B8B8B] font-lexendRegular text-[12px]  px-1">
                Date to be reminded
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className=" flex-row items-center justify-between"
                style={styles.inputShadow}
              >
                <Text className="text-[#ACB7B7] text-[14px] font-lexendRegular">
                  {date ? format(date, "d MMMM yyyy") : "Select date of event"}
                </Text>
                <Ionicons name="chevron-forward" size={24} color="#ADADAD" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Frequency Toggle */}
          <View className="bg-white mt-1 px-4 py-4">
            <Text className="text-[#8B8B8B] font-lexendRegular text-[12px] mb-4 px-1">
              Frequency
            </Text>
            <View className="flex-row gap-3">
              {FREQUENCIES.map((freq) => (
                <TouchableOpacity
                  key={freq}
                  onPress={() => setFrequency(freq)}
                  className={`flex-1 py-4 rounded-[8px] items-center ${
                    frequency === freq ? "bg-secondary" : "bg-[#EEEEEE]"
                  }`}
                >
                  <Text
                    className={`text-[12px] ${
                      frequency === freq
                        ? "text-white font-lexendMedium"
                        : "text-[#AFB4B4] font-lexendRegular"
                    }`}
                  >
                    {freq}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tag Severity */}
          <View className="bg-white px-4 py-4 mt-1 ">
            <Text className="text-[#8B8B8B] font-lexendRegular text-[12px] mb-4 px-1">
              Tag Severity
            </Text>
            <View className="flex-row gap-3">
              {SEVERITIES.map((sev) => (
                <TouchableOpacity
                  key={sev}
                  onPress={() => setSeverity(sev)}
                  className={`flex-1 py-4 rounded-[8px] items-center ${
                    severity === sev ? "bg-secondary" : "bg-[#EEEEEE]"
                  }`}
                >
                  <Text
                    className={`text-[12px] ${
                      severity === sev
                        ? "text-white font-lexendMedium"
                        : "text-[#AFB4B4] font-lexendRegular"
                    }`}
                  >
                    {sev}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Email Notification */}
          <View
            className="mt-1 bg-white border border-[#E9F0F0]  p-4 flex-row gap-3 items-center justify-between"
            // style={styles.inputShadow}
          >
            <Switch
              value={emailNotify}
              onValueChange={setEmailNotify}
              trackColor={{ false: "#002D36", true: "#036D7D" }}
              thumbColor="white"
            />
            <View className="flex-1 pr-4">
              <View className="flex-row items-center mb-1">
                <Text className="text-[#000000] font-lexendMedium text-[14px]">
                  Also remind me via email
                </Text>
              </View>
              <Text className="text-[#8B8B8B] font-lexendRegular text-[12px]">
                we'll send a reminder to {user?.email || "your email"}
              </Text>
            </View>
          </View>

          {/* Notes/Description */}
          <View className="mb-10 mt-1 bg-white px-4 py-4">
            <Text className="text-[#8B8B8B] font-lexendRegular text-[12px] mb-2 px-1">
              Notes/Description
            </Text>
            <View
              className="border-b border-[#DEDEDE] px-4 py-4"
              style={styles.inputShadow}
            >
              <TextInput
                placeholder="Write a brief note for your preference"
                placeholderTextColor="#C1C3C3"
                value={notes}
                onChangeText={setNotes}
                multiline
                className="text-[#1A3B41] font-lexendRegular text-[14px] p-0"
              />
            </View>
          </View>
        </ScrollView>

        <DatePickerSheet
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSelect={setDate}
          initialDate={date}
          title="Select Date"
        />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  inputShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
});
