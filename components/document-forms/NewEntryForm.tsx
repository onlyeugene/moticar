import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DocumentFormProps, DocumentFormState } from "./types";
import {
  SectionCard,
  FormInput,
  DateSelectRow,
  AmountBlock,
  DocumentUpload,
  PillSelector,
} from "./DocumentFormComponents";
import DatePickerSheet from "../sheets/DatePickerSheet";
import { Ionicons } from "@expo/vector-icons";

export function NewEntryForm({
  state,
  setState,
  onPickImage,
  isEditing,
}: DocumentFormProps) {
  const [showIssueDate, setShowIssueDate] = useState(false);
  const [showExpiryDate, setShowExpiryDate] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const updateState = (updates: Partial<DocumentFormState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const categories = ["Legal", "Maintenance", "Financial", "Permit", "Inspection", "Other"];
  const frequencies = ["One-time", "Monthly", "Annual"];

  return (
    <View>
      <SectionCard>
        <FormInput
          value={state.documentName}
          onChange={(v) => updateState({ documentName: v })}
          icon="ribbon-outline"
          placeholder="Document Name e.g. “Parking Permit”"
          multiline
underline
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <PillSelector
          label="Category"
          required
          options={categories}
          selected={state.subCategory}
          onSelect={(v) => updateState({ subCategory: v })}
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <DateSelectRow
          label="Issue Date"
          required
          date={state.issueDate}
          onPress={() => setShowIssueDate(true)}
          icon="calendar-outline"
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <View>
          <DateSelectRow
            label="Expiry Date"
            required={!state.doesNotExpire}
            date={state.expiryDate}
            onPress={() => !state.doesNotExpire && setShowExpiryDate(true)}
            icon="calendar-outline"
            disabled={!isEditing || state.doesNotExpire}
          />
          <TouchableOpacity 
            onPress={() => isEditing && updateState({ doesNotExpire: !state.doesNotExpire, expiryDate: !state.doesNotExpire ? null : state.expiryDate })}
            className="flex-row items-center mt-2 ml-9"
            disabled={!isEditing}
          >
            <View className={`w-4 h-4 rounded-[6px] border items-center justify-center mr-2 ${state.doesNotExpire ? "bg-[#00AEB5] border-[#00AEB5]" : "border-[#C1C3C3]"}`}>
              {state.doesNotExpire && <Ionicons name="checkmark" size={12} color="white" />}
            </View>
            <Text className="text-[#ACB7B7] font-lexendRegular text-[14px] ">Does not expire</Text>
          </TouchableOpacity>
        </View>
      </SectionCard>
      <SectionCard>
        {!isExpanded ? (
          <TouchableOpacity
            onPress={() => setIsExpanded(true)}
            className="py-3 items-center border border-[#B1D0D2] rounded-full flex-row justify-center gap-2"
          >
            <Text className="text-[#799799] font-lexendMedium text-[12px]">show more</Text>
            <Ionicons name="chevron-down" size={18} color="#ADADAD" />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => setIsExpanded(false)}
              className="py-3 items-center border border-[#B1D0D2] rounded-full flex-row justify-center gap-2 mb-4"
            >
              <Text className="text-[#799799] font-lexendMedium text-[12px]">show less</Text>
              <Ionicons name="chevron-up" size={18} color="#ADADAD" />
            </TouchableOpacity>
            <AmountBlock
              label="Cost/Fee"
              value={state.amount}
              onChange={(v) => updateState({ amount: v })}
              disabled={!isEditing}
            />
          </>
        )}
      </SectionCard>

      {isExpanded && (
        <>
          <SectionCard>
            <FormInput
              label="Issuing Authority"
              value={state.issuingAuthority}
              onChange={(v) => updateState({ issuingAuthority: v })}
              icon="business-outline"
              multiline
              underline
              disabled={!isEditing}
            />
          </SectionCard>

          <SectionCard>
            <PillSelector
              label="Payment Frequency"
              options={frequencies}
              selected={state.paymentFrequency}
              onSelect={(v) => updateState({ paymentFrequency: v as any })}
              disabled={!isEditing}
            />
          </SectionCard>

          <SectionCard>
            <DocumentUpload
              label="Upload Receipt"
              url={state.receiptUrl}
              onPress={() => onPickImage("receiptUrl")}
              icon="receipt-outline"
              disabled={!isEditing}
            />
          </SectionCard>

          <SectionCard>
            <FormInput
              label="Notes/Description"
              value={state.notes}
              onChange={(v) => updateState({ notes: v })}
              placeholder="Write a brief note for your preference"
              multiline
              disabled={!isEditing}
            />
          </SectionCard>
        </>
      )}

      <DatePickerSheet
        visible={showIssueDate}
        onClose={() => setShowIssueDate(false)}
        onSelect={(d) => {
          updateState({ issueDate: d });
          setShowIssueDate(false);
        }}
        initialDate={state.issueDate || new Date()}
        title="Select Issue Date"
      />
      <DatePickerSheet
        visible={showExpiryDate}
        onClose={() => setShowExpiryDate(false)}
        onSelect={(d) => {
          updateState({ expiryDate: d });
          setShowExpiryDate(false);
        }}
        initialDate={state.expiryDate || new Date()}
        title="Select Expiry Date"
      />
    </View>
  );
}
