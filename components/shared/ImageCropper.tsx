import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CROP_AREA_SIZE = SCREEN_WIDTH - 40;
const HANDLE_SIZE = 24;

interface ImageCropperProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
  onCrop: (croppedUri: string) => void;
}

export default function ImageCropper({
  visible,
  imageUri,
  onClose,
  onCrop,
}: ImageCropperProps) {
  if (!imageUri) return null;

  const [imgLayout, setImgLayout] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });

  // Crop box state (Shared Values for performance)
  const boxX = useSharedValue(20);
  const boxY = useSharedValue(100);
  const boxWidth = useSharedValue(CROP_AREA_SIZE);
  const boxHeight = useSharedValue(CROP_AREA_SIZE);

  // Start values for gestures
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startW = useSharedValue(0);
  const startH = useSharedValue(0);

  // Load image size
  useMemo(() => {
    if (imageUri) {
      Image.getSize(imageUri, (width, height) => {
        setOriginalSize({ width, height });
        
        // Calculate fit center
        const aspectRatio = width / height;
        let displayWidth, displayHeight;
        
        if (aspectRatio > 1) { // Landscape
          displayWidth = SCREEN_WIDTH;
          displayHeight = SCREEN_WIDTH / aspectRatio;
        } else { // Portrait
          displayHeight = SCREEN_HEIGHT * 0.7;
          displayWidth = displayHeight * aspectRatio;
          if (displayWidth > SCREEN_WIDTH) {
            displayWidth = SCREEN_WIDTH;
            displayHeight = SCREEN_WIDTH / aspectRatio;
          }
        }
        
        const x = (SCREEN_WIDTH - displayWidth) / 2;
        const y = (SCREEN_HEIGHT * 0.8 - displayHeight) / 2;
        
        setImgLayout({ width: displayWidth, height: displayHeight, x, y });
        
        // Reset box to cover the whole image initially
        boxX.value = x;
        boxY.value = y;
        boxWidth.value = displayWidth;
        boxHeight.value = displayHeight;
      });
    }
  }, [imageUri]);

  // Gestures for corners
  const createHandleGesture = (handle: 'tl' | 'tr' | 'bl' | 'br') => {
    return Gesture.Pan()
      .onStart(() => {
        startX.value = boxX.value;
        startY.value = boxY.value;
        startW.value = boxWidth.value;
        startH.value = boxHeight.value;
      })
      .onUpdate((e) => {
        'worklet';
        if (handle === 'tl') {
          const newX = startX.value + e.translationX;
          const newY = startY.value + e.translationY;
          const newW = startW.value - e.translationX;
          const newH = startH.value - e.translationY;
          
          if (newW > 50 && newH > 50) {
            boxX.value = newX;
            boxY.value = newY;
            boxWidth.value = newW;
            boxHeight.value = newH;
          }
        } else if (handle === 'tr') {
          const newW = startW.value + e.translationX;
          const newY = startY.value + e.translationY;
          const newH = startH.value - e.translationY;
          
          if (newW > 50 && newH > 50) {
            boxY.value = newY;
            boxWidth.value = newW;
            boxHeight.value = newH;
          }
        } else if (handle === 'bl') {
          const newX = startX.value + e.translationX;
          const newW = startW.value - e.translationX;
          const newH = startH.value + e.translationY;
          
          if (newW > 50 && newH > 50) {
            boxX.value = newX;
            boxWidth.value = newW;
            boxHeight.value = newH;
          }
        } else if (handle === 'br') {
          const newW = startW.value + e.translationX;
          const newH = startH.value + e.translationY;
          
          if (newW > 50 && newH > 50) {
            boxWidth.value = newW;
            boxHeight.value = newH;
          }
        }
      });
  };

  const boxGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = boxX.value;
      startY.value = boxY.value;
    })
    .onUpdate((e) => {
      'worklet';
      boxX.value = startX.value + e.translationX;
      boxY.value = startY.value + e.translationY;
    });

  const animatedBoxStyle = useAnimatedStyle(() => ({
    left: boxX.value,
    top: boxY.value,
    width: boxWidth.value,
    height: boxHeight.value,
  }));

  const topOverlayStyle = useAnimatedStyle(() => ({
    left: 0,
    top: 0,
    width: SCREEN_WIDTH,
    height: boxY.value,
  }));

  const leftOverlayStyle = useAnimatedStyle(() => ({
    left: 0,
    top: boxY.value,
    width: boxX.value,
    height: boxHeight.value,
  }));

  const rightOverlayStyle = useAnimatedStyle(() => ({
    left: boxX.value + boxWidth.value,
    top: boxY.value,
    width: SCREEN_WIDTH - (boxX.value + boxWidth.value),
    height: boxHeight.value,
  }));

  const bottomOverlayStyle = useAnimatedStyle(() => ({
    left: 0,
    top: boxY.value + boxHeight.value,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - (boxY.value + boxHeight.value),
  }));

  const handleCrop = async () => {
    if (!imageUri || !imgLayout.width || !originalSize.width) return;

    const scale = originalSize.width / imgLayout.width;
    
    // Relative to image layout
    const cropX = (boxX.value - imgLayout.x) * scale;
    const cropY = (boxY.value - imgLayout.y) * scale;
    const cropW = boxWidth.value * scale;
    const cropH = boxHeight.value * scale;

    try {
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: Math.max(0, cropX),
              originY: Math.max(0, cropY),
              width: Math.min(originalSize.width - cropX, cropW),
              height: Math.min(originalSize.height - cropY, cropH),
            },
          },
        ],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );
      onCrop(result.uri);
    } catch (error) {
      console.error('Crop error:', error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Crop Image</Text>
          <TouchableOpacity onPress={handleCrop}>
            <Text style={styles.cropText}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.previewContainer}>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.image,
                {
                  width: imgLayout.width,
                  height: imgLayout.height,
                  left: imgLayout.x,
                  top: imgLayout.y,
                },
              ]}
              resizeMode="contain"
            />
          )}

          {/* Dark Overlays around the crop box */}
          <Animated.View style={[styles.overlay, topOverlayStyle]} />
          <Animated.View style={[styles.overlay, leftOverlayStyle]} />
          <Animated.View style={[styles.overlay, rightOverlayStyle]} />
          <Animated.View style={[styles.overlay, bottomOverlayStyle]} />
          
          <GestureDetector gesture={boxGesture}>
            <Animated.View style={[styles.cropBox, animatedBoxStyle]}>
              {/* Corner Handles */}
              <GestureDetector gesture={createHandleGesture('tl')}>
                <View style={[styles.handle, styles.tl]} />
              </GestureDetector>
              <GestureDetector gesture={createHandleGesture('tr')}>
                <View style={[styles.handle, styles.tr]} />
              </GestureDetector>
              <GestureDetector gesture={createHandleGesture('bl')}>
                <View style={[styles.handle, styles.bl]} />
              </GestureDetector>
              <GestureDetector gesture={createHandleGesture('br')}>
                <View style={[styles.handle, styles.br]} />
              </GestureDetector>
              
              {/* Visual Grid */}
              <View style={styles.gridContainer}>
                <View style={styles.gridRow} />
                <View style={styles.gridRow} />
                <View style={styles.gridCol} />
                <View style={styles.gridCol} />
              </View>
            </Animated.View>
          </GestureDetector>
        </View>

        <View style={styles.footer}>
          <Text style={styles.hint}>Drag corners to resize. Drag box to move.</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    zIndex: 10,
  },
  cancelText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Lexend-Regular',
  },
  cropText: {
    color: '#00AEB5',
    fontSize: 16,
    fontFamily: 'Lexend-Bold',
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Lexend-Medium',
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  cropBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#00AEB5',
    backgroundColor: 'transparent',
  },
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    backgroundColor: '#00AEB5',
    borderRadius: HANDLE_SIZE / 2,
    zIndex: 20,
  },
  tl: { top: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2 },
  tr: { top: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2 },
  bl: { bottom: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2 },
  br: { bottom: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2 },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.3,
  },
  gridRow: {
    width: '100%',
    height: '33.33%',
    borderBottomWidth: 1,
    borderColor: '#FFF',
  },
  gridCol: {
    width: '33.33%',
    height: '100%',
    borderRightWidth: 1,
    borderColor: '#FFF',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  hint: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'Lexend-Light',
  },
});
