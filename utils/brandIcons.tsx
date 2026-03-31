import React from "react";
import { SvgProps } from "react-native-svg";

import SeventySixLogo from "@/assets/brands/76.svg";
import AcdelcoLogo from "@/assets/brands/acdelco.svg";
import AllisonTransmissionLogo from "@/assets/brands/allison-transmission.svg";
import BfgoodrichLogo from "@/assets/brands/bfgoodrich.svg";
import BoschLogo from "@/assets/brands/bosch.svg";
import BpLogo from "@/assets/brands/bp.svg";
import CaltexLogo from "@/assets/brands/caltex.svg";
import CatLogo from "@/assets/brands/cat.svg";
import CatlLogo from "@/assets/brands/catl.svg";
import ChevronLogo from "@/assets/brands/chevron.svg";
import ConocoLogo from "@/assets/brands/conoco.svg";
import ContinentalLogo from "@/assets/brands/continental.svg";
import DiehardLogo from "@/assets/brands/diehard.svg";
import DunlopLogo from "@/assets/brands/dunlop.svg";
import EngenLogo from "@/assets/brands/engen-.svg";
import EssoLogo from "@/assets/brands/esso.svg";
import ExideLogo from "@/assets/brands/exide.svg";
import ExxonmobilLogo from "@/assets/brands/exxonmobil.svg";
import FalkenLogo from "@/assets/brands/falken.svg";
import FirestoneLogo from "@/assets/brands/firestone.svg";
import GoodyearLogo from "@/assets/brands/goodyear.svg";
import GulfOilLogo from "@/assets/brands/gulf-oil.svg";
import HankookLogo from "@/assets/brands/hankook.svg";
import HellaPng4Logo from "@/assets/brands/hella_png4.svg";
import IndianOilCorporationLogo from "@/assets/brands/indian-oil-corporation.svg";
import InterstateBatteriesLogo from "@/assets/brands/interstate-batteries.svg";
import KumhoLogo from "@/assets/brands/kumho.svg";
import KybLogo from "@/assets/brands/kyb.svg";
import LassaLogo from "@/assets/brands/lassa.svg";
import LovesTravelStopsLogo from "@/assets/brands/loves-travel-stops.svg";
import LukoilLogo from "@/assets/brands/lukoil.svg";
import MarathonLogo from "@/assets/brands/marathon.svg";
import MatadorLogo from "@/assets/brands/matador.svg";
import MaxwellLogo from "@/assets/brands/maxwell.svg";
import MaxxisLogo from "@/assets/brands/maxxis.svg";
import MichelinLogo from "@/assets/brands/michelin.svg";
import MobilLogo from "@/assets/brands/mobil.svg";
import MorrisonsLogo from "@/assets/brands/morrisons.svg";
import MouraLogo from "@/assets/brands/moura.svg";
import MrfLogo from "@/assets/brands/mrf.svg";
import MurphyUsaLogo from "@/assets/brands/murphy-usa.svg";
import NapaLogo from "@/assets/brands/napa.svg";
import NexenLogo from "@/assets/brands/nexen.svg";
import NgkLogo from "@/assets/brands/ngk.svg";
import NorthstarLogo from "@/assets/brands/northstar.svg";
import OandoLogo from "@/assets/brands/oando.svg";
import OdysseyLogo from "@/assets/brands/odyssey.svg";
import OptimaBatteriesLogo from "@/assets/brands/optima-batteries.svg";
import PetroCanadaLogo from "@/assets/brands/petro-canada.svg";
import PetrobrasLogo from "@/assets/brands/petrobras.svg";
import Phillips6Logo from "@/assets/brands/phillips6.svg";
import PowerSonicLogo from "@/assets/brands/power-sonic.svg";
import PttLogo from "@/assets/brands/ptt.svg";
import RyobiLogo from "@/assets/brands/ryobi.svg";
import SasolLogo from "@/assets/brands/sasol.svg";
import SheetzLogo from "@/assets/brands/sheetz.svg";
import ShellLogo from "@/assets/brands/shell.svg";
import SpeedwayLogo from "@/assets/brands/speedway.svg";
import TexacoLogo from "@/assets/brands/texaco.svg";
import TotalLogo from "@/assets/brands/total.svg";
import ToyoLogo from "@/assets/brands/toyo.svg";
import TudorLogo from "@/assets/brands/tudor.svg";
import UniroyalLogo from "@/assets/brands/uniroyal.svg";
import ValeoLogo from "@/assets/brands/valeo.svg";
import ValeroLogo from "@/assets/brands/valero.svg";
import WawaLogo from "@/assets/brands/wawa.svg";
import YeswayLogo from "@/assets/brands/yesway.svg";
import YokohamaLogo from "@/assets/brands/yokohama.svg";
import YuasaLogo from "@/assets/brands/yuasa.svg";

export const BRAND_LOGOS: Record<string, React.FC<SvgProps>> = {
  "76": SeventySixLogo,
  "acdelco": AcdelcoLogo,
  "allison-transmission": AllisonTransmissionLogo,
  "bfgoodrich": BfgoodrichLogo,
  "bosch": BoschLogo,
  "bp": BpLogo,
  "caltex": CaltexLogo,
  "cat": CatLogo,
  "catl": CatlLogo,
  "chevron": ChevronLogo,
  "conoco": ConocoLogo,
  "continental": ContinentalLogo,
  "diehard": DiehardLogo,
  "dunlop": DunlopLogo,
  "engen-": EngenLogo,
  "esso": EssoLogo,
  "exide": ExideLogo,
  "exxonmobil": ExxonmobilLogo,
  "falken": FalkenLogo,
  "firestone": FirestoneLogo,
  "goodyear": GoodyearLogo,
  "gulf-oil": GulfOilLogo,
  "hankook": HankookLogo,
  "hella_png4": HellaPng4Logo,
  "indian-oil-corporation": IndianOilCorporationLogo,
  "interstate-batteries": InterstateBatteriesLogo,
  "kumho": KumhoLogo,
  "kyb": KybLogo,
  "lassa": LassaLogo,
  "loves-travel-stops": LovesTravelStopsLogo,
  "lukoil": LukoilLogo,
  "marathon": MarathonLogo,
  "matador": MatadorLogo,
  "maxwell": MaxwellLogo,
  "maxxis": MaxxisLogo,
  "michelin": MichelinLogo,
  "mobil": MobilLogo,
  "morrisons": MorrisonsLogo,
  "moura": MouraLogo,
  "mrf": MrfLogo,
  "murphy-usa": MurphyUsaLogo,
  "napa": NapaLogo,
  "nexen": NexenLogo,
  "ngk": NgkLogo,
  "northstar": NorthstarLogo,
  "oando": OandoLogo,
  "odyssey": OdysseyLogo,
  "optima-batteries": OptimaBatteriesLogo,
  "petro-canada": PetroCanadaLogo,
  "petrobras": PetrobrasLogo,
  "phillips6": Phillips6Logo,
  "power-sonic": PowerSonicLogo,
  "ptt": PttLogo,
  "ryobi": RyobiLogo,
  "sasol": SasolLogo,
  "sheetz": SheetzLogo,
  "shell": ShellLogo,
  "speedway": SpeedwayLogo,
  "texaco": TexacoLogo,
  "total": TotalLogo,
  "toyo": ToyoLogo,
  "tudor": TudorLogo,
  "uniroyal": UniroyalLogo,
  "valeo": ValeoLogo,
  "valero": ValeroLogo,
  "wawa": WawaLogo,
  "yesway": YeswayLogo,
  "yokohama": YokohamaLogo,
  "yuasa": YuasaLogo,
};

export const getBrandLogo = (brandName: string) => {
  const normalized = brandName.toLowerCase();
  return BRAND_LOGOS[normalized] || null;
};
