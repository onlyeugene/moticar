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
  DocumentUpload 
} from "./DocumentFormComponents";
import DatePickerSheet from "../sheets/DatePickerSheet";

export function DriversLicenseForm({ state, setState, onPickImage, isEditing }: DocumentFormProps) {
  const [showExpiryDate, setShowExpiryDate] = useState(false);

  const updateState = (updates: Partial<DocumentFormState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <View>
      <SectionCard>
        <FormInput
          value={state.licenseNumber}
          onChange={(v) => updateState({ licenseNumber: v })}
          icon="ribbon-outline"
          placeholder="Enter License Number"
          underline={true}
          multiline={true}
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
        <DocumentUpload
          label="Upload License Photo"
          url={state.documentUrl}
          onPress={() => onPickImage("documentUrl")}
          icon="document-text-outline"
          disabled={!isEditing}
        />
      </SectionCard>


      <SectionCard>
        <FormInput
          label="Notes/Description"
          value={state.notes}
          onChange={(v) => updateState({ notes: v })}
          placeholder="Write a brief note for your preference"
          multiline={true}
          underline={true}
          disabled={!isEditing}
        />
      </SectionCard>

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
