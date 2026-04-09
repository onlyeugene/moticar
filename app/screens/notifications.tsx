import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useReminders } from "@/hooks/useActivity";
import { useNotifications, useNotificationActions } from "@/hooks/useNotifications";
import { useAppStore } from "@/store/useAppStore";
import { format } from "date-fns";
import Empty from "@/assets/icons/empty.svg";

const TABS = ["Alerts", "Tips", "Offers & Promos", "Reminders"];

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState("Alerts");
  const { selectedCarId } = useAppStore();
  const { data: remindersData } = useReminders(selectedCarId || "");
  
  // Map UI tabs to backend types
  const tabTypeMap: Record<string, any> = {
    "Alerts": "alert",
    "Tips": "tip",
    "Offers & Promos": "promotion",
    "Reminders": "reminder"
  };

  const { data: notificationsData, isLoading } = useNotifications(tabTypeMap[activeTab]);
  const { markAllAsRead, markAsRead } = useNotificationActions();

  const handleMarkAllRead = () => {
    markAllAsRead.mutate(tabTypeMap[activeTab]);
  };

  const renderNotificationItem = (item: any) => {
    const isUnread = !item.isRead;
    const isMotibuddie = item.source === 'motibuddie';

    return (
      <TouchableOpacity
        key={item._id}
        onPress={() => !item.isRead && markAsRead.mutate(item._id)}
        className="bg-white rounded-[12px] p-4 mb-3 border border-[#E9F0F0] flex-row items-center"
      >
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
          item.type === 'alert' ? 'bg-[#FFF0F0]' : 'bg-[#F0F9FA]'
        }`}>
          <MaterialCommunityIcons 
            name={item.type === 'alert' ? "alert-circle-outline" : "lightbulb-outline"} 
            size={20} 
            color={item.type === 'alert' ? "#FF4B4B" : "#00AEB5"} 
          />
        </View>
        
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-[#001A1F] font-lexendMedium text-[14px]">
              {item.title}
            </Text>
            {isMotibuddie && (
              <View className="bg-[#E6F7F7] px-1.5 py-0.5 rounded-full">
                <Text className="text-[#00AEB5] text-[8px] font-lexendBold uppercase">MotiBuddie</Text>
              </View>
            )}
          </View>
          <Text className="text-[#8B8B8B] font-lexendRegular text-[12px]" numberOfLines={2}>
            {item.body}
          </Text>
          <Text className="text-[#C1C3C3] font-lexendRegular text-[10px] mt-1">
            {format(new Date(item.createdAt), "MMM d, h:mm a")}
          </Text>
        </View>

        {isUnread && (
          <View className="w-2 h-2 rounded-full bg-[#00AEB5] ml-2" />
        )}
      </TouchableOpacity>
    );
  };

  const renderTabContent = () => {
    if (activeTab === "Reminders") {
      const reminders = remindersData?.reminders || [];
      return (
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
           <View className="flex-row items-center justify-between mb-4 mt-6">
              <Text className="text-[#001A1F] font-lexendMedium text-[16px]">
                Upcoming Reminders
              </Text>
           </View>
          {reminders.length === 0 ? (
            <View className="flex-1 items-center justify-center mt-20">
              <Empty />
              <Text className="text-[#5D8689] font-lexendRegular text-[14px] mt-4">
                No reminders scheduled
              </Text>
            </View>
          ) : (
            reminders
              .sort((a, b) => {
                const dateA = a.details?.date || a.details?.dueDate || a.details?.startDate;
                const dateB = b.details?.date || b.details?.dueDate || b.details?.startDate;
                return new Date(dateA || 0).getTime() - new Date(dateB || 0).getTime();
              })
              .map((reminder) => {
                const dets = reminder.details || {};
                const primaryDate = dets.date || dets.dueDate || dets.startDate;
                const amount = dets.amount || dets.budget || dets.estimatedCost;
                const severity = dets.severity;
                return (
                  <View
                    key={reminder.id || (reminder as any)._id}
                    className="bg-white rounded-[12px] p-4 mb-3 border border-[#E9F0F0] flex-row items-center"
                  >
                    <View className="w-10 h-10 rounded-full bg-[#f0f9fa] items-center justify-center mr-4">
                      <MaterialCommunityIcons name="bell-outline" size={20} color="#00AEB5" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[#001A1F] font-lexendMedium text-[14px]">
                        {reminder.name}
                      </Text>
                      <Text className="text-[#8B8B8B] font-lexendRegular text-[12px]">
                        {reminder.category}{primaryDate ? ` • ${format(new Date(primaryDate), "MMM d, yyyy")}` : ''}
                      </Text>
                      {severity && (
                        <Text className="text-[#C1C3C3] font-lexendRegular text-[10px] mt-0.5">
                          {severity}
                        </Text>
                      )}
                    </View>
                    {amount ? (
                      <Text className="text-[#001A1F] font-lexendMedium text-[14px]">
                        ₦{Number(amount).toLocaleString()}
                      </Text>
                    ) : null}
                  </View>
                );
              })
          )}
        </ScrollView>
      );
    }

    const notifications = notificationsData?.notifications || [];
    return (
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-4 mt-6">
          <Text className="text-[#001A1F] font-lexendMedium text-[16px]">
            {activeTab}
          </Text>
          {notifications.length > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead}>
              <Text className="text-[#00AEB5] font-lexendMedium text-[12px]">
                Mark all as read
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-20">
            <Empty />
            <Text className="text-[#5D8689] font-lexendRegular text-[14px] mt-4">
              No {activeTab.toLowerCase()} for now
            </Text>
          </View>
        ) : (
          notifications.map(renderNotificationItem)
        )}
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-white pt-12">
      <View className="flex-1 pt-6">
        <View className="px-5 flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#001A1F" />
          </TouchableOpacity>
        </View>

        <Text className="px-5 text-[24px] font-lexendBold text-[#001A1F] mb-8">
          Notifications
        </Text>

        <View className="px-5 mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-8">
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className="pb-2 relative"
                  >
                    <Text
                      className={`text-[14px] font-lexendBold ${
                        isActive ? "text-[#00AEB5]" : "text-[#C1C3C3]"
                      }`}
                    >
                      {tab}
                    </Text>
                    {isActive && (
                       <View className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-[#00AEB5] rounded-full" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View className="flex-1 bg-[#F9FBFB] rounded-t-[32px] pt-4">
            {renderTabContent()}
        </View>
      </View>
    </View>
  );
}
