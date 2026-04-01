import React from 'react';
import { View } from 'react-native';

const DefaultCar = require("@/assets/carIcons/other-car.svg").default;

const ICON_MAP: Record<string, any> = {
  // Common Brands
  toyota: require("@/assets/carIcons/toyota.svg").default,
  honda: require("@/assets/carIcons/honda.svg").default,
  bmw: require("@/assets/carIcons/bmw.svg").default,
  mercedes: require("@/assets/carIcons/mercedes.svg").default,
  benz: require("@/assets/carIcons/mercedes.svg").default,
  audi: require("@/assets/carIcons/audi.svg").default,
  ford: require("@/assets/carIcons/ford.svg").default,
  nissan: require("@/assets/carIcons/nissan.svg").default,
  hyundai: require("@/assets/carIcons/hyundai.svg").default,
  kia: require("@/assets/carIcons/kia.svg").default,
  lexus: require("@/assets/carIcons/lexus.svg").default,
  "land-rover": require("@/assets/carIcons/land-rover.svg").default,
  landrover: require("@/assets/carIcons/land-rover.svg").default,
  mazda: require("@/assets/carIcons/mazda.svg").default,
  tesla: require("@/assets/carIcons/tesla.svg").default,
  vw: require("@/assets/carIcons/vw.svg").default,
  volkswagen: require("@/assets/carIcons/vw.svg").default,
  jeep: require("@/assets/carIcons/jeep.svg").default,
  chevrolet: require("@/assets/carIcons/chevrolet.svg").default,
  fiat: require("@/assets/carIcons/fiat.svg").default,
  peugeot: require("@/assets/carIcons/peugot.svg").default,
  peugot: require("@/assets/carIcons/peugot.svg").default,
  mitsubishi: require("@/assets/carIcons/mitsubishi.svg").default,
  suzuki: require("@/assets/carIcons/suzuki.svg").default,
  
  // Luxury & Sports
  porsche: require("@/assets/carIcons/porsche.svg").default,
  ferrari: require("@/assets/carIcons/ferrari.svg").default,
  lamborghini: require("@/assets/carIcons/lamborghini.svg").default,
  maserati: require("@/assets/carIcons/maserati.svg").default,
  mclaren: require("@/assets/carIcons/mclaren.svg").default,
  bentley: require("@/assets/carIcons/bentley.svg").default,
  rollsroyce: require("@/assets/carIcons/rolls-royce.svg").default,
  "rolls-royce": require("@/assets/carIcons/rolls-royce.svg").default,
  astonmartin: require("@/assets/carIcons/aston-martin.svg").default,
  "aston-martin": require("@/assets/carIcons/aston-martin.svg").default,
  bugatti: require("@/assets/carIcons/bugatti.svg").default,
  alfaromeo: require("@/assets/carIcons/alfa-romeo.svg").default,
  "alfa-romeo": require("@/assets/carIcons/alfa-romeo.svg").default,
  jaguar: require("@/assets/carIcons/jaguar.svg").default,
  
  // Other Brands
  acura: require("@/assets/carIcons/acura.svg").default,
  austin: require("@/assets/carIcons/austin.svg").default,
  avia: require("@/assets/carIcons/avia.svg").default,
  brilliance: require("@/assets/carIcons/brilliance.svg").default,
  buick: require("@/assets/carIcons/buick.svg").default,
  cadillac: require("@/assets/carIcons/cadillac.svg").default,
  chrysler: require("@/assets/carIcons/chrysler.svg").default,
  citroen: require("@/assets/carIcons/citroen.svg").default,
  cupra: require("@/assets/carIcons/cupra.svg").default,
  dacia: require("@/assets/carIcons/dacia.svg").default,
  daewoo: require("@/assets/carIcons/daewoo.svg").default,
  dodge: require("@/assets/carIcons/dodge.svg").default,
  gmc: require("@/assets/carIcons/gmc.svg").default,
  hummer: require("@/assets/carIcons/hummer.svg").default,
  infiniti: require("@/assets/carIcons/infiniti.svg").default,
  isuzu: require("@/assets/carIcons/isuzu.svg").default,
  lincoln: require("@/assets/carIcons/lincoln.svg").default,
  mini: require("@/assets/carIcons/mini-cooper.svg").default,
  opel: require("@/assets/carIcons/opel.svg").default,
  ram: require("@/assets/carIcons/ram.svg").default,
  renault: require("@/assets/carIcons/renault.svg").default,
  saab: require("@/assets/carIcons/saab.svg").default,
  skoda: require("@/assets/carIcons/skoda.svg").default,
  smart: require("@/assets/carIcons/smart.svg").default,
  ssangyong: require("@/assets/carIcons/ssangyong.svg").default,
  subaru: require("@/assets/carIcons/subaru.svg").default,
  volvo: require("@/assets/carIcons/volvo.svg").default,
};

export const getCarIcon = (make: string) => {
  if (!make) return DefaultCar;
  const normalizedMake = make.toLowerCase().trim().replace(/[ _]/g, '-');
  
  // Try direct match
  if (ICON_MAP[normalizedMake]) return ICON_MAP[normalizedMake];
  
  // Try no-hyphen match for hyphenated keys (e.g., 'rolls-royce' -> 'rollsroyce')
  const noHyphenMake = normalizedMake.replace(/-/g, '');
  if (ICON_MAP[noHyphenMake]) return ICON_MAP[noHyphenMake];

  // Try partial match
  for (const key in ICON_MAP) {
    if (normalizedMake.includes(key) || key.includes(normalizedMake)) return ICON_MAP[key];
  }
  
  return DefaultCar;
};

interface CarIconProps {
  make: string;
  size?: number;
  color?: string;
}

export const CarIcon = ({ make, size = 32, color }: CarIconProps) => {
  const IconComponent = getCarIcon(make);
  
  if (!IconComponent) return null;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent width={size} height={size} fill={color} style={{ flex: 1 }} />
    </View>
  );
};
