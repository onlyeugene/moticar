import { SpendBreakdown } from "@/types/activity";
import { Expense } from "@/types/expense";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import ExpenseListItem from "../dashboard/ExpenseListItem";
import BottomSheet from "../shared/BottomSheet";
import ExpenseDetailSheet from "./ExpenseDetailSheet";

interface ExpenseBreakdownSheetProps {
  visible: boolean;
  onClose: () => void;
  spendData?: SpendBreakdown;
  expenses?: Expense[];
  currencySymbol: string;
}

export default function ExpenseBreakdownSheet({
  visible,
  onClose,
  spendData,
  expenses,
  currencySymbol,
}: ExpenseBreakdownSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const handlePressDetails = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDetailVisible(true);
  };

  // Group expenses by date
  const expensesList = expenses || spendData?.expenses || [];
  const groupedExpenses = expensesList.reduce((acc: any, expense) => {
    const date = new Date(expense.date);
    const dateKey = date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
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
    <View className="">
      <Ionicons name="filter" size={20} color="#00343F" />
    </View>
  );

  const title = (
    <View className="flex-col items-start gap-2">
      <Text className="text-[#00343F] text-[16px] font-lexendBold">
        Expense Breakdown
      </Text>
      <Text className="text-[#8B8B8B] text-[12px] font-lexendRegular">
        Total{" "}
        <Text className="text-[#00AEB5] text-[13px] font-lexendSemiBold">
          {currencySymbol}
          {spendData?.totalSpend.toLocaleString()}
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
                  <ExpenseListItem
                    key={expense.id || expense._id || idx}
                    expense={expense}
                    currencySymbol={currencySymbol}
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
                    onPressDetails={handlePressDetails}
                  />
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
    </BottomSheet>
  );
}
