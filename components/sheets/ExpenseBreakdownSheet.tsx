import { SpendBreakdown } from "@/types/activity";
import { Expense } from "@/types/expense";
import { Ionicons } from "@expo/vector-icons";
import { isSameMonth, isSameWeek, isSameYear } from "date-fns";
import React, { useMemo, useState } from "react";
import { Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import ExpenseListItem from "../dashboard/ExpenseListItem";
import BottomSheet from "../shared/BottomSheet";
import ExpenseDetailSheet from "./ExpenseDetailSheet";

interface ExpenseBreakdownSheetProps {
  visible: boolean;
  onClose: () => void;
  spendData?: SpendBreakdown;
  expenses?: Expense[];
  currencySymbol: string;
  monthlyBudget?: number;
  selectedDate: Date;
}

export default function ExpenseBreakdownSheet({
  visible,
  onClose,
  spendData,
  expenses,
  currencySymbol,
  monthlyBudget,
  selectedDate,
}: ExpenseBreakdownSheetProps) {
  const [filterScale, setFilterScale] = useState<"Weekly" | "Monthly" | "Yearly" | "All Time">(
    spendData ? "Monthly" : "All Time"
  );
  const [isScaleMenuOpen, setIsScaleMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  React.useEffect(() => {
    if (!spendData) {
      setFilterScale("All Time");
    }
  }, [spendData, expenses]);

  const handlePressDetails = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDetailVisible(true);
  };

  const expensesList = useMemo(() => {
    // If "All Time" is selected, we use the complete list from spendData.allExpenses
    // If not "All Time", we still use allExpenses as our pool but filter it on the client
    // using the Dashboard's selectedDate as the reference point.
    const pool = (spendData as any)?.allExpenses || expenses || spendData?.expenses || [];
    
    if (filterScale === "All Time") return pool;

    return pool.filter((exp: any) => {
      const d = new Date(exp.date);
      if (filterScale === "Weekly") return isSameWeek(d, selectedDate);
      if (filterScale === "Monthly") return isSameMonth(d, selectedDate) && isSameYear(d, selectedDate);
      if (filterScale === "Yearly") return isSameYear(d, selectedDate);
      return true;
    });
  }, [expenses, spendData?.expenses, (spendData as any)?.allExpenses, filterScale, selectedDate]);

  // Cumulative sum logic to find which expense exceeded the budget
  const exceedingExpenseId = React.useMemo(() => {
    if (!monthlyBudget) return null;

    // We only care about the current month's expenses for the monthly budget exceedance.
    // If spendData is provided, we use its month/year. Otherwise, we assume the latest expense's month.
    const referenceMonth = spendData?.period?.month;
    const referenceYear = spendData?.period?.year;

    // Filter and Sort all expenses for THAT specific month by date ascending (oldest first)
    const currentMonthExpenses = expensesList.filter((exp: Expense) => {
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
      // Stable sort tie-breaker
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
    <View className="flex-row items-center my-4 ">
      <View className="flex-1 h-[1px] bg-[#F8953A]" />
      <View className="bg-[#FFF2C5] border border-[#F8953A] rounded-[4px] px-3 py-1.5 flex-row items-center gap-2 ">
        <Ionicons name="warning-outline" size={14} color="#F8953A" />
        <Text className="text-[#425658] text-[10px] font-lexendRegular">
          You exceeded your set monthly budget on{" "}
          <Text className="font-lexendBold">
            {currencySymbol}
            {budget.toLocaleString()}
          </Text>
        </Text>
      </View>
      <View className="flex-1 h-[1px] bg-[#F8953A]" />
    </View>
  );
  const groupedExpenses = expensesList.reduce((acc: any, expense: Expense) => {
    const date = new Date(expense.date);
    const dateKey = date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(expense);
    return acc;
  }, {});

  const filteredGroupKeys = Object.keys(groupedExpenses).filter((key) => {
    return groupedExpenses[key].some((exp: any) =>
      (exp.name || exp.category)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  });

  const headerRight = (
    <TouchableOpacity onPress={() => setIsScaleMenuOpen(true)} className="p-2">
      <Ionicons name="filter" size={20} color="#00343F" />
    </TouchableOpacity>
  );

  const totalAmount = useMemo(() => {
    return expensesList.reduce((sum: number, exp: Expense) => sum + exp.amount, 0);
  }, [expensesList]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const title = (
    <View className="flex-col items-start gap-2">
      <View className="flex-row items-baseline gap-1">
        <Text className="text-[#00343F] text-[16px] font-lexendBold">
          Expense Breakdown
        </Text>
        <Text className="text-[#8B8B8B] text-[12px] font-lexendRegular">
          • {filterScale}
        </Text>
      </View>
      <Text className="text-[#8B8B8B] text-[12px] font-lexendRegular">
        Total{" "}
        <Text className="text-[#00AEB5] text-[13px] font-lexendSemiBold">
          {currencySymbol}
          {totalAmount.toLocaleString()}
        </Text>
      </Text>
    </View>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={title}
      headerRight={headerRight}
      height="70%"
      backgroundColor="#F0F0F0"
    >
      <View className="mb-6 rounded-[12px] bg-white flex-1 px-4">
        {/* Search Bar */}
        <View className="flex-row items-center bg-[#F8F8F8] border border-[#D4D4D4] rounded-[12px] px-4 py-3 mt-4">
          <TextInput
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 font-lexendRegular text-[14px] text-[#9A9A9A]"
            placeholderTextColor="#C1C3C3"
          />
          <Ionicons name="search" size={20} color="#C1C3C3" />
        </View>

        {/* Expense List */}
        <View className="mt-6">
          {filteredGroupKeys.map((dateKey) => (
            <View key={dateKey} className="mb-6">
              <Text className="text-[#6C6C70] font-lexendMedium text-[14px] mb-2">
                {dateKey}
              </Text>
              {groupedExpenses[dateKey]
                .filter((exp: any) =>
                  (exp.name || exp.category)
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
                )
                .map((expense: any, idx: number) => (
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
          ))}
        </View>
      </View>

      <ExpenseDetailSheet
        visible={isDetailVisible}
        onClose={() => setIsDetailVisible(false)}
        expense={selectedExpense}
        currencySymbol={currencySymbol}
      />

      <Modal
        visible={isScaleMenuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsScaleMenuOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setIsScaleMenuOpen(false)}
        >
          <View className="bg-white rounded-t-[24px] p-6 pb-12 shadow-lg">
            <Text className="text-[#001A1F] text-[18px] font-lexendBold mb-4">
              Filter By Period
            </Text>
            {(["Weekly", "Monthly", "Yearly", "All Time"] as const).map((opt) => (
              <TouchableOpacity
                key={opt}
                className="py-4 border-b border-[#F0F0F0] flex-row items-center justify-between"
                onPress={() => {
                  setFilterScale(opt);
                  setIsScaleMenuOpen(false);
                }}
              >
                <Text
                  className={`text-[16px] ${filterScale === opt ? "text-[#00AEB5] font-lexendBold" : "text-[#879090] font-lexendRegular"}`}
                >
                  {opt}
                </Text>
                {filterScale === opt && (
                  <Ionicons name="checkmark-circle" size={24} color="#00AEB5" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </BottomSheet>
  );
}
