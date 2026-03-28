import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import CarWireframe from "@/components/scan/CarWireframe";
import { useAppStore } from "@/store/useAppStore";
import { AppState } from "@/types/app";

const { width } = Dimensions.get("window");

export default function CameraScreen() {
  const params = useLocalSearchParams<{ 
    type: 'front' | 'back' | 'side' | 'perspective';
    step: string;
    totalSteps: string;
    label: string;
  }>();

  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const setTempCapturedImage = useAppStore((state: AppState) => state.setTempCapturedImage);

  if (!permission) {
    // Camera permissions are still loading.
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#29D7DE" />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: false,
        });
        
        if (photo) {
          setTempCapturedImage(photo.uri);
          router.back();
        }
      } catch (error) {
        console.error("Failed to take picture:", error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing="back"
        ref={cameraRef}
      />
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeText}>Exit</Text>
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>
            {params.step || "1"} of {params.totalSteps || "4"}
          </Text>
        </View>

        {/* Center Wireframe */}
        <View style={styles.wireframeContainer} pointerEvents="none">
          <CarWireframe 
            type={params.type || 'perspective'} 
            color="#FFFFFF" 
            opacity={0.6} 
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>{params.label || "Front driver side"}</Text>
          </View>
          
          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.captureButton} 
              onPress={takePicture}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator color="#00232A" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  closeButton: {
    padding: 10,
  },
  closeText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Lexend-Medium",
  },
  stepIndicator: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Lexend-Regular",
    opacity: 0.8,
  },
  wireframeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  footer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  labelContainer: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 30,
  },
  labelText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Lexend-Medium",
  },
  controls: {
    width: "100%",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#29D7DE",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "#FFF",
  },
  permissionButton: {
    backgroundColor: "#29D7DE",
    padding: 15,
    borderRadius: 8,
    alignSelf: "center",
  },
  permissionText: {
    color: "#00232A",
    fontWeight: "bold",
  },
});
