
export type DocumentCategory = 
  | "MOT" 
  | "Vehicle License" 
  | "Road Tax" 
  | "Service History" 
  | "Driver’s License" 
  | "Insurance" 
  | "Emissions / Inspection"
  | "New Entry";

export interface DocumentFormState {
  // Common fields
  amount: number;
  startDate: Date | null;
  expiryDate: Date | null;
  issueDate: Date | null;
  testDate: Date | null;
  serviceDate: Date | null;
  mileage: string;
  notes: string;
  issuingAuthority: string;
  documentUrl: string | null;
  receiptUrl: string | null;
  invoiceUrl: string | null;
  
  // MOT specific
  result: "Pass" | "Fail" | "";
  testCentreName: string;
  certificateNumber: string;
  
  // Vehicle License specific
  vin: string;
  
  // Road Tax specific
  frequency: "Monthly" | "Bi-Annual" | "Annual" | "";
  paymentStatus: "Paid" | "Pending" | "";
  paymentMethod: "Cash" | "Card" | "Others" | "";
  
  // Service History specific
  serviceType: "Interim" | "Full" | "Major" | "Manufacturer" | "";
  garageName: string;
  partsReplaced: Array<{ id: string; item: string }>;
  
  // Driver's License specific
  licenseNumber: string;
  
  // Insurance specific
  provider: string; 
  policyNumber: string;
  coverageType: "Third-party" | "Comprehensive" | "Fire & Theft" | "";
  paymentPlan: "Monthly" | "Annual" | "";

  // New Entry specific
  documentName: string;
  subCategory: string;
  doesNotExpire: boolean;
  paymentFrequency: "One-time" | "Monthly" | "Annual" | "";
}


export interface DocumentFormProps {
  state: DocumentFormState;
  setState: React.Dispatch<React.SetStateAction<DocumentFormState>>;
  carId?: string;
  vin?: string;
  plate?: string;
  isEditing?: boolean;
  onPickImage: (field: keyof Pick<DocumentFormState, 'documentUrl' | 'receiptUrl' | 'invoiceUrl'>) => void;
}

export const CATEGORY_DEFAULTS: DocumentFormState = {
  amount: 0,
  startDate: null,
  expiryDate: null,
  issueDate: null,
  testDate: null,
  serviceDate: null,
  mileage: "",
  notes: "",
  issuingAuthority: "",
  documentUrl: null,
  receiptUrl: null,
  invoiceUrl: null,
  
  result: "",
  testCentreName: "",
  certificateNumber: "",

  
  vin: "",
  
  frequency: "",
  paymentStatus: "",
  paymentMethod: "",
  
  serviceType: "",
  garageName: "",
  partsReplaced: [{ id: Math.random().toString(), item: "" }],
  
  licenseNumber: "",
  
  provider: "",
  policyNumber: "",
  coverageType: "",
  paymentPlan: "",

  documentName: "",
  subCategory: "",
  doesNotExpire: false,
  paymentFrequency: "",
};
