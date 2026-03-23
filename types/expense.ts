export interface CategoryField {
  _id?: string;
  name: string;
  type: 'text' | 'select' | 'number';
  label: string;
  options?: string[];
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
// ... (rest same)
  name: string;
  amount: number;
  currency: string;
  date: string;
  receiptUrl?: string;
  technicianId?: string;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Debit Card';
  items?: ExpenseItem[];
  metadata?: Record<string, any>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseInput {
  carId: string;
  category: string;
  name: string;
  amount: number;
  date: string;
  currency?: string;
  receiptUrl?: string;
  technicianId?: string;
  paymentMethod: string;
  items?: ExpenseItem[];
  metadata?: Record<string, any>;
  notes?: string;
}

export interface UpdateExpenseInput {
  name?: string;
  amount?: number;
  date?: string;
  category?: string;
  currency?: string;
  receiptUrl?: string;
  technicianId?: string;
  paymentMethod?: string;
  items?: ExpenseItem[];
  metadata?: Record<string, any>;
  notes?: string;
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
  lastSimilarExpense?: {
    amount: number;
    date: string;
  } | null;
}

export interface ValuationBreakdown {
  estimatedValue: number;
  highestValuationAvg: number;
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
