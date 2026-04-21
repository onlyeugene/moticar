import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import BottomSheet from "../shared/BottomSheet";
import PriceRuler from "./PriceRuler";
import { useUpdateCar } from "@/hooks/useCars";
import { useSnackbar } from "@/providers/SnackbarProvider";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface EditBudgetSheetProps {
  visible: boolean;
  onClose: () => void;
  carId: string;
  initialBudget: number;
  currencySymbol: string;
}

export default function EditBudgetSheet({
  visible,
  onClose,
  carId,
  initialBudget,
  currencySymbol,
}: EditBudgetSheetProps) {
  const [budget, setBudget] = useState(initialBudget);
  const { mutate: updateCar, isPending } = useUpdateCar();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (visible) {
      setBudget(initialBudget);
    }
  }, [visible, initialBudget]);

  const handleSave = () => {
    updateCar(
      { id: carId, data: { monthlyBudget: budget } },
      {
        onSuccess: () => {
          showSnackbar({
            type: "success",
            message: "Success",
            description: "Monthly budget updated successfully",
          });
          onClose();
        },
        onError: () => {
          showSnackbar({
            type: "error",
            message: "Error",
            description: "Failed to update budget",
          });
        },
      },
    );
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Estimated Monthly Budget"
      height="55%"
      backgroundColor="#F0F0F0"
      scrollable={false}
      contentPadding={0}
      headerRight={
        <TouchableOpacity
          onPress={handleSave}
          disabled={isPending}
          className="bg-[#29D7DE] px-5 py-1.5 rounded-full"
        >
          <Text className="text-white font-lexendSemiBold text-[14px]">
            {isPending ? <ActivityIndicator /> : "Save"}
          </Text>
        </TouchableOpacity>
      }
    >
      <View className="flex-1 items-center pt-3">
        {/* Value Display Card */}
        <View
          className="bg-white rounded-t-[12px] items-center justify-center"
          style={{ width: SCREEN_WIDTH - 10, height: 180 }}
        >
          <Text className="text-[30px] font-lexendBold text-[#2A2A2A]">
            {currencySymbol}
            {budget.toLocaleString()}
          </Text>

          <View
            className="h-[100px] justify-center"
            style={{ width: SCREEN_WIDTH }}
          >
            <PriceRuler
              value={budget}
              onValueChange={setBudget}
              unitPrefix={currencySymbol}
            />
          </View>
        </View>

        <View
          className="bg-white border border-[#E0E0E0] rounded-b-[12px] w-full h-7"
          style={{ width: SCREEN_WIDTH - 10 }}
        ></View>
      </View>
    </BottomSheet>
  );
}
