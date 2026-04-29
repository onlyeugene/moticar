import MotiIcon from "@/assets/icons/device.svg";
import EmptyIcon from "@/assets/icons/empty.svg";
import Logo from "@/assets/icons/logo.svg";
import { CarLogo } from "@/components/shared/CarLogo";
import CarTypeIcon from "@/components/shared/CarTypeIcon";
import { CarDetailsSheet } from "@/components/sheets/CarDetailsSheet";
import BottomSheet from "@/components/shared/BottomSheet";
import { useDeleteAccount, useLogout } from "@/hooks/useAuth";
import { useDeleteCar, useUserCars } from "@/hooks/useCars";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Car } from "@/types/car";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { LoadingModal } from "@/components/ui/LoadingModal";

export default function MeScreen() {
  const user = useAuthStore((state) => state.user);
  const { selectedCarId, obdData } = useAppStore();
  const { data: carsData } = useUserCars();
  const logout = useLogout();
  const deleteAccount = useDeleteAccount();
  const { showSnackbar } = useSnackbar();

  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [deleteCarId, setDeleteCarId] = useState<string | null>(null);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  const [selectedCarDetails, setSelectedCarDetails] = useState<Car | null>(
    null,
  );

  const deleteCar = useDeleteCar();

  const cars = carsData?.cars || [];
  const activeCar =
    cars.find((c) => (c.id || c._id) === selectedCarId) || cars[0];
  const activeObd = activeCar ? obdData[activeCar.id || activeCar._id] : null;

  const statusColor =
    activeObd?.status === "moving"
      ? "#4ADE80"
      : activeObd?.status === "online"
        ? "#29D7DE"
        : "#9BBABB";

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => logout.mutate(),
      },
    ]);
  };

  const handleDeleteCar = (carId: string) => {
    deleteCar.mutate(carId, {
      onSuccess: () => {
        setDeleteCarId(null);
        showSnackbar({
          type: "success",
          message: "Car successfully deleted",
          description: "All records for this vehicle have been removed.",
        });
      },
      onError: () => {
        setDeleteCarId(null);
        showSnackbar({
          type: "error",
          message: "Deletion failed",
          description:
            "There was a problem removing the vehicle. Please try again.",
        });
      },
    });
  };

  return (
    <View className="bg-[#09CFD7] flex-1">
      <ScrollView
        className="flex-1 px-4 pt-20"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View
          className={`bg-[#B8F2F4] p-4 ${
            activeCar?.entryMethod === "obd" ||
            activeCar?.entryMethod === "obd_pull"
              ? "rounded-t-[20px]"
              : "rounded-[20px]"
          }`}
        >
          <View className="flex-row justify-between items-center ">
            <Logo height={32} width={126} />
          </View>
          <Text className="text-[12px] font-lexendRegular text-[#00343F] leading-[18px] px-4 py-2">
            It is so simple that you have to just keep track of all expenses you
            incur and we can provide you the insights you need for taking money
            saving decisions.
          </Text>
        </View>

        {(activeCar?.entryMethod === "obd" ||
          activeCar?.entryMethod === "obd_pull") && (
          <View className="flex-row items-center gap-2 bg-[#013037] p-4 rounded-b-[20px]">
            <View
              className="bg-[#29D7DE] w-14 h-14 rounded-full items-center justify-center"
              style={{
                shadowColor: "#29D7DE",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 15,
                elevation: 10,
              }}
            >
              <MotiIcon width={32} height={18} />
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-white font-lexendBold text-[16px]">
                motibuddie detected
              </Text>
              <Text className="text-[#29D7DE] font-lexendRegular text-[10px] ">
                ID: {activeCar?.imei || "12121212311"}
              </Text>
              <Text className="text-[#BCBCBC] font-lexendRegular text-[10px] ">
                Nothing to be alarmed about. Your device can now read about your
                car. You have a buddie to count on.
              </Text>
              <View className="flex-row items-center gap-2">
                <View className="bg-[#FEF597] w-6 h-6 rounded-full items-center justify-center">
                  <Ionicons name="location" size={12} color="#013037" />
                </View>
                <Text className="text-[#FBE74C] font-lexendRegular text-[10px]">
                  Detected in Ikoyi, Lagos
                </Text>
                <Text className="text-[#77A287] font-lexendRegular text-[10px] ml-auto">
                  453km away
                </Text>
              </View>
            </View>
          </View>
        )}

        <View className="mt-4">
          <Text className="text-[#00343F] font-lexendBold text-[26px] mb-6">
            Your Garage
          </Text>

          {cars.length === 0 ? (
            <View className="items-center py-16 bg-[#0FC3CB] rounded-[32px] shadow-sm mb-8">
              <View className="w-20 h-20 bg-[#B8F2F4] rounded-full items-center justify-center mb-6">
                <EmptyIcon width={48} height={48} />
              </View>
              <Text className="text-[#00343F] font-lexendBold text-[18px] mb-2">
                No car added yet
              </Text>
            </View>
          ) : (
            <View className="bg-[#B8F2F4] rounded-[20px] overflow-hidden mb-8">
              {cars.map((car, index) => {
                const carId = car.id || car._id;
                const createdAt = car.createdAt
                  ? format(new Date(car.createdAt), "do MMMM, yyyy")
                  : "N/A";
                const isLast = index === cars.length - 1;

                return (
                  <View
                    key={carId}
                    className={`p-6 ${!isLast ? "border-b border-[#08BFC7]" : ""}`}
                  >
                    <View className="flex-row items-start gap-4">
                      <View className="w-12 h-12 bg-white rounded-xl shadow-sm border border-[#F0F4F4] items-center justify-center">
                        <CarLogo make={car.make} size={32} />
                      </View>

                      <View className="flex-row justify-between w-full flex-1">
                        <View className="">
                          <Text className="text-[14px] font-lexendMedium text-[#013037]">
                            {car.make} {car.carModel}
                          </Text>
                          <Text className="font-ukNumberPlate text-[18px] text-[#006C70] mt-3">
                            {car.plate}
                          </Text>
                        </View>

                        <View className="flex-row items-start gap-2">
                          {/* @ts-ignore */}
                          <CarTypeIcon type={car.bodyStyle} size={45} color="#002E35" />
                          <TouchableOpacity
                            onPress={(e) => {
                              e.currentTarget.measure(
                                (x, y, width, height, px, py) => {
                                  setMenuPosition({ x: px, y: py });
                                  setMenuVisible(carId);
                                },
                              );
                            }}
                            // className="p-1"
                          >
                            <Ionicons
                              name="ellipsis-vertical"
                              size={18}
                              color="#5E9597"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View className="flex-row items-center justify-between flex-1 w-full">
                      <View className="flex-row items-center gap-2 mx-10">
                        <View
                          style={{ backgroundColor: car.color || "#ACB7B7" }}
                          className="w-3 h-3 rounded-[2px]"
                        />
                        <View className="bg-[#8FE2E5] px-3 py-0.5 rounded-[4px]">
                          <Text className="text-[#40585C] font-lexendRegular text-[10px]">
                            {car.transmission || "Manual"}
                          </Text>
                        </View>
                        <View className="bg-[#8FE2E5] px-3 py-0.5 rounded-[4px]">
                          <Text className="text-[#40585C] font-lexendRegular text-[10px]">
                            {car.fuelType || "Petrol"}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-[#5E9597] font-lexendRegular text-[8px] mt-2">
                        Added : {createdAt}
                      </Text>

                      {/* <View className="flex-1">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center gap-2 flex-1">
                            <Text
                              className="text-[#00343F] font-lexendMedium text-[14px]"
                              numberOfLines={1}
                            >
                              {car.make} {car.carModel}
                            </Text>
                            <View className="w-2 h-2 rounded-full bg-[#4ADE80]" />
                          </View>
                          <TouchableOpacity
                            onPress={(e) => {
                              e.currentTarget.measure(
                                (x, y, width, height, px, py) => {
                                  setMenuPosition({ x: px, y: py });
                                  setMenuVisible(carId);
                                },
                              );
                            }}
                            // className="p-1"
                          >
                            <Ionicons
                              name="ellipsis-vertical"
                              size={18}
                              color="#ACB7B7"
                            />
                          </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center justify-between">
                          <View>
                            <Text className="text-[#00343F] font-ukNumberPlate text-[14px]">
                              {car.plate}
                            </Text>

                            <View className="flex-row items-center gap-2">
                              <View 
                                style={{ backgroundColor: car.color || "#ACB7B7" }}
                                className="w-3 h-3 rounded-[2px]" 
                              />
                              <View className="bg-[#29D7DE20] px-3 py-0.5 rounded-full">
                                <Text className="text-[#00343F] font-lexendMedium text-[10px]">
                                  {car.transmission || "Manual"}
                                </Text>
                              </View>
                              <View className="bg-[#29D7DE20] px-3 py-0.5 rounded-full">
                                <Text className="text-[#00343F] font-lexendMedium text-[10px]">
                                  {car.fuelType || "Petrol"}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View className="items-end">
                            <CarTypeIcon
                              type={car.bodyStyle}
                              size={45}
                            />
                            <Text className="text-[#ACB7B7] font-lexendRegular text-[9px] mt-2">
                              Added : {createdAt}
                            </Text>
                          </View>
                        </View>
                      </View> */}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {cars.length > 0 && (
            <TouchableOpacity
              className="bg-[#FBE74C] rounded-full py-6 items-center"
              onPress={() => router.push("/(onboarding)")}
            >
              <Text className="text-[#00343F] font-lexendSemiBold text-[16px]">
                Add another car
              </Text>
            </TouchableOpacity>
          )}

          <View className="items-center mt-8 mb-12">
            <Text className="text-[#0E525C] font-lexendBold text-[12px] mb-1">
              moticar
            </Text>
            <Text className="text-[#0E525C] font-lexendRegular text-[10px]">
              version 1.0.1 (73)
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Float Menu — rendered in a Modal so it sits above all views */}
      <Modal
        visible={!!menuVisible}
        transparent
        animationType="none"
        onRequestClose={() => setMenuVisible(null)}
      >
        {/* Backdrop: tap outside closes menu */}
        <Pressable style={{ flex: 1 }} onPress={() => setMenuVisible(null)}>
          {/* Menu sheet — positioned top-right */}
          <View
            style={{
              position: "absolute",
              top: menuPosition.y + 24, // Positioned right under the dots
              right: 24,
              backgroundColor: "#FFFFFFD9",
              borderRadius: 12,
              overflow: "hidden",
              width: 140,

            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                padding: 14,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255,255,255,0.1)",
              }}
              onPress={() => {
                const carId = menuVisible!;
                const car = cars.find((c) => (c.id || c._id) === carId);
                setMenuVisible(null);
                if (car) {
                  setSelectedCarDetails(car);
                  setShowDetailsSheet(true);
                }
              }}
            >
              <Ionicons name="pencil-outline" size={18} color="#00AEB5" />
              <Text
                className="text-[#000000] font-lexendRegular text-[14px]"
              >
                Edit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                padding: 14,
              }}
              onPress={() => {
                const carId = menuVisible!;
                setMenuVisible(null);
                setDeleteCarId(carId);
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#00AEB5" />
              <Text
                className="text-[#000000] font-lexendRegular text-[14px]"
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Delete Confirmation BottomSheet */}
      <BottomSheet
        visible={!!deleteCarId}
        onClose={() => setDeleteCarId(null)}
        title=""
        backgroundColor="#002D36"
        showCloseButton={false}
        height="30%"
      >
        <View className="items-center py-6">
          <Text className="text-[#FFFFFF] font-lexendBold text-[18px] mb-8 text-center px-4">
            Are you sure you want to delete?
          </Text>

          <View className="flex-row gap-4 w-full px-4">
            <TouchableOpacity
              className="bg-[#FF0000] flex-1 rounded-full h-[52px] items-center justify-center shadow-sm"
              onPress={() => deleteCarId && handleDeleteCar(deleteCarId)}
            >
              <Text className="text-white font-lexendBold text-[16px]">
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 border border-[#00AEB5] rounded-full h-[52px] items-center justify-center"
              onPress={() => setDeleteCarId(null)}
            >
              <Text className="text-[#00AEB5] font-lexendBold text-[16px]">
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>

      <CarDetailsSheet
        isVisible={showDetailsSheet}
        onClose={() => setShowDetailsSheet(false)}
        car={selectedCarDetails}
        onEdit={(car) => {
          router.push({
            pathname: "/(onboarding)",
            params: { editCarId: car.id || car._id },
          });
        }}
        onDelete={(carId) => {
          setDeleteCarId(carId);
        }}
      />

      <LoadingModal
        visible={logout.isPending || deleteCar.isPending}
        message={logout.isPending ? "Logging out..." : "Deleting car..."}
      />
    </View>
  );
}
