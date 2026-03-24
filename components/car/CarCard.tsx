import EmptyIcon from "@/assets/icons/empty.svg";
import { CarIcon } from "@/utils/carIconHelper";
import { Ionicons } from "@expo/vector-icons";
import { format, formatDistanceToNow } from "date-fns";
import { Text, TouchableOpacity, View } from "react-native";

interface CarCardProps {
  activeCar: any;
  onAddCar?: () => void;
  onValuation?: () => void;
}

export function CarCard({ activeCar, onAddCar, onValuation }: CarCardProps) {
  const healthScore = activeCar?.healthScore;
  const resaleValuation = activeCar?.resaleValuation;

  return (
    <View className="bg-white rounded-[24px] overflow-hidden mb-6 ">
      <View className="p-5">
        {/* Top row: Logo + Plate */}
        <View className="flex-row justify-between items-center mb-4">
          <View className=" flex-1">
            <CarIcon make={activeCar?.make || ""} size={32} />
          </View>
          <View className="bg-white border border-dashed border-[#E5E5E5] px-4 h-[44px] w-[110px] items-center justify-center rounded-lg">
            <Text className="text-[#00343F] text-[18px] font-lexendBold uppercase">
              {activeCar?.plate || "-"}
            </Text>
          </View>
        </View>

        {/* Car name + health score row */}
        <View className="flex-row justify-between items-start mt-5">
          {/* Left: name + meta */}
          <View className="flex-1 mr-4">
            <Text className="text-[#00AEB5] text-[16px] font-lexendMedium mb-1">
              {activeCar?.make} {activeCar?.carModel}
            </Text>
            <Text className="text-[#9A9B9B] text-[10px] font-lexendRegular leading-[18px]">
              {activeCar?.year} · {activeCar?.mileage?.toLocaleString()} km ·{" "}
              {activeCar?.color ? ` · ${activeCar.color}` : "N/A"}{" "}
              {activeCar?.bodyStyle ? `· ${activeCar.bodyStyle}` : "N/A"}
              {activeCar?.fuelType ? ` · ${activeCar.fuelType}` : "N/A"}
              {"\n"}
              <Text className="text-[#006C70] text-[10px] font-lexendMedium">
                {activeCar?.purchaseDate
                  ? `Purchased ${formatDistanceToNow(new Date(activeCar.purchaseDate), { addSuffix: true })}`
                  : "No purchase info"}
                {" · Added "}
                {activeCar?.createdAt
                  ? format(new Date(activeCar.createdAt), "d MMM yyyy")
                  : "recently"}
              </Text>
            </Text>
          </View>

          {/* Right: health score */}
          <View className="items-center bg-[#EAFEFF] rounded-full h-[72px] w-[77px]">
            <Text className="text-[#7FA4A6] text-[9px] font-lexendRegular mb-1 text-center">
              Car Health Score
            </Text>
            <View className="">
              <Text className="text-[#29D7DE] text-[33px] font-lexendBold">
                {healthScore ? `${healthScore}%` : "--%"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Resale Valuation */}
      <View className="bg-[#FFECCF] px-5 py-3.5 flex-row justify-between items-center">
        <Text className="text-[#202A2A] text-[12px] font-lexendRegular">
          Resale Valuation
        </Text>
        <TouchableOpacity onPress={onValuation}>
          <View className="flex-row items-center gap-2">
            <Text className="text-[#006C70] text-[14px] font-lexendRegular">
              {resaleValuation
                ? `₦${resaleValuation?.toLocaleString()}`
                : "N/A"}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#ADADAD" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface EmptyCarCardProps {
  onAddCar?: () => void;
}

export function EmptyCarCard({ onAddCar }: EmptyCarCardProps) {
  return (
    <View className="bg-white p-6 rounded-[24px] items-center mb-6">
      <EmptyIcon width={100} height={80} />
      <Text className="text-[#888282] text-[14px] font-lexendMedium mt-4 mb-6">
        You haven't registered any car yet
      </Text>
      <TouchableOpacity
        onPress={onAddCar}
        className="bg-[#29D7DE] w-full py-4 rounded-full items-center"
      >
        <Text className="text-[#00343F] font-lexendBold text-[16px]">
          Add a car
        </Text>
      </TouchableOpacity>
    </View>
  );
}
