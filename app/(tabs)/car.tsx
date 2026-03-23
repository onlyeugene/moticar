import EmptyIcon from "@/assets/icons/empty.svg";
import AddTechnicianSheet from "@/components/sheets/AddTechnicianSheet";
import { useCarById, useUserCars } from "@/hooks/useCars";
import { useTechnicians } from "@/hooks/useTechnicians";
import { TECHNICIAN_CATEGORIES } from "@/types/technician";
import { CarIcon } from "@/utils/carIconHelper";
import { Ionicons } from "@expo/vector-icons";
import { format, formatDistanceToNow } from "date-fns";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BrakesIcon from "@/assets/icons/car/parts/brakes.svg";
import BatteryIcon from "@/assets/icons/car/parts/electrics.svg";
import EngineOilIcon from "@/assets/icons/car/parts/engileOil.svg";
import FuelIcon from "@/assets/icons/car/parts/fuelSupplySystem.svg";
import TyresIcon from "@/assets/icons/car/parts/tyres.svg";
import MotiBuddieIcon from "@/assets/icons/motibuddie.svg";
import { useAppStore } from "@/store/useAppStore";

export default function CarScreen() {
  const { selectedCarId } = useAppStore();
  const { data: carsData, isLoading: isCarsLoading } = useUserCars();
  const { data: techniciansData } = useTechnicians();
  const [selectedCategory, setSelectedCategory] = useState<string>("Mechanic");
  const [isAddTechnicianSheetVisible, setIsAddTechnicianSheetVisible] =
    useState(false);

  const cars = carsData?.cars || [];
  const technicians = techniciansData?.technicians || [];

  // Find the currently selected car or default to the first one
  const activeCarSummary = useMemo(() => {
    if (selectedCarId) {
      return (
        cars.find((c) => c._id === selectedCarId || c.id === selectedCarId) ||
        cars[0]
      );
    }
    return cars[0];
  }, [cars, selectedCarId]);

  const { data: carDetailData, isLoading: isDetailLoading } = useCarById(
    activeCarSummary?._id || activeCarSummary?.id || "",
  );

  const activeCar = useMemo(() => {
    // If we have detailed data, use it.
    return carDetailData?.car || activeCarSummary;
  }, [carDetailData, activeCarSummary]);

  const hasCars = cars.length > 0;
  const isLoading = isCarsLoading || (hasCars && isDetailLoading);

  const filteredTechnicians = technicians.filter((t) =>
    selectedCategory === "Others"
      ? !TECHNICIAN_CATEGORIES.filter((c) => c !== "Others").includes(
          t.specialty as any,
        )
      : t.specialty === selectedCategory,
  );

  // Derived properties - only use if provided by API, otherwise use placeholders
  const healthScore = (activeCar as any)?.healthScore;
  const resaleValuation = (activeCar as any)?.resaleValuation;

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      {/* Fixed Header */}
      <View className="pt-[60px] pb-3 px-4 bg-[#F5F5F5]">
        <Text className="text-[26px] font-lexendBold text-[#00343F]">Car</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
      >
        {/* ── Car Card ── */}
        {isLoading ? (
          <View className="h-[200px] items-center justify-center">
            <ActivityIndicator size="large" color="#00AEB5" />
          </View>
        ) : !hasCars ? (
          <View className="bg-white p-6 rounded-[24px] items-center mb-6">
            <EmptyIcon width={100} height={80} />
            <Text className="text-[#888282] text-[14px] font-lexendMedium mt-4 mb-6">
              You haven't registered any car yet
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(onboarding)")}
              className="bg-[#29D7DE] w-full py-4 rounded-full items-center"
            >
              <Text className="text-[#00343F] font-lexendBold text-[16px]">
                Add a car
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-white rounded-[24px] overflow-hidden mb-6 shadow-sm elevation-2">
            <View className="p-5">
              {/* Top row */}
              <View className="flex-row justify-between items-center mb-4">
                <View className="w-12 h-12 bg-[#F5F5F5] rounded-full items-center justify-center">
                  <CarIcon make={activeCar?.make || ""} size={32} />
                </View>
                <View className="bg-white border border-[#E5E5E5] px-4 py-2 rounded-lg">
                  <Text className="text-[#00343F] text-[16px] font-lexendBold">
                    {activeCar?.plate || "-"}
                  </Text>
                </View>
              </View>

              {/* Car name + health score */}
              <View className="flex-row justify-between items-end">
                <View className="flex-1 mr-4">
                  <Text className="text-[#00AEB5] text-[20px] font-lexendBold mb-1.5">
                    {activeCar?.make} {activeCar?.carModel}
                  </Text>
                  <Text className="text-[#888282] text-[11px] font-lexendRegular leading-[18px]">
                    {activeCar?.year} . {activeCar?.mileage?.toLocaleString()}{" "}
                    miles . {activeCar?.color || "N/A"} .{" "}
                    {activeCar?.bodyStyle || "N/A"} .{" "}
                    {activeCar?.fuelType || "N/A"}
                    {"\n"}
                    <Text className="text-[#006064] font-lexendMedium">
                      {activeCar?.purchaseDate
                        ? `Purchased ${formatDistanceToNow(new Date(activeCar.purchaseDate), { addSuffix: true })}`
                        : "No purchase info"}
                      {" . "}
                      Added{" "}
                      {activeCar?.createdAt
                        ? format(new Date(activeCar.createdAt), "d MMMM, yyyy")
                        : "recently"}
                    </Text>
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-[#888282] text-[10px] font-lexendRegular mb-1.5 text-center">
                    Car Health Score
                  </Text>
                  <View className="w-16 h-16 rounded-full border-[4px] border-[#C6F1F1] items-center justify-center">
                    <Text className="text-[#00AEB5] text-[18px] font-lexendBold">
                      {healthScore ? `${healthScore}%` : "--%"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Resale Valuation */}
            <TouchableOpacity className="bg-[#FFF9EC] px-5 py-3.5 flex-row justify-between items-center">
              <Text className="text-[#00343F] text-[14px] font-lexendMedium">
                Resale Valuation
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-[#00343F] text-[14px] font-lexendBold">
                  {resaleValuation ? `₦${resaleValuation?.toLocaleString()}` : "N/A"}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#00343F" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Car Facts ── */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-[#00343F] text-[20px] font-lexendBold">
              Your Car Facts
            </Text>
            <Ionicons name="grid-outline" size={20} color="#7A7A7C" />
          </View>

          {/* Row 1: Engine Oil + Fuel */}
          <View className="flex-row gap-3 mb-3">
            {/* Engine Oil */}
            <TouchableOpacity className="flex-1 bg-white rounded-[20px] p-4">
              <View className="flex-row justify-between items-start mb-2">
                <EngineOilIcon width={30} height={30} />
                <Text className="text-[#00343F] text-[22px] font-lexendBold">
                  {activeCar?.engineOil?.capacityLiters
                    ? `${activeCar.engineOil.capacityLiters}L`
                    : "8L"}
                </Text>
              </View>
              <Text className="text-[#00343F] text-[14px] font-lexendBold mb-1">
                Engine Oil
              </Text>
              <Text
                className="text-[#888282] text-[10px] font-lexendRegular mb-2"
                numberOfLines={2}
              >
                Recommended grades:{"\n"}
                {activeCar?.engineOil?.recommendedGrade ||
                  "5W-30, 10W-40, 5W-40"}
              </Text>
              <View className="flex-row gap-1">
                {["BOSCH", "STARK", "RIDEX"].map((brand) => (
                  <View
                    key={brand}
                    className="bg-[#F5F5F5] px-1.5 py-0.5 rounded"
                  >
                    <Text className="text-[7px] font-lexendBold text-[#444]">
                      {brand}
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>

            {/* Fuel */}
            <TouchableOpacity className="flex-1 bg-white rounded-[20px] p-4">
              <View className="flex-row justify-between items-start mb-2">
                <FuelIcon width={30} height={30} />
                <Text className="text-[#00343F] text-[22px] font-lexendBold">
                  {activeCar?.fuelSpec?.capacityLiters
                    ? `${activeCar.fuelSpec.capacityLiters}L`
                    : "93L"}
                </Text>
              </View>
              <Text className="text-[#00343F] text-[14px] font-lexendBold mb-1">
                Fuel
              </Text>
              <Text className="text-[#888282] text-[10px] font-lexendRegular mb-2">
                Full Tank
              </Text>
              <View className="bg-[#FEF597] px-2 py-0.5 rounded-full self-start">
                <Text className="text-[#00343F] text-[9px] font-lexendBold">
                  Est. ₦
                  {(
                    (activeCar?.fuelSpec?.capacityLiters || 93) *
                    (activeCar?.fuelSpec?.avgPriceRange || 650)
                  )?.toLocaleString()}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Row 2: Tyres full width */}
          <TouchableOpacity className="bg-white rounded-[20px] p-4 mb-3">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-3 flex-1">
                <TyresIcon width={30} height={30} />
                <View className="flex-1">
                  <Text className="text-[#00343F] text-[14px] font-lexendBold mb-0.5">
                    Tyres
                  </Text>
                  <Text className="text-[#888282] text-[10px] font-lexendRegular">
                    Recommended tyre pressure is between{" "}
                    <Text className="font-lexendBold text-[#00343F]">
                      {activeCar?.tyreSpec?.recommendedPressurePsi ||
                        "40 - 44 psi"}
                    </Text>
                  </Text>
                  <View className="flex-row gap-1 mt-1.5">
                    {["BOSCH", "STARK", "RIDEX"].map((brand) => (
                      <View
                        key={brand}
                        className="bg-[#F5F5F5] px-1.5 py-0.5 rounded"
                      >
                        <Text className="text-[7px] font-lexendBold text-[#444]">
                          {brand}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-[#00343F] text-[20px] font-lexendBold">
                  {activeCar?.tyreSpec?.size || "265x45 R20"}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color="#888282"
                  className="mt-1"
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* Row 3: Brake Pads + Battery */}
          <View className="flex-row gap-3">
            {/* Brake Pads */}
            <TouchableOpacity className="flex-1 bg-white rounded-[20px] p-4">
              <View className="flex-row justify-between items-start mb-2">
                <BrakesIcon width={30} height={30} />
                <Text className="text-[#00343F] text-[22px] font-lexendBold">
                  {activeCar?.brakePads?.thicknessMm
                    ? `${activeCar.brakePads.thicknessMm}mm`
                    : "10mm"}
                </Text>
              </View>
              <Text className="text-[#00343F] text-[14px] font-lexendBold mb-1">
                Brake Pads
              </Text>
              <Text className="text-[#888282] text-[10px] font-lexendRegular mb-2">
                Est. last between 30,000{"\n"}and 70,000 miles
              </Text>
              <View className="flex-row gap-1">
                {["BOSCH", "STARK", "RIDEX"].map((brand) => (
                  <View
                    key={brand}
                    className="bg-[#F5F5F5] px-1.5 py-0.5 rounded"
                  >
                    <Text className="text-[7px] font-lexendBold text-[#444]">
                      {brand}
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>

            {/* Battery */}
            <TouchableOpacity className="flex-1 bg-white rounded-[20px] p-4">
              <View className="flex-row justify-between items-start mb-2">
                <BatteryIcon width={30} height={30} />
                <Text className="text-[#00343F] text-[20px] font-lexendBold">
                  {activeCar?.batteryVoltage || "13.7V"}
                </Text>
              </View>
              <Text className="text-[#00343F] text-[14px] font-lexendBold mb-1">
                Battery
              </Text>
              <Text className="text-[#888282] text-[10px] font-lexendRegular mb-2">
                Normal operating{"\n"}voltage
              </Text>
              <View className="flex-row gap-1">
                {["BOSCH", "STARK", "RIDEX"].map((brand) => (
                  <View
                    key={brand}
                    className="bg-[#F5F5F5] px-1.5 py-0.5 rounded"
                  >
                    <Text className="text-[7px] font-lexendBold text-[#444]">
                      {brand}
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          </View>

          <Text className="text-[#888282] text-[10px] font-lexendRegular text-center mt-4">
            These details are powered by motiNtelligence
          </Text>
        </View>

        {/* ── motiBuddie Status ── */}
        <View className="bg-[#012227] p-5 rounded-[20px] flex-row items-start mb-8">
          <View className="w-12 h-12 bg-[#00AEB5]/20 rounded-xl items-center justify-center mr-4">
            <MotiBuddieIcon width={32} height={32} />
          </View>
          <View className="flex-1">
            <Text className="text-white text-[15px] font-lexendBold mb-0.5">
              motibuddie detected
            </Text>
            <Text className="text-[#00AEB5] text-[10px] font-lexendBold mb-2">
              ID: {activeCar?.plate || "12121212311"}
            </Text>
            <Text className="text-[#9BBABB] text-[11px] font-lexendRegular leading-[17px] mb-3">
              Nothing to be alarmed about. Your device can now read about your
              car. You have a buddie to count on.
            </Text>
            <View className="flex-row items-center gap-2">
              <View className="bg-[#FEF597] px-3 py-1.5 rounded-full flex-row items-center gap-1">
                <Ionicons name="location" size={11} color="#00343F" />
                <Text className="text-[#00343F] text-[10px] font-lexendBold">
                  Detected in Ikoyi, Lagos
                </Text>
              </View>
              <Text className="text-[#9BBABB] text-[10px] font-lexendRegular">
                453km away
              </Text>
            </View>
          </View>
        </View>

        {/* ── Technicians ── */}
        <View className="mb-10">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-[#00343F] text-[20px] font-lexendBold">
              Your auto-technicians
            </Text>
            <TouchableOpacity
              onPress={() => setIsAddTechnicianSheetVisible(true)}
              className="bg-[#C6F1F1] p-2 rounded-[20px]"
            >
              <Ionicons name="add" size={20} color="#00AEB5" />
            </TouchableOpacity>
          </View>

          {/* Category pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row mb-5"
            contentContainerStyle={{ gap: 10 }}
          >
            {TECHNICIAN_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`px-[18px] py-2 rounded-full border ${selectedCategory === category ? "bg-[#00FEF5]/10 border-[#00AEB5]" : "bg-white border-[#E5E5E5]"}`}
              >
                <Text
                  className={`text-[13px] font-lexendMedium ${selectedCategory === category ? "text-[#00AEB5]" : "text-[#7A7A7C]"}`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Technicians grid */}
          {filteredTechnicians && filteredTechnicians.length > 0 ? (
            <View className="flex-row flex-wrap gap-3">
              {filteredTechnicians.map((tech) => (
                <View key={tech._id} className="w-[22%] items-center gap-1.5">
                  <View className="w-14 h-14 rounded-full bg-[#E5F9F9] overflow-hidden">
                    {/* {tech.imageUrl ? (
                      <Image source={{ uri: tech.imageUrl }} className="w-14 h-14" />
                    ) : (
                      <View className="flex-1 items-center justify-center">
                        <Ionicons name="person" size={24} color="#00AEB5" />
                      </View>
                    )} */}
                  </View>
                  <Text
                    className="text-[#00343F] text-[11px] font-lexendBold text-center"
                    numberOfLines={2}
                  >
                    {tech.name}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white p-10 rounded-[24px] items-center">
              <EmptyIcon width={80} height={60} />
              <Text className="text-[#888282] text-[14px] font-lexendMedium mt-4">
                No details recorded
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <AddTechnicianSheet
        visible={isAddTechnicianSheetVisible}
        onClose={() => setIsAddTechnicianSheetVisible(false)}
        onSuccess={() => setIsAddTechnicianSheetVisible(false)}
      />
    </View>
  );
}
