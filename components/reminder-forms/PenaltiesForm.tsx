import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import {
  SectionCard, AmountBlock, DateTimeRow, PillSelector,
  SeverityPicker, EmailToggle, NotesField, DateTimePickerPair,
  useDateTimePicker,
} from "./ReminderFormComponents";
import { ReminderFormProps } from "./types";

const PENALTY_CATEGORIES = ["Toll Violation", "Fine", "Parking", "Speeding", "Misc"];
const AUTHORITIES = ["City", "Local Agency", "Others"];

export function PenaltiesForm({ state, setState, userEmail }: ReminderFormProps) {
  const { showDate, setShowDate, showTime, setShowTime } = useDateTimePicker();

  return (
    <>
      <SectionCard>
        <PillSelector label="Category" icon="wrench-cog-outline"
          options={PENALTY_CATEGORIES} selected={state.serviceCategory}
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
        <Text className="text-[#8B8B8B] font-lexendRegular text-[0.75rem] mb-3">Issuing Authority</Text>
        <View className="flex-row gap-2">
          {AUTHORITIES.map((opt) => (
            <TouchableOpacity key={opt} onPress={() => setState((p) => ({ ...p, issuingAuthority: opt }))}
              className={`flex-1 py-2.5 rounded-[8px] items-center border ${
                state.issuingAuthority === opt ? "bg-[#00AEB5] border-[#00AEB5]" : "bg-[#F5F5F5] border-[#F0F0F0]"
              }`}>
              <Text className={`font-lexendRegular text-[0.75rem] ${state.issuingAuthority === opt ? "text-white" : "text-[#8B8B8B]"}`}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SectionCard>

      {/* Upload proof */}
      <SectionCard>
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="image-outline" size={18} color="#8B8B8B" style={{ marginRight: 12 }} />
          <Text className="flex-1 text-[#8B8B8B] font-lexendRegular text-[0.8125rem]">Upload any image proof or receipt</Text>
          <View className="border border-dashed border-[#C1C3C3] rounded-[8px] w-10 h-10 items-center justify-center mr-2">
            <Ionicons name="add" size={20} color="#C1C3C3" />
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C1C3C3" />
        </View>
      </SectionCard>

      <SectionCard>
        <View className="flex-row items-center py-1">
          <MaterialCommunityIcons name="ticket-outline" size={18} color="#8B8B8B" style={{ marginRight: 12 }} />
          <Text className="flex-1 text-[#8B8B8B] font-lexendRegular text-[0.8125rem]">Reference/Ticket Number</Text>
          <TextInput placeholder="——————" placeholderTextColor="#C1C3C3"
            value={state.reference}
            onChangeText={(v) => setState((p) => ({ ...p, reference: v }))}
            className="text-[#001A1F] font-lexendRegular text-[0.8125rem] mr-1 text-right"
          />
          <Ionicons name="chevron-forward" size={18} color="#C1C3C3" />
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
