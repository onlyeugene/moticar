import React, { useState } from "react";
import { View, Text } from "react-native";
import { DocumentFormProps, DocumentFormState } from "./types";
import {
  SectionCard,
  FormInput,
  DateSelectRow,
  DocumentUpload,
  PillSelector,
} from "./DocumentFormComponents";
import DatePickerSheet from "../sheets/DatePickerSheet";

export function VehicleLicenseForm({
  state,
  setState,
  vin,
  plate,
  onPickImage,
  isEditing,
}: DocumentFormProps) {
  const [showIssueDate, setShowIssueDate] = useState(false);
  const [showExpiryDate, setShowExpiryDate] = useState(false);

  const updateState = (updates: Partial<DocumentFormState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <View>
      <SectionCard backgroundColor="bg-[#F9F9F9]">
        <View className="flex-row flex-1 items-center justify-between">
          <View className="flex-1">
            <FormInput
              label="VIN"
              value={state.vin || vin || ""}
              onChange={(v) => updateState({ vin: v })}
              placeholder="Enter VIN"
              disabled={!isEditing}
            />
          </View>
          <View className="mb-4">
            <View className="flex-row items-center justify-between mt-2">
              <View>
            <View className="bg-white border border-[#EFEFEF] shadow-sm px-3 h-[44px] items-center justify-center rounded-lg">
              <Text className="text-[#006C70] font-ukNumberPlate text-[18px]">
                {plate || "No Plate"}
              </Text>
            </View>
          </View>
        </View>
          </View>
        </View>
      </SectionCard>
      <SectionCard margin="">
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
        <PillSelector
          label="Issuing Authority"
          options={["DVLA", "State DMV", "Others"]}
          selected={state.issuingAuthority}
          onSelect={(v) => updateState({ issuingAuthority: v })}
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
