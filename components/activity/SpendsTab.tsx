import Calendar from "@/assets/icons/calendar.svg";
import EmptyIcon from "@/assets/icons/empty.svg";
import Filter from "@/assets/icons/filter.svg";
import { useActivitySpends } from "@/hooks/useActivity";
import { useAppStore } from "@/store/useAppStore";
import { Expense } from "@/types/expense";
import { Ionicons } from "@expo/vector-icons";
import {
  addMonths,
  addWeeks,
  addYears,
  eachWeekOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  isSameYear,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ExpenseBreakdownSheet from "../sheets/ExpenseBreakdownSheet";
import SpendStatsCard from "./SpendStatsCard";
import { LoadingModal } from "../ui/LoadingModal";

interface SpendsTabProps {
  currencySymbol: string;
  onShareExpense?: () => void;
}

const DateTimelineHeader = ({
  selectedDate,
  onSelectDate,
  onOpenFilter,
  timeFilter,
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onOpenFilter: () => void;
  timeFilter: "Weekly" | "Monthly" | "Yearly";
}) => {
  const timelineItems = useMemo(() => {
    const result: Date[] = [];
    if (timeFilter === "Yearly") {
      const currentYear = new Date().getFullYear();
      for (let y = currentYear - 5; y <= currentYear + 1; y++) {
        result.push(new Date(y, 0, 1));
      }
    } else if (timeFilter === "Monthly") {
      const currentYear = selectedDate.getFullYear();
      for (let m = 0; m < 12; m++) {
        result.push(new Date(currentYear, m, 1));
      }
    } else if (timeFilter === "Weekly") {
      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);
      return eachWeekOfInterval({ start, end }, { weekStartsOn: 0 });
    }
    return result;
  }, [selectedDate.getFullYear(), selectedDate.getMonth(), timeFilter]);

  const handlePrev = () => {
    if (timeFilter === "Yearly") onSelectDate(subYears(selectedDate, 1));
    else if (timeFilter === "Monthly") onSelectDate(subMonths(selectedDate, 1));
    else onSelectDate(subWeeks(selectedDate, 1));
  };

  const handleNext = () => {
    if (timeFilter === "Yearly") onSelectDate(addYears(selectedDate, 1));
    else if (timeFilter === "Monthly") onSelectDate(addMonths(selectedDate, 1));
    else onSelectDate(addWeeks(selectedDate, 1));
  };

  return (
    <View className="flex-row items-center gap-2 mb-4">
      <TouchableOpacity onPress={handlePrev}>
        <Ionicons name="chevron-back" size={20} color="#7BA0A3" />
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{
          alignItems: "center",
          paddingRight: 20,
          paddingVertical: 10,
        }}
      >
        <View className="flex-row items-center gap-8">
          {timelineItems.map((item, idx) => {
            const isActive =
              timeFilter === "Yearly"
                ? isSameYear(item, selectedDate)
                : timeFilter === "Monthly"
                  ? isSameMonth(item, selectedDate) &&
                    isSameYear(item, selectedDate)
                  : format(item, "w-yyyy") === format(selectedDate, "w-yyyy");

            const isCurrentYear = isSameYear(item, new Date());
            const label =
              timeFilter === "Yearly"
                ? format(item, "yyyy")
                : timeFilter === "Monthly"
                  ? format(item, isCurrentYear ? "MMMM" : "MMM yy")
                  : `Week ${idx + 1}`;

            return (
              <TouchableOpacity
                key={item.toISOString()}
                onPress={() => onSelectDate(item)}
                className="items-center"
              >
                {isActive && (
                  <View className="w-1 h-1 rounded-full absolute -top-1 -right-2 bg-[#293536]" />
                )}
                <Text
                  className={`text-[14px] font-lexendSemiBold ${isActive ? "text-[#00AEB5]" : "text-[#B0B0B0]"}`}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity onPress={handleNext}>
        <Ionicons name="chevron-forward" size={20} color="#7BA0A3" />
      </TouchableOpacity>

      <View className="w-[1px] h-6 bg-[#E2E2E2] mx-1" />
      <TouchableOpacity onPress={onOpenFilter} className="p-2">
        <Filter />
      </TouchableOpacity>
    </View>
  );
};

const ExpenseGroupItem = ({
  date,
  totalAmount,
  entriesCount,
  categories,
  currencySymbol,
  isFirst,
  isLast,
  onPress,
}: any) => {
  const formattedDate = new Date(date);
  return (
    <View className="flex-row mb-6 bg-white p-4 rounded-[10px]">
      <View className="items-center mr-4">
        {!isFirst && (
          <View
            className="absolute w-[1px] bg-[#E2E2E2]"
            style={{ top: -24, bottom: "50%" }}
          />
        )}
        {!isLast && (
          <View
            className="absolute w-[1px] bg-[#E2E2E2]"
            style={{ top: "50%", bottom: -24 }}
          />
        )}
        <View className="w-[60px] h-[60px] rounded-[10px] border border-[#E2E2E2] bg-white items-center justify-center">
          <Calendar width={20} height={20} />
          <Text className="text-[#006C70] text-[10px] font-lexendBold mt-1">
            {format(formattedDate, "do")}
          </Text>
          <Text className="text-[#006C70] text-[10px] font-lexendRegular">
            {format(formattedDate, "HH:mm")}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onPress} className="flex-1">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-3">
            <Text className="text-[#001A1F] text-[20px] font-lexendBold">
              {currencySymbol}
              {totalAmount.toLocaleString()}
            </Text>
            <View className="bg-[#7AE6EB] px-2.5 py-1 rounded-[6px]">
              <Text className="text-[#006C70] text-[10px] font-lexendBold">
                {entriesCount} entries
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#7BA0A3" />
        </View>
        <View className="flex-row flex-wrap gap-2">
          {categories.map((cat: string, idx: number) => (
            <View key={idx} className="bg-[#F6F6F6] px-3 py-1.5 rounded-[4px]">
              <Text className="text-[#A1A1A1] text-[10px] font-lexendRegular">
                {cat}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </View>
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
  date,
}: any) => {
  const formattedDate = new Date(date || new Date());
  return (
    <View className="flex-row mb-6 bg-white p-4 rounded-[10px]">
      <View className="items-center mr-4 w-[60px]">
        <View className="w-[60px] h-[60px] rounded-[10px] border border-[#E2E2E2] bg-white items-center justify-center">
          <Calendar width={20} height={20} />
          <Text className="text-[#001A1F] text-[10px] font-lexendBold mt-1">
            {format(formattedDate, "do")}
          </Text>
          <Text className="text-[#00AEB5] text-[10px] font-lexendRegular">
            {format(formattedDate, "HH:mm")}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onPress} className="flex-1 flex-row gap-4">
        <View
          style={{ backgroundColor: color }}
          className="w-[6px] h-full rounded-full"
        />
        <View className="flex-1 flex-row items-start justify-between">
          <View>
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-[#00AEB5] text-[14px] font-lexendRegular">
                {name}
              </Text>
              <View className="bg-[#7AE6EB] px-2.5 py-1 rounded-[6px]">
                <Text className="text-[#006C70] text-[10px] font-lexendMedium">
                  {entriesCount} entries
                </Text>
              </View>
            </View>
            <Text className="text-[#001A1F] text-[20px] font-lexendBold mb-2">
              {currencySymbol}
              {totalAmount.toLocaleString()}
            </Text>
            {specialty && (
              <View className="bg-[#F6F6F6] px-3 py-1.5 rounded-[3px] self-start">
                <Text className="text-[#A1A1A1] text-[10px] font-lexendRegular">
                  {specialty}
                </Text>
              </View>
            )}
          </View>
          <Ionicons name="chevron-forward" size={24} color="#7BA0A3" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const SpendsTab: React.FC<SpendsTabProps> = ({
  currencySymbol,
  onShareExpense,
}) => {
  const { selectedCarId } = useAppStore();
  const [filterType, setFilterType] = useState("Overview");
  const [timeFilter, setTimeFilter] = useState<"Weekly" | "Monthly" | "Yearly">(
    "Monthly",
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthParam =
    timeFilter !== "Yearly"
      ? (selectedDate.getMonth() + 1).toString()
      : undefined;
  const yearParam = selectedDate.getFullYear().toString();
  const intervalParam =
    timeFilter === "Weekly"
      ? "week"
      : timeFilter === "Yearly"
        ? "year"
        : "month";

  const { data: spendData, isLoading } = useActivitySpends(
    selectedCarId || "",
    monthParam,
    yearParam,
    intervalParam,
  );

  const [isScaleMenuOpen, setIsScaleMenuOpen] = useState(false);
  const [isBreakdownVisible, setIsBreakdownVisible] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState<Expense[]>([]);

  const isByTechnician = filterType === "By Car Technicians";
  const TECH_COLORS = ["#FBE74C", "#00AEB5", "#7BA0A3", "#00343F", "#ADADAD"];

  const filteredData = useMemo(() => {
    if (!spendData?.expenses) return [];
    return spendData.expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      if (timeFilter === "Monthly")
        return (
          isSameMonth(expDate, selectedDate) &&
          isSameYear(expDate, selectedDate)
        );
      if (timeFilter === "Weekly") {
        const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
        const end = addWeeks(start, 1);
        return expDate >= start && expDate < end;
      }
      if (timeFilter === "Yearly") return isSameYear(expDate, selectedDate);
      return true;
    });
  }, [spendData?.expenses, selectedDate, timeFilter]);

  const groupedData = useMemo(() => {
    if (isByTechnician) {
      const groups: Record<string, any> = {};
      filteredData.forEach((exp: any) => {
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
            specialty,
            total: 0,
            entries: 0,
            expenses: [],
            date: exp.date,
          };
        }
        groups[techName].total += Number(exp.amount || 0);
        groups[techName].entries += 1;
        groups[techName].expenses.push(exp);
      });
      return Object.values(groups).sort((a, b) => b.total - a.total);
    } else {
      const groups: Record<string, any> = {};
      filteredData.forEach((exp: any) => {
        let dateKey =
          timeFilter === "Monthly"
            ? format(new Date(exp.date), "yyyy-MM-dd")
            : timeFilter === "Weekly"
              ? format(startOfWeek(new Date(exp.date)), "'Week' w, yyyy")
              : format(new Date(exp.date), "yyyy-MM");
        if (!groups[dateKey]) {
          groups[dateKey] = {
            date: exp.date,
            total: 0,
            entries: 0,
            categories: new Set(),
            expenses: [],
          };
        }
        groups[dateKey].total += Number(exp.amount || 0);
        groups[dateKey].entries += 1;
        groups[dateKey].categories.add(exp.category);
        groups[dateKey].expenses.push(exp);
      });
      return Object.values(groups).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }
  }, [filteredData, isByTechnician, timeFilter]);

  return (
    <View className="pb-20">
      <DateTimelineHeader
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onOpenFilter={() => setIsScaleMenuOpen(true)}
        timeFilter={timeFilter}
      />

      <View className="bg-[#DCE7E6] rounded-full p-1.5 flex-row mb-8">
        {(["Overview", "By Car Technicians"] as const).map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilterType(type)}
            className={`flex-1 py-3 rounded-full items-center justify-center ${filterType === type ? "bg-white shadow-sm" : ""}`}
          >
            <Text
              className={`text-[14px] font-lexendMedium ${filterType === type ? "text-[#00AEB5]" : "text-[#7BA0A3]"}`}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredData.length > 0 && (
        <SpendStatsCard
          spendData={spendData}
          currencySymbol={currencySymbol}
          filterType={filterType}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          selectedDate={selectedDate}
        />
      )}

      {filteredData.length > 0 ? (
        <View className="mt-4">
          {groupedData.map((group: any, idx: number) =>
            isByTechnician ? (
              <TechnicianGroupItem
                key={idx}
                name={group.name}
                specialty={group.specialty}
                totalAmount={group.total}
                entriesCount={group.entries}
                date={group.date}
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
        <View className="items-center justify-center py-32">
          <EmptyIcon width={54} height={38} />
          <Text className="text-[#ADADAD] text-[14px] font-lexendRegular mt-5">
            No spends recorded
          </Text>
        </View>
      )}

      <Modal visible={isScaleMenuOpen} transparent animationType="slide">
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setIsScaleMenuOpen(false)}
        >
          <View className="bg-white rounded-t-[24px] p-6 pb-12 shadow-lg">
            <Text className="text-[#001A1F] text-[18px] font-lexendBold mb-4">
              View Scale
            </Text>
            {(["Weekly", "Monthly", "Yearly"] as const).map((opt) => (
              <TouchableOpacity
                key={opt}
                className="py-4 border-b border-[#F0F0F0] flex-row items-center justify-between"
                onPress={() => {
                  setTimeFilter(opt);
                  setIsScaleMenuOpen(false);
                }}
              >
                <Text
                  className={`text-[16px] ${timeFilter === opt ? "text-[#00AEB5] font-lexendBold" : "text-[#879090] font-lexendRegular"}`}
                >
                  {opt}
                </Text>
                {timeFilter === opt && (
                  <Ionicons name="checkmark-circle" size={24} color="#00AEB5" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <ExpenseBreakdownSheet
        visible={isBreakdownVisible}
        onClose={() => setIsBreakdownVisible(false)}
        expenses={selectedExpenses}
        currencySymbol={currencySymbol}
        selectedDate={selectedDate}
      />

      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default SpendsTab;
