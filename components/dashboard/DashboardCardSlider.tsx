import React, { useState } from 'react';
import { View, Text, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { getCurrencySymbol } from '@/utils/currency';
import { useActivitySpends } from '@/hooks/useActivity';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

import { CATEGORY_COLORS, DEFAULT_COLOR } from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DashboardCardSliderProps {
  carId?: string;
  month?: number;
  year?: number;
}

const formatAmount = (amount: number, currencySymbol: string) => {
  if (amount >= 1000) {
    return currencySymbol + (amount / 1000).toFixed(0) + 'K';
  }
  return currencySymbol + amount.toLocaleString();
};

export default function DashboardCardSlider({ carId, month, year }: DashboardCardSliderProps) {
  const user = useAuthStore((state) => state.user);
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: spendData, isLoading } = useActivitySpends(
    carId || "",
    month?.toString(),
    year?.toString()
  );

  const cards = [
    { type: 'analysis', title: 'Expense Analysis' },
    { type: 'cost-per-mile', title: 'Cost Per Mile' },
    { type: 'comparison', title: 'Month on Month Comparison' },
    { type: 'weekly', title: 'Weekly Analysis' },
  ];

  const renderAnalysisSegments = () => {
    if (!spendData || spendData.categoryBreakdown.length === 0) {
      return (
        <Circle
          cx="88"
          cy="88"
          r="80"
          stroke="#00AEB5"
          strokeWidth="12"
          fill="none"
          opacity={0.2}
        />
      );
    }

    const radius = 64;
    const strokeWidth = 32;
    const centerX = 88;
    const centerY = 88;
    const gap = spendData.categoryBreakdown.length > 1 ? 1 : 0; // 1 degree gap
    const totalGap = spendData.categoryBreakdown.length * gap;
    const availableAngle = 360 - totalGap;

    let currentAngle = -90; // Start at the top

    return spendData.categoryBreakdown.map((item, index) => {
      const percentage = item.percentage;
      const angle = (percentage / 100) * availableAngle;
      
      const rad1 = (Math.PI * currentAngle) / 180;
      const x1 = centerX + radius * Math.cos(rad1);
      const y1 = centerY + radius * Math.sin(rad1);
      
      const endAngle = currentAngle + angle;
      const rad2 = (Math.PI * endAngle) / 180;
      const x2 = centerX + radius * Math.cos(rad2);
      const y2 = centerY + radius * Math.sin(rad2);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      const color = CATEGORY_COLORS[item.category] || DEFAULT_COLOR;

      const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
      
      currentAngle = endAngle + gap;

      return (
        <Path
          key={index}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
        />
      );
    });
  };

  const renderCard = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'analysis':
        return (
          <View className="px-2 w-[315px]">
            <View className="bg-[#E0FBFC] border border-[#E0FBFC] rounded-[8px] p-4 h-[284px] items-center justify-center shadow-sm">
              <Text className="text-[#1A3B41] font-lexendBold text-[16px]  mb-2">{item.title}</Text>
              
              <View className="items-center justify-center relative">
                {isLoading ? (
                  <ActivityIndicator size="large" color="#00AEB5" style={{ width: 176, height: 176 }} />
                ) : (
                  <View style={{ width: 176, height: 176 }}>
                   <Svg width="176" height="176">
                    <G transform="translate(0, 0)">
                      {/* Background circle */}
                      <Circle
                        cx="88"
                        cy="88"
                        r="64"
                        stroke="#00AEB5"
                        strokeWidth="32"
                        fill="none"
                        opacity={0.1}
                      />
                      {renderAnalysisSegments()}
                    </G>
                  </Svg>
                  
                  <View className="absolute inset-0 items-center justify-center">
                    <View className="bg-[#00343F] w-8 h-8 rounded-[6px] items-center justify-center mb-1 shadow-sm">
                      <Text className="text-[#FBE74C] font-lexendBold text-[12px]">{spendData?.count || 0}</Text>
                    </View>
                    <Text className="text-[#5E7A7C] font-lexendRegular text-[11px]">Total expense</Text>
                    <Text className="text-[#1A3B41] font-lexendBold text-[14px]" numberOfLines={1}>
                      {formatAmount(spendData?.totalSpend || 0, currencySymbol)}
                    </Text>
                  </View>
                 </View>
                )}
              </View>

              <View className="mt-2 items-center">
                <Text className="text-[#91C2C2] font-lexendRegular text-[12px]">Last Expense Recorded:</Text>
                <Text className="text-[#202A2A] font-lexendSemiBold text-[15px] mt-1">
                  {spendData?.lastExpenseDate 
                    ? new Date(spendData.lastExpenseDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Nil'}
                </Text>
              </View>
            </View>
          </View>
        );
      
      case 'cost-per-mile':
        return (
          <View  className="px-2 w-[315px] ">
             <View className="bg-[#E0FBFC] rounded-[8px] p-8 h-[284px] items-center justify-center shadow-sm">
                <Text className="text-[#1A3B41] font-lexendBold text-[18px] mb-10">{item.title}</Text>
                
                <View className="bg-[#FFFD54] px-4 py-2 rounded-full flex-row items-center gap.1.5 mb-2">
                   <Ionicons name="arrow-up" size={12} color="#1A3B41" />
                   <Text className="text-[#1A3B41] font-lexendBold text-[13px]">14%</Text>
                </View>

                <Text className="text-[#1A3B41] font-lexendBold text-[44px] tracking-tighter">{currencySymbol}317</Text>
                <Text className="text-[#9BBABB] font-lexendRegular text-[14px] mt-1">than last month</Text>
             </View>
          </View>
        );

      case 'comparison':
        return (
          <View className="px-2 w-[315px]">
            <View className="bg-[#E0FBFC] rounded-[8px] p-6 h-[284px] items-center justify-center shadow-sm">
                <Text className="text-[#1A3B41] font-lexendBold text-[18px] mb-8">{item.title}</Text>
                
                <View className="bg-[#FFFD54] px-4 py-2 rounded-full flex-row items-center gap-1.5 mb-4">
                   <Ionicons name="arrow-up" size={12} color="#1A3B41" />
                   <Text className="text-[#1A3B41] font-lexendBold text-[13px]">14%</Text>
                </View>

                <Text className="text-[#1A3B41] font-lexendBold text-[38px] mt-1">+ {currencySymbol} 2,000</Text>
                <Text className="text-[#9BBABB] font-lexendRegular text-[14px] mt-1">than last month</Text>

                <View className="bg-[#B8F2F4]/60 p-5 rounded-[24px] mt-8 w-full">
                   <View className="flex-row items-start justify-between">
                     <View>
                       <Text className="text-[#1A3B41] font-lexendBold text-[11px] uppercase tracking-wider opacity-60">Weekly Average</Text>
                       <Text className="text-[#1A3B41] font-lexendBold text-[20px] mt-1">{currencySymbol} 62,000</Text>
                     </View>
                     <Ionicons name="thumbs-up" size={20} color="#00AEB5" />
                   </View>
                   <Text className="text-[#1A3B41] font-lexendRegular text-[10px] mt-2 opacity-70">Great! You didn't exceed your weekly average threshold.</Text>
                </View>
            </View>
          </View>
        );

      case 'weekly':
        return (
          <View  className="px-2 w-[315px]">
            <View className="bg-[#E0FBFC] rounded-[8px] p-6 h-[284px] items-center shadow-sm">
                <Text className="text-[#1A3B41] font-lexendBold text-[18px] mb-8">{item.title}</Text>
                
                <View className="flex-row gap-2 mb-2">
                   {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map(w => (
                     <View key={w} className={`px-2.5 py-1 rounded-full border ${w === 'Week 3' ? 'bg-[#7AE6EB] border-[#7AE6EB]' : 'border-[#E0E0E0]'}`}>
                        <Text className={`text-[10px] font-lexendMedium ${w === 'Week 3' ? 'text-[#00343F]' : 'text-[#9BBABB]'}`}>{w}</Text>
                     </View>
                   ))}
                </View>

                {/* Vertical Bar Chart */}
                <View className="flex-row items-end justify-between w-full h-32 px-4 mb-8">
                  <View className="absolute left-0 top-0 h-full justify-between py-2">
                     <Text className="text-[10px] text-[#9BBABB] font-lexendRegular rotate-[-90deg] translate-x-[-15px]">{currencySymbol} 47,000</Text>
                  </View>
                  {[45, 75, 100, 85, 90, 70, 75].map((h, i) => (
                    <View key={i} className="items-center">
                       <View style={{ height: h }} className={`w-3.5 ${i % 2 === 0 ? 'bg-[#00AEB5]/20' : 'bg-[#00AEB5]'} rounded-sm`} />
                       <Text className="text-[10px] text-[#1A3B41] font-lexendBold mt-1.5">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
                    </View>
                  ))}
                </View>

                <View className="w-full flex-row justify-between items-center pt-4 border-t border-[#F0F0F0]">
                   <Text className="text-[#9BBABB] font-lexendRegular text-[12px]">Your Set Budget</Text>
                   <Text className="text-[#1A3B41] font-lexendBold text-[18px]">{currencySymbol}30,000</Text>
                </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const onScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  return (
    <View className="mt-4">
      <FlatList
        data={cards}
        renderItem={renderCard}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.type}
      />
      
      {/* Pagination Dots */}
      <View className="flex-row justify-center gap-1.5 mt-6">
        {cards.map((_, i) => (
          <View 
            key={i} 
            className={`w-2 h-2 rounded-full ${activeIndex === i ? 'bg-[#00AEB5]' : 'bg-[#00AEB5]/30'}`} 
          />
        ))}
      </View>
    </View>
  );
}
