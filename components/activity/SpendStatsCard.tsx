import React, { useState, useMemo } from "react";
import { Text, TouchableOpacity, View, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SpendBreakdown } from "@/types/activity";
import ExpenseDoughnutChart from "../dashboard/ExpenseDoughnutChart";
import { 
  format, 
  subMonths, 
  subDays, 
  subYears, 
  startOfMonth, 
  endOfMonth, 
  startOfDay, 
  endOfDay, 
  startOfYear, 
  endOfYear, 
  isWithinInterval 
} from "date-fns";

interface SpendStatsCardProps {
  spendData?: SpendBreakdown;
  currencySymbol: string;
  filterType: string;
}

const SpendStatsCard: React.FC<SpendStatsCardProps> = ({ 
  spendData, 
  currencySymbol,
  filterType 
}) => {
  const [timeFilter, setTimeFilter] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalSpend = spendData?.totalSpend || 0;
  const isByTechnician = filterType === "By Car Technicians";

  const chartInfo = useMemo(() => {
    const expenses = spendData?.expenses || [];
    const labels: string[] = [];
    const data: { current: number; prev: number }[] = [];
    const now = new Date();

    if (timeFilter === 'Monthly') {
      for (let i = 5; i >= 0; i--) {
        const d = subMonths(now, i);
        const start = startOfMonth(d);
        const end = endOfMonth(d);
        const prevStart = startOfMonth(subMonths(d, 1));
        const prevEnd = endOfMonth(subMonths(d, 1));

        const currentTotal = expenses
          .filter(e => {
            const expenseDate = new Date(e.date);
            return (
              expenseDate.getMonth() === d.getMonth() &&
              expenseDate.getFullYear() === d.getFullYear()
            );
          })
          .reduce((sum, e) => sum + e.amount, 0);

        const prevTotal = expenses
          .filter(e => {
            const expenseDate = new Date(e.date);
            const prevMonth = subMonths(d, 1);
            return (
              expenseDate.getMonth() === prevMonth.getMonth() &&
              expenseDate.getFullYear() === prevMonth.getFullYear()
            );
          })
          .reduce((sum, e) => sum + e.amount, 0);

        labels.push(format(d, "MMM"));
        data.push({ current: currentTotal, prev: prevTotal });
      }
    } else if (timeFilter === 'Weekly') {
      for (let i = 6; i >= 0; i--) {
        const d = subDays(now, i);
        const start = startOfDay(d);
        const end = endOfDay(d);
        const prevStart = startOfDay(subDays(d, 1));
        const prevEnd = endOfDay(subDays(d, 1));

        const currentTotal = expenses
          .filter(e => isWithinInterval(new Date(e.date), { start, end }))
          .reduce((sum, e) => sum + e.amount, 0);

        const prevTotal = expenses
          .filter(e => isWithinInterval(new Date(e.date), { start: prevStart, end: prevEnd }))
          .reduce((sum, e) => sum + e.amount, 0);

        labels.push(format(d, "EEE"));
        data.push({ current: currentTotal, prev: prevTotal });
      }
    } else if (timeFilter === 'Yearly') {
       for (let i = 4; i >= 0; i--) {
        const d = subYears(now, i);
        const start = startOfYear(d);
        const end = endOfYear(d);
        const prevStart = startOfYear(subYears(d, 1));
        const prevEnd = endOfYear(subYears(d, 1));

        const currentTotal = expenses
          .filter(e => isWithinInterval(new Date(e.date), { start, end }))
          .reduce((sum, e) => sum + e.amount, 0);

        const prevTotal = expenses
          .filter(e => isWithinInterval(new Date(e.date), { start: prevStart, end: prevEnd }))
          .reduce((sum, e) => sum + e.amount, 0);

        labels.push(format(d, "yyyy"));
        data.push({ current: currentTotal, prev: prevTotal });
      }
    }

    const maxVal = Math.max(...data.map(d => Math.max(d.current, d.prev)), 100);
    return { labels, data, maxVal };
  }, [spendData?.expenses, timeFilter]);

  const { labels, data: chartData, maxVal } = chartInfo;

  // Calculate current total and comparison based on the latest data point in the chart
  const latestData = chartData[chartData.length - 1] || { current: 0, prev: 0 };
  const currentTotal = latestData.current;
  const prevTotal = latestData.prev;
  
  const diff = currentTotal - prevTotal;
  const percentage = prevTotal > 0 ? (diff / prevTotal) * 100 : 0;
  const trend = diff >= 0 ? 'up' : 'down';

  const filterOptions: ('Weekly' | 'Monthly' | 'Yearly')[] = ['Weekly', 'Monthly', 'Yearly'];

  return (
    <View className="bg-white border border-[#F0F0F0] rounded-[10px] p-6 mb-8 shadow-sm">
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-baseline gap-2">
          <Text className="text-[#00343F] text-[24px] font-lexendBold">
            {currencySymbol}{currentTotal.toLocaleString()}
          </Text>
          {currentTotal > 0 && (
            <View className="flex-row items-center">
              <Ionicons 
                name={trend === 'up' ? "trending-up" : "trending-down"} 
                size={14} 
                color={trend === 'up' ? "#FF5A5F" : "#34A853"} 
              />
              <Text className={`text-[12px] font-lexendMedium ml-1 ${trend === 'up' ? 'text-[#FF5A5F]' : 'text-[#34A853]'}`}>
                {Math.abs(percentage).toFixed(1)}%
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          onPress={() => setIsMenuOpen(true)}
          className="flex-row items-center gap-1 bg-[#F0F0F0] px-3 py-1.5 rounded-full"
        >
           <Text className="text-[#879090] text-[12px] font-lexendRegular">
             {isByTechnician ? "This Month" : timeFilter}
           </Text>
           <Ionicons name="chevron-down" size={14} color="#879090" />
        </TouchableOpacity>

        <Modal
          visible={isMenuOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsMenuOpen(false)}
        >
          <Pressable 
            className="flex-1 bg-black/20 justify-center items-center"
            onPress={() => setIsMenuOpen(false)}
          >
            <View className="bg-white rounded-[16px] p-4 w-[200px] shadow-lg">
              {filterOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  className="py-3 items-center border-b border-[#F0F0F0] last:border-0"
                  onPress={() => {
                    setTimeFilter(opt);
                    setIsMenuOpen(false);
                  }}
                >
                  <Text className={`text-[14px] ${timeFilter === opt ? 'text-[#00AEB5] font-lexendBold' : 'text-[#879090] font-lexendRegular'}`}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      </View>

      {!isByTechnician ? (
        <>
          <View className="flex-row gap-6 mb-8">
             <View className="flex-row items-center gap-2">
                <View className="w-2.5 h-2.5 rounded-full bg-[#00AEB5]" />
                <Text className="text-[#879090] text-[12px] font-lexendRegular">
                  {timeFilter === 'Weekly' ? 'This Day' : timeFilter === 'Yearly' ? 'This Year' : 'This Month'}
                </Text>
             </View>
             <View className="flex-row items-center gap-2">
                <View className="w-2.5 h-2.5 rounded-full bg-[#FBE74C]" />
                <Text className="text-[#879090] text-[12px] font-lexendRegular">
                  {timeFilter === 'Weekly' ? 'Prev Day' : timeFilter === 'Yearly' ? 'Prev Year' : 'Prev Month'}
                </Text>
             </View>
          </View>

          {/* Bar Chart visualization */}
          <View className="h-[180px] flex-row items-end justify-between px-2">
             {chartData.map((data, i) => {
               const currentHeight = (data.current / maxVal) * 120;
               const prevHeight = (data.prev / maxVal) * 120;
               
               return (
                 <View key={i} className="gap-2 items-center">
                    <View className="flex-row gap-1.5 items-end">
                       <View style={{ height: currentHeight }} className="w-2.5 bg-[#00AEB5] rounded-t-sm" />
                       <View style={{ height: prevHeight }} className="w-2.5 bg-[#FBE74C] rounded-t-sm" />
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
        <View className="items-center justify-center py-4">
           {spendData?.categoryBreakdown && (
             <ExpenseDoughnutChart 
               data={spendData.categoryBreakdown}
               totalSpend={totalSpend}
               totalCount={spendData.count || 0}
               currencySymbol={currencySymbol}
               size={200}
             />
           )}
        </View>
      )}
    </View>
  );
};


export default SpendStatsCard;
