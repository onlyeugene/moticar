import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useLogout, useDeleteAccount } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MeScreen() {
  const logout = useLogout();
  const { showSnackbar } = useSnackbar();

  const deleteAccount = useDeleteAccount();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        showSnackbar({
          type: "success",
          message: "Logged out",
          description: "You have been successfully logged out.",
        });
        router.replace("/(auth)/welcome");
      },
      onError: (error: any) => {
        showSnackbar({
          type: "error",
          message: "Logout failed",
          description: error.response?.data?.message || "Something went wrong.",
        });
      },
    });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action is permanent and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteAccount.mutate(undefined, {
              onSuccess: () => {
                showSnackbar({
                  type: "success",
                  message: "Account Deleted",
                  description: "Your account has been successfully deleted.",
                });
                router.replace("/(auth)/welcome");
              },
              onError: (error: any) => {
                showSnackbar({
                  type: "error",
                  message: "Deletion failed",
                  description:
                    error.response?.data?.message || "Something went wrong.",
                });
              },
            });
          },
        },
      ]
    );
  };

  return (
    <ScreenBackground className="flex-1 items-center justify-center">
      <View className="items-center gap-2">
        <View className="w-24 h-24 rounded-full bg-[#FDEF56] items-center justify-center mb-4">
          <Text className="text-3xl font-lexendBold text-[#1F1F1F]">M</Text>
        </View>
        <Text className="text-2xl font-lexendBold text-white">Me Screen</Text>
        <Text className="text-sm font-lexendRegular text-white/60">
          Profile and Settings
        </Text>
      </View>

      <View className="mt-10 w-full px-10 gap-4">
        <TouchableOpacity
          onPress={handleLogout}
          disabled={logout.isPending || deleteAccount.isPending}
          className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl items-center justify-center flex-row gap-2"
        >
          {logout.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-lexendBold text-[16px]">
              Logout
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          disabled={logout.isPending || deleteAccount.isPending}
          className="w-full h-14 bg-red-500/10 border border-red-500/20 rounded-2xl items-center justify-center flex-row gap-2"
        >
          {deleteAccount.isPending ? (
            <ActivityIndicator color="#ef4444" />
          ) : (
            <Text className="text-red-500 font-lexendBold text-[16px]">
              Delete Account
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenBackground>
  );
}
