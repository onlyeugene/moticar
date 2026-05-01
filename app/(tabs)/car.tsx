// Ensures this screen is rendered on the client (Expo Router).
"use client";

import { CarCard, EmptyCarCard } from "@/components/car/CarCard";
import { CarFacts } from "@/components/car/CarFacts";
import { MotiBuddieStatus } from "@/components/car/MotiBuddieStatus";
import { TechnicianSection } from "@/components/car/TechnicianSection";
import AddTechnicianSheet from "@/components/sheets/AddTechnicianSheet";
import ValuationSheet from "@/components/sheets/ValuationSheet";
import EditBudgetSheet from "@/components/sheets/EditBudgetSheet";
import DiagnosticListSheet, {
  getDiagnosticItems,
  type DiagnosticItem,
} from "@/components/sheets/DiagnosticListSheet";
import { useAuthStore } from "@/store/useAuthStore";
import { getCurrencySymbol } from "@/utils/currency";
import DiagnosticDetailSheet from "@/components/sheets/DiagnosticDetailSheet";
import TechnicianDetailSheet from "@/components/sheets/TechnicianDetailSheet";
import { type Technician } from "@/types/technician";
import { useCarById, useUserCars } from "@/hooks/useCars";
import { useTechnicians, useDeleteTechnician } from "@/hooks/useTechnicians";
import { TECHNICIAN_CATEGORIES } from "@/types/technician";
import { useAppStore } from "@/store/useAppStore";
import { router } from "expo-router";
import { useMemo, useState, useCallback } from "react";
import { ActivityIndicator, ScrollView, Text, View, Alert, RefreshControl } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import LogExpenseSheet from "@/components/sheets/LogExpenseSheet";
import AddReminderSheet from "@/components/sheets/AddReminderSheet";
import { type ExpenseCategory } from "@/types/expense";
import { useExpenseCategories } from "@/hooks/useExpenses";
import * as WebBrowser from 'expo-web-browser';
import CarBudget from "@/components/car/CarBudget";

export default function CarScreen() {
  const queryClient = useQueryClient();
  const { selectedCarId } = useAppStore();
  const { data: carsData, isLoading: isCarsLoading } = useUserCars();
  const { data: techniciansData } = useTechnicians();
  const { mutate: deleteTechnician } = useDeleteTechnician();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cars"] }),
        queryClient.invalidateQueries({ queryKey: ["technicians"] }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  // Sheet states
  const [isAddTechnicianSheetVisible, setIsAddTechnicianSheetVisible] =
    useState(false);
  const [isValuationSheetVisible, setIsValuationSheetVisible] = useState(false);
  const [isDiagnosticListVisible, setIsDiagnosticListVisible] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] =
    useState<DiagnosticItem | null>(null);
  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);
  
  const [isLogExpenseVisible, setIsLogExpenseVisible] = useState(false);
  const [isAddReminderVisible, setIsAddReminderVisible] = useState(false);
  const [isEditBudgetVisible, setIsEditBudgetVisible] = useState(false);
  const [targetExpenseCategory, setTargetExpenseCategory] = useState<ExpenseCategory | null>(null);
  const [targetReminderCategory, setTargetReminderCategory] = useState<string>("Others");

  const { data: expenseCategories } = useExpenseCategories(selectedCarId || "");

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

  const filteredTechnicians = technicians.filter((t) => {
    if (!selectedCategory) return true;
    return selectedCategory === "Others"
      ? !TECHNICIAN_CATEGORIES.filter((c) => c !== "Others").includes(
          t.specialty as any,
        )
      : t.specialty === selectedCategory;
  });

  const handleSelectDiagnosticByKey = (key: string) => {
    const user = useAuthStore.getState().user;
    const currencySymbol = getCurrencySymbol(user?.preferredCurrency);
    const items = getDiagnosticItems(activeCar, currencySymbol);
    const item = items.find((i) => i.key === key);
    if (item) {
      setSelectedDiagnostic(item);
    }
  };

  const handleRecordExpense = () => {
    if (!selectedDiagnostic || !expenseCategories) return;
    
    // Map diagnostic key to expense category name
    const mapping: Record<string, string> = {
      fuel: "Fuel Top-Up",
      engineOil: "Engine",
      tyres: "Accessories & Parts",
      brakePads: "Accessories & Parts",
      battery: "Accessories & Parts",
    };

    const categoryName = mapping[selectedDiagnostic.key] || "Others";
    const category = expenseCategories.categories.find((c: any) => c.name === categoryName);
    
    if (category) {
      setTargetExpenseCategory(category);
      setSelectedDiagnostic(null);
      setIsLogExpenseVisible(true);
    }
  };

  const handleSetReminder = () => {
    if (!selectedDiagnostic) return;

    // Map diagnostic key to reminder category
    const mapping: Record<string, string> = {
      fuel: "Others",
      engineOil: "Servicing",
      tyres: "Servicing",
      brakePads: "Servicing",
      battery: "Others",
    };

    setTargetReminderCategory(mapping[selectedDiagnostic.key] || "Others");
    setSelectedDiagnostic(null);
    setIsAddReminderVisible(true);
  };

  const handleFindFuelStation = () => {
    WebBrowser.openBrowserAsync("https://www.google.com/maps/search/?api=1&query=fuel+stations+near+me");
  };

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      {/* Fixed Header */}
      <View className="pt-[60px] pb-3 px-4 bg-[#F5F5F5]">
        <Text className="text-[1.625rem] font-lexendBold text-[#00343F]">Car</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00AEB5"
            colors={["#00AEB5"]}
          />
        }
      >
        {/* ── Car Card ── */}
        {isLoading ? (
          <View className="h-[200px] items-center justify-center">
            <ActivityIndicator size="large" color="#00AEB5" />
          </View>
        ) : !hasCars ? (
          <EmptyCarCard
            onAddCar={() => {
              router.push("/(onboarding)");
            }}
          />
        ) : (
          <CarCard
            activeCar={activeCar}
            onValuation={() => {
              setIsValuationSheetVisible(true);
              queryClient.refetchQueries({
                queryKey: ["cars", "details", activeCar?._id || activeCar?.id],
              });
            }}
          />
        )}

        {/* ── Car Budget ── */}
        <CarBudget onEdit={() => setIsEditBudgetVisible(true)} />

        {/* ── Car Facts ── */}
        {hasCars && (
          <CarFacts
            activeCarId={activeCar?._id || activeCar?.id || ''}
            activeCar={activeCar}
            onOpenDiagnostics={() => setIsDiagnosticListVisible(true)}
            onSelectDiagnostic={handleSelectDiagnosticByKey}
          />
        )}

        {/* ── motiBuddie Status ── */}
        {hasCars && activeCar?.entryMethod === "obd" && (
          <MotiBuddieStatus
            plate={activeCar?.plate}
            carId={activeCar?._id || activeCar?.id}
          />
        )}

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
        onClose={() => {
            setIsAddTechnicianSheetVisible(false);
            setSelectedTechnician(null);
        }}
        technician={selectedTechnician}
      />

      <ValuationSheet
        visible={isValuationSheetVisible}
        onClose={() => setIsValuationSheetVisible(false)}
        carId={activeCar?._id || activeCar?.id || ""}
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
        onRecordExpense={handleRecordExpense}
        onSetReminder={handleSetReminder}
        onFindFuelStation={handleFindFuelStation}
      />

      <LogExpenseSheet
        visible={isLogExpenseVisible}
        onClose={() => setIsLogExpenseVisible(false)}
        category={targetExpenseCategory}
      />

      <AddReminderSheet
        visible={isAddReminderVisible}
        onClose={() => setIsAddReminderVisible(false)}
        category={targetReminderCategory}
        carId={selectedCarId || ""}
      />

      <TechnicianDetailSheet
        visible={!!selectedTechnician && !isAddTechnicianSheetVisible}
        onClose={() => setSelectedTechnician(null)}
        technician={selectedTechnician}
        onEdit={() => {
            setIsAddTechnicianSheetVisible(true);
        }}
        onDelete={() => {
          if (!selectedTechnician) return;
          Alert.alert(
            "Delete Technician",
            `Are you sure you want to delete ${selectedTechnician.name}?`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                  deleteTechnician(
                    selectedTechnician._id || (selectedTechnician as any).id,
                  );
                  setSelectedTechnician(null);
                },
              },
            ],
          );
        }}
      />

      <EditBudgetSheet
        visible={isEditBudgetVisible}
        onClose={() => setIsEditBudgetVisible(false)}
        carId={activeCar?._id || activeCar?.id || ""}
        initialBudget={activeCar?.monthlyBudget || 0}
        currencySymbol={getCurrencySymbol(useAuthStore.getState().user?.preferredCurrency)}
      />
    </View>
  );
}
