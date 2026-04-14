import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import Logo from "@/assets/icons/logo.svg";
import MotiIcon from "@/assets/icons/device.svg";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { useUserCars } from "@/hooks/useCars";
import { CarLogo } from "@/components/shared/CarLogo";
import { useLogout, useDeleteAccount } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";

import { LoadingModal } from "@/components/ui/LoadingModal";

export default function MeScreen() {
  const user = useAuthStore((state) => state.user);
  const { selectedCarId, obdData } = useAppStore();
  const { data: carsData } = useUserCars();
  const logout = useLogout();
  const deleteAccount = useDeleteAccount();
  const { showSnackbar } = useSnackbar();

  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState<string | null>(
    null,
  );

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
    setDeleteModalVisible(null);
    showSnackbar({
      type: "info",
      message: "Feature coming soon",
      description: "Car deletion is currently being finalized.",
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

        <View className="mt-5">
          {/* Your Garage Section */}
          <Text className="text-[#00343F] font-lexendMedium text-[26px] mb-6">
            Your Garage
          </Text>

          {cars.map((car) => {
            const carId = car.id || car._id;
            return (
              <View
                key={carId}
                className=" rounded-[10px] border border-[#08BFC7] p-4 mb-4 flex-row items-center gap-4 relative shadow-sm"
              >
                <View className="bg-white  rounded-full items-center justify-center">
                  <CarLogo make={car.make} size={40} />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text
                      className="text-[#00343F] font-lexendBold text-[16px]"
                      numberOfLines={1}
                    >
                      {car.make} {car.carModel}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "#4ADE80",
                        }}
                      />
                      <TouchableOpacity onPress={() => setMenuVisible(carId)}>
                        <Ionicons
                          name="ellipsis-vertical"
                          size={20}
                          color="#00343F"
                          opacity={0.3}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text className="text-[#09515D] font-ukNumberPlate text-[14px] mb-2 opacity-60">
                    {car.plate}
                  </Text>

                  <View className="flex-row gap-2">
                    {[
                      car.bodyStyle || "SUV",
                      car.year,
                      car.transmission || "CVT",
                    ].map((tag, idx) => (
                      <View
                        key={idx}
                        className="bg-[#5E9597] px-2 py-0.5 rounded-md"
                      >
                        <Text className="text-[#002E35] font-lexendMedium text-[10px] opacity-60">
                          {String(tag)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Float Menu */}
                {menuVisible === carId && (
                  <View className="absolute right-10 top-2 bg-[#001D22] rounded-xl overflow-hidden z-50 w-32 shadow-2xl">
                    <TouchableOpacity
                      className="flex-row items-center gap-3 p-3 border-b border-white/10"
                      onPress={() => {
                        setMenuVisible(null);
                        router.push({
                          pathname: "/(onboarding)",
                          params: { editCarId: carId },
                        });
                      }}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={18}
                        color="#29D7DE"
                      />
                      <Text className="text-white font-lexendMedium text-[12px]">
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-row items-center gap-3 p-3"
                      onPress={() => {
                        setMenuVisible(null);
                        setDeleteModalVisible(carId);
                      }}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#29D7DE"
                      />
                      <Text className="text-white font-lexendMedium text-[12px]">
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          className="bg-[#FFE352] rounded-full py-5 items-center mt-4"
          onPress={() => router.push("/(onboarding)")}
        >
          <Text className="text-[#00343F] font-lexendBold text-[16px]">
            Add another car
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal visible={!!deleteModalVisible} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/40 items-center justify-center px-6"
          onPress={() => setDeleteModalVisible(null)}
        >
          <View
            className="bg-[#001D22] w-full rounded-[24px] p-8 items-center shadow-2xl"
            onStartShouldSetResponder={() => true}
          >
            <Text className="text-white font-lexendBold text-[20px] mb-8 text-center">
              Are you sure you want to delete?
            </Text>

            <View className="flex-row gap-4 w-full">
              <TouchableOpacity
                className="flex-1 border border-red-500 rounded-full py-4 items-center"
                onPress={() =>
                  deleteModalVisible && handleDeleteCar(deleteModalVisible)
                }
              >
                <Text className="text-red-500 font-lexendBold text-[16px]">
                  Yes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 border border-[#29D7DE] rounded-full py-4 items-center"
                onPress={() => setDeleteModalVisible(null)}
              >
                <Text className="text-[#29D7DE] font-lexendBold text-[16px]">
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Dismiss Menu Overlay */}
      {menuVisible && (
        <Pressable
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={() => setMenuVisible(null)}
        />
      )}

      <LoadingModal
        visible={logout.isPending}
        message="Logging out..."
      />
    </View>
  );
}
