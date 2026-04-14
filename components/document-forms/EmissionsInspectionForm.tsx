import React, { useState } from "react";
import { View } from "react-native";
import { DocumentFormProps, DocumentFormState } from "./types";
import {
  SectionCard,
  DateSelectRow,
  PillSelector,
  DocumentUpload,
  FormInput,
} from "./DocumentFormComponents";

import DatePickerSheet from "../sheets/DatePickerSheet";

export function EmissionsInspectionForm({
  state,
  setState,
  onPickImage,
  isEditing,
}: DocumentFormProps) {
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
          disabled={!isEditing}
        />
        {/* <FormInput
          label="Mileage"
          value={state.mileage}
          onChange={(v) => updateState({ mileage: v })}
          icon="speedometer-outline"
          placeholder="Enter Mileage"
          disabled={!isEditing}
        /> */}
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
        <DocumentUpload
          label="Upload Test Certificate"
          url={state.documentUrl}
          onPress={() => onPickImage("documentUrl")}
          icon="document-text-outline"
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
