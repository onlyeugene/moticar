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
    switch (normalizedType) {
      case "suv":
      case "jeep":
      case "4x4":
      case "offroad":
        return JeepIcon;
      case "sedan":
      case "saloon":
        return SedanIcon;
      case "hatchback":
        return HatchbackIcon;
      case "sportscar":
      case "coupe":
      case "performance":
        return SportsCarIcon;
      case "pickup":
      case "truck":
        return PickupIcon;
      case "bus":
      case "coach":
        return BusIcon;
      case "crossover":
        return CrossOverIcon;
      case "convertible":
      case "cabriolet":
        return ConvertibleIcon;
      case "stationwagon":
      case "estate":
        return StationWagonIcon;
      case "minivan":
      case "mpv":
        return MiniVanIcon;
      case "cargovan":
        return CargoVanIcon;
      case "compactvan":
        return CompactVanIcon;
      case "compactcar":
      case "compact":
        return CompactCarIcon;
      case "smallcar":
        return SmallCarIcon;
      case "classic":
        return ClassicIcon;
      default:
        return SedanIcon; // Fallback to sedan
    }
  };

  const IconComponent = getIcon();

  return (
    <View style={style}>
      <IconComponent width={size} height={size} fill={color} />
    </View>
  );
};

export default CarTypeIcon;
