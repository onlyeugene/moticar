import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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

const FREQUENCIES = ["Weekly", "Monthly", "Bi-Annual", "Annual"];
const CATEGORIES = ["Expense", "Maintenance", "Admin", "Personal"];

export function OthersForm({ state, setState, userEmail }: ReminderFormProps) {
  const { showDate, setShowDate, showTime, setShowTime } = useDateTimePicker();
  const [showEndDate, setShowEndDate] = useState(false);

  return (
    <>
      <NameField
        value={state.name}
        onChange={(v) => setState((p) => ({ ...p, name: v }))}
        placeholder="Give your reminder a name"
      />

      <SectionCard>
        <DateTimeRow
          label="Date"
          required
          date={state.date}
          time={state.time}
          onPressDate={() => setShowDate(true)}
          onPressTime={() => setShowTime(true)}
        />
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
          options={CATEGORIES}
          selected={state.serviceCategory}
          onSelect={(v) => setState((p) => ({ ...p, serviceCategory: v }))}
        />
      </SectionCard>

      <SectionCard>
        <Text className="text-[#8B8B8B] font-lexendRegular text-[12px] mb-3">
          Frequency
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {FREQUENCIES.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setState((p) => ({ ...p, frequency: opt }))}
              className={`px-4 py-2.5 rounded-[8px] border ${
                state.frequency === opt
                  ? "bg-[#00AEB5] border-[#00AEB5]"
                  : "bg-[#F5F5F5] border-[#F0F0F0]"
              }`}
            >
              <Text
                className={`font-lexendRegular text-[12px] ${state.frequency === opt ? "text-white" : "text-[#8B8B8B]"}`}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
        dateTitle="Select Date"
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
