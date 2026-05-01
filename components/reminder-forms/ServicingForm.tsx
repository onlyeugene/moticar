import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import AddTechnicianSheet from "../sheets/AddTechnicianSheet";
import DatePickerSheet from "../sheets/DatePickerSheet";
import TechnicianSheet from "../sheets/TechnicianSheet";
import {
  AmountBlock,
  DateRow,
  DateTimePickerPair,
  DateTimeRow,
  EmailToggle,
  NameField,
  NotesField,
  PaymentMethod,
  PillSelector,
  SectionCard,
  SeverityPicker,
  useDateTimePicker,
} from "./ReminderFormComponents";
import { ReminderFormProps } from "./types";

export function ServicingForm({
  state,
  setState,
  userEmail,
  carId,
}: ReminderFormProps) {
  const { showDate, setShowDate, showTime, setShowTime } = useDateTimePicker();
  const [showLastService, setShowLastService] = useState(false);
  const [showTechSheet, setShowTechSheet] = useState(false);
  const [showAddTech, setShowAddTech] = useState(false);

  return (
    <>
      <NameField
        value={state.name}
        onChange={(v) => setState((p) => ({ ...p, name: v }))}
      />

      <SectionCard>
        <PillSelector
          label="Category"
          icon="wrench-cog-outline"
          options={["General", "Oil Change", "Major"]}
          selected={state.serviceCategory}
          onSelect={(v) => setState((p) => ({ ...p, serviceCategory: v }))}
        />
      </SectionCard>

      <SectionCard>
        <View className="flex-row items-center mb-3">
          <MaterialCommunityIcons
            name="lightning-bolt-outline"
            size={18}
            color="#8B8B8B"
            style={{ marginRight: 10 }}
          />
          <Text className="text-[#8B8B8B] font-lexendRegular text-[0.75rem]">
            Due Trigger <Text className="text-[#00AEB5]">*</Text>
          </Text>
        </View>
        <View className="flex-row gap-2 mb-3">
          {["Date", "Mileage"].map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setState((p) => ({ ...p, dueTrigger: opt }))}
              className={`flex-1 py-2.5 rounded-[8px] items-center border ${state.dueTrigger === opt ? "bg-[#00AEB5] border-[#00AEB5]" : "bg-[#F5F5F5] border-[#F0F0F0]"}`}
            >
              <Text
                className={`font-lexendRegular text-[0.75rem] ${state.dueTrigger === opt ? "text-white" : "text-[#8B8B8B]"}`}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {state.dueTrigger === "Mileage" && (
          <View className="flex-row items-center border-b border-[#F0F0F0] py-3">
            <MaterialCommunityIcons
              name="speedometer"
              size={18}
              color="#8B8B8B"
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Enter Current Mileage"
              placeholderTextColor="#C1C3C3"
              keyboardType="numeric"
              value={state.mileage}
              onChangeText={(v) => setState((p) => ({ ...p, mileage: v }))}
              className="flex-1 font-lexendRegular text-[0.875rem] text-[#001A1F]"
            />
          </View>
        )}
        {state.dueTrigger === "Date" && (
          <DateTimeRow
            label="Due Date"
            required
            date={state.date}
            time={state.time}
            onPressDate={() => setShowDate(true)}
            onPressTime={() => setShowTime(true)}
          />
        )}
      </SectionCard>

      <AmountBlock
        label="Estimated Cost"
        value={state.amount}
        onChange={(v) => setState((p) => ({ ...p, amount: v }))}
      />

      <SectionCard>
        <TouchableOpacity
          onPress={() => setShowTechSheet(true)}
          className="flex-row items-center py-2"
        >
          <MaterialCommunityIcons
            name="account-wrench-outline"
            size={18}
            color="#8B8B8B"
            style={{ marginRight: 12 }}
          />
          <Text className="flex-1 text-[#8B8B8B] font-lexendRegular text-[0.8125rem]">
            Technician
          </Text>
          <Text className="text-[#001A1F] font-lexendRegular text-[0.8125rem] mr-1">
            {state.technician ? state.technician.name : "Select"}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#C1C3C3" />
        </TouchableOpacity>
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

      <SectionCard>
        <DateRow
          label="Last Service Date"
          date={state.lastServiceDate}
          onPress={() => setShowLastService(true)}
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
        visible={showLastService}
        onClose={() => setShowLastService(false)}
        onSelect={(d) => setState((p) => ({ ...p, lastServiceDate: d }))}
        initialDate={state.lastServiceDate || new Date()}
        title="Last Service Date"
      />
      <TechnicianSheet
        visible={showTechSheet}
        onClose={() => setShowTechSheet(false)}
        onSelect={(tech) => {
          setState((p) => ({ ...p, technician: tech }));
          setShowTechSheet(false);
        }}
        onAdd={() => {
          setShowTechSheet(false);
          setShowAddTech(true);
        }}
      />
      <AddTechnicianSheet
        visible={showAddTech}
        onClose={() => setShowAddTech(false)}
      />
    </>
  );
}
