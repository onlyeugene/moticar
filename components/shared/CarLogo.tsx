import React from "react";
import { View, ViewStyle, Text } from "react-native";
import { SvgProps } from "react-native-svg";

// Import brand SVGs from assets/carIcons
import FordSvg from "@/assets/carIcons/ford.svg";
import ToyotaSvg from "@/assets/carIcons/toyota.svg";
import HondaSvg from "@/assets/carIcons/honda.svg";
import HyundaiSvg from "@/assets/carIcons/hyundai.svg";
import MazdaSvg from "@/assets/carIcons/mazda.svg";
import MercedesSvg from "@/assets/carIcons/mercedes.svg";
import BMWSvg from "@/assets/carIcons/bmw.svg";
import VWSvg from "@/assets/carIcons/vw.svg";
import NissanSvg from "@/assets/carIcons/nissan.svg";
import KiaSvg from "@/assets/carIcons/kia.svg";
import AudiSvg from "@/assets/carIcons/audi.svg";
import LexusSvg from "@/assets/carIcons/lexus.svg";
import JeepSvg from "@/assets/carIcons/jeep.svg";
import LandRoverSvg from "@/assets/carIcons/land-rover.svg";
import TeslaSvg from "@/assets/carIcons/tesla.svg";
import PorscheSvg from "@/assets/carIcons/porsche.svg";
import ChevroletSvg from "@/assets/carIcons/chevrolet.svg";
import MitsubishiSvg from "@/assets/carIcons/mitsubishi.svg";
import SubaruSvg from "@/assets/carIcons/subaru.svg";
import SuzukiSvg from "@/assets/carIcons/suzuki.svg";
import RenaultSvg from "@/assets/carIcons/renault.svg";
import PeugeotSvg from "@/assets/carIcons/peugot.svg"; 
import AcuraSvg from "@/assets/carIcons/acura.svg";
import InfinitiSvg from "@/assets/carIcons/infiniti.svg";
import DodgeSvg from "@/assets/carIcons/dodge.svg";
import ChryslerSvg from "@/assets/carIcons/chrysler.svg";
import CadillacSvg from "@/assets/carIcons/cadillac.svg";
import BuickSvg from "@/assets/carIcons/buick.svg";
import BentleySvg from "@/assets/carIcons/bentley.svg";
import MaseratiSvg from "@/assets/carIcons/maserati.svg";
import LamborghiniSvg from "@/assets/carIcons/lamborghini.svg";
import FerrariSvg from "@/assets/carIcons/ferrari.svg";
import AlfaRomeoSvg from "@/assets/carIcons/alfa-romeo.svg";
import VolvoSvg from "@/assets/carIcons/volvo.svg";
import SkodaSvg from "@/assets/carIcons/skoda.svg";
import MiniSvg from "@/assets/carIcons/mini-cooper.svg";

interface CarLogoProps {
  make: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const brandLogos: Record<string, React.FC<SvgProps>> = {
  ford: FordSvg,
  toyota: ToyotaSvg,
  honda: HondaSvg,
  hyundai: HyundaiSvg,
  mazda: MazdaSvg,
  mercedes: MercedesSvg,
  "mercedes-benz": MercedesSvg,
  bmw: BMWSvg,
  volkswagen: VWSvg,
  vw: VWSvg,
  nissan: NissanSvg,
  kia: KiaSvg,
  audi: AudiSvg,
  lexus: LexusSvg,
  jeep: JeepSvg,
  "land rover": LandRoverSvg,
  "land-rover": LandRoverSvg,
  tesla: TeslaSvg,
  porsche: PorscheSvg,
  chevrolet: ChevroletSvg,
  mitsubishi: MitsubishiSvg,
  subaru: SubaruSvg,
  suzuki: SuzukiSvg,
  renault: RenaultSvg,
  peugeot: PeugeotSvg,
  peugot: PeugeotSvg, 
  acura: AcuraSvg,
  infiniti: InfinitiSvg,
  dodge: DodgeSvg,
  chrysler: ChryslerSvg,
  cadillac: CadillacSvg,
  buick: BuickSvg,
  bentley: BentleySvg,
  maserati: MaseratiSvg,
  lamborghini: LamborghiniSvg,
  ferrari: FerrariSvg,
  "alfa romeo": AlfaRomeoSvg,
  "alfa-romeo": AlfaRomeoSvg,
  volvo: VolvoSvg,
  skoda: SkodaSvg,
  mini: MiniSvg,
  "mini cooper": MiniSvg,
};

export const CarLogo = ({ make, size = 40, color, style }: CarLogoProps) => {
  const normalizedMake = make.toLowerCase().trim();
  const LogoComponent = brandLogos[normalizedMake];

  if (!LogoComponent) {
    // Return a placeholder or the first letter if logo not found
    return (
      <View
        style={[{
          width: size, 
          height: size, 
          borderRadius: size / 2, 
          backgroundColor: color || "#00343F", 
          alignItems: "center", 
          justifyContent: "center",
          opacity: color ? 0.3 : 1
        }, style]}
      >
        <Text className="text-white text-[10px] uppercase font-lexendBold">
          {make.charAt(0)}
        </Text>
      </View>
    );
  }

  return (
    <View style={[{ width: size, height: size }, style]}>
      <LogoComponent width={size} height={size} fill={color} color={color} />
    </View>
  );
};
