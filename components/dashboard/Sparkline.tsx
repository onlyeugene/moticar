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
  color?: string;
  width?: number;
  height?: number;
  currencySymbol?: string;
  label?: string;
  trend?: "up" | "down";
}

export default function Sparkline({
  data,
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

  const max = Math.max(...chartData);
  const min = Math.min(...chartData);
  const range = (max - min) || 1;
  const paddingY = 40; // Increased padding for the tooltip
  const chartHeight = height - paddingY - 10; // 10px bottom padding
  const stepX = width / (chartData.length - 1);

  const points = chartData.map((val, i) => ({
    x: i * stepX,
    y: paddingY + chartHeight - ((val - min) / range) * chartHeight,
  }));

  // Helper for smooth bezier curves
  const getCurvePath = (p: { x: number; y: number }[]) => {
    if (p.length < 2) return "";
    let d = `M ${p[0].x} ${p[0].y}`;
    for (let i = 0; i < p.length - 1; i++) {
      const cx = (p[i].x + p[i + 1].x) / 2;
      d += ` Q ${p[i].x} ${p[i].y} ${cx} ${(p[i].y + p[i + 1].y) / 2}`;
    }
    d += ` L ${p[p.length - 1].x} ${p[p.length - 1].y}`;
    return d;
  };

  const lineD = getCurvePath(points);
  const fillD = `${lineD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  const handleTouch = (event: any) => {
    const x = event.nativeEvent.locationX;
    const index = Math.round(x / stepX);
    if (index >= 0 && index < chartData.length) {
      setActiveIndex(index);
    }
  };

  const activePoint = activeIndex !== null ? points[activeIndex] : null;
  
  // Bounds checking for tooltip
  const getTooltipX = (x: number) => {
    const tooltipWidth = 85; // Slightly wider for full currency labels
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

        {/* Dashed background line - subtly angled */}
        <Line
          x1="0"
          y1={paddingY + chartHeight * 0.7}
          x2={width}
          y2={paddingY + chartHeight * 0.4}
          stroke="#E0E0E0"
          strokeWidth="1"
          strokeDasharray="4,4"
        />

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
                {label}
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