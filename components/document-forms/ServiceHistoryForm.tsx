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

export function ServiceHistoryForm({ state, setState, onPickImage }: DocumentFormProps) {
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
        />
        <FormInput
          label="Enter Mileage"
          value={state.mileage}
          onChange={(v) => updateState({ mileage: v })}
          icon="speedometer-outline"
          placeholder="Enter Mileage"
        />
      </SectionCard>

      <SectionCard>
        <PillSelector
          label="Service Type"
          required
          options={["Interim", "Full", "Major", "Manufacturer"]}
          selected={state.serviceType}
          onSelect={(v) => updateState({ serviceType: v as any })}
        />
      </SectionCard>

      <SectionCard>
        <FormInput
          label="Enter Garage Name"
          value={state.garageName}
          onChange={(v) => updateState({ garageName: v })}
          icon="business-outline"
          placeholder="Enter Garage Name"
        />
      </SectionCard>

      <SectionCard>
        <AmountBlock
          label="Cost"
          value={state.amount}
          onChange={(v) => updateState({ amount: v })}
        />
      </SectionCard>

      <SectionCard>
        <DocumentUpload
          label="Upload Invoice"
          url={state.invoiceUrl}
          onPress={() => onPickImage("invoiceUrl")}
          icon="document-text-outline"
        />
      </SectionCard>

      <SectionCard>
        <PartsReplacedList
          items={state.partsReplaced}
          onAdd={addPart}
          onRemove={removePart}
          onChange={updatePart}
        />
      </SectionCard>

      <SectionCard>
        <FormInput
          label="Notes/Description"
          value={state.notes}
          onChange={(v) => updateState({ notes: v })}
          placeholder="Write a brief note for your preference"
          multiline
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
