import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
  Dimensions,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Each item in FlatList = step units (passed via prop)
const SUB_TICK_WIDTH = 8;
const STEP_WIDTH = SUB_TICK_WIDTH; // Fixed width per step for smooth scrolling
const CENTER_OFFSET = SCREEN_WIDTH / 2;

interface RulerPickerProps {
  min?: number;
  max?: number;
  value?: number;
  initialValue?: number;
  onValueChange: (value: number) => void;
  unitPrefix?: string;
  title?: string;
  step?: number;
  unitStep?: number;
}

export const RulerPicker = ({
  min = 0,
  max = 2000000,
  value,
  initialValue = 50000,
  onValueChange,
  unitPrefix = "₦",
  title = "Estimated monthly budget",
  step = 50,
  unitStep = 500,
}: RulerPickerProps) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentValue, setCurrentValue] = useState(value ?? initialValue);
  const [inputValue, setInputValue] = useState(
    (value ?? initialValue).toLocaleString()
  );
  const [isEditing, setIsEditing] = useState(false);
  const isScrolling = useRef(false);
  const isProgrammaticScroll = useRef(false);

  // Each item in FlatList = step units, so total items = (max - min) / step
  const ticks = React.useMemo(() => {
    const t = [];
    for (let i = min; i <= max; i += step) {
      t.push(i);
    }
    return t;
  }, [min, max, step]);

  const scrollToValue = useCallback(
    (val: number, animated = true) => {
      const clampedVal = Math.max(min, Math.min(max, val));
      const offset = ((clampedVal - min) / step) * STEP_WIDTH;
      if (flatListRef.current) {
        isProgrammaticScroll.current = true;
        flatListRef.current.scrollToOffset({ offset, animated });
        setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 600);
      }
    },
    [min, max, step]
  );

  useEffect(() => {
    if (
      value !== undefined &&
      value !== currentValue &&
      !isScrolling.current &&
      !isEditing
    ) {
      setCurrentValue(value);
      setInputValue(value.toLocaleString());
      scrollToValue(value);
    }
  }, [value, isEditing]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToValue(currentValue, false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isProgrammaticScroll.current && !isScrolling.current) return;
    const offsetX = event.nativeEvent.contentOffset.x;

    // Snap to nearest index relative to min
    const index = Math.round(offsetX / STEP_WIDTH);
    const val = min + index * step;

    if (val !== currentValue && val >= min && val <= max) {
      setCurrentValue(val);
      if (!isEditing) setInputValue(val.toLocaleString());
      onValueChange(val);
    }
  };

  const handleInputChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setInputValue(numericText);
    const val = parseInt(numericText) || 0;
    // We update current value immediately to show text,
    // but snapping happens on blur/submit
    if (val !== currentValue) {
      setCurrentValue(val);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const val = parseInt(inputValue.replace(/,/g, "")) || 0;
    // Snap to nearest step
    const snapped = Math.round(val / step) * step;
    const clamped = Math.max(min, Math.min(max, snapped));

    setCurrentValue(clamped);
    setInputValue(clamped.toLocaleString());
    onValueChange(clamped);
    scrollToValue(clamped);
  };

  const renderItem = ({ item }: { item: number }) => {
    // Major tick every unitStep units
    const isMajor = item % unitStep === 0;
    // Mid tick every half of unitStep units
    const isMid = item % (unitStep / 2) === 0 && !isMajor;

    const tickHeight = isMajor ? 48 : isMid ? 28 : 18;
    const tickWidth = isMajor ? 2 : 1;
    const tickColor = isMajor ? "#7A9A9B" : "#4A6A6B";

    return (
      <View
        key={item}
        style={{
          width: STEP_WIDTH,
          alignItems: "center",
          justifyContent: "flex-end",
          height: 80,
        }}
      >
        {isMajor && (
          <Text
            style={{
              color: "#6A9A9B",
              fontSize: 10,
              position: "absolute",
              top: 0,
              width: 80,
              textAlign: "center",
              fontFamily: "LexendDeca-Regular",
              letterSpacing: -0.3,
            }}
          >
            {unitPrefix} {item.toLocaleString()}
          </Text>
        )}
        <View
          style={{
            width: tickWidth,
            height: tickHeight,
            backgroundColor: tickColor,
            marginBottom: 8,
            borderRadius: 1,
          }}
        />
      </View>
    );
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 8,
      }}
    >
      {/* Title */}
      <Text
        style={{
          color: "#4FB8C8",
          fontFamily: "LexendDeca-Medium",
          fontSize: 12,
          marginBottom: 4,
        }}
      >
        {title}
      </Text>

      {/* Value display */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "center",
          marginBottom: 24,
          paddingHorizontal: 40,
        }}
      >
        <Text
          style={{
            color: "white",
            fontFamily: "LexendDeca-Bold",
            fontSize: 32,
          }}
        >
          {unitPrefix}
        </Text>
        <TextInput
          value={isEditing ? inputValue : currentValue.toLocaleString()}
          onChangeText={handleInputChange}
          onFocus={() => {
            setIsEditing(true);
            setInputValue(currentValue.toString());
          }}
          onBlur={handleInputBlur}
          onSubmitEditing={handleInputBlur}
          keyboardType="numeric"
          keyboardAppearance="dark"
          returnKeyType="done"
          style={{
            color: "white",
            fontFamily: "LexendDeca-Bold",
            fontSize: 32,
            padding: 0,
            textAlign: "center",
          }}
          placeholder="0"
          placeholderTextColor="#356D75"
          maxLength={12}
        />
      </View>

      {/* Ruler */}
      <View style={{ height: 80, width: SCREEN_WIDTH }}>
        <FlatList
          ref={flatListRef}
          data={ticks}
          renderItem={renderItem}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onScrollBeginDrag={() => {
            isScrolling.current = true;
          }}
          onMomentumScrollBegin={() => {
            isScrolling.current = true;
          }}
          onScrollEndDrag={(e) => {
            if (e.nativeEvent.velocity?.x === 0) {
              isScrolling.current = false;
            }
          }}
          onMomentumScrollEnd={() => {
            isScrolling.current = false;
          }}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={STEP_WIDTH}
          snapToAlignment="start"
          contentContainerStyle={{
            paddingHorizontal: CENTER_OFFSET,
          }}
          getItemLayout={(_, index) => ({
            length: STEP_WIDTH,
            offset: STEP_WIDTH * index,
            index,
          })}
        />

        {/* Center indicator */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: CENTER_OFFSET - 2,
            bottom: -4,
            width: 3,
            height: 88,
            backgroundColor: "#00AEB5",
            borderRadius: 2,
          }}
        />

        {/* Left fade */}
        <LinearGradient
          colors={["#000", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: CENTER_OFFSET * 0.7,
            height: 80,
          }}
        />

        {/* Right fade */}
        <LinearGradient
          colors={["transparent", "#000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: CENTER_OFFSET * 0.7,
            height: 80,
          }}
        />
      </View>
    </View>
  );
};
