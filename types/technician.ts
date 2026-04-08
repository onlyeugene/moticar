export interface Technician {
  _id: string;
  id?: string;
  name: string;
  specialty: string;
  phone?: string;
  location?: string;
  notes?: string;
  businessName?: string;
  avatarUrl?: string;
  createdAt?: string;
  isVerified?: boolean;
}

export interface CreateTechnicianInput {
  name: string;
  specialty: string;
  phone: string;
  location?: string;
  notes?: string;
  businessName?: string;
  avatarUrl?: string;
}

export type TechnicianCategory = 
  | "Mechanic" 
  | "Panel Beater" 
  | "Car Washer" 
  | "Rewire" 
  | "Upholstery" 
  | "Others";

export const TECHNICIAN_CATEGORIES: TechnicianCategory[] = [
  "Mechanic",
  "Panel Beater",
  "Car Washer",
  "Rewire",
  "Upholstery",
  "Others"
];
