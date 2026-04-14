import React, { useState } from "react";
import { View } from "react-native";
import { 
  DocumentFormProps, 
  DocumentFormState 
} from "./types";
import { 
  SectionCard, 
  FormInput, 
  DateSelectRow, 
  AmountBlock, 
  DocumentUpload, 
  PillSelector,
  PartsReplacedList
} from "./DocumentFormComponents";
import DatePickerSheet from "../sheets/DatePickerSheet";

export function ServiceHistoryForm({ state, setState, onPickImage, isEditing }: DocumentFormProps) {
  const [showServiceDate, setShowServiceDate] = useState(false);

  const updateState = (updates: Partial<DocumentFormState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const addPart = () => {
    updateState({
      partsReplaced: [...state.partsReplaced, { id: Math.random().toString(), item: "" }]
    });
  };

  const removePart = (id: string) => {
    updateState({
      partsReplaced: state.partsReplaced.filter(p => p.id !== id)
    });
  };

  const updatePart = (id: string, text: string) => {
    updateState({
      partsReplaced: state.partsReplaced.map(p => p.id === id ? { ...p, item: text } : p)
    });
  };

  return (
    <View>
      <SectionCard>
        <DateSelectRow
          label="Service Date"
          required
          date={state.serviceDate}
          onPress={() => setShowServiceDate(true)}
          icon="calendar-outline"
          disabled={!isEditing}
        />
        <FormInput
          label="Enter Mileage"
          value={state.mileage}
          onChange={(v) => updateState({ mileage: v })}
          icon="speedometer-outline"
          placeholder="Enter Mileage"
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <PillSelector
          label="Service Type"
          required
          options={["Interim", "Full", "Major", "Manufacturer"]}
          selected={state.serviceType}
          onSelect={(v) => updateState({ serviceType: v as any })}
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <FormInput
          label="Enter Garage Name"
          value={state.garageName}
          onChange={(v) => updateState({ garageName: v })}
          icon="business-outline"
          placeholder="Enter Garage Name"
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
          label="Upload Invoice"
          url={state.invoiceUrl}
          onPress={() => onPickImage("invoiceUrl")}
          icon="document-text-outline"
          disabled={!isEditing}
        />
      </SectionCard>

      <SectionCard>
        <PartsReplacedList
          items={state.partsReplaced}
          onAdd={addPart}
          onRemove={removePart}
          onChange={updatePart}
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

      <DatePickerSheet
        visible={showServiceDate}
        onClose={() => setShowServiceDate(false)}
        onSelect={(d) => {
          updateState({ serviceDate: d });
          setShowServiceDate(false);
        }}
        initialDate={state.serviceDate || new Date()}
        title="Select Service Date"
      />
    </View>
  );
}
