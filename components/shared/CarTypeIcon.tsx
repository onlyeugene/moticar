import React from "react";
import { View, ViewStyle } from "react-native";

// Import all car type SVGs
import BusIcon from "@/assets/cartypes/bus.svg";
import CargoVanIcon from "@/assets/cartypes/cargoVan.svg";
import ClassicIcon from "@/assets/cartypes/classic.svg";
import CompactVanIcon from "@/assets/cartypes/compactVan.svg";
import ConvertibleIcon from "@/assets/cartypes/convertible.svg";
import CompactCarIcon from "@/assets/cartypes/copactCar.svg";
import CrossOverIcon from "@/assets/cartypes/crossOver.svg";
import HatchbackIcon from "@/assets/cartypes/hatchBack.svg";
import JeepIcon from "@/assets/cartypes/jeep.svg";
import MiniVanIcon from "@/assets/cartypes/miniVan.svg";
import PickupIcon from "@/assets/cartypes/pickUp.svg";
import SedanIcon from "@/assets/cartypes/sedan.svg";
import SmallCarIcon from "@/assets/cartypes/smallCar.svg";
import SportsCarIcon from "@/assets/cartypes/sportsCar.svg";
import StationWagonIcon from "@/assets/cartypes/stationWagon.svg";

interface CarTypeIconProps {
  type: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const CarTypeIcon = ({
  type = "",
  size = 50,
  color = "#29D7DE",
  style,
}: CarTypeIconProps) => {
  const normalizedType = type.toLowerCase().replace(/[\s-]/g, "");

  const getIcon = () => {
    if (normalizedType.includes("suv") || normalizedType.includes("jeep") || normalizedType.includes("4x4") || normalizedType.includes("offroad")) {
      return JeepIcon;
    }
    if (normalizedType.includes("sedan") || normalizedType.includes("saloon") || normalizedType.includes("luxury") || normalizedType.includes("prestige")) {
      return SedanIcon;
    }
    if (normalizedType.includes("hatchback")) {
      return HatchbackIcon;
    }
    if (normalizedType.includes("sports") || normalizedType.includes("coupe") || normalizedType.includes("performance") || normalizedType.includes("supercar")) {
      return SportsCarIcon;
    }
    if (normalizedType.includes("pickup") || normalizedType.includes("truck") || normalizedType.includes("4x2")) {
      return PickupIcon;
    }
    if (normalizedType.includes("bus") || normalizedType.includes("coach") || normalizedType.includes("minibus")) {
      return BusIcon;
    }
    if (normalizedType.includes("crossover")) {
      return CrossOverIcon;
    }
    if (normalizedType.includes("convertible") || normalizedType.includes("cabriolet") || normalizedType.includes("cabrio") || normalizedType.includes("roadster")) {
      return ConvertibleIcon;
    }
    if (normalizedType.includes("stationwagon") || normalizedType.includes("estate") || normalizedType.includes("wagon") || normalizedType.includes("touring")) {
      return StationWagonIcon;
    }
    if (normalizedType.includes("minivan") || normalizedType.includes("mpv") || normalizedType.includes("muv") || normalizedType.includes("peoplemover")) {
      return MiniVanIcon;
    }
    if (normalizedType.includes("cargovan") || normalizedType.includes("van")) {
      return CargoVanIcon;
    }
    if (normalizedType.includes("compactvan")) {
      return CompactVanIcon;
    }
    if (normalizedType.includes("compactcar") || normalizedType.includes("compact")) {
      return CompactCarIcon;
    }
    if (normalizedType.includes("smallcar") || normalizedType.includes("micro") || normalizedType.includes("citycar")) {
      return SmallCarIcon;
    }
    if (normalizedType.includes("classic") || normalizedType.includes("vintage")) {
      return ClassicIcon;
    }
    return SedanIcon; // Fallback to sedan
  };

  const IconComponent = getIcon();

  return (
    <View style={style}>
      <IconComponent width={size} height={size} fill={color} />
    </View>
  );
};

export default CarTypeIcon;
