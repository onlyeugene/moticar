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

export function InsuranceForm({
  state,
  setState,
  onPickImage,
  isEditing,
}: DocumentFormProps) {
  const [showStartDate, setShowStartDate] = useState(false);
  const [showExpiryDate, setShowExpiryDate] = useState(false);

  const updateState = (updates: Partial<DocumentFormState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <View>
      <SectionCard>
        <FormInput
          label="Insurance Provider"
          value={state.provider}
          onChange={(v) => updateState({ provider: v })}
          icon="business-outline"
          placeholder="Select"
          align="end"
          disabled={!isEditing}
        />
      </SectionCard>
      <SectionCard>
        <FormInput
          value={state.policyNumber}
          onChange={(v) => updateState({ policyNumber: v })}
          icon="ribbon-outline"
          placeholder="Enter Policy Number"
          underline={true}
          multiline={true}
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <PillSelector
          label="Coverage Type"
          required
          options={["Third-party", "Comprehensive", "Fire & Theft"]}
          selected={state.coverageType}
          onSelect={(v) => updateState({ coverageType: v as any })}
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <DateSelectRow
          label="Start Date"
          required
          date={state.startDate}
          onPress={() => setShowStartDate(true)}
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
      </SectionCard>

      <SectionCard>
        <AmountBlock
          label="Premium Amount"
          value={state.amount}
          onChange={(v) => updateState({ amount: v })}
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <PillSelector
          label="Payment Plan"
          options={["Monthly", "Annual"]}
          selected={state.paymentPlan}
          onSelect={(v) => updateState({ paymentPlan: v as any })}
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

      <DatePickerSheet
        visible={showStartDate}
        onClose={() => setShowStartDate(false)}
        onSelect={(d) => {
          updateState({ startDate: d });
          setShowStartDate(false);
        }}
        initialDate={state.startDate || new Date()}
        title="Select Start Date"
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
