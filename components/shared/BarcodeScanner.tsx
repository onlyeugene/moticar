import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  SafeAreaView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface BarcodeScannerProps {
  isVisible: boolean;
  onClose: () => void;
  onScanned: (data: string) => void;
}

const { width, height } = Dimensions.get("window");

export default function BarcodeScanner({
  isVisible,
  onClose,
  onScanned,
}: BarcodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isVisible && !permission?.granted) {
      requestPermission();
    }
    
    if (isVisible) {
      translateY.value = withRepeat(
        withTiming(250, { duration: 2500 }),
        -1,
        true
      );
    } else {
      translateY.value = 0;
    }
  }, [isVisible]);

  const animatedScanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    onScanned(data);
    onClose();
    // Reset scanned state after a delay to allow re-scanning if modal re-opens
    setTimeout(() => setScanned(false), 2000);
  };

  if (!permission?.granted && isVisible) {
    return (
      <Modal visible={isVisible} animationType="slide">
        <View className="flex-1 bg-[#00171B] items-center justify-center p-6">
          <Ionicons name="camera-outline" size={64} color="#29D7DE" />
          <Text className="text-white text-[1.25rem] font-lexendMedium mt-6 text-center">
            Camera Permission Needed
          </Text>
          <Text className="text-[#9BBABB] text-[0.9375rem] font-lexendRegular mt-4 text-center leading-6">
            We need your permission to use the camera to scan the device barcode.
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            className="bg-[#29D7DE] px-8 py-4 rounded-full mt-10"
          >
            <Text className="text-[#00232A] font-lexendBold">Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} className="mt-6">
            <Text className="text-[#9BBABB] font-lexendRegular">Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={isVisible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          enableTorch={torch}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "code128", "ean13", "ean8"],
          }}
        />

        {/* Viewfinder Overlay */}
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <View style={styles.viewfinder}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              {/* Pulsing & Moving Scan Line */}
              <Animated.View style={[styles.scanLine, animatedScanStyle]} />
            </View>
            <View style={styles.sideOverlay} />
          </View>
          <View style={styles.bottomOverlay}>
            <Text style={styles.instruction}>
              Align the barcode inside the square
            </Text>
          </View>
        </View>

        {/* Controls */}
        <SafeAreaView style={styles.controls}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.iconButton}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTorch(!torch)}
              style={styles.iconButton}
            >
              <Ionicons
                name={torch ? "flash" : "flash-off"}
                size={24}
                color={torch ? "#29D7DE" : "white"}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  middleRow: {
    flexDirection: "row",
    height: 250,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  viewfinder: {
    width: 250,
    height: 250,
    backgroundColor: "transparent",
    position: "relative",
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    paddingTop: 30,
  },
  instruction: {
    color: "white",
    fontFamily: "Lexend-Regular",
    fontSize: 16,
    textAlign: "center",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#29D7DE",
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: "absolute",
    left: "5%",
    right: "5%",
    top: 0,
    height: 2,
    backgroundColor: "#29D7DE",
    shadowColor: "#29D7DE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  controls: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
});
