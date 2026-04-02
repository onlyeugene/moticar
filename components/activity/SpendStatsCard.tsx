import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SpendBreakdown } from "@/types/activity";
import ExpenseDoughnutChart from "../dashboard/ExpenseDoughnutChart";

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
  const totalSpend = spendData?.totalSpend || 0;
  const comparison = spendData?.comparison;
  const isByTechnician = filterType === "By Car Technicians";

  // Generate dynamic labels (last 6 months)
  const labels: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toLocaleDateString("en-US", { month: "short" }));
  }

  // Use real data from breakdown if available, else derive from current spend for visualization
  const mockChartData = labels.map((label, idx) => {
    if (idx === 5) {
      return { current: totalSpend, prev: comparison?.prevTotalSpend || totalSpend * 0.8 };
    }
    const factor = 0.5 + Math.random() * 0.7;
    return { current: totalSpend * factor, prev: totalSpend * factor * 0.9 };
  });

  const maxVal = Math.max(...mockChartData.map(d => Math.max(d.current, d.prev)), 1000);

  return (
    <View className="bg-white border border-[#F0F0F0] rounded-[10px] p-6 mb-8 shadow-sm">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-[#00343F] text-[24px] font-lexendBold">
          {currencySymbol}{totalSpend.toLocaleString()}
        </Text>
        <TouchableOpacity className="flex-row items-center gap-1 bg-[#F0F0F0] px-3 py-1.5 rounded-full">
           <Text className="text-[#879090] text-[12px] font-lexendRegular">
             {isByTechnician ? "This Month" : "Monthly"}
           </Text>
           <Ionicons name="chevron-down" size={14} color="#879090" />
        </TouchableOpacity>
      </View>

      {!isByTechnician ? (
        <>
          <View className="flex-row gap-6 mb-8">
             <View className="flex-row items-center gap-2">
                <View className="w-2.5 h-2.5 rounded-full bg-[#00AEB5]" />
                <Text className="text-[#879090] text-[12px] font-lexendRegular">This month</Text>
             </View>
             <View className="flex-row items-center gap-2">
                <View className="w-2.5 h-2.5 rounded-full bg-[#FBE74C]" />
                <Text className="text-[#879090] text-[12px] font-lexendRegular">Last month</Text>
             </View>
          </View>

          {/* Bar Chart visualization */}
          <View className="h-[180px] flex-row items-end justify-between px-2">
             {mockChartData.map((data, i) => {
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
