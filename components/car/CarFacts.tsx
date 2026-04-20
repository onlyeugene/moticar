import BrakesIcon from "@/assets/facts/brake.svg";
import EngineOilIcon from "@/assets/facts/oil.svg";
import FuelIcon from "@/assets/facts/fuel.svg";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import TyresIcon from "@/assets/facts/tyre.svg";
import BatteryIcon from "@/assets/facts/battery.svg";
import { BrandTags } from "@/lib";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getCurrencySymbol } from "@/utils/currency";

interface CarFactsProps {
  activeCarId: string;
  activeCar: any;
  onOpenDiagnostics?: () => void;
  onSelectDiagnostic?: (key: string) => void;
}

export function CarFacts({
  activeCarId,
  activeCar,
  onOpenDiagnostics,
  onSelectDiagnostic,
}: CarFactsProps) {
  const obdData = useAppStore((state) => state.obdData[activeCarId]);
  const user = useAuthStore((state) => state.user);
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);

  // Fuel Estimation Logic: Check if avgPriceRange is the total estimated cost or price per liter
  const getFuelEst = () => {
    if (!activeCar?.fuelSpec) return `Est. ${currencySymbol}N/A`;
    const { capacityLiters, avgPriceRange } = activeCar.fuelSpec;
    if (!capacityLiters) return `Est. ${currencySymbol}N/A`;

    const price = avgPriceRange || 0;
    if (!price) return `Est. ${currencySymbol}N/A`;

    // If avgPriceRange is large (e.g. 60000), it's likely the total cost already.
    if (price > 10000) {
      return `Est. ${currencySymbol}${price.toLocaleString()}`;
    }
    return `Est. ${currencySymbol}${(capacityLiters * price).toLocaleString()}`;
  };

  return (
    <View className="mb-6 bg-white rounded-[8px] p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-[#036D7D] text-[20px] font-lexendMedium">
          Your Car Facts
        </Text>
        <TouchableOpacity onPress={onOpenDiagnostics}>
          <Ionicons name="grid-outline" size={20} color="#7A7A7C" />
        </TouchableOpacity>
      </View>

      {/* Row 1: Engine Oil + Fuel */}
      <View className="flex-row gap-3 mb-3">
        {/* Engine Oil */}
        <TouchableOpacity
          className="flex-1 bg-[#F5F5F5] rounded-[4px] p-4"
          onPress={() => onSelectDiagnostic?.("engineOil")}
        >
          <View className="flex-row justify-between items-start mb-2">
            <EngineOilIcon width={30} height={30} />
            <Text className="text-[#006C70] text-[24px] font-lexendRegular">
              {activeCar?.engineOil?.capacityLiters
                ? `${activeCar.engineOil.capacityLiters}L`
                : "N/A"}
            </Text>
          </View>
          <Text className="text-[#006C70] text-[14px] font-lexendRegular mb-1">
            Engine Oil
          </Text>
          <Text
            className="text-[#879090] text-[10px] font-lexendRegular mb-2"
            numberOfLines={1}
          >
            Grade: {activeCar?.engineOil?.recommendedGrade || "N/A"}
          </Text>
          {/* <BrandTags brands={activeCar?.engineOil?.reputableBrands} /> */}
        </TouchableOpacity>

        {/* Fuel */}
        <TouchableOpacity
          className="flex-1 bg-[#F5F5F5] rounded-[4px] p-4"
          onPress={() => onSelectDiagnostic?.("fuel")}
        >
          <View className="flex-row justify-between items-start mb-2">
            <FuelIcon width={30} height={30} />
            <Text className="text-[#006C70] text-[24px] font-lexendRegular">
              {obdData?.fuelLevel !== undefined
                ? `${obdData.fuelLevel}%`
                : activeCar?.fuelSpec?.capacityLiters
                  ? `${activeCar.fuelSpec.capacityLiters}L`
                  : "N/A"}
            </Text>
          </View>
          <Text className="text-[#006C70] text-[14px] font-lexendRegular mb-2">
            Fuel {obdData?.fuelLevel !== undefined && "(Live)"}
          </Text>
          <View className="justify-between flex-row items-center mt-3">
            <Text className="text-[#879090] text-[10px] font-lexendRegular ">
              Full Tank
            </Text>
            <View className="flex-row items-center ">
              <View className="bg-[#FEF597] px-2 py-0.5 rounded-full">
                <Text className="text-[#425658] text-[8px] font-lexendRegular">
                  {getFuelEst()}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={12} color="#888282" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Row 2: Tyres full width */}
      <TouchableOpacity
        className="bg-[#F5F5F5] rounded-[4px] p-4 mb-3"
        onPress={() => onSelectDiagnostic?.("tyres")}
      >
        <View className="flex-row justify-between items-center">
          <View className=" gap-3 flex-1">
            <View className="flex-row justify-between items-start">
              <View>
                <TyresIcon width={30} height={30} />
                <Text className="text-[#006C70] text-[14px] font-lexendRegular mt-2 ">
                  Tyres
                </Text>
              </View>
              <View className="">
                <Text className="text-[#006C70] text-[24px] font-lexendRegular">
                  {activeCar?.tyreSpec?.size || "N/A"}
                </Text>
              </View>
            </View>
            {/* <BrandTags brands={activeCar?.tyreSpec?.manufacturers} /> */}
            <View className="flex-1 flex-row justify-between items-center">
              <Text className="text-[#879090] text-[10px] font-lexendRegular">
                Recommended tyre pressure is between{" "}
                <Text className="font-lexendBold text-[#006C70]">
                  {activeCar?.tyreSpec?.recommendedPressurePsi || "N/A"}
                </Text>
              </Text>
              <Ionicons name="chevron-forward" size={12} color="#7BA0A3" />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Row 3: Brake Pads + Battery */}
      <View className="flex-row gap-3">
        {/* Brake Pads */}
        <TouchableOpacity
          className="flex-1 bg-[#F5F5F5] rounded-[4px] p-4"
          onPress={() => onSelectDiagnostic?.("brakePads")}
        >
          <View className="flex-row justify-between items-start mb-2">
            <BrakesIcon width={30} height={30} />
            <Text className="text-[#006C70] text-[24px] font-lexendRegular">
              {activeCar?.brakePads?.thicknessMm
                ? `${activeCar.brakePads.thicknessMm}mm`
                : "N/A"}
            </Text>
          </View>
          <Text className="text-[#006C70] text-[14px] font-lexendRegular mb-1">
            Brake Pads
          </Text>
          {/* <BrandTags brands={activeCar?.brakePads?.reputableBrands} /> */}
          <View className="flex-row justify-between items-center mt-3">
            <Text
              className="text-[#879090] text-[10px] font-lexendRegular"
              numberOfLines={2}
            >
              Last between:{"\n"}
              <Text className="font-lexendBold text-[#006C70]">
                {activeCar?.brakePads?.estLifespanMiles ||
                  activeCar?.brakePads?.estimatedLifespanKm ||
                  "N/A"}
              </Text>
            </Text>
            <Ionicons name="chevron-forward" size={12} color="#7BA0A3" />
          </View>
        </TouchableOpacity>

        {/* Battery */}
        <TouchableOpacity
          className="flex-1 bg-[#F5F5F5] rounded-[4px] p-4"
          onPress={() => onSelectDiagnostic?.("battery")}
        >
          <View className="flex-row justify-between items-start mb-2">
            <BatteryIcon width={30} height={30} />
            <Text className="text-[#006C70] text-[24px] font-lexendRegular">
              {obdData?.voltage
                ? `${obdData.voltage}V`
                : activeCar?.batterySpec?.voltage
                  ? "12V"
                  : "N/A"}
            </Text>
          </View>
          <Text className="text-[#006C70] text-[14px] font-lexendRegular mb-1">
            Battery {obdData?.voltage && "(Live)"}
          </Text>
          <View className="mt-4 flex-row justify-between items-center">
            {/* <BrandTags brands={activeCar?.batterySpec?.providers} /> */}
            <Ionicons name="chevron-forward" size={12} color="#7BA0A3" />
          </View>
        </TouchableOpacity>
      </View>

      <Text className="text-[#879090] text-[10px] font-lexendRegular text-center mt-6 mb-3">
        These details are powered by motiNtelligence
      </Text>
    </View>
  );
}
