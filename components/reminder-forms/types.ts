import { Technician } from "@/types/technician";

export interface ReminderFormState {
  name: string;
  amount: number;
  date: Date | null;
  endDate: Date | null;
  lastServiceDate: Date | null;
  time: string;
  frequency: string;
  frequencyMode: string;
  severity: string;
  emailNotify: boolean;
  notes: string;
  paymentMethod: string;
  serviceCategory: string;
  dueTrigger: string;
  mileage: string;
  technician: Technician | null;
  issuingAuthority: string;
  reference: string;
  destination: string;
}

export interface ReminderFormProps {
  state: ReminderFormState;
  setState: React.Dispatch<React.SetStateAction<ReminderFormState>>;
  userEmail: string;
  carId?: string;
}

export const CATEGORY_DEFAULTS: ReminderFormState = {
  name: "",
  amount: 0,
  date: null,
  endDate: null,
  lastServiceDate: null,
  time: "",
  frequency: "",
  frequencyMode: "",
  severity: "",
  emailNotify: false,
  notes: "",
  paymentMethod: "",
  serviceCategory: "",
  dueTrigger: "",
  mileage: "",
  technician: null,
  issuingAuthority: "",
  reference: "",
  destination: "",
};
