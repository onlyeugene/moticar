import Empty from "@/assets/icons/empty.svg";
import { SpendBreakdown } from "@/types/activity";
import { Expense } from "@/types/expense";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ExpenseBreakdownSheet from "../sheets/ExpenseBreakdownSheet";
import ExpenseDetailSheet from "../sheets/ExpenseDetailSheet";
import ExpenseListItem from "./ExpenseListItem";
import Sparkline from "./Sparkline";

interface ExpenseBreakdownCardProps {
  spendData?: SpendBreakdown;
  expenses?: Expense[];
  currencySymbol: string;
  monthlyBudget?: number;
}

const ExpenseBreakdownCard: React.FC<ExpenseBreakdownCardProps> = ({
  spendData,
  expenses,
  currencySymbol,
  monthlyBudget,
}) => {
  const [containerWidth, setContainerWidth] = useState(240);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handlePressDetails = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDetailVisible(true);
  };

  // Derive sparkline data from expenses
  const chartData = useMemo(() => {
    const listToUse = expenses || spendData?.expenses;
    if (!listToUse || listToUse.length === 0) return [];

    // Group expenses by date and sum amounts
    const dailyTotals: Record<number, number> = {};
    listToUse.forEach((exp) => {
      const date = new Date(exp.date);
      const day = date.getDate();
      dailyTotals[day] = (dailyTotals[day] || 0) + (exp.amount || 0);
    });

    const days = Object.keys(dailyTotals)
      .map(Number)
      .sort((a, b) => a - b);

    if (days.length === 0) return [];

    // Ensure at least two points for the chart to render properly
    if (days.length === 1) {
      return [0, dailyTotals[days[0]]];
    }

    return days.map((d) => dailyTotals[d]);
  }, [expenses, spendData?.expenses]);

  const expensesList = expenses || spendData?.expenses || [];

  // Cumulative sum logic to find which expense exceeded the budget
  const exceedingExpenseId = React.useMemo(() => {
    if (!monthlyBudget) return null;

    // Filter current month
    const referenceMonth = spendData?.period?.month;
    const referenceYear = spendData?.period?.year;

    const currentMonthExpenses = expensesList.filter((exp) => {
      const d = new Date(exp.date);
      return (
        (!referenceMonth || d.getMonth() + 1 === referenceMonth) &&
        (!referenceYear || d.getFullYear() === referenceYear)
      );
    });

    const sortedAll = [...currentMonthExpenses].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return (a.id || (a as any)._id).localeCompare(b.id || (b as any)._id);
    });

    let runningTotal = 0;
    for (const exp of sortedAll) {
      runningTotal += exp.amount;
      if (runningTotal > monthlyBudget) {
        return exp.id || (exp as any)._id;
      }
    }
    return null;
  }, [expensesList, monthlyBudget, spendData?.period]);

  const BudgetExceededIndicator = ({ budget }: { budget: number }) => (
    <View className="flex-row items-center my-4 px-1">
      <View className="flex-1 h-[1px] bg-[#FFAB2D] opacity-40" />
      <View className="bg-[#FFF8ED] border border-[#FFAB2D] rounded-[8px] px-3 py-1.5 flex-row items-center gap-2 mx-1.5">
        <Ionicons name="warning-outline" size={14} color="#FF7A00" />
        <Text className="text-[#1A3B41] text-[11px] font-lexendRegular">
          You exceeded your set monthly budget on{" "}
          <Text className="font-lexendBold">
            {currencySymbol}
            {budget.toLocaleString()}
          </Text>
        </Text>
      </View>
      <View className="flex-1 h-[1px] bg-[#FFAB2D] opacity-40" />
    </View>
  );

  return (
    <View className="mt-4">
      <View
        className="bg-white p-4 rounded-[12px]"
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width - 32)} // padding sub
      >
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[#036D7D] font-lexendBold text-[20px]">
            Expense Breakdown
          </Text>
          <TouchableOpacity onPress={() => setIsSheetVisible(true)}>
            <Ionicons
              name="arrow-forward"
              size={20}
              color="#C1C3C3"
              style={{ transform: [{ rotate: "-45deg" }] }}
            />
          </TouchableOpacity>
        </View>

        {spendData && (spendData.count > 0 || (expenses && expenses.length > 0)) ? (
          <>
            <View className="flex-row items-end justify-between mb-6">
              <View>
                <Text className="text-[#1A3B41] font-lexendBold text-[32px]">
                  {currencySymbol}
                  {spendData.totalSpend.toLocaleString()}
                </Text>
                <View className="flex-row items-center gap-1.5 mt-1">
                  <Text className="text-[#9BBABB] font-lexendRegular text-[13px]">
                    Spent except bills
                  </Text>
                  <Ionicons
                    name="help-circle-outline"
                    size={14}
                    color="#9BBABB"
                  />
                </View>
              </View>
            </View>

            <View className="my-2">
              <Sparkline
                data={chartData}
                width={containerWidth}
                height={100}
                currencySymbol={currencySymbol}
                label={spendData.comparison?.label}
                trend={spendData.comparison?.trend}
              />
            </View>

            <View className="mt-4">
              {expensesList.slice(0, 4).map((expense, idx) => (
                <React.Fragment key={expense.id || expense._id || idx}>
                  {exceedingExpenseId ===
                    (expense.id || (expense as any)._id) &&
                    monthlyBudget && (
                      <BudgetExceededIndicator budget={monthlyBudget} />
                    )}
                  <ExpenseListItem
                    expense={expense}
                    currencySymbol={currencySymbol}
                    onPressDetails={handlePressDetails}
                    isExpanded={
                      expandedId === (expense.id || (expense as any)._id)
                    }
                    onToggle={() =>
                      setExpandedId(
                        expandedId === (expense.id || (expense as any)._id)
                          ? null
                          : expense.id || (expense as any)._id,
                      )
                    }
                  />
                </React.Fragment>
              ))}
            </View>
          </>
        ) : (
          <View className="items-center py-10">
            <Empty />
            <Text className="text-[#888282] font-lexendRegular text-[14px] mt-4">
              No transactions recorded
            </Text>
          </View>
        )}
      </View>

      <ExpenseBreakdownSheet
        visible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
        spendData={spendData}
        expenses={expenses}
        currencySymbol={currencySymbol}
        monthlyBudget={monthlyBudget}
      />

      <ExpenseDetailSheet
        visible={isDetailVisible}
        onClose={() => setIsDetailVisible(false)}
        expense={selectedExpense}
        currencySymbol={currencySymbol}
      />
    </View>
  );
};

export default ExpenseBreakdownCard;