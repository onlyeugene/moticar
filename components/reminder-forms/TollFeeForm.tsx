import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  SectionCard, NameField, AmountBlock, DateTimeRow, PaymentMethod,
  SeverityPicker, EmailToggle, NotesField, DateTimePickerPair,
} from "./ReminderFormComponents";
import { ReminderFormProps } from "./types";

export function TollFeeForm({ state, setState, userEmail }: ReminderFormProps) {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const repeatOptions = ["Daily", "Weekly", "Every 2 weeks", "Monthly", "Yearly"];

  return (
    <>
      <NameField 
        value={state.name} 
        onChange={(v) => setState((p) => ({ ...p, name: v }))} 
      />

      <AmountBlock 
        value={state.amount} 
        onChange={(v) => setState((p) => ({ ...p, amount: v }))} 
      />

      <SectionCard>
        <DateTimeRow
          label="Date to be reminded" required
          date={state.date} time={state.time}
          onPressDate={() => setShowDate(true)}
          onPressTime={() => setShowTime(true)}
        />
      </SectionCard>

      <SectionCard>
        <Text className="text-[#8B8B8B] font-lexendRegular text-[12px] mb-3">
          Frequency <Text className="text-[#00AEB5]">*</Text>
        </Text>
        <View className="flex-row gap-2 mb-3">
          {["One-Time", "Repeat"].map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setState((p) => ({ ...p, frequencyType: opt, frequencyMode: opt }))}
              className={`flex-1 py-2.5 rounded-[8px] items-center border ${
                state.frequencyMode === opt ? "bg-[#00AEB5] border-[#00AEB5]" : "bg-[#F5F5F5] border-[#F0F0F0]"
              }`}
            >
              <Text className={`font-lexendRegular text-[12px] ${state.frequencyMode === opt ? "text-white" : "text-[#8B8B8B]"}`}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {state.frequencyMode === "Repeat" && (
          <View className="flex-row flex-wrap gap-2">
            {repeatOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setState((p) => ({ ...p, frequency: opt }))}
                className={`px-4 py-2 rounded-[8px] border ${
                  state.frequency === opt ? "bg-[#00AEB5] border-[#00AEB5]" : "bg-[#F5F5F5] border-[#F0F0F0]"
                }`}
              >
                <Text className={`font-lexendRegular text-[12px] ${state.frequency === opt ? "text-white" : "text-[#8B8B8B]"}`}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </SectionCard>

      <SectionCard>
        <PaymentMethod 
          selected={state.paymentMethod} 
          onSelect={(v) => setState((p) => ({ ...p, paymentMethod: v }))} 
        />
      </SectionCard>
      <SectionCard>
        <SeverityPicker 
          selected={state.severity} 
          onSelect={(v) => setState((p) => ({ ...p, severity: v }))} 
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
        showDate={showDate} showTime={showTime}
        date={state.date} time={state.time}
        onDateClose={() => setShowDate(false)}
        onDateSelect={(d) => setState((p) => ({ ...p, date: d }))}
        onTimeClose={() => setShowTime(false)}
        onTimeSelect={(t) => setState((p) => ({ ...p, time: t }))}
        dateTitle="Select Reminder Date"
      />
    </>
  );
}
