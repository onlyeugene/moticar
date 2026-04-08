import React from "react";
import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface TechnicianDoughnutChartProps {
  data: { name: string; amount: number; percentage: number }[];
  size?: number;
}

const COLORS = [
  "#FBE74C", // Yellow
  "#00AEB5", // Cyan/Teal
  "#7BA0A3", // Muted Teal
  "#00343F", // Dark Teal
  "#ADADAD", // Grey
];

export default function TechnicianDoughnutChart({
  data,
  size = 220,
}: TechnicianDoughnutChartProps) {
  const strokeWidth = 35;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const GAP_DEGS = 2; // Subtle gap

  const chartData = [...data].sort((a, b) => b.amount - a.amount).slice(0, 5);
  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);

  let cumulativeAngle = -90;

  const toRad = (deg: number) => (Math.PI * deg) / 180;

  const segments = chartData.map((item, index) => {
    const numSegments = chartData.length;
    const totalGapDegrees = numSegments > 1 ? GAP_DEGS * numSegments : 0;
    const availableDegrees = 360 - totalGapDegrees;
    
    const itemPercentage = (item.amount / (totalAmount || 1)) * 100;
    const angle = (itemPercentage / 100) * availableDegrees;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle + (numSegments > 1 ? GAP_DEGS : 0);

    const x1 = center + radius * Math.cos(toRad(startAngle));
    const y1 = center + radius * Math.sin(toRad(startAngle));
    const x2 = center + radius * Math.cos(toRad(endAngle));
    const y2 = center + radius * Math.sin(toRad(endAngle));
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    let pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
    
    if (angle >= 359.9) {
      const midX = center + radius * Math.cos(toRad(startAngle + 180));
      const midY = center + radius * Math.sin(toRad(startAngle + 180));
      pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${midX} ${midY} A ${radius} ${radius} 0 0 1 ${x1} ${y1}`;
    }

    const midAngle = startAngle + angle / 2;
    const textX = center + radius * Math.cos(toRad(midAngle));
    const textY = center + radius * Math.sin(toRad(midAngle));

    return {
      pathData,
      color: COLORS[index % COLORS.length],
      textPos: { x: textX, y: textY },
      percentage: Math.round(itemPercentage),
      angle
    };
  });

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        {segments.map((seg, i) => (
          <Path
            key={i}
            d={seg.pathData}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
          />
        ))}
      </Svg>

      {/* Percentage Labels */}
      {segments.map((seg, i) => (
        <View
          key={`label-${i}`}
          style={{
            position: "absolute",
            left: seg.textPos.x - 20,
            top: seg.textPos.y - 10,
            width: 40,
            height: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {seg.angle > 20 && (
            <Text className="text-white text-[12px] font-lexendBold">
                {seg.percentage}%
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}
