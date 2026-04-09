import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import DatePickerSheet from "../sheets/DatePickerSheet";
import {
  AmountBlock,
  DateRow,
  DateTimePickerPair,
  DateTimeRow,
  EmailToggle,
  NameField,
  NotesField,
  PillSelector,
  SectionCard,
  useDateTimePicker,
} from "./ReminderFormComponents";
import { ReminderFormProps } from "./types";

export function PlannedTripsForm({
  state,
  setState,
  userEmail,
}: ReminderFormProps) {
  const { showDate, setShowDate, showTime, setShowTime } = useDateTimePicker();
  const [showEndDate, setShowEndDate] = useState(false);

  return (
    <>
      <NameField
        value={state.name}
        onChange={(v) => setState((p) => ({ ...p, name: v }))}
        placeholder="Give your trip a name"
      />

      <SectionCard>
        <DateTimeRow
          label="Start Date"
          required
          date={state.date}
          time={state.time}
          onPressDate={() => setShowDate(true)}
          onPressTime={() => setShowTime(true)}
        />
        <View className="flex-row items-center py-4 border-b border-[#F5F5F5]">
          <MaterialCommunityIcons
            name="web"
            size={18}
            color="#8B8B8B"
            style={{ marginRight: 12 }}
          />
          <Text className="text-[#8B8B8B] font-lexendRegular text-[13px] mr-2">
            Destination <Text className="text-[#00AEB5]">*</Text>
          </Text>
          <TextInput
            placeholder="Enter destination"
            placeholderTextColor="#C1C3C3"
            value={state.destination}
            onChangeText={(v) => setState((p) => ({ ...p, destination: v }))}
            className="flex-1 text-[#001A1F] font-lexendRegular text-[13px] text-right"
          />
        </View>
        <DateRow
          label="End Date"
          date={state.endDate}
          onPress={() => setShowEndDate(true)}
        />
      </SectionCard>

      <AmountBlock
        label="Estimated Budget"
        value={state.amount}
        onChange={(v) => setState((p) => ({ ...p, amount: v }))}
      />

      <SectionCard>
        <PillSelector
          label="Category"
          options={["Business", "Personal", "Vacation", "Misc"]}
          selected={state.serviceCategory}
          onSelect={(v) => setState((p) => ({ ...p, othersCategory: v, serviceCategory: v }))}
        />
      </SectionCard>

      <EmailToggle
        value={state.emailNotify}
        onChange={(v) => setState((p) => ({ ...p, emailNotify: v }))}
        email={userEmail}
      />
      <NotesField
        value={state.notes}
        onChange={(v) => setState((p) => ({ ...p, notes: v }))}
      />

      <DateTimePickerPair
        showDate={showDate}
        showTime={showTime}
        date={state.date}
        time={state.time}
        onDateClose={() => setShowDate(false)}
        onDateSelect={(d) => setState((p) => ({ ...p, date: d }))}
        onTimeClose={() => setShowTime(false)}
        onTimeSelect={(t) => setState((p) => ({ ...p, time: t }))}
        dateTitle="Select Due Date"
      />
      <DatePickerSheet
        visible={showEndDate}
        onClose={() => setShowEndDate(false)}
        onSelect={(d) => setState((p) => ({ ...p, endDate: d }))}
        initialDate={state.endDate || new Date()}
        title="Select End Date"
      />
    </>
  );
}
