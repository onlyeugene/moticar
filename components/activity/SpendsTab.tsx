import React, { useState, useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SpendBreakdown } from "@/types/activity";
import SpendStatsCard from "./SpendStatsCard";
import ActivityEmptyState from "./ActivityEmptyState";
import { Expense } from "@/types/expense";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import Calendar from "@/assets/icons/calendar.svg";
import ExpenseBreakdownSheet from "../sheets/ExpenseBreakdownSheet";

interface SpendsTabProps {
  spendData?: SpendBreakdown;
  currencySymbol: string;
  onShareExpense?: () => void;
}

const ExpenseGroupItem = ({
  date,
  totalAmount,
  entriesCount,
  categories,
  currencySymbol,
  isFirst,
  isLast,
  onPress,
}: {
  date: string;
  totalAmount: number;
  entriesCount: number;
  categories: string[];
  currencySymbol: string;
  isFirst?: boolean;
  isLast?: boolean;
  onPress?: () => void;
}) => {
  const formattedDate = new Date(date);
  
  // Custom label formatting based on whether it's a specific date or a period
  const isSpecificTime = date.includes('T') || date.includes(':');
  const day = isSpecificTime ? format(formattedDate, "dd/MM") : format(formattedDate, "dd/MM");
  const time = isSpecificTime ? format(formattedDate, "HH:mm") : "";

  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white border border-[#F0F0F0] rounded-[12px] p-4 flex-row items-center mb-4"
    >
      <View className="items-center justify-center mr-4 w-[50px]">
        {!isFirst && (
          <View 
            className="absolute w-[1px] bg-[#D1D5D4]" 
            style={{ top: -20, bottom: '50%' }} 
          />
        )}
        {!isLast && (
          <View 
            className="absolute w-[1px] bg-[#D1D5D4]" 
            style={{ top: '50%', bottom: -20 }} 
          />
        )}
        <View className="w-[50px] h-[50px] rounded-full border border-[#D1D5D4] bg-white items-center justify-center z-10">
          <View className="items-center">
            <Calendar width={20} height={20} />
            <Text className="text-[#006C70] text-[8px] font-lexendRegular mt-0.5">
              {day}
            </Text>
            {time !== "" && (
              <Text className="text-[#006C70] text-[8px] font-lexendRegular">
                {time}
              </Text>
            )}
          </View>
        </View>
      </View>


      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-[#000000] text-[16px] font-lexendMedium">
              {currencySymbol}
              {totalAmount.toLocaleString()}
            </Text>
            <View className="bg-[#7AE6EB] px-2 py-0.5 rounded-full">
              <Text className="text-[#006C70] text-[10px] font-lexendMedium">
                {entriesCount} entries
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#7BA0A3" />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mt-1"
        >
          {categories.map((cat, idx) => (
            <View
              key={idx}
              className="bg-[#DEDEDE] px-3 py-1 rounded-[3px] items-center justify-center mr-2"
            >
              <Text className="text-[#A1A1A1] text-[10px] font-lexendRegular">
                {cat}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
};

const TechnicianGroupItem = ({
  name,
  specialty,
  totalAmount,
  entriesCount,
  currencySymbol,
  color,
  onPress,
}: {
  name: string;
  specialty?: string;
  totalAmount: number;
  entriesCount: number;
  currencySymbol: string;
  color: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white border border-[#F0F0F0] rounded-[16px] p-4 flex-row gap-3 items-start mb-4"
    >
      <View
        style={{ backgroundColor: color }}
        className="w-2.5 h-2.5 rounded-full "
      />

      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <View>
              <Text className="text-[#000000] text-[12px] font-lexendRegular">
                {name}
              </Text>
              <Text className="text-[#000000] text-[16px] font-lexendMedium">
                {currencySymbol}
                {totalAmount.toLocaleString()}
              </Text>
            </View>
            <View className="bg-[#7AE6EB] px-2 py-0.5 rounded-full">
              <Text className="text-[#006C70] text-[10px] font-lexendMedium">
                {entriesCount} entries
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#7BA0A3" />
        </View>

        {specialty && (
          <View className="bg-[#DEDEDE] px-3 py-1 rounded-[3px] self-start">
            <Text className="text-[#A1A1A1] text-[10px] font-lexendRegular">
              {specialty}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const SpendsTab: React.FC<SpendsTabProps> = ({
  spendData,
  currencySymbol,
  onShareExpense,
}) => {
  const [filterType, setFilterType] = useState("Show All");
  const [timeFilter, setTimeFilter] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  
  const [isBreakdownVisible, setIsBreakdownVisible] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState<Expense[]>([]);

  const isByTechnician = filterType === "By Car Technicians";
  const hasExpenses =
    spendData && spendData.expenses && spendData.expenses.length > 0;

  // Colors for technicians
  const TECH_COLORS = ["#00AEB5", "#FBE74C", "#FF7A00", "#A15BFF", "#29D7DE"];

  // Grouping logic
  const groupedData = useMemo(() => {
    if (!spendData?.expenses) return [];

    if (isByTechnician) {
      const groups: Record<
        string,
        { name: string; specialty?: string; total: number; entries: number; expenses: any[] }
      > = {};

      spendData.expenses.forEach((exp: any) => {
        const techName =
          typeof exp.technicianId === "object"
            ? exp.technicianId?.name
            : exp.metadata?.workshopName || "Unknown Technician";
        const specialty =
          typeof exp.technicianId === "object"
            ? exp.technicianId?.specialty
            : exp.metadata?.specialty || "General";

        if (!groups[techName]) {
          groups[techName] = {
            name: techName,
            specialty: specialty,
            total: 0,
            entries: 0,
            expenses: [],
          };
        }
        groups[techName].total += exp.amount;
        groups[techName].entries += 1;
        groups[techName].expenses.push(exp);
      });

      return Object.values(groups).sort((a, b) => b.total - a.total);
    } else {
      const groups: Record<
        string,
        {
          date: string;
          total: number;
          entries: number;
          categories: Set<string>;
          expenses: any[];
        }
      > = {};

      spendData.expenses.forEach((exp: any) => {
        let dateKey: string;
        let displayDate: string;

        if (timeFilter === 'Monthly') {
          dateKey = format(new Date(exp.date), "yyyy-MM");
          displayDate = format(startOfMonth(new Date(exp.date)), "yyyy-MM-dd");
        } else if (timeFilter === 'Weekly') {
          dateKey = format(startOfWeek(new Date(exp.date)), "'Week' w, yyyy");
          displayDate = format(startOfWeek(new Date(exp.date)), "yyyy-MM-dd");
        } else if (timeFilter === 'Yearly') {
          dateKey = format(new Date(exp.date), "yyyy");
          displayDate = format(startOfYear(new Date(exp.date)), "yyyy-MM-dd");
        } else {
          dateKey = format(new Date(exp.date), "yyyy-MM-dd HH:mm");
          displayDate = exp.date;
        }

        if (!groups[dateKey]) {
          groups[dateKey] = {
            date: displayDate,
            total: 0,
            entries: 0,
            categories: new Set(),
            expenses: [],
          };
        }
        groups[dateKey].total += exp.amount;
        groups[dateKey].entries += 1;
        groups[dateKey].categories.add(exp.category);
        groups[dateKey].expenses.push(exp);
      });

      return Object.values(groups).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }
  }, [spendData?.expenses, isByTechnician, timeFilter]);

  return (
    <View className="pb-20">
      {/* Spend toggle */}
      <View className="bg-[#DCE7E6] rounded-full p-1.5 flex-row mb-6">
        <TouchableOpacity
          onPress={() => setFilterType("Show All")}
          className={`flex-1 py-3 rounded-full items-center justify-center ${
            filterType === "Show All" ? "bg-white shadow-sm" : ""
          }`}
        >
          <Text
            className={`text-[12px] font-lexendMedium ${
              filterType === "Show All" ? "text-[#00AEB5]" : "text-[#667085]"
            }`}
          >
            Show All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilterType("By Car Technicians")}
          className={`flex-1 py-3 rounded-full items-center justify-center ${
            filterType === "By Car Technicians" ? "bg-white shadow-sm" : ""
          }`}
        >
          <Text
            className={`text-[12px]  ${
              filterType === "By Car Technicians"
                ? "text-[#00AEB5] font-lexendMedium"
                : "text-[#96A1A1] font-lexendRegular"
            }`}
          >
            By Car Technicians
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Card */}
      <SpendStatsCard
        spendData={spendData}
        currencySymbol={currencySymbol}
        filterType={filterType}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
      />

      <TouchableOpacity
        onPress={onShareExpense}
        className=" border border-[#29D7DE] rounded-full h-[40px] items-center justify-center mb-8"
      >
        <Text className="text-[#00AEB5] text-[14px] font-lexendSemiBold">
          Share this expense
        </Text>
      </TouchableOpacity>

      {hasExpenses ? (
        <View className="space-y-4">
          {groupedData.map((group: any, idx) =>
            isByTechnician ? (
              <TechnicianGroupItem
                key={idx}
                name={group.name}
                specialty={group.specialty}
                totalAmount={group.total}
                entriesCount={group.entries}
                currencySymbol={currencySymbol}
                color={TECH_COLORS[idx % TECH_COLORS.length]}
                onPress={() => {
                  setSelectedExpenses(group.expenses);
                  setIsBreakdownVisible(true);
                }}
              />
            ) : (
              <ExpenseGroupItem
                key={idx}
                date={group.date}
                totalAmount={group.total}
                entriesCount={group.entries}
                categories={Array.from(group.categories)}
                currencySymbol={currencySymbol}
                isFirst={idx === 0}
                isLast={idx === groupedData.length - 1}
                onPress={() => {
                    setSelectedExpenses(group.expenses);
                    setIsBreakdownVisible(true);
                }}
              />
            ),
          )}
        </View>
      ) : (
        <View className="items-center justify-center py-10 opacity-40">
          <View className="w-20 h-20 bg-[#F0F0F0] rounded-full items-center justify-center mb-4">
            <Ionicons name="pie-chart-outline" size={32} color="#ADADAD" />
          </View>
          <Text className="text-[#ADADAD] text-[14px] font-lexendRegular">
            No spends recorded
          </Text>
        </View>
      )}

      <ExpenseBreakdownSheet 
        visible={isBreakdownVisible}
        onClose={() => setIsBreakdownVisible(false)}
        expenses={selectedExpenses}
        currencySymbol={currencySymbol}
      />
    </View>
  );
};

export default SpendsTab;
