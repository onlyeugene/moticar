"use client";

import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HomeWhite from "@/assets/icons/tabs/Icon.svg";
import ActivityIcon from "@/assets/icons/tabs/activity.svg";
import ActivityWhite from "@/assets/icons/tabs/activityIcon.svg";
import CarIcon from "@/assets/icons/tabs/car.svg";
import CarWhite from "@/assets/icons/tabs/carIcon.svg";
import HomeIcon from "@/assets/icons/tabs/homeIcon.svg";
import MoreIcon from "@/assets/icons/tabs/more.svg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import LogoIcon from "@/assets/icons/logomark.svg";
import { ExpenseCategory } from "@/types/expense";
import LogExpenseSheet from "../sheets/LogExpenseSheet";
import SuccessModal from "./SuccessModal";
import AccessoriesIcon from "@/assets/tabs/accesory.svg";
import CarWashIcon from "@/assets/tabs/carwash.svg";
import FuelIcon from "@/assets/tabs/fuel.svg";
import MechanicalIcon from "@/assets/tabs/mechanic.svg";
import TyresIcon from "@/assets/tabs/tyreguage.svg";
import ExpenseCategorySheet from "../sheets/ExpenseCategorySheet";

const FAB_ITEMS = [
  { label: "Accessories & Parts", icon: AccessoriesIcon },
  { label: "Car Wash", icon: CarWashIcon },
  { label: "Tyre Guage", icon: TyresIcon },
  { label: "Mechanical Work", icon: MechanicalIcon },
  { label: "Fuel Top-Up", icon: FuelIcon },
  { label: "New Expense", icon: "add-circle-outline", lib: "Ionicons" },
];

const TAB_ICONS: Record<string, { focused: React.ReactNode; unfocused: React.ReactNode }> = {
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

export default function TabBar({ state, descriptors, navigation, categories = [] }: any) {
  const [fabOpen, setFabOpen] = useState(false);
  const [fabClosing, setFabClosing] = useState(false);
  const [categorySheetVisible, setCategorySheetVisible] = useState(false);
  const [logSheetVisible, setLogSheetVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [successVisible, setSuccessVisible] = useState(false);
  const [openedFromCategorySheet, setOpenedFromCategorySheet] = useState(false);

  const currentRouteName = state.routes[state.index].name;
  const isHomeRoute = currentRouteName === "index";
  const isActivityRoute = currentRouteName === "activity";
  const isCarRoute = currentRouteName === "car";
  const showFab = isHomeRoute || isActivityRoute;

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
      (c: ExpenseCategory) =>
        c.name.toLowerCase() === item.label.toLowerCase(),
    );

    if (!matchingCategory && item.label === "Tyre Guage") {
      matchingCategory = categories.find(
        (c: ExpenseCategory) =>
          c.name === "Balancing" || c.id === "balancing",
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
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            opacity: overlayAnim,
          }}
          pointerEvents={fabClosing ? "none" : "auto"}
        >
          <Pressable
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={() => closeFab()}
          >
            <BlurView
              intensity={50}
              tint="dark"
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            />
          </Pressable>
        </Animated.View>
      )}

      {/* FAB menu items — also pointerEvents none when closing */}
      {fabOpen && isHomeRoute && (
        <View
          style={{
            position: "absolute",
            right: 20,
            bottom: 160,
            zIndex: 20,
            alignItems: "flex-end",
            gap: 12,
          }}
          pointerEvents={fabClosing ? "none" : "box-none"}
        >
          {FAB_ITEMS.map((item, index) => {
            const anim = itemAnims[index];
            return (
              <Animated.View
                key={item.label}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
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
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "LexendDeca-Regular",
                    color: "white",
                    letterSpacing: -0.3,
                  }}
                >
                  {item.label}
                </Text>
                <TouchableOpacity
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#B8F2F4",
                    borderWidth: 1,
                    borderColor: "#B8F2F4",
                  }}
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
          style={{
            position: "absolute",
            bottom: 90,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 30,
            backgroundColor: fabOpen ? "transparent" : "#FBE74C",
            borderWidth: fabOpen ? 1 : 0,
            borderColor: fabOpen ? "#FBE74C" : "transparent",
            ...(Platform.OS === "ios"
              ? { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }
              : { elevation: 8 }),
          }}
          onPress={toggleFab}
          activeOpacity={0.85}
        >
          <Animated.View style={{ transform: [{ rotate: fabRotateDeg }] }}>
            <Ionicons
              name={isActivityRoute ? "play" : "add"}
              size={isActivityRoute ? 22 : 28}
              color={fabOpen ? "#FBE74C" : "#0D2B2B"}
              style={isActivityRoute ? { marginLeft: 2 } : {}}
            />
          </Animated.View>
        </TouchableOpacity>
      )}

      {/* Tab Bar + Logo */}
      <View
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          bottom: 24,
          height: 64,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          zIndex: 30,
        }}
      >
        {/* Tab bar */}
        <View
          style={{
            flex: 1,
            height: 64,
            borderRadius: 100,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
            ...(Platform.OS === "ios"
              ? { shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 }
              : { elevation: 12 }),
          }}
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
              backgroundColor: "rgba(240,240,240,0.2)",
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              paddingHorizontal: 8,
            }}
          >
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
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 8,
                      borderRadius: 100,
                      gap: 2,
                      backgroundColor: isFocused ? "#FDEF56" : "transparent",
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
                      {isFocused ? iconSet.focused : iconSet.unfocused}
                    </View>
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: "LexendDeca-Regular",
                        color: isFocused ? "#1F1F1F" : "#6D8686",
                        lineHeight: 14,
                      }}
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
          style={{ alignItems: "center", justifyContent: "center", padding: 8 }}
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