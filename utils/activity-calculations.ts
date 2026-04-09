import { Trip } from "@/types/activity";
import { Expense } from "@/types/expense";
import { 
  startOfMonth, 
  endOfMonth, 
  isWithinInterval, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameDay 
} from "date-fns";

/**
 * Calculates total mileage for a specific month and year.
 */
export const calculateMonthlyMileage = (trips: Trip[], month: number, year: number) => {
  const referenceDate = new Date(year, month - 1, 1);
  const start = startOfMonth(referenceDate);
  const end = endOfMonth(referenceDate);

  return trips
    .filter((trip) => {
      const tripDate = new Date(trip.startTime);
      return isWithinInterval(tripDate, { start, end });
    })
    .reduce((sum, trip) => sum + trip.distanceKm, 0);
};

/**
 * Groups expenses by day for a specific week of the month.
 */
export const getWeeklySpendData = (expenses: Expense[], month: number, year: number, weekNumber: number) => {
  const monthStart = new Date(year, month - 1, 1);
  
  // Calculate the start day of the week (1-7, 8-14, 15-21, 22-end)
  const startDay = (weekNumber - 1) * 7 + 1;
  const start = new Date(year, month - 1, startDay);
  
  // Calculate the end day of the week, capped at the end of the month
  const monthEnd = endOfMonth(monthStart);
  const endDay = Math.min(startDay + 6, monthEnd.getDate());
  const end = new Date(year, month - 1, endDay);
  
  const days = eachDayOfInterval({ start, end });

  return days.map((day) => {
    const dailyTotal = expenses
      .filter((exp) => isSameDay(new Date(exp.date || exp.createdAt), day))
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      label: format(day, "EEEEE"), // "M", "T", "W", etc.
      amount: dailyTotal,
      dayName: format(day, "EEEE"),
      date: day,
    };
  });
};

/**
 * Calculates Cost Per Mile (CPM) for a given month.
 */
export const calculateCPM = (expenses: Expense[], trips: Trip[], month: number, year: number) => {
  const referenceDate = new Date(year, month - 1, 1);
  const start = startOfMonth(referenceDate);
  const end = endOfMonth(referenceDate);

  const monthlyExpenses = expenses
    .filter((exp) => isWithinInterval(new Date(exp.date || exp.createdAt), { start, end }))
    .reduce((sum, exp) => sum + exp.amount, 0);

  const monthlyMileage = calculateMonthlyMileage(trips, month, year);

  if (monthlyMileage === 0) return 0;
  return monthlyExpenses / monthlyMileage;
};
