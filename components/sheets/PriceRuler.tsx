import React, { useRef, useEffect, useCallback, memo } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = 12;
const STEP = 100; // Each tick is 100 units
const MAJOR_STEP = 10; // Label every 10 ticks (1,000 units)
const MAX_VALUE = 1000000;
const TOTAL_ITEMS = MAX_VALUE / STEP;

interface PriceRulerProps {
  value: number;
  onValueChange: (value: number) => void;
}

const PriceRulerItem = memo(({ item, index }: { item: number; index: number }) => {
  const isMajor = index % MAJOR_STEP === 0;
  
  return (
    <View style={[styles.itemContainer, { width: ITEM_WIDTH }]}>
      {isMajor && (
        <Text style={styles.majorLabel}>
          {item >= 1000 ? `${item / 1000}k` : item}
        </Text>
      )}
      <View style={[styles.tick, isMajor ? styles.majorTick : styles.minorTick]} />
    </View>
  );
});

const PriceRuler: React.FC<PriceRulerProps> = ({ value, onValueChange }) => {
  const flatListRef = useRef<FlatList>(null);
  const isScrollingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const lastEmittedValue = useRef(value);

  // Data for the ruler
  const data = Array.from({ length: TOTAL_ITEMS + 1 }, (_, i) => i * STEP);

  // Sync scroll position when external value changes
  useEffect(() => {
    if (!isScrollingRef.current) {
      if (value >= 0 && value <= MAX_VALUE) {
        const offset = (value / STEP) * ITEM_WIDTH;
        isProgrammaticScrollRef.current = true;
        flatListRef.current?.scrollToOffset({
          offset,
          animated: true,
        });
        lastEmittedValue.current = value;
      }
    }
  }, [value]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isProgrammaticScrollRef.current) {
      // Ignore this scroll event as it was caused by the useEffect
      return;
    }

    const offset = event.nativeEvent.contentOffset.x;
    const rawValue = (offset / ITEM_WIDTH) * STEP;
    
    // Allow single unit precision
    const newValue = Math.round(rawValue);
    
    if (newValue !== lastEmittedValue.current && newValue >= 0 && newValue <= MAX_VALUE) {
      isScrollingRef.current = true;
      lastEmittedValue.current = newValue;
      onValueChange(newValue);
    }
  }, [onValueChange]);

  const onMomentumScrollEnd = useCallback(() => {
    isScrollingRef.current = false;
    isProgrammaticScrollRef.current = false;
  }, []);

  const onScrollBeginDrag = useCallback(() => {
    isScrollingRef.current = true;
    isProgrammaticScrollRef.current = false;
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item, index }) => <PriceRulerItem item={item} index={index} />}
        keyExtractor={(item) => item.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        onScroll={handleScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollBeginDrag={onScrollBeginDrag}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
        })}
        contentContainerStyle={{
          paddingHorizontal: SCREEN_WIDTH / 2 - ITEM_WIDTH / 2,
        }}
      />
      <View style={styles.indicator} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: "transparent",
    position: "relative",
    marginVertical: 10,
    overflow: "visible",
  },
  itemContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    paddingBottom: 10,
  },
  tick: {
    width: 1,
    backgroundColor: "#B4B1B1",
  },
  minorTick: {
    height: 12,
    backgroundColor: "#E0E0E0",
  },
  majorTick: {
    height: 24,
    backgroundColor: "#B4B1B1",
  },
  majorLabel: {
    fontSize: 10,
    color: "#9BBABB",
    position: "absolute",
    top: 0,
    fontFamily: "Lexend-Regular",
  },
  indicator: {
    position: "absolute",
    left: SCREEN_WIDTH / 2 - 1,
    bottom: 5,
    width: 2,
    height: 40,
    backgroundColor: "#29D7DE",
    borderRadius: 1,
  },
});

export default memo(PriceRuler);
