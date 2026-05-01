import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import MotiIcon from "@/assets/icons/device.svg";
import { useAppStore } from "@/store/useAppStore";

interface MotiBuddieStatusProps {
  plate?: string;
  carId?: string;
}

export function MotiBuddieStatus({ plate, carId }: MotiBuddieStatusProps) {
  const obdData = useAppStore((state) =>
    carId ? state.obdData[carId] : undefined,
  );

  const statusColor =
    obdData?.status === "moving"
      ? "#4ADE80"
      : obdData?.status === "online"
        ? "#29D7DE"
        : "#9BBABB";

  const statusLabel =
    obdData?.status === "moving"
      ? "Moving"
      : obdData?.status === "online"
        ? "Online"
        : obdData?.status === "offline"
          ? "Offline"
          : "Connected";

  const lastSeen = obdData?.lastSeen
    ? new Date(obdData.lastSeen).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <View className="bg-[#013037] p-5 rounded-[20px] flex-row items-start mb-8 gap-4">
      <View
        className="items-center justify-center bg-[#29D7DE] h-14 w-14 rounded-full"
        style={{
          shadowColor: statusColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 20,
          elevation: 20,
        }}
      >
        <MotiIcon width={35} height={19} />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-0.5">
          <Text className="text-white text-[1rem] font-lexendBold">
            motibuddie
          </Text>
          <View className="flex-row items-center gap-1">
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: statusColor,
              }}
            />
            <Text
              style={{ color: statusColor }}
              className="text-[0.625rem] font-lexendMedium"
            >
              {statusLabel}
            </Text>
          </View>
        </View>
        <Text className="text-[#29D7DE] text-[0.625rem] font-lexendBold mb-2">
          ID: {plate || "—"}
        </Text>
        <Text className="text-[#BCBCBC] text-[0.625rem] font-lexendRegular leading-[17px] mb-3">
          Nothing to be alarmed about. Your device can now read {"\n"}about your
          car. You have a buddie to count on.
        </Text>
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-2">
            <View className="bg-[#FEF597] px-2 py-2 rounded-full">
              <Ionicons name="time-outline" size={13} color="#013037" />
            </View>
            <Text className="text-[#FBE74C] text-[0.625rem] font-lexendRegular">
              {lastSeen ? `Last seen at ${lastSeen}` : "Awaiting data..."}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
