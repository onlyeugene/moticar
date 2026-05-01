import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, ScrollView, Share, ActivityIndicator } from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { Car } from "@/types/car";
import { CarLogo } from "../shared/CarLogo";
import FuelIcon from "@/assets/icons/car/fuel.svg";
import TransIcon from "@/assets/icons/car/transmission.svg";
import EngineIcon from "@/assets/icons/car/engine.svg";
import DriveIcon from "@/assets/icons/car/drive.svg";
import SegmentIcon from "@/assets/icons/car/segment.svg";
import BodyIcon from "@/assets/icons/car/body.svg";
import HorseIcon from "@/assets/icons/car/horse.svg";
import CalendarIcon from "@/assets/icons/car/calendar.svg";
import CylinderIcon from "@/assets/icons/car/cylinder.svg";
import AttributeEditSheet, { EditMode } from "../scan/AttributeEditSheet";
import { useUpdateCar, useCarDetails } from "@/hooks/useCars";

interface CarDetailsSheetProps {
  isVisible: boolean;
  onClose: () => void;
  car: Car | null;
  onEdit: (car: Car) => void;
  onDelete: (carId: string) => void;
}

const BODY_STYLES = [
  "SUV", "Sedan", "Hatchback", "Pickup", "Bus", "Crossover", 
  "Convertible", "Station Wagon", "Mini Van", "Cargo Van", 
  "Compact Van", "Compact Car", "Small Car", "Classic", "Sports Car"
];

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];
const TRANSMISSIONS = ["Automatic", "Manual", "Semi-Automatic"];
const DRIVE_TYPES = ["FWD", "RWD", "AWD", "4WD"];

export const CarDetailsSheet = ({
  isVisible,
  onClose,
  car,
  onEdit,
  onDelete,
}: CarDetailsSheetProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localCar, setLocalCar] = useState<Car | null>(car);
  const [editingField, setEditingField] = useState<{
    key: string;
    label: string;
    mode: EditMode;
    options?: string[];
  } | null>(null);

  const updateCar = useUpdateCar();
  const { data: detailsData } = useCarDetails({
    make: localCar?.make || "",
    model: localCar?.carModel || "",
    year: localCar?.year || 0,
  });

  useEffect(() => {
    if (isVisible) {
      setLocalCar(car);
      setIsEditing(false);
    }
  }, [isVisible, car]);

  if (!car || !localCar) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my ${localCar.year} ${localCar.make} ${localCar.carModel} on Moticar!`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = () => {
    if (!car.id && !car._id) return;
    const updateData = {
      plate: localCar.plate,
      fuelType: localCar.fuelType,
      transmission: localCar.transmission,
      engineDesc: localCar.engine,
      cylinder: localCar.cylinder,
      horsepower: localCar.horsepower,
      driveType: localCar.driveType,
      bodyStyle: localCar.bodyStyle,
      segment: localCar.segment,
      color: localCar.color,
      doors: localCar.doors,
      vin: localCar.vin,
    };

    updateCar.mutate(
      { id: (car.id || car._id) as string, data: updateData },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const openEditor = (key: string, label: string, mode: EditMode, options?: string[]) => {
    if (!isEditing) return;
    setEditingField({ key, label, mode, options });
  };

  const handleAttributeSave = (value: any) => {
    if (editingField) {
      setLocalCar(prev => prev ? { ...prev, [editingField.key]: value } : null);
    }
    setEditingField(null);
  };

  const Header = () => (
    <View className="w-full relative px-6">
      <TouchableOpacity 
        onPress={onClose} 
        className="absolute right-6 top-0 z-10"
      >
        <Ionicons name="close" size={24} color="#101828" />
      </TouchableOpacity>

      <View className="items-center w-full">
        <View className="bg-white p-3 rounded-[8px] mb-4 shadow-sm">
          <CarLogo make={localCar.make} size={48} />
        </View>
        
        <Text className="text-[#00343F] font-lexendSemiBold text-[1.25rem] mb-3 text-center">
          {localCar.make} {localCar.carModel}
        </Text>
        
        <TouchableOpacity 
          disabled={!isEditing}
          onPress={() => openEditor("plate", "Plate Number", "plate")}
          className={`bg-white px-4 h-[44px] rounded-[4px] items-center justify-center border ${isEditing ? 'border-[#29D7DE]' : 'border-[#00000033]'} flex-row gap-2`}
        >
          <Text className="text-[#002E35] font-ukNumberPlate text-[1.125rem] tracking-widest uppercase">
            {localCar.plate || "N/A"}
          </Text>
          {isEditing && <Ionicons name="chevron-down" size={14} color="#29D7DE" />}
        </TouchableOpacity>
      </View>
    </View>
  );

  const getYearOptions = () => {
    const availableYears = detailsData?.details?.features?.availableYears;
    if (availableYears && availableYears.length > 0) {
      return availableYears.map((y: any) => y.toString());
    }
    return Array.from({length: 30}, (_, i) => (new Date().getFullYear() - i).toString());
  };

  const specs = [
    { label: "Year of Production:", value: localCar.year, icon: CalendarIcon, key: "year", mode: "chips" as EditMode, options: getYearOptions() },
    { label: "Fuel Type", value: localCar.fuelType || "N/A", icon: FuelIcon, key: "fuelType", mode: "chips" as EditMode, options: FUEL_TYPES },
    {
      label: "Gearbox",
      value: localCar.transmission || "N/A",
      icon: TransIcon,
      key: "transmission",
      mode: "toggle" as EditMode,
      options: TRANSMISSIONS
    },
    { label: "Engine", value: localCar.engine || "V6", icon: EngineIcon, key: "engine", mode: "input" as EditMode },
    { label: "Cylinder", value: localCar.cylinder || "N/A", icon: CylinderIcon, key: "cylinder", mode: "input" as EditMode },
    { label: "Horse Power", value: localCar.horsepower || "N/A", icon: HorseIcon, key: "horsepower", mode: "input" as EditMode },
    { label: "Drive Type", value: localCar.driveType || "N/A", icon: DriveIcon, key: "driveType", mode: "chips" as EditMode, options: DRIVE_TYPES },
    { label: "Body Style", value: localCar.bodyStyle || "N/A", icon: BodyIcon, key: "bodyStyle", mode: "chips" as EditMode, options: BODY_STYLES },
    { label: "Segment", value: localCar.segment || "N/A", icon: SegmentIcon, key: "segment", mode: "input" as EditMode },
    { label: "Body Color", value: localCar.color || "N/A", icon: FuelIcon, isColor: true, key: "color", mode: "color" as EditMode },
    { label: "Doors", value: localCar.doors || "N/A", icon: BodyIcon, key: "doors", mode: "input" as EditMode },
  ];

  return (
    <BottomSheet
      visible={isVisible}
      onClose={onClose}
      height="92%"
      backgroundColor="#EBEBE0"
      showCloseButton={false}
      title={<Header />}
      contentPadding={0}
    >
      <View className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 bg-white px-4 pt-8"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View className="border border-[#D6D5CA] rounded-[30px] overflow-hidden mb-6">
            {specs.map((spec, index) => {
              if (index % 2 !== 0) return null;
              const nextSpec = specs[index + 1];

              return (
                <View key={index} className="flex-row border-b border-[#D6D5CA]">
                  {/* Left Spec */}
                  <TouchableOpacity 
                    disabled={!isEditing}
                    onPress={() => openEditor(spec.key, spec.label, spec.mode, spec.options)}
                    className="flex-1 p-4 border-r border-[#D6D5CA]"
                  >
                    <View className="flex-row items-center gap-2 mb-2">
                      <spec.icon width={16} height={16} color="#29D7DE" />
                      <Text className="text-[#879090] font-lexendRegular text-[0.6875rem]">
                        {spec.label}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-[#002E35] font-lexendBold text-[0.9375rem]">
                        {spec.value}
                      </Text>
                      {isEditing && <Ionicons name="chevron-down" size={14} color="#29D7DE" />}
                    </View>
                  </TouchableOpacity>

                  {/* Right Spec */}
                  {nextSpec ? (
                    <TouchableOpacity 
                      disabled={!isEditing}
                      onPress={() => openEditor(nextSpec.key, nextSpec.label, nextSpec.mode, nextSpec.options)}
                      className="flex-1 p-4"
                    >
                      <View className="flex-row items-center gap-2 mb-2">
                        <nextSpec.icon width={16} height={16} color="#29D7DE" />
                        <Text className="text-[#879090] font-lexendRegular text-[0.6875rem]">
                          {nextSpec.label}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-[#002E35] font-lexendBold text-[0.9375rem]">
                          {nextSpec.value}
                        </Text>
                        {isEditing && <Ionicons name="chevron-down" size={14} color="#29D7DE" />}
                      </View>
                    </TouchableOpacity>
                  ) : <View className="flex-1 p-4" />}
                </View>
              );
            })}
          </View>

          {/* Registration Info */}
          <View className="border border-[#D6D5CA] rounded-[30px] overflow-hidden mb-8">
            <TouchableOpacity 
              disabled={!isEditing}
              onPress={() => openEditor("vin", "Chassis Number", "input")}
              className="flex-row items-center justify-between p-5 border-b border-[#D6D5CA]"
            >
              <View className="flex-row items-center gap-3">
                <CalendarIcon width={18} height={18} color="#29D7DE" />
                <Text className="text-[#879090] font-lexendRegular text-[0.75rem]">Chassis Number</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-[#002E35] font-lexendBold text-[0.875rem]">{localCar.vin || "N/A"}</Text>
                {isEditing && <Ionicons name="chevron-down" size={14} color="#29D7DE" />}
              </View>
            </TouchableOpacity>
            {/* Engine number is treated as engine field for now for simplicity, or we can add engineNumber to Car type */}
            <View className="flex-row items-center justify-between p-5 border-b border-[#D6D5CA]">
              <View className="flex-row items-center gap-3">
                <CalendarIcon width={18} height={18} color="#29D7DE" />
                <Text className="text-[#879090] font-lexendRegular text-[0.75rem]">Engine Number</Text>
              </View>
              <Text className="text-[#002E35] font-lexendBold text-[0.875rem]">{localCar.engine || "N/A"}</Text>
            </View>
            <View className="flex-row">
              <View className="flex-1 p-5 border-r border-[#D6D5CA]">
                <View className="flex-row items-center gap-2 mb-2">
                  <CalendarIcon width={16} height={16} color="#29D7DE" />
                  <Text className="text-[#879090] font-lexendRegular text-[0.6875rem]">Date Issued</Text>
                </View>
                <Text className="text-[#002E35] font-lexendBold text-[0.875rem]">20 May, 2020</Text>
              </View>
              <View className="flex-1 p-5">
                <View className="flex-row items-center gap-2 mb-2">
                  <CalendarIcon width={16} height={16} color="#29D7DE" />
                  <Text className="text-[#879090] font-lexendRegular text-[0.6875rem]">Expiry Date</Text>
                </View>
                <Text className="text-[#002E35] font-lexendBold text-[0.875rem]">20 May, 2021</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="absolute bottom-10 left-0 right-0 flex-row gap-4 px-8 pt-6 bg-white border-t border-gray-50">
          {!isEditing ? (
            <>
              <TouchableOpacity
                className="flex-1 bg-[#FFEA52] rounded-[30px] py-5 items-center justify-center shadow-sm"
                onPress={() => setIsEditing(true)}
              >
                <Text className="text-[#013037] font-lexendBold text-[1rem]">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-[#F7F7E8] rounded-[30px] py-5 items-center justify-center border border-[#EBEBE0]"
                onPress={() => onDelete(localCar.id || localCar._id as string)}
              >
                <Text className="text-[#013037] font-lexendBold text-[1rem] opacity-60">Delete</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                className="flex-1 bg-[#FFEA52] rounded-[30px] py-5 items-center justify-center shadow-sm"
                onPress={handleSave}
                disabled={updateCar.isPending}
              >
                {updateCar.isPending ? (
                  <ActivityIndicator color="#013037" />
                ) : (
                  <Text className="text-[#013037] font-lexendBold text-[1rem]">Save Changes</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-[30px] py-5 items-center justify-center"
                onPress={() => {
                  setIsEditing(false);
                  setLocalCar(car);
                }}
              >
                <Text className="text-[#013037] font-lexendBold text-[1rem]">Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <AttributeEditSheet
        visible={!!editingField}
        onClose={() => setEditingField(null)}
        onSave={handleAttributeSave}
        title={editingField?.label || ""}
        mode={editingField?.mode || "chips"}
        options={editingField?.options}
        initialValue={editingField ? localCar[editingField.key as keyof Car] : ""}
      />
    </BottomSheet>
  );
};
