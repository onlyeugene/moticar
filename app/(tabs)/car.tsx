// Ensures this screen is rendered on the client (Expo Router).
"use client";

import { CarCard, EmptyCarCard } from "@/components/car/CarCard";
import { CarFacts } from "@/components/car/CarFacts";
import { MotiBuddieStatus } from "@/components/car/MotiBuddieStatus";
import { TechnicianSection } from "@/components/car/TechnicianSection";
import AddTechnicianSheet from "@/components/sheets/AddTechnicianSheet";
import ValuationSheet from "@/components/sheets/ValuationSheet";
import DiagnosticListSheet, {
  getDiagnosticItems,
  type DiagnosticItem,
} from "@/components/sheets/DiagnosticListSheet";
import DiagnosticDetailSheet from "@/components/sheets/DiagnosticDetailSheet";
import TechnicianDetailSheet, {
  type Technician,
} from "@/components/sheets/TechnicianDetailSheet";
import { useCarById, useUserCars } from "@/hooks/useCars";
import { useTechnicians } from "@/hooks/useTechnicians";
import { TECHNICIAN_CATEGORIES } from "@/types/technician";
import { useAppStore } from "@/store/useAppStore";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function CarScreen() {
  const { selectedCarId } = useAppStore();
  const { data: carsData, isLoading: isCarsLoading } = useUserCars();
  const { data: techniciansData } = useTechnicians();
  const [selectedCategory, setSelectedCategory] = useState<string>("Mechanic");

  // Sheet states
  const [isAddTechnicianSheetVisible, setIsAddTechnicianSheetVisible] =
    useState(false);
  const [isValuationSheetVisible, setIsValuationSheetVisible] = useState(false);
  const [isDiagnosticListVisible, setIsDiagnosticListVisible] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] =
    useState<DiagnosticItem | null>(null);
  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);

  const cars = carsData?.cars || [];
  const technicians = (techniciansData?.technicians || []) as Technician[];

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
    return carDetailData?.car || activeCarSummary;
  }, [carDetailData, activeCarSummary]);

  const hasCars = cars.length > 0;
  const isLoading =
    isCarsLoading || (hasCars && isDetailLoading && !carDetailData);

  const filteredTechnicians = technicians.filter((t) =>
    selectedCategory === "Others"
      ? !TECHNICIAN_CATEGORIES.filter((c) => c !== "Others").includes(
          t.specialty as any,
        )
      : t.specialty === selectedCategory,
  );

  const handleSelectDiagnosticByKey = (key: string) => {
    const items = getDiagnosticItems(activeCar);
    const item = items.find((i) => i.key === key);
    if (item) {
      setSelectedDiagnostic(item);
    }
  };

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
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
      >
        {/* ── Car Card ── */}
        {isLoading ? (
          <View className="h-[200px] items-center justify-center">
            <ActivityIndicator size="large" color="#00AEB5" />
          </View>
        ) : !hasCars ? (
          <EmptyCarCard onAddCar={() => {}} />
        ) : (
          <CarCard
            activeCar={activeCar}
            onValuation={() => setIsValuationSheetVisible(true)}
          />
        )}

        {/* ── Car Facts ── */}
        <CarFacts
          activeCar={activeCar}
          onOpenDiagnostics={() => setIsDiagnosticListVisible(true)}
          onSelectDiagnostic={handleSelectDiagnosticByKey}
        />

        {/* ── motiBuddie Status ── */}
        <MotiBuddieStatus plate={activeCar?.plate} />

        {/* ── Technicians ── */}
        <TechnicianSection
          filteredTechnicians={filteredTechnicians}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddTechnician={() => setIsAddTechnicianSheetVisible(true)}
          onSelectTechnician={setSelectedTechnician}
        />
      </ScrollView>

      {/* ── Sheets ── */}
      <AddTechnicianSheet
        visible={isAddTechnicianSheetVisible}
        onClose={() => setIsAddTechnicianSheetVisible(false)}
      />

      <ValuationSheet
        visible={isValuationSheetVisible}
        onClose={() => setIsValuationSheetVisible(false)}
        activeCar={activeCar}
      />

      <DiagnosticListSheet
        visible={isDiagnosticListVisible}
        onClose={() => setIsDiagnosticListVisible(false)}
        activeCar={activeCar}
        onSelectItem={(item) => {
          setIsDiagnosticListVisible(false);
          setSelectedDiagnostic(item);
        }}
      />

      <DiagnosticDetailSheet
        visible={!!selectedDiagnostic}
        onClose={() => setSelectedDiagnostic(null)}
        item={selectedDiagnostic}
        activeCar={activeCar}
        onRecordExpense={() => setSelectedDiagnostic(null)}
      />

      <TechnicianDetailSheet
        visible={!!selectedTechnician}
        onClose={() => setSelectedTechnician(null)}
        technician={selectedTechnician}
      />
    </View>
  );
}
