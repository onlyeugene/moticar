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
    const expenses = spendData?.expenses || [];
    const labels: string[] = [];
    const data: { current: number; prev: number }[] = [];
    const anchorDate = selectedDate;

    if (timeFilter === "Monthly") {
      const displayMonths = [
        subMonths(anchorDate, 5),
        subMonths(anchorDate, 4),
        subMonths(anchorDate, 3),
        subMonths(anchorDate, 2),
        subMonths(anchorDate, 1),
        anchorDate,
      ];

      displayMonths.forEach((d) => {
        const currentTotal = expenses
          .filter((e) => {
            const expDate = new Date(e.date);
            return isSameMonth(expDate, d) && isSameYear(expDate, d);
          })
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        const prevTotal = expenses
          .filter((e) => {
            const expDate = new Date(e.date);
            const prevMonth = subMonths(d, 1);
            return (
              isSameMonth(expDate, prevMonth) && isSameYear(expDate, prevMonth)
            );
          })
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        labels.push(format(d, "MMM"));
        data.push({ current: currentTotal, prev: prevTotal });
      });
    } else if (timeFilter === "Weekly") {
      // Current week and 5 previous weeks
      const displayWeeks = [
        subWeeks(anchorDate, 5),
        subWeeks(anchorDate, 4),
        subWeeks(anchorDate, 3),
        subWeeks(anchorDate, 2),
        subWeeks(anchorDate, 1),
        anchorDate,
      ];

      displayWeeks.forEach((d, i) => {
        const start = startOfWeek(d);
        const end = endOfWeek(d);
        const prevStart = startOfWeek(subWeeks(d, 1));
        const prevEnd = endOfWeek(subWeeks(d, 1));

        const currentTotal = expenses
          .filter((e) => {
            const expDate = new Date(e.date);
            return isWithinInterval(expDate, { start, end });
          })
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        const prevTotal = expenses
          .filter((e) => {
            const expDate = new Date(e.date);
            return isWithinInterval(expDate, {
              start: prevStart,
              end: prevEnd,
            });
          })
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        labels.push(format(start, "d MMM"));
        data.push({ current: currentTotal, prev: prevTotal });
      });
    } else if (timeFilter === "Yearly") {
      for (let i = 4; i >= 0; i--) {
        const d = subYears(anchorDate, i);
        const currentTotal = expenses
          .filter((e) => {
            const expDate = new Date(e.date);
            return isSameYear(expDate, d);
          })
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        const prevTotal = expenses
          .filter((e) => {
            const expDate = new Date(e.date);
            return isSameYear(expDate, subYears(d, 1));
          })
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        labels.push(format(d, "yyyy"));
        data.push({ current: currentTotal, prev: prevTotal });
      }
    }

    const allValues = data.flatMap((d) => [d.current, d.prev]);
    const maxVal = Math.max(...allValues, 100000);
    return { labels, data, maxVal };
  }, [spendData?.expenses, timeFilter, selectedDate]);

  const { labels, data: chartData, maxVal } = chartInfo;

  // Latest data point
  const latestData = chartData[chartData.length - 1] || { current: 0, prev: 0 };
  const currentTotal = latestData.current;

  return (
    <View className="bg-white rounded-[10px] p-6 mb-8 shadow-sm border border-[#F0F0F0]">
      {/* Header with Share Icon */}
      <View className=" mb-4">
        {/* Amount Centered */}
        <View className="flex-row items-center justify-between">
          <View>
            
          </View>
          <Text className="text-[#001013] text-[20px] font-lexendSemiBold">
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
              <Text className="text-[#848A9C] text-[14px] font-lexendRegular">
                Current
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-5 h-5 rounded-full border-2 border-[#FDEF56]" />
              <Text className="text-[#848A9C] text-[14px] font-lexendRegular">
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
                  <Text className="text-[#ADADAD] text-[10px] font-lexendRegular">
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
            const expenses = spendData?.expenses || [];
            const filteredExpenses = expenses.filter((exp) => {
              const expDate = new Date(exp.date);
              return (
                isSameMonth(expDate, selectedDate) &&
                isSameYear(expDate, selectedDate)
              );
            });

            if (filteredExpenses.length === 0) {
              return (
                <View className="items-center justify-center h-[180px]">
                  <Ionicons
                    name="pie-chart-outline"
                    size={48}
                    color="#E2E2E2"
                  />
                  <Text className="text-[#ADADAD] text-[12px] font-lexendRegular mt-2">
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
