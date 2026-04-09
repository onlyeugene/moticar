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
  email?: string;
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
  email?: string;
}

export type TechnicianCategory = 
  | "Panel Beater" 
  | "Painter" 
  | "Rewire" 
  | "Diagnostic Technician" 
  | "Auto Upholsterer" 
  | "Vinyl Wrapper"
  | "Diesel Mechanic"
  | "Key"
  | "Auto Glass"
  | "Auto Electronics"
  | "HVAC"
  | "Lubrication"
  | "MOT Tester"
  | "Tire/Exhaust"
  | "Heating & Air Conditioning"
  | "Others";

export const TECHNICIAN_CATEGORIES: TechnicianCategory[] = [
  "Panel Beater",
  "Painter",
  "Rewire",
  "Diagnostic Technician",
  "Auto Upholsterer",
  "Vinyl Wrapper",
  "Diesel Mechanic",
  "Key",
  "Auto Glass",
  "Auto Electronics",
  "HVAC",
  "Lubrication",
  "MOT Tester",
  "Tire/Exhaust",
  "Heating & Air Conditioning",
  "Others"
];
