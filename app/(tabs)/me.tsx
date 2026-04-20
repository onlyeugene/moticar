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
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [deleteCarId, setDeleteCarId] = useState<string | null>(null);

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
    setDeleteCarId(null);
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
                      <TouchableOpacity 
                        onPress={(e) => {
                          const carId = car.id || car._id;
                          e.currentTarget.measure((x, y, width, height, px, py) => {
                            setMenuPosition({ x: px, y: py });
                            setMenuVisible(carId);
                          });
                        }}
                      >
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

      {/* Float Menu — rendered in a Modal so it sits above all views */}
      <Modal
        visible={!!menuVisible}
        transparent
        animationType="none"
        onRequestClose={() => setMenuVisible(null)}
      >
        {/* Backdrop: tap outside closes menu */}
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setMenuVisible(null)}
        >
          {/* Menu sheet — positioned top-right */}
          <View
            style={{
              position: "absolute",
              top: menuPosition.y + 24, // Positioned right under the dots
              right: 24,
              backgroundColor: "#001D22",
              borderRadius: 12,
              overflow: "hidden",
              width: 140,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 10,
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
                setMenuVisible(null);
                router.push({
                  pathname: "/(onboarding)",
                  params: { editCarId: carId },
                });
              }}
            >
              <Ionicons name="pencil-outline" size={18} color="#29D7DE" />
              <Text style={{ color: "white", fontFamily: "Lexend-Medium", fontSize: 13 }}>Edit</Text>
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
              <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
              <Text style={{ color: "#FF6B6B", fontFamily: "Lexend-Medium", fontSize: 13 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={!!deleteCarId}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteCarId(null)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
          onPress={() => setDeleteCarId(null)}
        >
          <View
            style={{
              backgroundColor: "#001D22",
              width: "100%",
              borderRadius: 24,
              padding: 32,
              alignItems: "center",
            }}
            onStartShouldSetResponder={() => true}
          >
            {/* Icon */}
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "rgba(255, 107, 107, 0.15)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons name="trash-outline" size={28} color="#FF6B6B" />
            </View>

            <Text
              style={{
                color: "white",
                fontFamily: "Lexend-Bold",
                fontSize: 20,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Delete Car?
            </Text>
            <Text
              style={{
                color: "#9BBABB",
                fontFamily: "Lexend-Regular",
                fontSize: 14,
                textAlign: "center",
                marginBottom: 32,
                lineHeight: 22,
              }}
            >
              This action cannot be undone. All data for this vehicle will be permanently removed.
            </Text>

            <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#1E4A54",
                  borderRadius: 999,
                  paddingVertical: 16,
                  alignItems: "center",
                }}
                onPress={() => setDeleteCarId(null)}
              >
                <Text style={{ color: "#9BBABB", fontFamily: "Lexend-Bold", fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#FF6B6B",
                  borderRadius: 999,
                  paddingVertical: 16,
                  alignItems: "center",
                }}
                onPress={() => deleteCarId && handleDeleteCar(deleteCarId)}
              >
                <Text style={{ color: "white", fontFamily: "Lexend-Bold", fontSize: 16 }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <LoadingModal
        visible={logout.isPending}
        message="Logging out..."
      />
    </View>
  );
}
