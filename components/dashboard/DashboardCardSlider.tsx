import React, { useState } from 'react';
import { View, Text, FlatList, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { getCurrencySymbol } from '@/utils/currency';
import { useActivitySpends, useTrips } from '@/hooks/useActivity';
import { Ionicons } from '@expo/vector-icons';
import ExpenseDoughnutChart from './ExpenseDoughnutChart';
import { calculateCPM, calculateMonthlyMileage, getWeeklySpendData } from '@/utils/activity-calculations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DashboardCardSliderProps {
  carId?: string;
  month?: number;
  year?: number;
  monthlyBudget?: number;
}

const formatAmount = (amount: number, currencySymbol: string) => {
  if (amount >= 1000) {
    return currencySymbol + (amount / 1000).toFixed(0) + 'K';
  }
  return currencySymbol + amount.toLocaleString();
};

export default function DashboardCardSlider({ carId, month, year, monthlyBudget }: DashboardCardSliderProps) {
  const user = useAuthStore((state) => state.user);
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(1);

  const { data: spendData, isLoading: spendLoading } = useActivitySpends(
    carId || "",
    month?.toString(),
    year?.toString()
  );

  const { data: tripsData, isLoading: tripsLoading } = useTrips(carId || "");

  const isLoading = spendLoading || tripsLoading;

  const currentMonthCPM = calculateCPM(
    spendData?.allExpenses || [],
    tripsData?.trips || [],
    month || new Date().getMonth() + 1,
    year || new Date().getFullYear()
  );

  const prevMonth = month === 1 ? 12 : (month || 1) - 1;
  const prevYear = month === 1 ? (year || 2024) - 1 : (year || 2024);
  const prevMonthCPM = calculateCPM(
    spendData?.allExpenses || [],
    tripsData?.trips || [],
    prevMonth,
    prevYear
  );

  const cpmDiff = prevMonthCPM === 0 ? 0 : ((currentMonthCPM - prevMonthCPM) / prevMonthCPM) * 100;

  const currentMonth = month || new Date().getMonth() + 1;
  const currentYear = year || new Date().getFullYear();

  const weeklyData = getWeeklySpendData(spendData?.allExpenses || [], currentMonth, currentYear, selectedWeek);
  const maxWeeklySpend = Math.max(...weeklyData.map(d => d.amount), 1);
  const weeklyAverage = spendData?.totalSpend ? spendData.totalSpend / 4 : 0;
  const weeklyBudget = monthlyBudget ? monthlyBudget / 4 : 30000;

  const cards = [
    { type: 'analysis', title: 'Expense Analysis' },
    { type: 'cost-per-mile', title: 'Cost Per Mile' },
    { type: 'comparison', title: 'Month on Month Comparison' },
    { type: 'weekly', title: 'Weekly Analysis' },
  ];

  // ────────────────────────────────────────────────
  // CARD SIZING & SPACING
  // ────────────────────────────────────────────────
  const CARD_WIDTH = 315;
  const CARD_SPACING = 16;
  const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;
  const HORIZONTAL_PADDING = 20; 

  const renderCard = ({ item }: { item: any }) => {
    return (
      <View className="items-center" style={{ marginRight: CARD_SPACING }}>
        {item.type === 'analysis' && (
          <View className="bg-[#E0FBFC] border border-[#E0FBFC] rounded-[8px] p-4 h-[284px] w-[315px] items-center justify-center shadow-sm">
            <Text className="text-[#1A3B41] font-lexendBold text-[16px]">{item.title}</Text>

            <View className="items-center justify-center relative">
              {isLoading ? (
                <ActivityIndicator size="large" color="#00AEB5" style={{ width: 176, height: 176 }} />
              ) : (
                <View style={{ width: 220, height: 220, alignItems: 'center', justifyContent: 'center' }}>
                  <ExpenseDoughnutChart
                    data={spendData?.categoryBreakdown || []}
                    totalSpend={spendData?.totalSpend || 0}
                    totalCount={spendData?.count || 0}
                    currencySymbol={currencySymbol}
                  />
                </View>
              )}
            </View>

            <View className="items-center">
              <Text className="text-[#91C2C2] font-lexendRegular text-[12px]">Last Expense Recorded:</Text>
              <Text className="text-[#202A2A] font-lexendSemiBold text-[15px] mt-1">
                {spendData?.lastExpenseDate
                  ? new Date(spendData.lastExpenseDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Nil'}
              </Text>
            </View>
          </View>
        )}

        {item.type === 'cost-per-mile' && (
          <View className="bg-[#E0FBFC] rounded-[8px] p-8 h-[284px] w-[315px] items-center justify-center shadow-sm">
            <Text className="text-[#1A3B41] font-lexendBold text-[18px] mb-10">{item.title}</Text>

            <View className={`px-4 py-2 rounded-full flex-row items-center gap-1.5 mb-2 ${cpmDiff >= 0 ? 'bg-[#FFFD54]' : 'bg-[#7AE6EB]'}`}>
              <Ionicons name={cpmDiff >= 0 ? "arrow-up" : "arrow-down"} size={12} color="#1A3B41" />
              <Text className="text-[#1A3B41] font-lexendBold text-[13px]">{Math.abs(cpmDiff).toFixed(0)}%</Text>
            </View>

            <Text className="text-[#1A3B41] font-lexendBold text-[44px] tracking-tighter">
              {currencySymbol}{currentMonthCPM.toFixed(2)}
            </Text>
            <Text className="text-[#9BBABB] font-lexendRegular text-[14px] mt-1">than last month</Text>
          </View>
        )}

        {item.type === 'comparison' && (
          <View className="bg-[#E0FBFC] rounded-[8px] p-6 h-[284px] w-[315px] items-center justify-center shadow-sm">
            <Text className="text-[#1A3B41] font-lexendBold text-[18px] mb-8">{item.title}</Text>

            <View className={`px-4 py-2 rounded-full flex-row items-center gap-1.5 mb-4 ${spendData?.comparison?.trend === 'up' ? 'bg-[#FFFD54]' : 'bg-[#7AE6EB]'}`}>
              <Ionicons name={spendData?.comparison?.trend === 'up' ? "arrow-up" : "arrow-down"} size={12} color="#1A3B41" />
              <Text className="text-[#1A3B41] font-lexendBold text-[13px]">{Math.abs(spendData?.comparison?.percentage || 0).toFixed(0)}%</Text>
            </View>

            <Text className="text-[#1A3B41] font-lexendBold text-[38px] mt-1">
              {spendData?.comparison?.trend === 'up' ? '+' : '-'} {currencySymbol}{Math.abs(spendData?.comparison?.difference || 0).toLocaleString()}
            </Text>
            <Text className="text-[#9BBABB] font-lexendRegular text-[14px] mt-1">than last month</Text>

            <View className="bg-[#B8F2F4]/60 p-5 rounded-[24px] mt-8 w-full">
              <View className="flex-row items-start justify-between">
                <View>
                  <Text className="text-[#1A3B41] font-lexendBold text-[11px] uppercase tracking-wider opacity-60">
                    Weekly Average
                  </Text>
                  <Text className="text-[#1A3B41] font-lexendBold text-[20px] mt-1">{currencySymbol}{weeklyAverage.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
                </View>
                <Ionicons 
                  name={weeklyAverage <= weeklyBudget ? "thumbs-up" : "warning"} 
                  size={20} 
                  color={weeklyAverage <= weeklyBudget ? "#00AEB5" : "#FF6B6B"} 
                />
              </View>
              <Text className="text-[#1A3B41] font-lexendRegular text-[10px] mt-2 opacity-70">
                {weeklyAverage <= weeklyBudget 
                  ? "Great! You didn't exceed your weekly average threshold."
                  : "Caution: You are exceeding your set weekly budget threshold."}
              </Text>
            </View>
          </View>
        )}

        {item.type === 'weekly' && (
          <View className="bg-[#E0FBFC] rounded-[8px] p-6 h-[284px] w-[315px] items-center shadow-sm">
            <Text className="text-[#1A3B41] font-lexendBold text-[18px] mb-8">{item.title}</Text>

            <View className="flex-row gap-2 mb-2">
              {[1, 2, 3, 4].map((w) => (
                <TouchableOpacity
                  key={w}
                  onPress={() => setSelectedWeek(w)}
                  className={`px-3 py-1.5 rounded-full border ${
                    selectedWeek === w ? 'bg-[#7AE6EB] border-[#7AE6EB]' : 'border-[#E0E0E0]'
                  }`}
                >
                  <Text
                    className={`text-[10px] font-lexendMedium ${
                      selectedWeek === w ? 'text-[#00343F]' : 'text-[#9BBABB]'
                    }`}
                  >
                    Week {w}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row items-end justify-between w-full h-32 px-4 mb-8">
              <View className="absolute left-0 top-0 h-full justify-between py-2">
                <Text className="text-[10px] text-[#9BBABB] font-lexendRegular rotate-[-90deg] translate-x-[-15px]">
                  {currencySymbol}{Math.round(maxWeeklySpend).toLocaleString()}
                </Text>
              </View>
              {weeklyData.map((d, i) => (
                <View key={i} className="items-center">
                  <View
                    style={{ height: Math.max((d.amount / maxWeeklySpend) * 100, 4) }}
                    className={`w-3.5 ${i % 2 === 0 ? 'bg-[#00AEB5]/20' : 'bg-[#00AEB5]'} rounded-sm`}
                  />
                  <Text className="text-[10px] text-[#1A3B41] font-lexendBold mt-1.5">
                    {d.label}
                  </Text>
                </View>
              ))}
            </View>

            <View className="w-full flex-row justify-between items-center pt-4 border-t border-[#F0F0F0]">
              <Text className="text-[#9BBABB] font-lexendRegular text-[12px]">Your Set Budget</Text>
              <Text className="text-[#1A3B41] font-lexendBold text-[18px]">{currencySymbol}{weeklyBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const onScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SNAP_INTERVAL);
    setActiveIndex(index);
  };

  const getItemLayout = (_data: any, index: number) => ({
    length: SNAP_INTERVAL,
    offset: SNAP_INTERVAL * index,
    index,
  });

  return (
    <View className="mt-4">
      <FlatList
        data={cards}
        renderItem={renderCard}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.type}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={onScroll}
        getItemLayout={getItemLayout}
        contentContainerStyle={{
          paddingHorizontal: HORIZONTAL_PADDING,
          // Optional: add a bit more bottom padding if needed for shadow breathing room
          paddingBottom: 8,
        }}
      />

      {/* Pagination Dots */}
      <View className="flex-row justify-center gap-1.5 mt-5">
        {cards.map((_, i) => (
          <View
            key={i}
            className={`w-2 h-2 rounded-full ${activeIndex === i ? 'bg-[#7AE6EB]' : 'bg-[#00343F]'}`}
          />
        ))}
      </View>
    </View>
  );
}