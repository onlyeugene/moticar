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
import TagIcon from "@/assets/icons/takepic.svg";

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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Take pictures</Text>
            <Text style={styles.headerSubtitle}>
              Ensure you are in a well lit area so that data gathered can be readable.
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
            <Ionicons name="chevron-forward" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Center Wireframe */}
        <View style={styles.wireframeContainer} pointerEvents="none">
          <CarWireframe opacity={0.8} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.captureButton} 
            onPress={takePicture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator color="#000" />
            ) : (
              <TagIcon width={32} height={32} />
            )}
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  backButton: {
    padding: 10,
    marginLeft: -10,
  },
  headerTitleContainer: {
    flex: 1,
    paddingTop: 8,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 24,
    fontFamily: "Lexend-Bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Lexend-Regular",
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  skipText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Lexend-Medium",
    marginRight: 2,
  },
  wireframeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  footer: {
    paddingBottom: 60,
    alignItems: "center",
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FBE74C",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
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
