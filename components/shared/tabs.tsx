"use client";

import LogoIcon from "@/assets/icons/logomark.svg";
import HomeWhite from "@/assets/icons/tabs/Icon.svg";
import ActivityIcon from "@/assets/icons/tabs/activity.svg";
import ActivityWhite from "@/assets/icons/tabs/activityIcon.svg";
import CarIcon from "@/assets/icons/tabs/car.svg";
import CarWhite from "@/assets/icons/tabs/carIcon.svg";
import HomeIcon from "@/assets/icons/tabs/homeIcon.svg";
import MoreIcon from "@/assets/icons/tabs/more.svg";
import AccessoriesIcon from "@/assets/tabs/accesory.svg";
import CarWashIcon from "@/assets/tabs/carwash.svg";
import FuelIcon from "@/assets/tabs/fuel.svg";
import MechanicalIcon from "@/assets/tabs/mechanic.svg";
import TyresIcon from "@/assets/tabs/tyreguage.svg";
import { ExpenseCategory } from "@/types/expense";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ExpenseCategorySheet from "../sheets/ExpenseCategorySheet";
import LogExpenseSheet from "../sheets/LogExpenseSheet";
import SuccessModal from "./SuccessModal";
import { useAppStore } from "@/store/useAppStore";

const FAB_ITEMS = [
  { label: "Accessories & Parts", icon: AccessoriesIcon },
  { label: "Car Wash", icon: CarWashIcon },
  { label: "Tyre Guage", icon: TyresIcon },
  { label: "Mechanical Work", icon: MechanicalIcon },
  { label: "Fuel Top-Up", icon: FuelIcon },
  { label: "New Expense", icon: "add-circle-outline", lib: "Ionicons" },
];

const TAB_ICONS: Record<
  string,
  { focused: React.ReactNode; unfocused: React.ReactNode }
> = {
  index: { focused: <HomeIcon />, unfocused: <HomeWhite /> },
  car: { focused: <CarWhite />, unfocused: <CarIcon /> },
  activity: { focused: <ActivityWhite />, unfocused: <ActivityIcon /> },
  more: { focused: <MoreIcon />, unfocused: <MoreIcon /> },
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
  categories = [],
}: any) {
  const [fabOpen, setFabOpen] = useState(false);
  const [fabClosing, setFabClosing] = useState(false);
  const [categorySheetVisible, setCategorySheetVisible] = useState(false);
  const [logSheetVisible, setLogSheetVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseCategory | null>(null);
  const [successVisible, setSuccessVisible] = useState(false);
  const [openedFromCategorySheet, setOpenedFromCategorySheet] = useState(false);

  const { selectedCarId, activeActivityTab } = useAppStore();
  const currentRouteName = state.routes[state.index].name;
  const isHomeRoute = currentRouteName === "index";
  const isActivityRoute = currentRouteName === "activity";
  const isCarRoute = currentRouteName === "car";
  const showFab = isHomeRoute || (isActivityRoute && activeActivityTab === "Trips");

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

  const closeFab = (callback?: () => void) => {
    setFabClosing(true);
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
    ]).start(() => {
      setFabOpen(false);
      setFabClosing(false);
      callback?.();
    });
  };

  const toggleFab = () => (fabOpen ? closeFab() : openFab());

  const fabRotateDeg = fabRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const handleFabItemPress = (item: (typeof FAB_ITEMS)[0]) => {
    if (item.label === "New Expense") {
      closeFab(() => {
        setOpenedFromCategorySheet(false);
        setCategorySheetVisible(true);
      });
      return;
    }

    let matchingCategory = categories.find(
      (c: ExpenseCategory) => c.name.toLowerCase() === item.label.toLowerCase(),
    );

    if (!matchingCategory && item.label === "Tyre Guage") {
      matchingCategory = categories.find(
        (c: ExpenseCategory) => c.name === "Balancing" || c.id === "balancing",
      );
    }

    closeFab(() => {
      if (matchingCategory) {
        setOpenedFromCategorySheet(false);
        setSelectedCategory(matchingCategory);
        setLogSheetVisible(true);
      } else {
        setOpenedFromCategorySheet(false);
        setCategorySheetVisible(true);
      }
    });
  };

  const renderIcon = (item: (typeof FAB_ITEMS)[0], size = 22) => {
    if (typeof item.icon !== "string") {
      const IconComponent = item.icon as React.FC<any>;
      return <IconComponent width={size} height={size} />;
    }
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
      {/* Blur overlay — pointerEvents none when closing to prevent bleed-through */}
      {fabOpen && (
        <Animated.View
          className="absolute inset-0 z-10"
          style={{ opacity: overlayAnim }}
          pointerEvents={fabClosing ? "none" : "auto"}
        >
          <Pressable
            className="absolute inset-0"
            onPress={() => closeFab()}
          >
            <BlurView
              intensity={50}
              tint="dark"
              className="absolute inset-0"
            />
          </Pressable>
        </Animated.View>
      )}

      {/* FAB menu items — also pointerEvents none when closing */}
      {fabOpen && isHomeRoute && (
        <View
          className="absolute right-5 bottom-40 z-20 items-end gap-3"
          pointerEvents={fabClosing ? "none" : "box-none"}
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
                <Text className="text-[16px] font-lexendRegular text-white tracking-[-0.3px]">
                  {item.label}
                </Text>
                <TouchableOpacity
                  className="w-12 h-12 rounded-full items-center justify-center bg-accent border border-accent"
                  onPress={() => handleFabItemPress(item)}
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
      {showFab && (
        <TouchableOpacity
          className={`absolute bottom-[90px] right-5 w-14 h-14 rounded-full items-center justify-center z-30 ${
            fabOpen ? "bg-transparent border border-brand-yellow" : "bg-brand-yellow"
          }`}
          onPress={toggleFab}
          activeOpacity={0.85}
        >
          <Animated.View style={{ transform: [{ rotate: fabRotateDeg }] }}>
            <Ionicons
              name={isActivityRoute ? "play-outline" : "add"}
              size={isActivityRoute ? 22 : 28}
              color={fabOpen ? "#FBE74C" : "#0D2B2B"}
              style={isActivityRoute ? { marginLeft: 2 } : {}}
            />
          </Animated.View>
        </TouchableOpacity>
      )}

      {/* Tab Bar + Logo */}
      <View className="absolute left-6 right-6 bottom-6 h-16 flex-row items-center gap-3 z-30">
        {/* Tab bar */}
        <View
          className="flex-1 h-16 rounded-full overflow-hidden border border-[#DFDFDF]"
          style={Platform.OS === "ios" ? {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
          } : { elevation: 12 }}
        >
          <BlurView
            intensity={25}
            tint="light"
            className="absolute inset-0 bg-[rgba(240,240,240,0.2)]"
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
                    className={`flex-1 items-center justify-center py-2 rounded-full gap-0.5 ${
                      isFocused ? "bg-primary" : "bg-transparent"
                    }`}
                    activeOpacity={0.8}
                  >
                    <View className="w-6 h-6 items-center justify-center">
                      {isFocused ? iconSet.focused : iconSet.unfocused}
                    </View>
                    <Text
                      className={`text-[11px] font-lexendRegular leading-[14px] ${
                        isFocused ? "text-dark" : "text-muted"
                      }`}
                    >
                      {TAB_LABELS[route.name] || route.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        {/* Logo */}
        <TouchableOpacity
          onPress={() => navigation.navigate("me")}
          activeOpacity={0.7}
          className="items-center justify-center p-2"
        >
          <LogoIcon width={48} height={34} />
        </TouchableOpacity>
      </View>

      {/* Sheets */}
      <ExpenseCategorySheet
        visible={categorySheetVisible}
        onClose={() => {
          setCategorySheetVisible(false);
          setOpenedFromCategorySheet(false);
        }}
        onSelect={(category) => {
          setCategorySheetVisible(false);
          setOpenedFromCategorySheet(true);
          setSelectedCategory(category);
          setLogSheetVisible(true);
        }}
      />

      <LogExpenseSheet
        visible={logSheetVisible}
        onClose={() => {
          setLogSheetVisible(false);
          if (openedFromCategorySheet) {
            setCategorySheetVisible(true);
            setOpenedFromCategorySheet(false);
          }
        }}
        category={selectedCategory}
        onSuccess={() => {
          setLogSheetVisible(false);
          setOpenedFromCategorySheet(false);
          setSuccessVisible(true);
        }}
      />

      <SuccessModal
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
      />
    </>
  );
}
