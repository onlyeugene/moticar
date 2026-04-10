import React from "react";
import { View, Dimensions } from "react-native";
import WireframeSVG from "@/assets/icons/wireframe.svg";

interface CarWireframeProps {
  opacity?: number;
}

const { width: screenWidth } = Dimensions.get("window");
// Maintain a consistent size relative to the screen width
const WIREFRAME_WIDTH = screenWidth - 40;
const WIREFRAME_HEIGHT = (WIREFRAME_WIDTH * 185) / 344;

const CarWireframe: React.FC<CarWireframeProps> = ({ opacity = 0.8 }) => {
  return (
    <View style={{ 
      width: WIREFRAME_WIDTH, 
      height: WIREFRAME_HEIGHT, 
      alignItems: 'center', 
      justifyContent: 'center',
    }}>
      <WireframeSVG 
        width={WIREFRAME_WIDTH} 
        height={WIREFRAME_HEIGHT}
        style={{ opacity }}
      />
    </View>
  );
};

export default CarWireframe;
