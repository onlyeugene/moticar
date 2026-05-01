import React, { useState, useMemo } from "react";
import { Text, TouchableOpacity, View, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SpendBreakdown } from "@/types/activity";
import ExpenseDoughnutChart from "../dashboard/ExpenseDoughnutChart";
import TechnicianDoughnutChart from "./TechnicianDoughnutChart";
import Share from "@/assets/icons/share.svg";
import {
  format,
  subMonths,
  subDays,
  subWeeks,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  isWithinInterval,
  isSameMonth,
  isSameYear,
  eachWeekOfInterval,
  eachDayOfInterval,
  eachMonthOfInterval,
} from "date-fns";

interface SpendStatsCardProps {
  spendData?: SpendBreakdown;
  currencySymbol: string;
  filterType: string;
  timeFilter: "Weekly" | "Monthly" | "Yearly";
  setTimeFilter: (filter: "Weekly" | "Monthly" | "Yearly") => void;
  selectedDate: Date;
}

const SpendStatsCard: React.FC<SpendStatsCardProps> = ({
  spendData,
  currencySymbol,
  filterType,
  timeFilter,
  setTimeFilter,
  selectedDate,
}) => {
  const isByTechnician = filterType === "By Car Technicians";

  const chartInfo = useMemo(() => {
    const expenses = (spendData as any)?.allExpenses || spendData?.expenses || [];
    const labels: string[] = [];
    const data: { current: number; prev: number }[] = [];
    const anchorDate = selectedDate;

    if (timeFilter === "Yearly") {
      const yearStart = startOfYear(anchorDate);
      const yearEnd = endOfYear(anchorDate);
      const monthsInYear = eachMonthOfInterval({ start: yearStart, end: yearEnd });

      monthsInYear.forEach((m) => {
        const currentTotal = expenses
          .filter((e) => {
            const expDate = new Date(e.date);
            return isSameMonth(expDate, m) && isSameYear(expDate, m);
          })
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        const prevYearMonth = subYears(m, 1);
        const prevTotal = expenses
          .filter((e) => {
            const expDate = new Date(e.date);
            return isSameMonth(expDate, prevYearMonth) && isSameYear(expDate, prevYearMonth);
          })
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        labels.push(format(m, "MMM"));
        data.push({ current: currentTotal, prev: prevTotal });
      });
    } else if (timeFilter === "Monthly") {
      const monthStart = startOfMonth(anchorDate);
      const monthEnd = endOfMonth(anchorDate);
      const weeksInMonth = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 0 });

      weeksInMonth.forEach((w, i) => {
        const start = startOfWeek(w);
        const end = endOfWeek(w);
        const prevYearDate = subYears(w, 1);
        const prevStart = startOfWeek(prevYearDate);
        const prevEnd = endOfWeek(prevYearDate);

        const currentTotal = expenses
          .filter((e) => {
            const expDate = new Date(e.date);
            return isWithinInterval(expDate, { start, end });
          })
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        const prevTotal = expenses
          .filter((e) => {
            const expDate = new Date(e.date);
            return isWithinInterval(expDate, { start: prevStart, end: prevEnd });
          })
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        labels.push(`Week ${i + 1}`);
        data.push({ current: currentTotal, prev: prevTotal });
      });
    } else if (timeFilter === "Weekly") {
      const weekStart = startOfWeek(anchorDate);
      const weekEnd = endOfWeek(anchorDate);
      const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

      daysInWeek.forEach((d) => {
        const prevDay = subWeeks(d, 1);
        const currentTotal = expenses
          .filter((e) => {
            const expDate = new Date(e.date);
            return format(expDate, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd');
          })
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        const prevTotal = expenses
          .filter((e) => {
            const expDate = new Date(e.date);
            return format(expDate, 'yyyy-MM-dd') === format(prevDay, 'yyyy-MM-dd');
          })
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        labels.push(format(d, "EEE"));
        data.push({ current: currentTotal, prev: prevTotal });
      });
    }

    const allValues = data.flatMap((d) => [d.current, d.prev]);
    const maxVal = Math.max(...allValues, 1) * 1.1; // Add 10% ceiling
    return { labels, data, maxVal };
  }, [spendData?.expenses, timeFilter, selectedDate]);

  const { labels, data: chartData, maxVal } = chartInfo;

  // Total for the entire selected period (week/month/year)
  const currentTotal = chartData.reduce((sum, item) => sum + item.current, 0);

  return (
    <View className="bg-white rounded-[10px] p-6 mb-8 shadow-sm border border-[#F0F0F0]">
      {/* Header with Share Icon */}
      <View className=" mb-4">
        {/* Amount Centered */}
        <View className="flex-row items-center justify-between">
          <View>
            
          </View>
          <Text className="text-[#001013] text-[1.25rem] font-lexendSemiBold">
            {currentTotal > 0
              ? `${currencySymbol}${currentTotal.toLocaleString()}`
              : "No data"}
          </Text>

          <View className=" ">
            <TouchableOpacity>
              <Share width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {!isByTechnician ? (
        <>
          {/* Legend */}
          <View className="flex-row justify-center gap-6 mb-8">
            <View className="flex-row items-center gap-2">
              <View className="w-5 h-5 rounded-full border-2 border-[#29D7DE]" />
              <Text className="text-[#848A9C] text-[0.875rem] font-lexendRegular">
                Current
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-5 h-5 rounded-full border-2 border-[#FDEF56]" />
              <Text className="text-[#848A9C] text-[0.875rem] font-lexendRegular">
                Comparatively
              </Text>
            </View>
          </View>

          {/* New Styled Bar Chart */}
          <View className="h-[200px] flex-row items-end justify-between px-2">
            {chartData.map((item, i) => {
              const currentHeight =
                maxVal > 0 ? (item.current / maxVal) * 140 : 0;
              const prevHeight = maxVal > 0 ? (item.prev / maxVal) * 140 : 0;

              return (
                <View key={i} className="items-center">
                  <View className="flex-row gap-2 items-end mb-3">
                    <View
                      style={{ height: Math.max(currentHeight, 0) }}
                      className="w-[6px] bg-[#29D7DE] rounded-full"
                    />
                    <View
                      style={{ height: Math.max(prevHeight, 0) }}
                      className="w-[6px] bg-[#FDEF56] rounded-full"
                    />
                  </View>
                  <Text className="text-[#ADADAD] text-[0.625rem] font-lexendRegular">
                    {labels[i]}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      ) : (
        <View className="items-center justify-center py-6">
          {(() => {
            const expenses = (spendData as any)?.allExpenses || spendData?.expenses || [];
            const filteredExpenses = expenses.filter((exp: any) => {
              const expDate = new Date(exp.date);
              if (timeFilter === "Monthly") {
                return (
                  isSameMonth(expDate, selectedDate) &&
                  isSameYear(expDate, selectedDate)
                );
              } else if (timeFilter === "Weekly") {
                const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
                const end = addWeeks(start, 1);
                return expDate >= start && expDate < end;
              } else if (timeFilter === "Yearly") {
                return isSameYear(expDate, selectedDate);
              }
              return true;
            });

            if (filteredExpenses.length === 0) {
              return (
                <View className="items-center justify-center h-[180px]">
                  <Ionicons
                    name="pie-chart-outline"
                    size={48}
                    color="#E2E2E2"
                  />
                  <Text className="text-[#ADADAD] text-[0.75rem] font-lexendRegular mt-2">
                    No Technician Spend
                  </Text>
                </View>
              );
            }

            const techGroups: Record<string, number> = {};
            filteredExpenses.forEach((exp: any) => {
              const name =
                typeof exp.technicianId === "object"
                  ? exp.technicianId?.name
                  : exp.metadata?.workshopName || "Unknown Technician";
              techGroups[name] =
                (techGroups[name] || 0) + Number(exp.amount || 0);
            });

            const donorData = Object.entries(techGroups).map(
              ([name, amount]) => ({
                name,
                amount,
                percentage: (amount / (currentTotal || 1)) * 100,
              }),
            );

            return <TechnicianDoughnutChart data={donorData} size={220} />;
          })()}
        </View>
      )}
    </View>
  );
};

export default SpendStatsCard;
