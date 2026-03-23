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
  currencySymbol: string;
}

const ExpenseBreakdownCard: React.FC<ExpenseBreakdownCardProps> = ({
  spendData,
  currencySymbol,
}) => {
  const [containerWidth, setContainerWidth] = useState(240);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const handlePressDetails = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDetailVisible(true);
  };

  // Derive sparkline data from expenses
  const chartData = useMemo(() => {
    if (!spendData?.expenses || spendData.expenses.length === 0) return [];

    // Group expenses by date and sum amounts
    const dailyTotals: Record<number, number> = {};
    spendData.expenses.forEach((exp) => {
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
  }, [spendData?.expenses]);

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

        {spendData && spendData.count > 0 ? (
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

            <View className="flex-1">
              <View className="">
                <Sparkline
                  data={chartData}
                  width={containerWidth}
                  height={100}
                  currencySymbol={currencySymbol}
                  label={spendData.comparison?.label}
                  trend={spendData.comparison?.trend}
                />
              </View>
            </View>

            <View className="mt-4">
              {spendData.expenses.slice(0, 4).map((expense, idx) => (
                <ExpenseListItem
                  key={expense.id || expense._id || idx}
                  expense={expense}
                  currencySymbol={currencySymbol}
                  onPressDetails={handlePressDetails}
                />
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
        currencySymbol={currencySymbol}
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
