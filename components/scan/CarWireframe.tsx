import React from 'react';
import { View } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';

interface CarWireframeProps {
  type: 'front' | 'back' | 'side' | 'perspective';
  color?: string;
  opacity?: number;
}

const CarWireframe: React.FC<CarWireframeProps> = ({ type, color = "#FFFFFF", opacity = 0.6 }) => {
  const getPerspectivePaths = () => (
    <>
      <Path d="M40 145 Q35 145 32 140 L28 110 Q25 90 40 85 L85 75 Q115 70 145 75 L165 85 Q185 95 188 125 L192 145 Q192 155 180 158 L55 162 Q45 162 40 145 Z" />
      <Path d="M75 80 L95 50 Q110 42 145 45 L170 55 Q182 60 185 85 L165 85" />
      <Path d="M95 50 L145 50 M145 45 L145 75" />
      <Path d="M100 55 L140 55 L140 73 L105 78 Z" />
      <Path d="M150 55 L168 62 L163 80 L148 78 Z" />
      <Path d="M40 95 Q38 105 45 108 L75 105 Q82 105 82 95 Z" />
      <Path d="M45 115 L78 112 M48 125 L80 122 M52 135 L82 132" />
      <Path d="M90 100 Q145 95 180 105" />
      <Path d="M175 120 Q178 135 190 138" />
      <G>
        <Circle cx="60" cy="145" r="18" strokeWidth="1.5" />
        <Circle cx="60" cy="145" r="12" strokeWidth="1" />
        <Circle cx="160" cy="145" r="18" strokeWidth="1.5" />
        <Circle cx="160" cy="145" r="12" strokeWidth="1" />
      </G>
      <Path d="M95 78 Q92 72 98 70 L105 72 Q108 75 105 80 Z" />
    </>
  );

  const getFrontPaths = () => (
    <>
      <Path d="M20 120 Q20 110 25 108 L175 108 Q180 110 180 120 L180 160 Q180 170 170 170 L30 170 Q20 170 20 160 Z" />
      <Path d="M35 108 L45 70 Q55 60 100 60 Q145 60 155 70 L165 108" />
      <Path d="M45 75 L155 75 M100 60 L100 108" />
      <Path d="M25 115 Q25 130 45 130 L70 130 Q75 130 75 115 Z" />
      <Path d="M130 115 Q130 130 155 130 L175 130 Q175 115 175 115 Z" />
      <Path d="M85 115 L115 115 L115 145 L85 145 Z" />
      <Path d="M85 125 L115 125 M85 135 L115 135" />
      <Path d="M30 108 Q100 100 170 108" />
    </>
  );

  const getBackPaths = () => (
    <>
      <Path d="M20 120 Q20 110 25 108 L175 108 Q180 110 180 120 L180 160 Q180 170 170 170 L30 170 Q20 170 20 160 Z" />
      <Path d="M30 108 L45 70 Q55 60 100 60 Q145 60 155 70 L170 108" />
      <Path d="M40 75 L160 75" />
      <Path d="M25 115 Q25 125 45 125 L60 125 Q65 125 65 115 Z" />
      <Path d="M140 115 Q140 125 155 125 L175 125 Q175 115 175 115 Z" />
      <Path d="M80 115 L120 115 L115 150 L85 150 Z" />
    </>
  );

  const getSidePaths = () => (
    <>
      <Path d="M10 140 Q10 130 20 128 L180 128 Q190 130 190 140 L195 155 Q195 160 185 160 L15 160 Q5 160 5 155 Z" />
      <Path d="M35 128 L60 80 Q75 65 120 65 L160 70 Q180 75 185 110 L180 128" />
      <Path d="M65 72 L115 72 L115 120 L65 120 Z" />
      <Path d="M120 72 L155 75 L150 120 L120 120 Z" />
      <Path d="M65 128 Q65 110 85 110 L115 110 Q135 110 135 128" />
      <G>
        <Circle cx="45" cy="150" r="18" strokeWidth="1.5" />
        <Circle cx="45" cy="150" r="12" strokeWidth="1.2" />
        <Circle cx="155" cy="150" r="18" strokeWidth="1.5" />
        <Circle cx="155" cy="150" r="12" strokeWidth="1.2" />
      </G>
    </>
  );

  const renderCurrentView = () => {
    switch (type) {
      case 'perspective': return getPerspectivePaths();
      case 'front': return getFrontPaths();
      case 'back': return getBackPaths();
      case 'side': return getSidePaths();
      default: return getPerspectivePaths();
    }
  };

  return (
    <View style={{ width: '100%', aspectRatio: 1.2, alignItems: 'center', justifyContent: 'center' }}>
      <Svg height="100%" width="100%" viewBox="0 0 200 200">
        <G 
          opacity={opacity}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {renderCurrentView()}
        </G>
      </Svg>
    </View>
  );
};

export default CarWireframe;
