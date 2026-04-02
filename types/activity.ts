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

export interface Reminder {
  id: string;
  carId: string;
  category: 'Toll Fee' | 'Servicing' | 'Dues & Levies' | 'Penalties' | 'Planned Trips' | 'Others';
  name: string;
  amount?: number;
  date: string;
  frequency: 'One-Time' | 'Repeat';
  severity: 'Urgent' | 'Mid' | 'Low';
  emailNotify: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderInput {
  carId: string;
  category: string;
  name: string;
  amount?: number;
  date: string;
  frequency: string;
  severity: string;
  emailNotify?: boolean;
  notes?: string;
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
