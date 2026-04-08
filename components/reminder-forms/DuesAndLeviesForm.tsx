import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  SectionCard, AmountBlock, DateTimeRow, PillSelector,
  SeverityPicker, EmailToggle, NotesField, DateTimePickerPair,
  useDateTimePicker,
} from "./ReminderFormComponents";
import { ReminderFormProps } from "./types";

const DUES_CATEGORIES = ["Road Tax", "Levy", "Permit", "Registration", "Inspection", "License Renewal", "Misc"];
const AUTHORITIES = ["DVLA", "State DMV", "Others"];
const FREQUENCIES = ["Monthly", "Bi-Annual", "Annual"];

export function DuesAndLeviesForm({ state, setState, userEmail }: ReminderFormProps) {
  const { showDate, setShowDate, showTime, setShowTime } = useDateTimePicker();

  return (
    <>
      <SectionCard>
        <PillSelector label="Category" icon="wrench-cog-outline"
          options={DUES_CATEGORIES} selected={state.serviceCategory}
          onSelect={(v) => setState((p) => ({ ...p, serviceCategory: v }))}
        />
      </SectionCard>

      <SectionCard>
        <DateTimeRow label="Due Date" required date={state.date} time={state.time}
          onPressDate={() => setShowDate(true)} onPressTime={() => setShowTime(true)}
        />
      </SectionCard>

      <AmountBlock value={state.amount} onChange={(v) => setState((p) => ({ ...p, amount: v }))} />

      <SectionCard>
        <Text className="text-[#8B8B8B] font-lexendRegular text-[12px] mb-3">Issuing Authority</Text>
        <View className="flex-row gap-2">
          {AUTHORITIES.map((opt) => (
            <TouchableOpacity key={opt} onPress={() => setState((p) => ({ ...p, issuingAuthority: opt }))}
              className={`flex-1 py-2.5 rounded-[8px] items-center border ${
                state.issuingAuthority === opt ? "bg-[#00AEB5] border-[#00AEB5]" : "bg-[#F5F5F5] border-[#F0F0F0]"
              }`}>
              <Text className={`font-lexendRegular text-[12px] ${state.issuingAuthority === opt ? "text-white" : "text-[#8B8B8B]"}`}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text className="text-[#8B8B8B] font-lexendRegular text-[12px] mb-3">Frequency</Text>
        <View className="flex-row gap-2">
          {FREQUENCIES.map((opt) => (
            <TouchableOpacity key={opt} onPress={() => setState((p) => ({ ...p, frequency: opt }))}
              className={`flex-1 py-2.5 rounded-[8px] items-center border ${
                state.frequency === opt ? "bg-[#00AEB5] border-[#00AEB5]" : "bg-[#F5F5F5] border-[#F0F0F0]"
              }`}>
              <Text className={`font-lexendRegular text-[12px] ${state.frequency === opt ? "text-white" : "text-[#8B8B8B]"}`}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <SeverityPicker selected={state.severity} onSelect={(v) => setState((p) => ({ ...p, severity: v }))} />
      </SectionCard>

      <EmailToggle value={state.emailNotify} onChange={(v) => setState((p) => ({ ...p, emailNotify: v }))} email={userEmail} />
      <NotesField value={state.notes} onChange={(v) => setState((p) => ({ ...p, notes: v }))} />

      <DateTimePickerPair showDate={showDate} showTime={showTime} date={state.date} time={state.time}
        onDateClose={() => setShowDate(false)}        onDateSelect={(d) => setState((p) => ({ ...p, date: d }))}
        onTimeClose={() => setShowTime(false)}
        onTimeSelect={(t) => setState((p) => ({ ...p, time: t }))}
        dateTitle="Select Due Date"
      />
    </>
  );
}
