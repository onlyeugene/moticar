export interface TripInsights {
  ecoScore?: number;
  hardBrakeCount?: number;
  rapidAccelerationCount?: number;
  speedingDurationMins?: number;
  idleDurationMins?: number;
}

export interface Location {
  address: string;
  lat?: number;
  lng?: number;
}

export interface Trip {
  id: string;
  carId: string;
  origin: Location;
  destination: Location;
  category?: 'Work' | 'Leisure' | 'Family' | 'Misc';
  description?: string;
  distanceKm: number;
  durationMins?: number;
  startTime: string;
  endTime?: string;
  source: 'manual' | 'obd_gps';
  insights?: TripInsights;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripInput {
  carId: string;
  origin: Location;
  destination: Location;
  distanceKm: number;
  description?: string;
  startTime?: string;
  endTime?: string;
  category?: string;
}

export type ReminderCategory = 
  | 'Toll Fee' 
  | 'Servicing' 
  | 'Dues & Levies' 
  | 'Penalties' 
  | 'Planned Trips' 
  | 'Others';

export interface ReminderDetails {
  // Time (applies to the primary date field — date, startDate, or dueDate)
  time?: string; // "HH:MM" e.g. "14:30". Defaults to "00:00" (midnight) if not set.

  // Shared optional fields
  amount?: number;
  date?: string;
  endDate?: string;
  severity?: 'Urgent' | 'Mid' | 'Low';
  frequency?: string;

  // Planned Trips
  startDate?: string;
  destination?: string;
  tripCategory?: 'Business' | 'Personal' | 'Vacation' | 'Misc';
  budget?: number;

  // Servicing
  serviceCategory?: 'General' | 'Oil Change' | 'Major';
  dueTrigger?: 'Date' | 'Mileage';
  currentMileage?: number;
  estimatedCost?: number;
  technicianId?: string;
  paymentMethod?: 'Cash' | 'Tag' | 'Auto-billing';
  lastServiceDate?: string;
  dueDate?: string;

  // Dues & Levies
  duesCategory?: string;
  issuingAuthority?: string;

  // Penalties
  penaltyCategory?: string;
  imageProof?: string;
  location?: string;
  referenceNumber?: string;

  // Toll Fee
  frequencyType?: 'One-Time' | 'Repeat';
  repeatInterval?: 'Daily' | 'Weekly' | 'Every 2 weeks' | 'Monthly' | 'Yearly';

  // Others
  othersCategory?: 'Expense' | 'Maintenance' | 'Admin' | 'Personal';
}

export interface Reminder {
  id: string;
  _id?: string;
  carId: string;
  category: ReminderCategory;
  name: string;
  emailNotify: boolean;
  notes?: string;
  details: ReminderDetails;
  isProcessed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderInput {
  carId: string;
  category: ReminderCategory;
  name: string;
  emailNotify?: boolean;
  notes?: string;
  details: ReminderDetails;
}

export interface SpendCategory {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface SpendBreakdown {
  period: {
    month: number;
    year: number;
  };
  totalSpend: number;
  count: number;
  lastExpenseDate: string | null;
  comparison: {
    prevTotalSpend: number;
    difference: number;
    percentage: number;
    trend: 'up' | 'down';
    label: string;
  };
  categoryBreakdown: SpendCategory[];
  expenses: any[];
}

export interface TripsResponse {
  count: number;
  trips: Trip[];
}

export interface RemindersResponse {
  summary: Record<string, number>;
  count: number;
  reminders: Reminder[];
}
export interface ActivityInsight {
  id?: string;
  text: string;
  category?: string;
  trend?: string;
  type: string;
  createdAt?: string;
}

export interface InsightsResponse {
  count: number;
  insights: ActivityInsight[];
}
