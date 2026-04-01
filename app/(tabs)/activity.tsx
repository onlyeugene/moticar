import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";

const TABS = ["Trips", "Mileage Milestones", "Spends", "Reminder"];

export default function ActivityScreen() {
  const [activeTab, setActiveTab] = useState("Trips");

  return (
    <ScreenBackground style={{ backgroundColor: "white" }}>
      <View className="flex-1 pt-16">
        <Text className="px-4 text-[26px] font-lexendMedium mb-6 text-[#001A1F]">
          Activity
        </Text>

        {/* Sub-tabs Header */}
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            <View className="flex-row gap-6">
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className="pb-1"
                  >
                    <Text
                      className={`text-[12px] font-lexendRegular ${
                        isActive ? "text-[#00AEB5]" : "text-[#ADADAD]"
                      }`}
                    >
                      {tab}
                    </Text>
                    {isActive && (
                      <View className="absolute bottom-[-10px] left-0 right-0 h-[2px] bg-[#00AEB5] rounded-full" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Tab Content */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {activeTab === "Trips" && <TripsTab />}
          {activeTab === "Spends" && <SpendsTab />}
          {(activeTab === "Mileage Milestones" || activeTab === "Reminder") && (
            <EmptyState tabName={activeTab} />
          )}
        </ScrollView>
      </View>
    </ScreenBackground>
  );
}

function TripsTab() {
  return (
    <View className="px-4">
      <TouchableOpacity className="bg-white border border-[#00AEB5] rounded-full h-[48px] items-center justify-center flex-row gap-2 mb-8">
        <Ionicons name="add" size={20} color="#00AEB5" />
        <Text className="text-[#00AEB5] text-[14px] font-lexendMedium">
          Add new trip
        </Text>
      </TouchableOpacity>

      {/* Date Header */}
      <Text className="text-[#879090] text-[12px] font-lexendBold tracking-widest mb-4">
        09 JANUARY
      </Text>

      {/* Trip Card */}
      <TouchableOpacity className="bg-white border border-[#F0F0F0] rounded-[16px] p-4 mb-6">
        <View className="flex-row items-start gap-3">
          {/* Timeline indicator */}
          <View className="items-center py-1">
            <View className="w-2 h-2 rounded-full border border-[#00343F]" />
            <View className="w-[1px] h-[40px] bg-[#F0F0F0] my-1" />
            <View className="w-2 h-2 rounded-full bg-[#00343F]" />
          </View>

          <View className="flex-1 gap-4">
            <View>
              <Text className="text-[#00343F] text-[14px] font-lexendMedium">Wuse, Abuja</Text>
              <Text className="text-[#879090] text-[10px] font-lexendRegular">3B, Shaki Crescent, Victoria Island</Text>
            </View>
            <View>
              <Text className="text-[#00343F] text-[14px] font-lexendMedium">Accra, Ghana</Text>
              <Text className="text-[#879090] text-[10px] font-lexendRegular">3B, Shaki Crescent, Victoria Island</Text>
            </View>
          </View>

          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={16} color="#ADADAD" />
          </TouchableOpacity>
        </View>

        <View className="h-[1px] bg-[#F0F0F0] my-4" />

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={14} color="#ADADAD" />
            <Text className="text-[#ADADAD] text-[10px] font-lexendRegular">4:30pm - 6:45pm</Text>
          </View>
          <View className="flex-row items-center gap-4">
             <View className="flex-row items-center gap-1">
                <Text className="text-[#00AEB5] text-[10px] font-lexendBold">2hr 15m</Text>
             </View>
             <View className="flex-row items-center gap-1">
                <Ionicons name="navigate-outline" size={14} color="#00AEB5" />
                <Text className="text-[#00AEB5] text-[14px] font-lexendBold">219km</Text>
             </View>
          </View>
        </View>
      </TouchableOpacity>

      <Text className="text-[#ADADAD] text-[12px] font-lexendRegular text-center mt-10">
        No more trips for this period
      </Text>
    </View>
  );
}

function SpendsTab() {
  const [filterType, setFilterType] = useState("Show All");

  return (
    <View className="px-4 pb-20">
      {/* Spend toggle */}
      <View className="bg-[#F0F0F0] rounded-full p-1.5 flex-row mb-6">
        <TouchableOpacity
          onPress={() => setFilterType("Show All")}
          className={`flex-1 py-3 rounded-full items-center justify-center ${
            filterType === "Show All" ? "bg-white shadow-sm" : ""
          }`}
        >
          <Text
            className={`text-[12px] font-lexendMedium ${
              filterType === "Show All" ? "text-[#00343F]" : "text-[#879090]"
            }`}
          >
             Show All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilterType("By Car Technicians")}
          className={`flex-1 py-3 rounded-full items-center justify-center ${
            filterType === "By Car Technicians" ? "bg-white shadow-sm" : ""
          }`}
        >
          <Text
            className={`text-[12px] font-lexendMedium ${
              filterType === "By Car Technicians" ? "text-[#00343F]" : "text-[#879090]"
            }`}
          >
            By Car Technicians
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Card */}
      <View className="bg-white border border-[#F0F0F0] rounded-[24px] p-6 mb-8">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-[#00343F] text-[24px] font-lexendBold">
            ₦ 500,000
          </Text>
          <TouchableOpacity className="flex-row items-center gap-1 bg-[#F0F0F0] px-3 py-1.5 rounded-full">
             <Text className="text-[#879090] text-[12px] font-lexendRegular">Monthly</Text>
             <Ionicons name="chevron-down" size={14} color="#879090" />
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-6 mb-8">
           <View className="flex-row items-center gap-2">
              <View className="w-2.5 h-2.5 rounded-full bg-[#00AEB5]" />
              <Text className="text-[#879090] text-[12px] font-lexendRegular">This month</Text>
           </View>
           <View className="flex-row items-center gap-2">
              <View className="w-2.5 h-2.5 rounded-full bg-[#FBE74C]" />
              <Text className="text-[#879090] text-[12px] font-lexendRegular">Last month</Text>
           </View>
        </View>

        {/* Simplified Bar Chart visualization */}
        <View className="h-[180px] flex-row items-end justify-between px-2">
           {[...Array(6)].map((_, i) => (
             <View key={i} className="gap-2 items-center">
                <View className="flex-row gap-1.5 items-end">
                   <View style={{ height: 50 + Math.random() * 80 }} className="w-2.5 bg-[#00AEB5] rounded-t-sm" />
                   <View style={{ height: 30 + Math.random() * 60 }} className="w-2.5 bg-[#FBE74C] rounded-t-sm" />
                </View>
                <Text className="text-[#ADADAD] text-[10px] font-lexendRegular">
                   {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                </Text>
             </View>
           ))}
        </View>
      </View>

      <TouchableOpacity className="bg-white border border-[#00AEB5] rounded-full py-4 items-center justify-center mb-8">
         <Text className="text-[#00AEB5] text-[14px] font-lexendMedium">Share this expense</Text>
      </TouchableOpacity>

      <View className="items-center justify-center py-10 opacity-40">
        <View className="w-20 h-20 bg-[#F0F0F0] rounded-full items-center justify-center mb-4">
           <Ionicons name="pie-chart-outline" size={32} color="#ADADAD" />
        </View>
        <Text className="text-[#ADADAD] text-[14px] font-lexendRegular">
          No spends recorded
        </Text>
      </View>
    </View>
  );
}

function EmptyState({ tabName }: { tabName: string }) {
    return (
      <View className="px-4 items-center justify-center mt-20 opacity-50">
        <Text className="text-[#ADADAD] text-[14px] font-lexendRegular">
          No {tabName.toLowerCase()} recorded yet
        </Text>
      </View>
    );
}
