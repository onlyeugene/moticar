import Container from "@/components/shared/container";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useAuthStore } from "@/store/useAuthStore";
import { useToggleEmailNotifications } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Switch, Text, View, ActivityIndicator } from "react-native";

export default function EmailSubscriptionsScreen() {
  const user = useAuthStore((state) => state.user);
  const toggleNotifications = useToggleEmailNotifications();
  const { showSnackbar } = useSnackbar();

  // Create local state so toggle feels instant, but revert on error
  const [isEnabled, setIsEnabled] = useState(
    user?.emailNotificationsEnabled ?? true
  );

  const handleToggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);

    toggleNotifications.mutate(undefined, {
      onSuccess: (data) => {
        showSnackbar({
          type: "success",
          message: "Preferences Updated",
          description: data?.message || "Email subscriptions updated successfully.",
        });
        
        if (data && typeof data.emailNotificationsEnabled === "boolean") {
            setIsEnabled(data.emailNotificationsEnabled);
        }
      },
      onError: (error: any) => {
        // Revert local state on error
        setIsEnabled(!newValue);
        showSnackbar({
          type: "error",
          message: "Update failed",
          description: error.response?.data?.message || "Could not update preferences.",
        });
      },
    });
  };

  return (
    <ScreenBackground>
      <Container>
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        </View>

        <View className="mt-10 mb-8">
          <Text className="text-white text-[32px] font-lexendMedium">
            Email Subscriptions
          </Text>
          <Text className="text-[#9BBABB] font-lexendRegular text-[16px] mt-2 leading-6">
            Manage the emails you receive from us.
          </Text>
        </View>

        <View className="bg-[#002227] border border-[#09515D] rounded-[16px] p-4">
          <View className="flex-row items-center justify-between pb-4 border-b border-[#09515D]">
            <View className="flex-1 pr-4">
              <Text className="text-white text-[16px] font-lexendMedium mb-1">
                Announcements & Updates
              </Text>
              <Text className="text-[#7BA0A3] text-[12px] font-lexendRegular leading-5">
                Receive important updates, product announcements, and personalized Motiversery reminders.
              </Text>
            </View>
            <View>
              {toggleNotifications.isPending ? (
                <ActivityIndicator color="#29D7DE" />
              ) : (
                <Switch
                  value={isEnabled}
                  onValueChange={handleToggle}
                  trackColor={{ false: "#00343F", true: "#29D7DE" }}
                  thumbColor={isEnabled ? "#ffffff" : "#7BA0A3"}
                  ios_backgroundColor="#00343F"
                />
              )}
            </View>
          </View>

          <View className="pt-4 flex-row items-start gap-2">
            <Ionicons name="information-circle-outline" size={16} color="#7BA0A3" />
            <Text className="flex-1 text-[#7BA0A3] text-[11px] font-lexendRegular leading-4">
              Critical updates like password resets or security alerts cannot be disabled.
            </Text>
          </View>
        </View>
      </Container>
    </ScreenBackground>
  );
}
