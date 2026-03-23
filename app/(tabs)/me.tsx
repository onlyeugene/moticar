import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScreenBackground } from "@/components/ScreenBackground";
import { useLogout } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { router } from "expo-router";

export default function MeScreen() {
  const logout = useLogout();
  const { showSnackbar } = useSnackbar();

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

  return (
    <ScreenBackground className="flex-1 items-center justify-center">
      <View className="items-center gap-2">
        <View className="w-24 h-24 rounded-full bg-[#FDEF56] items-center justify-center mb-4">
          <Text className="text-3xl font-lexendBold text-[#1F1F1F]">M</Text>
        </View>
        <Text className="text-2xl font-lexendBold text-white">Me Screen</Text>
        <Text className="text-sm font-lexendRegular text-white/60">Profile and Settings</Text>
      </View>

      <View className="mt-20 w-full px-10">
        <TouchableOpacity
          onPress={handleLogout}
          disabled={logout.isPending}
          className="w-full h-14 bg-red-500/10 border border-red-500/20 rounded-2xl items-center justify-center flex-row gap-2"
        >
          {logout.isPending ? (
            <ActivityIndicator color="#ef4444" />
          ) : (
            <Text className="text-red-500 font-lexendBold text-[16px]">Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenBackground>
  );
}
