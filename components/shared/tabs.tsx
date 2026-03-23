import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
  Platform,
  Image,
} from "react-native";
// import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import HomeIcon from "@/assets/icons/tabs/homeIcon.svg";
import CarIcon from "@/assets/icons/tabs/car.svg";
import ActivityIcon from "@/assets/icons/tabs/activity.svg";
import MoreIcon from "@/assets/icons/tabs/more.svg";
import HomeWhite from "@/assets/icons/tabs/Icon.svg";
import CarWhite from "@/assets/icons/tabs/carIcon.svg";
import ActivityWhite from "@/assets/icons/tabs/activityIcon.svg";
// import MoreWhite from "@/assets/icons/tabs/moreIcon.svg";

import LogoIcon from "@/assets/icons/logomark.svg";

const FAB_ITEMS = [
  { label: "Accessories & Parts", icon: "bag-outline", lib: "Ionicons" },
  { label: "Car Wash", icon: "car-wash", lib: "MaterialCommunityIcons" },
  { label: "Tyre Gauge", icon: "radio-button-on-outline", lib: "Ionicons" },
  { label: "Mechanical Work", icon: "construct-outline", lib: "Ionicons" },
  { label: "Fuel Top-Up", icon: "fuel", lib: "MaterialCommunityIcons" },
  {
    label: "New Expense",
    icon: "add-circle-outline",
    lib: "Ionicons",
  },
];

const TAB_ICONS: Record<
  string,
  { focused: React.ReactNode; unfocused: React.ReactNode }
> = {
  index: { focused: <HomeIcon />, unfocused: <HomeWhite /> },
  car: { focused: <CarWhite />, unfocused: <CarIcon /> },
  activity: { focused: <ActivityWhite />, unfocused: <ActivityIcon /> },
  more: {
    focused: <MoreIcon />,
    unfocused: <MoreIcon />,
  },
};

const TAB_LABELS: Record<string, string> = {
  index: "Home",
  car: "Car",
  activity: "Activity",
  more: "More",
};

export default function TabBar({
  state,
  descriptors,
  navigation,
}: any) {
  const [fabOpen, setFabOpen] = useState(false);
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const fabRotate = useRef(new Animated.Value(0)).current;
  const itemAnims = useRef(FAB_ITEMS.map(() => new Animated.Value(0))).current;

  const openFab = () => {
    setFabOpen(true);
    Animated.parallel([
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fabRotate, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.stagger(
        50,
        itemAnims.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 80,
            friction: 8,
          }),
        ),
      ),
    ]).start();
  };

  const closeFab = () => {
    Animated.parallel([
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fabRotate, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.stagger(
        30,
        [...itemAnims].reverse().map((anim) =>
          Animated.timing(anim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ),
      ),
    ]).start(() => setFabOpen(false));
  };

  const toggleFab = () => (fabOpen ? closeFab() : openFab());

  const fabRotateDeg = fabRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const renderIcon = (item: (typeof FAB_ITEMS)[0], size = 22) => {
    if (item.lib === "MaterialCommunityIcons") {
      return (
        <MaterialCommunityIcons
          name={item.icon as any}
          size={size}
          color="#002D36"
        />
      );
    }
    return <Ionicons name={item.icon as any} size={size} color="#002D36" />;
  };

  return (
    <>
      {/* Blur overlay */}
      {fabOpen && (
        <Animated.View
          className="absolute inset-0 z-10"
          style={{ opacity: overlayAnim }}
        >
          <Pressable className="absolute inset-0" onPress={closeFab}>
            <BlurView
              intensity={50}
              tint="dark"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          </Pressable>
        </Animated.View>
      )}

      {/* FAB menu items */}
      {fabOpen && (
        <View
          className="absolute right-5 z-20 items-end gap-3"
          style={{ bottom: 160 }}
          pointerEvents="box-none"
        >
          {FAB_ITEMS.map((item, index) => {
            const anim = itemAnims[index];
            return (
              <Animated.View
                key={item.label}
                className="flex-row items-center gap-2"
                style={{
                  opacity: anim,
                  transform: [
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                    {
                      scale: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                }}
              >
                <Text className="text-[16px] font-lexendRegular text-white tracking-tight">
                  {item.label}
                </Text>
                <TouchableOpacity
                  className="w-12 h-12 rounded-full items-center justify-center border bg-accent border-accent"
                  onPress={() => {
                    closeFab();
                  }}
                  activeOpacity={0.75}
                >
                  {renderIcon(item)}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      )}

      {/* FAB button */}
      <TouchableOpacity
        className={`absolute bottom-28 right-4 w-14 h-14 rounded-full items-center justify-center z-30 ${
          fabOpen
            ? "bg-transparent border border-brand-yellow"
            : "bg-primary shadow-lg"
        }`}
        onPress={toggleFab}
        activeOpacity={0.85}
      >
        <Animated.View style={{ transform: [{ rotate: fabRotateDeg }] }}>
          <Ionicons
            name="add"
            size={26}
            color={fabOpen ? "#FBE74C" : "#0D2B2B"}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Unified Tab Bar and Brand Container */}
      <View
        className="absolute left-6 right-6 h-16 flex-row items-center gap-3 z-30"
        style={{ bottom: 24 }}
      >
        {/* Tab bar */}
        <View
          className="flex-1 h-[64px]  rounded-full overflow-hidden border border-white/10"
          style={[
            Platform.OS === "ios"
              ? {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                }
              : { elevation: 12 },
          ]}
        >
          <BlurView
            intensity={25}
            tint="light"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#F0F0F033",
            }}
          />
          <View className="flex-1 flex-row items-center justify-around px-2">
            {state.routes
              .filter((route: any) => route.name !== "me")
              .map((route: any) => {
                const isFocused = state.index === state.routes.indexOf(route);
                const iconSet = TAB_ICONS[route.name] || {
                  focused: <HomeIcon />,
                  unfocused: <HomeWhite />,
                };

                const onPress = () => {
                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                };

                return (
                  <TouchableOpacity
                    key={route.key}
                    onPress={onPress}
                    className={`flex-1 items-center justify-center py-2 h-18 rounded-full gap-1 ${isFocused ? "bg-[#FDEF56]" : ""}`}
                    activeOpacity={0.8}
                  >
                    <View className="h-6 w-6 items-center justify-center">
                      {isFocused ? iconSet.focused : iconSet.unfocused}
                    </View>
                    <Text
                      className={`text-[11px] font-lexendRegular leading-tight ${isFocused ? "text-[#1F1F1F]" : "text-[#6D8686]"}`}
                    >
                      {TAB_LABELS[route.name] || route.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        {/* Brand/Logo */}
        <TouchableOpacity
          onPress={() => navigation.navigate("me")}
          activeOpacity={0.7}
          className="overflow-hidden items-center justify-center p-2"
        >
          <LogoIcon width={48} height={34} />
        </TouchableOpacity>
      </View>
    </>
  );
}
