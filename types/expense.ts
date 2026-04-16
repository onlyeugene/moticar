import { Technician } from "./technician";

export interface CategoryField {
  _id?: string;
  name: string;
  type: "text" | "select" | "number";
  label: string;
  options?: (string | { label: string; value: string })[];
}

export interface ExpenseItem {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  qty: number;
}

export interface Expense {
  id?: string;
  _id?: string;
  carId: string;
  category: string;
  name: string;
  amount: number;
  currency: string;
  date: string;
  receipts?: string[];
  technicianId?: string | Technician;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Debit Card';
  items?: ExpenseItem[];
  metadata?: Record<string, any>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpensesResponse {
  count: number;
  expenses: Expense[];
}

export interface CreateExpenseInput {
  carId: string;
  category: string;
  name: string;
  amount: number;
  date: string;
  currency?: string;
  receipts?: string[];
  technicianId?: string;
  paymentMethod: string;
  items?: ExpenseItem[];
  metadata?: Record<string, any>;
  notes?: string;
  technicianName?: string;
  technicianSpecialty?: string;
}

export interface UpdateExpenseInput {
  name?: string;
  amount?: number;
  date?: string;
  category?: string;
  currency?: string;
  receipts?: string[];
  technicianId?: string;
  paymentMethod?: string;
  items?: ExpenseItem[];
  metadata?: Record<string, any>;
  notes?: string;
  technicianName?: string;
  technicianSpecialty?: string;
}

export interface ExpenseCategory {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  icon?: string;
  recommendedBudget: number;
  isDefaultCommon: boolean;
  isCommon: boolean;
  budgetRecommended: number;
  budgetLeft: number;
  totalSpentThisMonth: number;
  fields?: CategoryField[];
  lastTechnicianId?: string;
  lastSimilarExpense?: {
    amount: number;
    date: string;
  } | null;
}

export interface ValuationBreakdown {
  estimatedValue: number;
  highestValuationAvg: number;
  aiReasoning?: string;
  currency?: string;
  scores: {
    makeAndYear: string;
    model: string;
    mileageRecorded: string;
    durationOfOwnership: string;
    faultsHistory: string;
    modifications: string;
  };
  assumptions: string[];
}

export interface PriceRecommendationInput {
  categoryId: string;
  carId: string;
  country?: string;
  city?: string;
}

export interface PriceRecommendation {
  suggestedPrice: number;
  range: {
    min: number;
    max: number;
  };
  confidence: number;
  reasoning: string;
}

export interface CategoriesResponse {
  count: number;
  categories: ExpenseCategory[];
}

export interface ScanReceiptResponse {
  name: string;
  amount: number;
  date: string;
  currency: string;
  category?: string;
  notes?: string;
  technicianName?: string;
  technicianSpecialty?: string;
  partsCost?: number;
  laborCost?: number;
  originalAmount?: number;
  originalCurrency?: string;
  receiptUrl: string;
}
