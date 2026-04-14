import React, { useState } from "react";
import { View } from "react-native";
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

export function MOTForm({ state, setState, onPickImage, isEditing }: DocumentFormProps) {
  const [showTestDate, setShowTestDate] = useState(false);
  const [showExpiryDate, setShowExpiryDate] = useState(false);

  const updateState = (updates: Partial<DocumentFormState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <View>
      <SectionCard>
        <DateSelectRow
          label="Test Date"
          required
          date={state.testDate}
          onPress={() => setShowTestDate(true)}
          icon="calendar-outline"
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <DateSelectRow
          label="Expiry Date"
          required
          date={state.expiryDate}
          onPress={() => setShowExpiryDate(true)}
          icon="calendar-outline"
          showExpiryShortcut
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <FormInput
          value={state.mileage}
          onChange={(v) => updateState({ mileage: v })}
          icon="speedo"
          placeholder="Mileage at Test"
          underline={true}
          multiline={true}
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <PillSelector
          label="Result"
          required
          options={["Pass", "Fail"]}
          selected={state.result as string}
          onSelect={(v) => updateState({ result: v as any })}
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <FormInput
          label="Enter Test Centre Name"
          value={state.testCentreName}
          onChange={(v) => updateState({ testCentreName: v })}
          icon="building"
          placeholder="Enter Test Centre Name"
          underline={true}
          multiline={true}
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <FormInput
          label="Enter Certificate Number"
          value={state.certificateNumber}
          onChange={(v) => updateState({ certificateNumber: v })}
          icon="ribbon-outline"
          placeholder="Enter Certificate Number"
          underline={true}
          multiline={true}
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <AmountBlock
          label="Cost"
          value={state.amount}
          onChange={(v) => updateState({ amount: v })}
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <DocumentUpload
          label="Upload document"
          url={state.documentUrl}
          onPress={() => onPickImage("documentUrl")}
          icon="document-text-outline"
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <FormInput
          label="Advisory Notes/Description"
          value={state.notes}
          onChange={(v) => updateState({ notes: v })}
          placeholder="Write a brief note for your preference"
          multiline
          underline
          disabled={!isEditing}
        />
      </SectionCard>

      <DatePickerSheet
        visible={showTestDate}
        onClose={() => setShowTestDate(false)}
        onSelect={(d) => {
          updateState({ testDate: d });
          setShowTestDate(false);
        }}
        initialDate={state.testDate || new Date()}
        title="Select Test Date"
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
