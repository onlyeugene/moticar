import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PriceRuler from "../dashboard/PriceRuler";
import BottomSheet from "../shared/BottomSheet";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface PricePickerSheetProps {
  visible: boolean;
  onClose: () => void;
  initialValue: string;
  onSelect: (value: string) => void;
  currencySymbol: string;
}

export default function PricePickerSheet({
  visible,
  onClose,
  initialValue,
  onSelect,
  currencySymbol,
}: PricePickerSheetProps) {
  const [amount, setAmount] = useState(initialValue || "0");

  useEffect(() => {
    if (visible) {
      setAmount(initialValue || "0");
    }
  }, [visible, initialValue]);

  const handleRulerChange = useCallback((newValue: number) => {
    setAmount(newValue.toString());
  }, []);

  const handleDone = () => {
    onSelect(amount);
    onClose();
  };

  const handleInputChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    setAmount(cleaned || "0");
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Enter amount"
      scrollable={false}
      height="80%"
    >
      <View style={styles.container}>
        <View style={styles.displayContainer}>
          <Text style={styles.currency}>{currencySymbol}</Text>
          <TextInput
            style={styles.amountInput}
            value={amount === "0" ? "" : amount}
            onChangeText={handleInputChange}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#CCC"
            autoFocus
          />
        </View>

        <View style={styles.rulerContainer}>
          <PriceRuler
            value={parseFloat(amount) || 0}
            onValueChange={handleRulerChange}
          />
        </View>

        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
          activeOpacity={0.8}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    alignItems: "center",
    paddingBottom: 30,
  },
  displayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
    width: "100%",
  },
  currency: {
    fontSize: 28,
    fontFamily: "Lexend-Bold",
    color: "#00343F",
    marginRight: 8,
  },
  amountInput: {
    fontSize: 48,
    fontFamily: "Lexend-Bold",
    color: "#00343F",
    textAlign: "center",
    minWidth: 100,
  },
  rulerContainer: {
    width: SCREEN_WIDTH,
    height: 100,
    marginBottom: 30,
    justifyContent: "center",
  },
  doneButton: {
    backgroundColor: "#00343F",
    width: "100%",
    height: 55,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lexend-Bold",
  },
});
