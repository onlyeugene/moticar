import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useReminders } from "@/hooks/useActivity";
import { useNotifications, useNotificationActions } from "@/hooks/useNotifications";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getCurrencySymbol } from "@/utils/currency";
import { format } from "date-fns";
import Empty from "@/assets/icons/empty.svg";
import BuddieIcon from "@/assets/icons/buddie.svg";
import { LoadingModal } from "@/components/ui/LoadingModal";

const TABS = ["Alerts", "Tips", "Offers & Promos", "Reminders"];

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState("Alerts");
  const { selectedCarId } = useAppStore();
  const { data: remindersData } = useReminders(selectedCarId || "");
  
  const user = useAuthStore(state => state.user);
  const currencySymbol = getCurrencySymbol(user?.preferredCurrency);
  
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
      <Pressable
        key={item._id}
        onPress={() => !item.isRead && markAsRead.mutate(item._id)}
        className="mb-3 border-b border-[#E7E7E7]"
      >
        {({ pressed }) => (
          <View 
            className={`rounded-[12px] p-4 border border-[#F0F5F5] flex-row items-center ${
              pressed 
                ? 'bg-[#B8F2F4]' 
                : (isUnread 
                    ? (isMotibuddie ? 'bg-[#FFFDE8]' : 'bg-[#E0F7F9]') 
                    : '')
            }`}
          >
            <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
              isMotibuddie ? 'bg-[#00D1D9]' : (isUnread ? 'bg-white' : 'bg-[#F0F9FA]')
            }`}>
              {isMotibuddie ? (
                <BuddieIcon width={24} height={24} />
              ) : (
                <MaterialCommunityIcons 
                  name={isUnread ? "email-outline" : "email-open-outline"} 
                  size={20} 
                  color={isUnread ? "#00AEB5" : "#ACB7B7"} 
                />
              )}
            </View>
            
            <View className="flex-1 ">
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center gap-2 flex-1">
                  <Text className="text-[#001A1F] font-lexendBold text-[14px]" numberOfLines={1}>
                    {item.title}
                  </Text>
                  {isMotibuddie && (
                    <View className="bg-[#C46A2A] px-2 py-0.5 rounded-[4px]">
                      <Text className="text-white text-[8px] font-lexendBold">motibuddie</Text>
                    </View>
                  )}
                </View>
                <Text className="text-[#00AEB5] font-lexendRegular text-[10px]">
                  {format(new Date(item.createdAt), "d/M/yy")}
                </Text>
              </View>
              <Text className="text-[#5D8689] font-lexendRegular text-[12px]" numberOfLines={2}>
                {item.body}
              </Text>
            </View>

            {!isMotibuddie && isUnread && (
              <Ionicons name="chevron-forward" size={18} color="#ACB7B7" className="ml-2" />
            )}
          </View>
        )}
      </Pressable>
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
                        {currencySymbol}{Number(amount).toLocaleString()}
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
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-4 mt-4">
          {notifications.some(n => !n.isRead) && (
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
    <View className="flex-1 bg-[#EEF5F5] pt-12">
      <View className="flex-1 pt-6">

        <Text className="px-5 text-[24px] font-lexendBold text-[#001A1F] mb-8">
          Notifications
        </Text>

        <View className="px-5 mb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-8">
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className={`pb-2 px-1 ${isActive ? "border-b-2 border-[#00AEB5]" : "border-b-2 border-[#FFFFFF]"}`}
                  >
                    <View className="flex-row items-center">
                      <Text
                        className={`text-[14px] font-lexendBold ${
                          isActive ? "text-[#00AEB5]" : "text-[#C1C3C3]"
                        }`}
                      >
                        {tab}
                      </Text>
                      {isActive && (
                        <View className="w-1.5 h-1.5 rounded-full bg-[#001A1F] ml-2" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View className="flex-1  ">
            {renderTabContent()}
        </View>
      </View>
      <LoadingModal visible={isLoading} />
    </View>
  );
}
