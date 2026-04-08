import { useCreateReminder } from "@/hooks/useActivity";
import { useAuthStore } from "@/store/useAuthStore";
import { ReminderCategory } from "@/types/activity";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DuesAndLeviesForm } from "@/components/reminder-forms/DuesAndLeviesForm";
import { OthersForm } from "@/components/reminder-forms/OthersForm";
import { PenaltiesForm } from "@/components/reminder-forms/PenaltiesForm";
import { PlannedTripsForm } from "@/components/reminder-forms/PlannedTripsForm";
import { ServicingForm } from "@/components/reminder-forms/ServicingForm";
import { TollFeeForm } from "@/components/reminder-forms/TollFeeForm";
import { CATEGORY_DEFAULTS, ReminderFormState } from "@/components/reminder-forms/types";

interface AddReminderSheetProps {
  visible: boolean;
  onClose: () => void;
  category: string;
  carId: string;
}

const FORM_MAP: Record<string, React.ComponentType<any>> = {
  "Toll Fee": TollFeeForm,
  Servicing: ServicingForm,
  "Dues & Levies": DuesAndLeviesForm,
  Penalties: PenaltiesForm,
  "Planned Trips": PlannedTripsForm,
  Others: OthersForm,
};

export default function AddReminderSheet({
  visible,
  onClose,
  category,
  carId,
}: AddReminderSheetProps) {
  const user = useAuthStore((s) => s.user);
  const { mutate: createReminder, isPending } = useCreateReminder();
  const [formState, setFormState] = useState<ReminderFormState>({
    ...CATEGORY_DEFAULTS,
  });

  React.useEffect(() => {
    if (visible) setFormState({ ...CATEGORY_DEFAULTS });
  }, [visible, category]);

  const saveEnabled =
    !!formState.date !== null &&
    (!!formState.name ||
      !!formState.serviceCategory ||
      ["Dues & Levies", "Penalties"].includes(category));

  const handleSave = useCallback(() => {
    // Build category-specific details object
    const buildDetails = (): any => {
      const time = formState.time || undefined;

      switch (category) {
        case "Toll Fee":
          return {
            amount: formState.amount,
            date: formState.date?.toISOString(),
            time,
            frequencyType: (formState.frequencyMode || "One-Time") as any,
            repeatInterval:
              formState.frequencyMode === "Repeat"
                ? (formState.frequency as any)
                : undefined,
            paymentMethod: formState.paymentMethod as any,
            severity: formState.severity as any,
          };
        case "Servicing":
          return {
            serviceCategory: formState.serviceCategory as any,
            dueTrigger: formState.dueTrigger as any,
            currentMileage: formState.mileage
              ? Number(formState.mileage)
              : undefined,
            dueDate: formState.date?.toISOString(),
            time,
            estimatedCost: formState.amount,
            technicianId: (formState.technician as any)?._id,
            paymentMethod: formState.paymentMethod as any,
            severity: formState.severity as any,
            lastServiceDate: formState.lastServiceDate?.toISOString(),
          };
        case "Dues & Levies":
          return {
            duesCategory: formState.serviceCategory,
            dueDate: formState.date?.toISOString(),
            time,
            amount: formState.amount,
            issuingAuthority: formState.issuingAuthority,
            frequency: formState.frequency,
            severity: formState.severity as any,
          };
        case "Penalties":
          return {
            penaltyCategory: formState.serviceCategory,
            dueDate: formState.date?.toISOString(),
            time,
            amount: formState.amount,
            issuingAuthority: formState.issuingAuthority,
            referenceNumber: formState.reference,
            severity: formState.severity as any,
          };
        case "Planned Trips":
          return {
            startDate: formState.date?.toISOString(),
            time,
            endDate: formState.endDate?.toISOString(),
            destination: formState.destination,
            tripCategory: formState.serviceCategory as any,
            budget: formState.amount,
          };
        case "Others":
          return {
            date: formState.date?.toISOString(),
            time,
            endDate: formState.endDate?.toISOString(),
            othersCategory: formState.serviceCategory as any,
            budget: formState.amount,
            frequency: formState.frequency,
          };
        default:
          return { date: formState.date?.toISOString(), time };
      }
    };

    createReminder(
      {
        carId,
        category: category as ReminderCategory,
        name: formState.name || formState.serviceCategory || category,
        emailNotify: formState.emailNotify,
        notes: formState.notes,
        details: buildDetails(),
      },
      {
        onSuccess: () => {
          onClose();
          setFormState({ ...CATEGORY_DEFAULTS });
        },
      },
    );
  }, [formState, carId, category, createReminder, onClose]);

  const ActiveForm = FORM_MAP[category];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.container}>
          <SafeAreaView style={{ flex: 1 }}>
            {/* Header */}
            <View className="flex-row items-start px-5 pt-5 pb-4">
              <TouchableOpacity onPress={onClose} className="mr-4 mt-1">
                <Ionicons name="close" size={22} color="#293536" />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-[#00AEB5] font-lexendRegular text-[11px] mb-0.5">
                  Reminder
                </Text>
                <Text className="text-[#001A1F] font-lexendBold text-[22px]">
                  {category}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleSave}
                disabled={!saveEnabled || isPending}
                className={`px-5 py-2 rounded-full mt-1 ${saveEnabled && !isPending ? "bg-[#29D7DE]" : "bg-[#29D7DE]/40"}`}
              >
                <Text className="text-[#00343F] font-lexendBold text-[14px]">
                  {isPending ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ flex: 1, backgroundColor: "#F5F5F5" }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 60, paddingTop: 8 }}
            >
              {ActiveForm && (
                <ActiveForm
                  state={formState}
                  setState={setFormState}
                  userEmail={user?.email || "your email"}
                  carId={carId}
                />
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "93%",
  },
});
