import React, { useState } from "react";
import { View } from "react-native";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Line,
  G,
  Rect,
  Text as SvgText,
} from "react-native-svg";

interface SparklineProps {
  data: number[];
  budget?: number;
  color?: string;
  width?: number;
  height?: number;
  currencySymbol?: string;
  label?: string;
  trend?: "up" | "down";
}

export default function Sparkline({
  data,
  budget,
  color = "#00AEB5",
  width = 120,
  height = 40,
  currencySymbol = "£",
  label = "0 more",
  trend = "up",
}: SparklineProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const badgeColor = trend === "down" ? "#EE6969" : color;

  // Use a minimal default dataset if no data is provided to ensure something is visible
  const chartData = data && data.length >= 2 ? data : [10, 15, 12, 20, 18, 25];

  const maxVal = Math.max(...chartData, budget || 0);
  const minVal = 0; // Always start from 0 for cumulative spend
  const range = (maxVal - minVal) || 1;
  const paddingY = 40; // Increased padding for the tooltip
  const chartHeight = height - paddingY - 10; // 10px bottom padding
  const stepX = width / (chartData.length - 1);

  const points = chartData.map((val, i) => ({
    x: i * stepX,
    y: paddingY + chartHeight - ((val - minVal) / range) * chartHeight,
  }));

  // Helper for polyline path (straight lines)
  const getPolylinePath = (p: { x: number; y: number }[]) => {
    if (p.length < 2) return "";
    return `M ${p.map(pt => `${pt.x} ${pt.y}`).join(' L ')}`;
  };

  const lineD = getPolylinePath(points);
  const fillD = `${lineD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  const budgetY = budget 
    ? paddingY + chartHeight - ((budget - minVal) / range) * chartHeight 
    : null;

  const handleTouch = (event: any) => {
    const x = event.nativeEvent.locationX;
    const index = Math.round(x / stepX);
    if (index >= 0 && index < chartData.length) {
      setActiveIndex(index);
    }
  };

  const activePoint = activeIndex !== null ? points[activeIndex] : null;
  const activeValue = activeIndex !== null ? chartData[activeIndex] : null;
  
  // Bounds checking for tooltip
  const getTooltipX = (x: number) => {
    const tooltipWidth = 85; 
    if (x - tooltipWidth / 2 < 0) return 0;
    if (x + tooltipWidth / 2 > width) return width - tooltipWidth;
    return x - tooltipWidth / 2;
  };

  return (
    <View style={{ width, height, overflow: "hidden" }}>
      <Svg
        width={width}
        height={height}
        onPressIn={handleTouch}
        onPressOut={() => setActiveIndex(null)}
        style={{ overflow: "hidden" }}
      >
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.2" />
            <Stop offset="1" stopColor={color} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* Dashed budget trajectory line - from 0 to full budget */}
        {budget !== undefined && (
          <>
            <Line
              x1="0"
              y1={paddingY + chartHeight}
              x2={width}
              y2={budgetY!}
              stroke="#E0E0E0"
              strokeWidth="1.5"
              strokeDasharray="6,6"
            />
            {/* Budget Label at the end */}
            <SvgText
              x={width - 5}
              y={budgetY! - 8}
              fill="#9BBABB"
              fontSize="10"
              fontWeight="bold"
              textAnchor="end"
              fontFamily="Lexend-Bold"
            >
              {currencySymbol}{budget.toLocaleString()}
            </SvgText>
          </>
        )}

        <Path d={fillD} fill="url(#gradient)" stroke="none" />
        <Path
          d={lineD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Highlighted point and Tooltip */}
        {activeIndex !== null && activePoint && (
          <G>
            <Circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="5"
              fill={badgeColor}
              stroke="white"
              strokeWidth="2"
            />
            {/* Tooltip Badge */}
            <G x={getTooltipX(activePoint.x)} y={activePoint.y - 35}>
              <Rect
                width="85"
                height="26"
                rx="13"
                fill={badgeColor}
              />
              <SvgText
                x="42.5"
                y="17"
                fill="white"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="Lexend-Bold"
              >
                {currencySymbol}{activeValue?.toLocaleString()} spent
              </SvgText>
            </G>
          </G>
        )}

        {/* Default indicator for last point */}
        {activeIndex === null && (
          <Circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="4"
            fill={color}
            stroke="white"
            strokeWidth="1.5"
          />
        )}
      </Svg>
    </View>
  );
}