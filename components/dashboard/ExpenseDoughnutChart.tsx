import { SpendCategory } from "@/types/activity";
import React, { useState } from "react";
import { Text, View, Pressable } from "react-native";
import Svg, { Circle, Path, Defs, Filter, FeGaussianBlur, G } from "react-native-svg";
import { CategoryIcon } from "../sheets/ExpenseCategorySheet";

interface ExpenseDoughnutChartProps {
  data: SpendCategory[];
  totalSpend: number;
  totalCount: number;
  currencySymbol: string;
  size?: number;
}

const COLORS = [
  "#29D7DE",
  "#FBE74C",
  "#C6F4F6",
  "#00AEB5",
  "#00343F",
  "#E8EAC3",
];

export default function ExpenseDoughnutChart({
  data,
  totalSpend,
  totalCount,
  currencySymbol,
  size = 260,
}: ExpenseDoughnutChartProps) {
  const [showIcons, setShowIcons] = useState(false);

  const radius = size * 0.28;
  const strokeWidth = size * 0.13;
  const center = size / 2;
  const iconOrbitRadius = radius + strokeWidth * 0.5 + 28;
  const GAP = 2;

  const formatValue = (num: number) => {
    if (num >= 1000000)
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return Math.round(num / 1000) + "K";
    return num.toLocaleString();
  };

  const chartData = [...data].sort((a, b) => b.amount - a.amount).slice(0, 6);

  const numSegments = chartData.length;
  let cumulativeAngle = -90;

  const segments = chartData.map((item, index) => {
    const rawAngle =
      (item.percentage / 100) *
      (360 - (numSegments > 1 ? GAP * numSegments : 0));
    const angle = Math.max(rawAngle, 3);
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle + (numSegments > 1 ? GAP : 0);

    const toRad = (deg: number) => (Math.PI * deg) / 180;

    const x1 = center + radius * Math.cos(toRad(startAngle));
    const y1 = center + radius * Math.sin(toRad(startAngle));
    const x2 = center + radius * Math.cos(toRad(endAngle));
    const y2 = center + radius * Math.sin(toRad(endAngle));
    const largeArcFlag = angle > 180 ? 1 : 0;

    const midAngle = startAngle + angle / 2;
    const iconX = center + iconOrbitRadius * Math.cos(toRad(midAngle));
    const iconY = center + iconOrbitRadius * Math.sin(toRad(midAngle));

    return {
      pathData: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      color: COLORS[index % COLORS.length],
      iconPos: { x: iconX, y: iconY },
      midAngle,
      item,
    };
  });

  const ICON_SIZE = 36;
  const canvasSize = size + ICON_SIZE * 2 + 20;
  const offset = (canvasSize - size) / 2;

  return (
    <Pressable
      onPress={() => setShowIcons(!showIcons)}
      style={{
        width: canvasSize,
        height: canvasSize,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* SVG Ring */}
      <Svg
        width={canvasSize}
        height={canvasSize}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <Defs>
          <Filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <FeGaussianBlur stdDeviation="4" result="blur" />
          </Filter>
        </Defs>

        <G x={offset} y={offset}>
          {/* Background ring with glow */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#B8F2F4"
            strokeWidth={strokeWidth}
            fill="none"
            filter="url(#glow)"
            strokeOpacity={0.5}
          />
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#B8F2F4"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Segments */}
          {segments.map((seg, i) => (
            <Path
              key={i}
              d={seg.pathData}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
            />
          ))}
        </G>
      </Svg>

      {/* Floating icon bubbles */}
      {showIcons && segments.map((seg, i) => {
        const absX = offset + seg.iconPos.x;
        const absY = offset + seg.iconPos.y;
        return (
          <View
            key={`icon-${i}`}
            style={{
              position: "absolute",
              left: absX - ICON_SIZE / 2,
              top: absY - ICON_SIZE / 2,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                borderRadius: ICON_SIZE / 2,
                backgroundColor: seg.color,
                alignItems: "center",
                justifyContent: "center",
                // Native shadow for the bubble
                shadowColor: seg.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <CategoryIcon name={seg.item.category} size={18} />
            </View>
            <Text className="font-lexendRegular text-[0.75rem] text-[#425658] -mt-0.5 text-center w-[40px]">
              {Math.round(seg.item.percentage)}%
            </Text>
          </View>
        );
      })}

      {/* Center content */}
      <View
        style={{
          position: "absolute",
          left: offset,
          top: offset,
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View className="bg-[#00343F] w-[24px] h-[24px] rounded-[8px] items-center justify-center mb-1.5">
          <Text className="font-lexendSemiBold text-[0.875rem] text-primary">
            {totalCount}
          </Text>
        </View>
        <Text className="font-lexendRegular text-[0.75rem] text-[#5E7A7C] mb-0.5">
          Total expense
        </Text>
        <Text className="font-lexendBold text-[1.25rem] text-[#036D7D]">
          {currencySymbol} {formatValue(totalSpend)}
        </Text>
      </View>
    </Pressable>
  );
}