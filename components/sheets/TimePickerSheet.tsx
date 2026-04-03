import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import BottomSheet from "../shared/BottomSheet";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 3;

interface TimePickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  initialTime?: string; // "HH:mm"
  title?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

// Padding items for centering
const PADDING_ITEMS = Array.from({ length: Math.floor(VISIBLE_ITEMS / 2) }, () => "");

export default function TimePickerSheet({
  visible,
  onClose,
  onSelect,
  initialTime = "12:00",
  title = "Select Time",
}: TimePickerSheetProps) {
  const [selectedHour, setSelectedHour] = useState(initialTime.split(":")[0]);
  const [selectedMinute, setSelectedMinute] = useState(initialTime.split(":")[1]);

  const hourListRef = useRef<FlatList>(null);
  const minuteListRef = useRef<FlatList>(null);

  const dataHours = [...PADDING_ITEMS, ...HOURS, ...PADDING_ITEMS];
  const dataMinutes = [...PADDING_ITEMS, ...MINUTES, ...PADDING_ITEMS];

  useEffect(() => {
    if (visible && initialTime) {
      const [h, m] = initialTime.split(":");
      setSelectedHour(h);
      setSelectedMinute(m);
      
      // Short delay to ensure FlatList is ready
      setTimeout(() => {
        const hourIndex = HOURS.indexOf(h);
        const minuteIndex = MINUTES.indexOf(m);
        if (hourIndex !== -1) {
          hourListRef.current?.scrollToOffset({
            offset: hourIndex * ITEM_HEIGHT,
            animated: false,
          });
        }
        if (minuteIndex !== -1) {
          minuteListRef.current?.scrollToOffset({
            offset: minuteIndex * ITEM_HEIGHT,
            animated: false,
          });
        }
      }, 100);
    }
  }, [visible, initialTime]);

  const handleScroll = (type: "hour" | "minute") => (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.y;
    const index = Math.round(offset / ITEM_HEIGHT);
    
    if (type === "hour") {
      if (HOURS[index]) setSelectedHour(HOURS[index]);
    } else {
      if (MINUTES[index]) setSelectedMinute(MINUTES[index]);
    }
  };

  const handleSave = () => {
    onSelect(`${selectedHour}:${selectedMinute}`);
    onClose();
  };

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.item}>
      <Text style={[styles.itemText, item === "" && { opacity: 0 }]}>
        {item}
      </Text>
    </View>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={title}
      height={400}
      scrollable={false}
    >
      <View style={styles.container}>
        <View style={styles.pickerWrapper}>
          {/* Highlight Background */}
          <View style={styles.highlight} pointerEvents="none" />
          
          <View style={styles.column}>
            <FlatList
              ref={hourListRef}
              data={dataHours}
              renderItem={renderItem}
              keyExtractor={(item, index) => `hour-${index}`}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onScroll={handleScroll("hour")}
              scrollEventThrottle={16}
              getItemLayout={(_, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
            />
          </View>
          
          <View style={styles.separator}>
            <Text style={styles.separatorText}>:</Text>
          </View>
          
          <View style={styles.column}>
            <FlatList
              ref={minuteListRef}
              data={dataMinutes}
              renderItem={renderItem}
              keyExtractor={(item, index) => `minute-${index}`}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onScroll={handleScroll("minute")}
              scrollEventThrottle={16}
              getItemLayout={(_, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
            />
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleSave}
          className="bg-[#00343F] w-full py-4 rounded-full items-center mt-8"
        >
          <Text className="text-white font-lexendBold text-[16px]">Save Time</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  pickerWrapper: {
    flexDirection: "row",
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  highlight: {
    position: "absolute",
    height: ITEM_HEIGHT,
    width: "100%",
    backgroundColor: "#FBE74C33",
    borderRadius: 12,
    top: ITEM_HEIGHT, // Center item
  },
  column: {
    flex: 1,
    height: "100%",
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 24,
    fontFamily: "Lexend-Medium",
    color: "#00343F",
  },
  separator: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  separatorText: {
    fontSize: 24,
    fontFamily: "Lexend-Bold",
    color: "#00343F",
  },
});
