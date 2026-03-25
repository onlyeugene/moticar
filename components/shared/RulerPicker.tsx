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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// Matching the screenshot density: 4 sub-ticks (5 intervals) between unitSteps
const TICK_WIDTH = 10;
const TICKS_PER_STEP = 5;
const STEP_WIDTH = TICK_WIDTH * TICKS_PER_STEP;
const CENTER_OFFSET = SCREEN_WIDTH / 2;

interface RulerPickerProps {
  min?: number;
  max?: number;
  step?: number; // Major step for labels (e.g. 5000)
  unitStep?: number; // Distance between each tick (e.g. 500)
  value?: number;
  initialValue?: number;
  onValueChange: (value: number) => void;
  unitPrefix?: string;
}

export const RulerPicker = ({
  min = 0,
  max = 1000000,
  step = 5000,
  unitStep = 500,
  value,
  initialValue = 50000,
  onValueChange,
  unitPrefix = "",
}: RulerPickerProps) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentValue, setCurrentValue] = useState(value ?? initialValue);
  const [inputValue, setInputValue] = useState((value ?? initialValue).toString());
  const [isEditing, setIsEditing] = useState(false);
  const isScrolling = useRef(false);
  const isProgrammaticScroll = useRef(false);

  // Generate discrete major units for FlatList (rendering only labels)
  const steps = React.useMemo(() => {
    const s = [];
    for (let i = min; i <= max; i += unitStep) {
      s.push(i);
    }
    return s;
  }, [min, max, unitStep]);

  const scrollToValue = useCallback((val: number, animated = true) => {
    const offset = ((val - min) / unitStep) * STEP_WIDTH;
    if (flatListRef.current) {
      isProgrammaticScroll.current = true;
      flatListRef.current.scrollToOffset({
        offset,
        animated,
      });
      // Reset after a short delay
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 500);
    }
  }, [min, unitStep]);

  // Sync with external value
  useEffect(() => {
    if (value !== undefined && value !== currentValue && !isScrolling.current && !isEditing) {
      setCurrentValue(value);
      setInputValue(value.toString());
      scrollToValue(value);
    }
  }, [value, isEditing]);

  // Initial position
  useEffect(() => {
    scrollToValue(currentValue, false);
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isProgrammaticScroll.current && !isScrolling.current) return;
    
    const offsetX = event.nativeEvent.contentOffset.x;
    // Continuous value calculation: value = min + (offset / STEP_WIDTH) * unitStep
    const val = Math.round(min + (offsetX / STEP_WIDTH) * unitStep);
    
    if (val !== currentValue && val >= min && val <= max) {
      setCurrentValue(val);
      if (!isEditing) setInputValue(val.toString());
      onValueChange(val);
    }
  };

  const handleInputChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setInputValue(numericText);
    
    const val = parseInt(numericText) || 0;
    if (val !== currentValue) {
      setCurrentValue(val);
      onValueChange(val);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const val = parseInt(inputValue) || 0;
    scrollToValue(val);
  };

  const renderItem = ({ item }: { item: number }) => {
    const isMajor = item % step === 0;

    return (
      <View
        style={{
          width: STEP_WIDTH,
          alignItems: "center",
          justifyContent: "flex-end",
          height: 120,
        }}
      >
        {isMajor && (
          <Text
            style={{
              color: "#9BBABB",
              fontSize: 10,
              position: "absolute",
              top: 10,
              width: 100,
              textAlign: "center",
              fontFamily: "LexendRegular",
            }}
          >
            {unitPrefix} {item.toLocaleString()}
          </Text>
        )}
        <View className="flex-row items-end justify-between w-full px-[1px] mb-4">
          <View
            style={{
              width: 1,
              height: isMajor ? 50 : 35,
              backgroundColor: isMajor ? "#356D75" : "#1A4147",
              borderRadius: 1,
            }}
          />
          {/* Exactly 4 sub-ticks to create 5 intervals */}
          <View style={{ width: 1, height: 15, backgroundColor: "#063036" }} />
          <View style={{ width: 1, height: 15, backgroundColor: "#063036" }} />
          <View style={{ width: 1, height: 15, backgroundColor: "#063036" }} />
          <View style={{ width: 1, height: 15, backgroundColor: "#063036" }} />
        </View>
      </View>
    );
  };

  return (
    <View className="items-center justify-center py-6 relative">
      {/* Dashed background line through the budget text */}
      <View 
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          bottom: 60, // Restricting it so it's not "one long line" through everything
          left: CENTER_OFFSET,
          width: 0.5,
          borderStyle: "dashed",
          borderWidth: 1,
          borderColor: "#29D7DE",
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      {/* Main Budget Display Area */}
      <View className="flex-row items-baseline justify-center mb-10 z-20 px-10">
        <Text className="text-white font-lexendBold text-[48px]">
          {unitPrefix}
        </Text>
        <TextInput
          value={isEditing ? inputValue : currentValue.toLocaleString()}
          onChangeText={handleInputChange}
          onFocus={() => setIsEditing(true)}
          onBlur={handleInputBlur}
          keyboardType="numeric"
          className="text-white font-lexendBold text-[48px] p-0 min-w-[200px] text-center"
          placeholder="0"
          placeholderTextColor="#356D75"
          maxLength={12}
        />
      </View>

      <View style={{ height: 120, width: SCREEN_WIDTH, zIndex: 10 }}>
        <FlatList
          ref={flatListRef}
          data={steps}
          renderItem={renderItem}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onScrollBeginDrag={() => (isScrolling.current = true)}
          onScrollEndDrag={() => (isScrolling.current = false)}
          onMomentumScrollEnd={() => (isScrolling.current = false)}
          scrollEventThrottle={16}
          decelerationRate="normal"
          contentContainerStyle={{
            paddingHorizontal: CENTER_OFFSET,
          }}
          getItemLayout={(_, index) => ({
            length: STEP_WIDTH,
            offset: STEP_WIDTH * index,
            index,
          })}
        />
        {/* Continuous Center Indicator Line (The cyan solid line on ruler) */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: CENTER_OFFSET - 2.5,
            bottom: 25,
            width: 5,
            height: 60,
            backgroundColor: "#29D7DE",
            borderRadius: 2.5,
          }}
        />
      </View>
    </View>
  );
};
