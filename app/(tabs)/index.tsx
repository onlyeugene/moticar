// Dashboard screen with vehicle insights and expense tracking
import StarIcon from "@/assets/icons/star.svg";
import DashboardCardSlider from "@/components/dashboard/DashboardCardSlider";
import DashboardDocuments from "@/components/dashboard/DashboardDocuments";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardInsights from "@/components/dashboard/DashboardInsights";
import ExpenseBreakdownCard from "@/components/dashboard/ExpenseBreakdownCard";
import DiagnosticView from "@/components/dashboard/diagnostic/DiagnosticView";
import MileageTracker from "@/components/dashboard/MileageTracker";
import LocationAlert from "@/components/shared/LocationAlert";
import { RulerPicker } from "@/components/shared/RulerPicker";
import AddMileageSheet from "@/components/sheets/AddMileageSheet";
import DiagnosisSheet from "@/components/sheets/DiagnosisSheet";
import MotiBuddieCrossSellSheet from "@/components/sheets/MotiBuddieCrossSellSheet";
import { ScreenBackground } from "@/components/ui/ScreenBackground";

import { useActivitySpends, useTrips } from "@/hooks/useActivity";
import { useCheckLocation, useMe } from "@/hooks/useAuth";
import { useUserCars } from "@/hooks/useCars";
import { useExpensesByCarId } from "@/hooks/useExpenses";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getCurrencySymbol } from "@/utils/currency";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ActivityScreen from "./activity";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);
  const queryClient = useQueryClient();
  const { data: userData, isLoading: userLoading } = useMe();

  const [showLocationAlert, setShowLocationAlert] = useState(false);
  const { selectedCarId, isDiagnosticActive, setActiveActivityTab } = useAppStore();
  const [isAddMileageVisible, setIsAddMileageVisible] = useState(false);
  const [isDiagnosisVisible, setIsDiagnosisVisible] = useState(false);
  const { data: carsData, isLoading: carsLoading } = useUserCars();

  const userCar =
    carsData?.cars?.find((c) => (c.id || (c as any)._id) === selectedCarId) ||
    carsData?.cars?.[0];

  const { 
    motiBuddieDismissed, 
    lastMotiBuddieCrossSellShown, 
    setMotiBuddieDismissed, 
    setLastMotiBuddieCrossSellShown 
  } = useAppStore();
  const [isCrossSellVisible, setIsCrossSellVisible] = useState(false);

  useEffect(() => {
    // Show cross-sell if car has no OBD device and hasn't been permanently dismissed
    if (userCar && !userCar.deviceId && !motiBuddieDismissed) {
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      
      // Show if it's the first time or if 7 days have passed since last nudge
      if (!lastMotiBuddieCrossSellShown || (now - lastMotiBuddieCrossSellShown) > sevenDays) {
        const timer = setTimeout(() => {
          setIsCrossSellVisible(true);
          setLastMotiBuddieCrossSellShown(now);
        }, 5000); // 5 second delay for a better UX
        return () => clearTimeout(timer);
      }
    }
  }, [userCar?.deviceId, motiBuddieDismissed, lastMotiBuddieCrossSellShown]);

  const { data: locationData } = useCheckLocation();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries();
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  useEffect(() => {
    if (
      locationData?.locationChanged &&
      locationData.newCurrency !== user?.preferredCurrency
    ) {
      setShowLocationAlert(true);
    }
  }, [locationData, user?.preferredCurrency]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const monthScrollRef = React.useRef<ScrollView>(null);

  const handlePrevMonth = () => {
    setSelectedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setSelectedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i,
  );

  const monthsList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const monthIndex = selectedDate.getMonth();
    monthScrollRef.current?.scrollTo({ x: monthIndex * 70, animated: true });
  }, [selectedDate]);

  const { data: tripsData } = useTrips(
    userCar?.id || (userCar as any)?._id || "",
  );
  const { data: spendData } = useActivitySpends(
    userCar?.id || (userCar as any)?._id || "",
    (selectedDate.getMonth() + 1).toString(),
    selectedDate.getFullYear().toString(),
  );

  const { data: expensesData } = useExpensesByCarId(
    userCar?.id || (userCar as any)?._id || "",
  );

  // Navigation context is provided by the TabLayout and root Stack.
  // We can safely render the dashboard content here.

  return (
    <ScreenBackground>
      <View className="mt-10 z-50">
        <DashboardHeader />
      </View>

     
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#29D7DE"
            colors={["#29D7DE"]}
          />
          
        }
      >
         {isDiagnosticActive && <DiagnosticView />}
        <View className="p-2 bg-[#F0F0F0] rounded-3xl mt-4">
          <View className="bg-[#C4FFFF] rounded-3xl">
            {/* User Greeting & Year */}
            <View className="flex-row items-center justify-between p-2 pt-4">
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-[#00AEB5]/10 items-center justify-center">
                  {user?.avatar ? (
                    <Image
                      source={{ uri: user.avatar }}
                      className="w-full h-full"
                    />
                  ) : (
                    <Text className="text-[#00AEB5] font-lexendBold text-[16px]">
                      {(user?.name || "U")[0].toUpperCase()}
                    </Text>
                  )}
                </View>
                <Text className="text-[#00232A] font-lexendBold text-[20px]">
                  Hi, {user?.name?.split(" ")[0] || "User"}
                </Text>
              </View>

              <View className="z-50">
                {showYearPicker && (
                  <Pressable
                    onPress={() => setShowYearPicker(false)}
                    className="absolute w-full h-full left-0 top-0 bg-transparent"
                  />
                )}
                <TouchableOpacity
                  onPress={() => setShowYearPicker(!showYearPicker)}
                  className="flex-row items-center gap-2 bg-[#00282B] px-4 py-1.5 rounded-full"
                >
                  <Text className="text-[#FFFFFF] font-lexendSemiBold text-[12px]">
                    {selectedDate.getFullYear()}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                </TouchableOpacity>

                {showYearPicker && (
                  <View className="absolute top-11 right-0 w-32 bg-[#00232A] rounded-2xl p-2 shadow-2xl border border-[#09515D] z-[100]">
                    {years.map((y) => (
                      <TouchableOpacity
                        key={y}
                        onPress={() => {
                          setSelectedDate(
                            new Date(y, selectedDate.getMonth(), 1),
                          );
                          setShowYearPicker(false);
                        }}
                        className={`py-2.5 px-4 rounded-xl mb-1 ${
                          selectedDate.getFullYear() === y
                            ? "bg-[#00AEB5]/20"
                            : ""
                        }`}
                      >
                        <Text
                          className={`text-[14px] font-lexendSemiBold ${
                            selectedDate.getFullYear() === y
                              ? "text-[#00AEB5]"
                              : "text-white"
                          }`}
                        >
                          {y}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Month Tabs */}
            <View className="mt-2 flex-row items-center justify-between pb-1 p-2">
              <TouchableOpacity onPress={handlePrevMonth} className="px-1 pr-3">
                <Ionicons name="chevron-back" size={24} color="#7BA0A3" />
              </TouchableOpacity>

              <View className="flex-1">
                <ScrollView
                  ref={monthScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 24, paddingHorizontal: 10 }}
                >
                  {monthsList.map((mName, index) => {
                    const isActive = selectedDate.getMonth() === index;
                    return (
                      <TouchableOpacity
                        key={mName}
                        onPress={() =>
                          setSelectedDate(
                            new Date(selectedDate.getFullYear(), index, 1),
                          )
                        }
                        className={`relative ${
                          isActive ? "border-b border-[#00AEB5] pb-1" : "pb-1"
                        }`}
                      >
                        <Text
                          className={` text-[13px] ${
                            isActive
                              ? "text-[#00AEB5] font-lexendSemiBold"
                              : "text-[#81B4B4] font-lexendRegular"
                          }`}
                        >
                          {mName}
                        </Text>
                        {isActive && (
                          <View className="w-1 h-1 rounded-full bg-[#293536] absolute  -right-2" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <TouchableOpacity onPress={handleNextMonth} className="px-1 pl-3">
                <Ionicons name="chevron-forward" size={24} color="#7BA0A3" />
              </TouchableOpacity>
            </View>

            {/* Swipable Analytics Cards */}
            <DashboardCardSlider
              carId={userCar?.id || (userCar as any)?._id}
              month={selectedDate.getMonth() + 1}
              year={selectedDate.getFullYear()}
              monthlyBudget={userCar?.monthlyBudget}
            />

            {/* Mileage Tracker Section */}
            <View className="border-t border-[#8acece] my-4" />
            <MileageTracker
              mileage={userCar?.mileage}
              updatedAt={userCar?.updatedAt}
              approxKm={tripsData?.trips?.[0]?.distanceKm || 0}
              entriesCount={tripsData?.count || 0}
              onPress={() => setIsAddMileageVisible(true)}
              onCardPress={() => {
                setActiveActivityTab("Mileage Milestones");
                router.push("/(tabs)/activity");
              }}
            />
          </View>


          {/* <ActivityScreen /> */}

          {/* Expense Breakdown Section */}
          <ExpenseBreakdownCard
            spendData={spendData}
            // expenses={expensesData?.expenses}
            currencySymbol={currencySymbol}
            monthlyBudget={userCar?.monthlyBudget}
            selectedDate={selectedDate}
          />

          {/* Insights Section */}
          <DashboardInsights carId={(userCar as any)?._id || userCar?.id} />

          {/* Documents Section */}
          <View className="mt-4">
            <DashboardDocuments
              carId={(userCar as any)?._id || userCar?.id}
              documents={userCar?.documents}
            />
          </View>
        </View>

        <View className="mt-4 bg-[#011C21] p-4 rounded-[12px]">
          <View className="flex-row items-center gap-2">
            <Text className="text-[#FFFFFF] font-lexendMedium text-[16px]">
              Get a smart auto advice
            </Text>
            <StarIcon width={20} />
          </View>

          <Text className="text-[#F1F1F1] font-lexendRegular text-[12px] mt-2">
            Enter up to 5 expenses and let our smart doc provide some {"\n"}auto
            advice that can help prolong the lifetime of yor car
          </Text>

          <TouchableOpacity 
            onPress={() => setIsDiagnosisVisible(true)}
            className="bg-[#29D7DE] p-4 rounded-full mt-5 w-[70%] items-center"
          >
            <Text className="text-[#00343F] font-lexendBold text-[16px]">
              Get Car Advice
            </Text>
          </TouchableOpacity>
        </View>

        <AddMileageSheet
          visible={isAddMileageVisible}
          onClose={() => setIsAddMileageVisible(false)}
          carId={userCar?.id || (userCar as any)?._id || ""}
          initialMileage={userCar?.mileage}
        />

        <DiagnosisSheet
          visible={isDiagnosisVisible}
          onClose={() => setIsDiagnosisVisible(false)}
          carId={userCar?.id || (userCar as any)?._id || ""}
        />

        <MotiBuddieCrossSellSheet
          visible={isCrossSellVisible}
          onClose={() => setIsCrossSellVisible(false)}
          onDontShowAgain={(val) => setMotiBuddieDismissed(val)}
          onLearnMore={() => {
            setIsCrossSellVisible(false);
            // Navigate to learn more page or open a link
          }}
          onGetOne={() => {
            setIsCrossSellVisible(false);
            // Navigate to shop or pairing page
          }}
        />
      </ScrollView>

    </ScreenBackground>
  );
}
