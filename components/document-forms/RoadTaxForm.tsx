import React, { useState } from "react";
import { View } from "react-native";
import { DocumentFormProps, DocumentFormState } from "./types";
import {
  SectionCard,
  DateSelectRow,
  AmountBlock,
  DocumentUpload,
  PillSelector,
} from "./DocumentFormComponents";
import DatePickerSheet from "../sheets/DatePickerSheet";

export function RoadTaxForm({
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
        <PillSelector
          label="Frequency"
          required
          options={["Monthly", "Bi-Annual", "Annual"]}
          selected={state.frequency}
          onSelect={(v) => updateState({ frequency: v as any })}
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
          showExpiryShortcut
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <AmountBlock
          label="Amount Paid"
          value={state.amount}
          onChange={(v) => updateState({ amount: v })}
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <PillSelector
          label="Issuing Authority"
          options={["DVLA", "State DMV", "Others"]}
          selected={state.issuingAuthority}
          onSelect={(v) => updateState({ issuingAuthority: v })}
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <PillSelector
          label="Payment Status"
          options={["Paid", "Pending"]}
          selected={state.paymentStatus}
          onSelect={(v) => updateState({ paymentStatus: v as any })}
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <PillSelector
          label="Method of Payment"
          options={["Cash", "Card", "Others"]}
          selected={state.paymentMethod}
          onSelect={(v) => updateState({ paymentMethod: v as any })}
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
