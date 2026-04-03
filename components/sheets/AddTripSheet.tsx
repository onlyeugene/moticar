import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "../shared/BottomSheet";
import { useCreateManualTrip } from "@/hooks/useActivity";
import DatePickerSheet from "./DatePickerSheet";
import TimePickerSheet from "./TimePickerSheet";
import { calculateHaversineDistance } from "@/utils/location";
import Location from "@/assets/icons/location.svg";
import LocationRound from "@/assets/icons/locationRound.svg";
import OutlineLocation from "@/assets/icons/outlinelocation.svg";
import Route from "@/assets/icons/route.svg";
import Calendar from "@/assets/icons/calendar.svg";
import Tciket from "@/assets/icons/ticket.svg";

// 🔑 No API key needed for Photon!

interface AddTripSheetProps {
  visible: boolean;
  onClose: () => void;
  carId: string;
}

const CATEGORIES = ["Work", "Leisure", "Family", "Misc"];

export interface LocationData {
  address: string;
  lat?: number;
  lng?: number;
}

export default function AddTripSheet({
  visible,
  onClose,
  carId,
}: AddTripSheetProps) {
  const [origin, setOrigin] = useState<LocationData | null>(null);
  const [destination, setDestination] = useState<LocationData | null>(null);
  const [distanceKm, setDistanceKm] = useState("0");
  const [selectedCategory, setSelectedCategory] = useState("Misc");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSearchField, setActiveSearchField] = useState<
    "origin" | "destination" | null
  >(null);

  // Dynamic time and date
  const now = new Date();
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const [rawDate, setRawDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState(formatTime(now));
  const [endTime, setEndTime] = useState(
    formatTime(new Date(now.getTime() + 60 * 60 * 1000)),
  );
  const [dateStr, setDateStr] = useState("");
  const [dateLabel, setDateLabel] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerType, setTimePickerType] = useState<"start" | "end">("start");

  const { mutate: createTrip, isPending } = useCreateManualTrip();

  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`,
      );
      const data = await response.json();

      const formatted = data.features.map((f: any) => ({
        address: [f.properties.name, f.properties.city, f.properties.country]
          .filter(Boolean)
          .join(", "),
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      }));

      setSearchResults(formatted);
    } catch (error) {
      console.error("Location Search Error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const calculateDistance = () => {
    if (origin?.lat && origin?.lng && destination?.lat && destination?.lng) {
      const distance = calculateHaversineDistance(
        origin.lat,
        origin.lng,
        destination.lat,
        destination.lng,
      );
      setDistanceKm(distance.toString());
    }
  };

  // 🛣️ Automatically calculate distance when both points are selected
  React.useEffect(() => {
    if (origin?.lat && destination?.lat) {
      calculateDistance();
    }
  }, [origin, destination]);

  const handleDateSelect = (selectedDate: Date) => {
    setRawDate(selectedDate);
    setDateStr(formatDate(selectedDate));

    // Simple day label logic
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday =
      selectedDate.toDateString() === yesterday.toDateString();

    if (isToday) setDateLabel("Today");
    else if (isYesterday) setDateLabel("Yesterday");
    else setDateLabel("");

    setShowDatePicker(false);
  };

  const handleTimeSelect = (selectedTime: string) => {
    if (timePickerType === "start") {
      setStartTime(selectedTime);
    } else {
      setEndTime(selectedTime);
    }
  };

  const handleSave = () => {
    if (!origin || !destination || !rawDate) return;

    // Use selected date and input times
    const finalStartDate = new Date(rawDate);
    const [startH, startM] = startTime.split(":").map(Number);
    finalStartDate.setHours(startH, startM);

    const finalEndDate = new Date(rawDate);
    const [endH, endM] = endTime.split(":").map(Number);
    finalEndDate.setHours(endH, endM);

    createTrip(
      {
        carId,
        origin: {
          address: origin.address,
          lat: origin.lat,
          lng: origin.lng,
        },
        destination: {
          address: destination.address,
          lat: destination.lat,
          lng: destination.lng,
        },
        distanceKm: parseFloat(distanceKm),
        startTime: finalStartDate.toISOString(),
        endTime: finalEndDate.toISOString(),
        category: selectedCategory,
      },
      {
        onSuccess: () => {
          onClose();
          // Reset fields
          setOrigin(null);
          setDestination(null);
          setRawDate(undefined);
          setDateStr("");
          setDateLabel("");
        },
      },
    );
  };

  const canSave = !isPending && origin && destination && rawDate;

  const headerRight = (
    <TouchableOpacity
      onPress={handleSave}
      disabled={!canSave}
      className={`px-6 py-2 rounded-full ${!canSave ? "bg-[#29D7DE]/50" : "bg-[#29D7DE]"}`}
    >
      <Text className="text-[#00343F] font-lexendBold text-[14px]">
        {isPending ? "Saving..." : "Save"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <BottomSheet
        visible={visible}
        onClose={onClose}
        title="Add New Trip"
        headerRight={headerRight}
        height="65%"
      >
        <View className="flex-1  px-2">
          {/* Journey Section */}
          <View
            className="bg-white rounded-t-[12px] p-5 mb-1 flex-row z-50"
            style={styles.shadow}
          >
            {/* Timeline indicator */}
            <View className="items-center py-2 mr-4">
              <Location />
              <View className="w-[1px] h-12 border-l-2 border-[#00AEB5]/30 border-dashed my-1" />
              <LocationRound />
            </View>

            <View className="flex-1">
              {/* Origin Input */}
              <View className="flex-row items-center border-b border-[#DEDEDE] pb-2 relative z-50">
                <TextInput
                  placeholder="Journey Start"
                  placeholderTextColor="#ADADAD"
                  className="flex-1 font-lexendRegular placeholder:text-[#ACB7B7] text-[12px] h-[40px]"
                  value={
                    activeSearchField === "origin"
                      ? searchQuery
                      : origin?.address
                  }
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    setActiveSearchField("origin");
                    searchLocations(text);
                  }}
                  onFocus={() => {
                    setActiveSearchField("origin");
                    setSearchQuery(origin?.address || "");
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (
                      origin ||
                      (activeSearchField === "origin" && searchQuery)
                    ) {
                      setOrigin(null);
                      setSearchQuery("");
                      setSearchResults([]);
                      setActiveSearchField(null);
                      setDistanceKm("0");
                    }
                  }}
                  className={`w-[36px] h-[24px] rounded-full items-center justify-center ${origin || (activeSearchField === "origin" && searchQuery) ? "bg-[#F0F0F0]" : "bg-[#81B4B4]"}`}
                >
                  {origin || (activeSearchField === "origin" && searchQuery) ? (
                    <Ionicons name="close" size={16} color="#8B8B8B" />
                  ) : (
                    <OutlineLocation className="w-4 h-4" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Destination Input */}
              <View className="flex-row items-center border-b border-[#DEDEDE] pt-2 relative z-40">
                <TextInput
                  placeholder="Journey End"
                  placeholderTextColor="#ADADAD"
                  className="flex-1 font-lexendRegular placeholder:text-[#ACB7B7] text-[12px] h-[40px]"
                  value={
                    activeSearchField === "destination"
                      ? searchQuery
                      : destination?.address
                  }
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    setActiveSearchField("destination");
                    searchLocations(text);
                  }}
                  onFocus={() => {
                    setActiveSearchField("destination");
                    setSearchQuery(destination?.address || "");
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (
                      destination ||
                      (activeSearchField === "destination" && searchQuery)
                    ) {
                      setDestination(null);
                      setSearchQuery("");
                      setSearchResults([]);
                      setActiveSearchField(null);
                      setDistanceKm("0");
                    }
                  }}
                  className=""
                >
                  <Ionicons
                    name={
                      destination ||
                      (activeSearchField === "destination" && searchQuery)
                        ? "close"
                        : "help-circle-outline"
                    }
                    size={
                      destination ||
                      (activeSearchField === "destination" && searchQuery)
                        ? 16
                        : 18
                    }
                    color="#8B8B8B"
                  />
                </TouchableOpacity>
              </View>

              {/* Search Results Dropdown */}
              {activeSearchField && searchResults.length > 0 && (
                <View
                  className="absolute bg-white border border-[#F0F0F0] rounded-xl shadow-lg z-[100] max-h-[250px] overflow-hidden"
                  style={{
                    top: activeSearchField === "origin" ? 45 : 85,
                    left: 0,
                    right: 0,
                  }}
                >
                  {searchResults.map((item, index) => (
                    <TouchableOpacity
                      key={`${item.address}-${index}`}
                      className={`px-4 py-3 ${index !== searchResults.length - 1 ? "border-b border-[#F0F0F0]" : ""}`}
                      onPress={() => {
                        if (activeSearchField === "origin") setOrigin(item);
                        else setDestination(item);
                        setSearchResults([]);
                        setActiveSearchField(null);
                        setSearchQuery("");
                      }}
                    >
                      <Text
                        className="text-[#00343F] text-[12px] font-lexendRegular"
                        numberOfLines={1}
                      >
                        {item.address}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {isSearching && (
                <View className="absolute right-10 top-2">
                  <ActivityIndicator size="small" color="#00AEB5" />
                </View>
              )}

              <View className="items-center mt-5">
                <View className="flex-row items-center gap-1">
                  <Route width={15} height={15} />
                  <Text className="text-[#00AEB5] font-lexendMedium text-[14px]">
                    approx. {distanceKm}km
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Date Section */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="bg-white p-5 mb-1 flex-row items-center justify-between"
            style={styles.shadow}
          >
            <View className="flex-row items-start gap-4">
              <View className=" items-center justify-center">
                <Calendar width={24} />
              </View>
              <View className="flex-row">
                <Text className="text-[#8B8B8B] text-[12px] font-lexendRegular">
                  Date
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="flex-col items-end">
                <Text className="text-[#050505] text-[14px] font-lexendRegular">
                  {dateStr || "Select Date"}
                </Text>
                {dateLabel ? (
                  <Text className="text-[#34A853] text-[10px] font-lexendRegular">
                    {dateLabel}
                  </Text>
                ) : null}
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ADADAD" />
            </View>
          </TouchableOpacity>

          <View
            className="bg-white p-5 mb-1 flex-row items-center"
            style={styles.shadow}
          >
            <View className="">
              <Ionicons name="alarm-outline" size={24} color="#8B8B8B" />
            </View>
            <View className="flex-row flex-1 items-center justify-around">
              <TouchableOpacity
                onPress={() => {
                  setTimePickerType("start");
                  setShowTimePicker(true);
                }}
                className="items-end"
              >
                <Text className="text-[#8B8B8B] text-[12px] font-lexendRegular">
                  Start Time
                </Text>
                <Text className="text-[#2A2A2A] text-[14px] font-lexendRegular">
                  {startTime}
                </Text>
              </TouchableOpacity>
              <View className="w-[1px] h-10 bg-[#ACB7B7]" />
              <TouchableOpacity
                onPress={() => {
                  setTimePickerType("end");
                  setShowTimePicker(true);
                }}
                className="items-end"
              >
                <Text className="text-[#8B8B8B] text-[12px] font-lexendRegular">
                  End Time
                </Text>
                <Text className="text-[#050505] text-[14px] font-lexendRegular">
                  {endTime}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Section */}
          <View
            className="bg-white rounded-b-[12px] p-5 mb-10"
            style={styles.shadow}
          >
            <View className="flex-row items-center gap-4 mb-4">
              <View className="">
                <Tciket width={24} />
              </View>
              <Text className="text-[#8B8B8B] text-[12px] font-lexendRegular">
                Category
              </Text>
            </View>

            <View className="flex-row justify-between mx-5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    className={`px-5 py-3 rounded-[8px] ${isSelected ? "bg-[#00AEB5]" : "bg-[#EEEEEE]"}`}
                  >
                    <Text
                      className={`text-[12px] font-lexendRegular ${isSelected ? "text-white" : "text-[#8B8B8B]"}`}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <DatePickerSheet
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          initialDate={rawDate}
          maxDate={new Date()}
          onSelect={handleDateSelect}
          title="Select Trip Date"
        />

        <TimePickerSheet
          visible={showTimePicker}
          onClose={() => setShowTimePicker(false)}
          initialTime={timePickerType === "start" ? startTime : endTime}
          onSelect={handleTimeSelect}
          title={timePickerType === "start" ? "Select Start Time" : "Select End Time"}
        />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
});
