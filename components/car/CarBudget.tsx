import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Pen from "@/assets/icons/pen.svg";
import { useAuthStore } from "@/store/useAuthStore";
import { getCurrencySymbol } from "@/utils/currency";
import { useUserCars } from "@/hooks/useCars";
import { useAppStore } from "@/store/useAppStore";
import { useActivitySpends } from "@/hooks/useActivity";

interface CarBudgetProps {
  onEdit?: () => void;
}

export default function CarBudget({ onEdit }: CarBudgetProps) {
  const user = useAuthStore((state) => state.user);
  const { selectedCarId } = useAppStore();
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);

  const now = new Date();
  const currentMonth = (now.getMonth() + 1).toString();
  const currentYear = now.getFullYear().toString();

  const { data: carsData } = useUserCars();
  
  // Find the active car: either the selected one or the first available
  const activeCar = carsData?.cars?.find(
    (c) => (c.id || (c as any)._id) === selectedCarId
  ) || carsData?.cars?.[0];

  const activeCarId = activeCar?.id || (activeCar as any)?._id || "";

  const { data: spendData } = useActivitySpends(
    activeCarId,
    currentMonth,
    currentYear
  );

  const userBudget = activeCar?.monthlyBudget || 0;
  const totalSpent = spendData?.totalSpend || 0;

  return (
    <View className="bg-[#F9FFE0] border-[#DEE5C0] border rounded-[8px] p-4 mb-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-[0.75rem] text-[#036D7D] font-lexendMedium ">
          Estimated Monthly Budget
        </Text>
        <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
          <Pen width={18} height={18} />
        </TouchableOpacity>
      </View>

      <View className="mt-3">
        <View className="items-center justify-center">
          <Text className="text-[2rem] text-[#006C70] font-lexendSemiBold ">
            {currencySymbol}{userBudget.toLocaleString()}
          </Text>

          <View className="flex-row items-center justify-center mt-1">
            <View className="flex-row items-center gap-1.5 bg-[#CFDF88] px-2 py-1 ">
              <Text className="text-[0.75rem] text-[#013037] font-lexendSemiBold ">
                Currently spent -
              </Text>
              <Text className="text-[0.75rem] text-[#013037] font-lexendSemiBold ">
                {currencySymbol}{totalSpent.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
