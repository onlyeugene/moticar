import Pen from "@/assets/icons/pen.svg";
import Trash from "@/assets/icons/trash.svg";
import BottomSheet from "@/components/shared/BottomSheet";
import { Technician } from "@/types/technician";
import { Ionicons } from "@expo/vector-icons";
import { format, isToday, isYesterday } from "date-fns";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface TechnicianDetailSheetProps {
  visible: boolean;
  onClose: () => void;
  technician: Technician | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

function DetailRow({
  icon,
  label,
  value,
  subValue,
  isNote = false,
  isPhone = false,
  isName = false,
}: {
  icon: string;
  label?: string;
  value?: string;
  subValue?: string;
  isNote?: boolean;
  isPhone?: boolean;
  isName?: boolean;
}) {
  return (
    <View
      className={`flex-row items-start py-4 border-b border-[#F5F5F5] gap-3 ${isNote ? "flex-row" : ""}`}
    >
      <View className="mt-0.5">
        <Ionicons name={icon as any} size={20} color="#ADADAD" />
      </View>
      <View className="flex-1">
        {isNote ? (
          <>
            <Text className="text-[#ADADAD] text-[12px] font-lexendRegular mb-2">
              {label}
            </Text>
            <View className=" p-3 rounded-lg border-b border-[#F0F0F0]">
              <Text className="text-[#00343F] text-[14px] font-lexendMedium leading-5">
                {value || "No notes added"}
              </Text>
            </View>
          </>
        ) : (
          <View className="flex-row justify-between items-center">
            {label && (
              <Text className="text-[#ADADAD] text-[12px] font-lexendRegular">
                {label}
              </Text>
            )}
            <View className="items-end flex-1">
              <Text
                className={`text-[#001A1F] font-lexendRegular text-[14px] ${isPhone && "text-[24px]"} ${isName && "text-[16px]"} `}
              >
                {value || "—"}
              </Text>
              {subValue && (
                <Text className="text-[#34A853] text-[10px] font-lexendMedium mt-0.5">
                  {subValue}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

export default function TechnicianDetailSheet({
  visible,
  onClose,
  technician,
  onEdit,
  onDelete,
}: TechnicianDetailSheetProps) {
  const dateValue = technician?.createdAt
    ? new Date(technician.createdAt)
    : null;
  const relativeDate = dateValue
    ? isToday(dateValue)
      ? "Today"
      : isYesterday(dateValue)
        ? "Yesterday"
        : ""
    : "";

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Your Auto-Technician"
      scrollable={true}
      height="75%"
      backgroundColor="#F0F0F0"
      headerRight={
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={onEdit}
            className="bg-white w-12 h-12 rounded-full items-center justify-center border border-[#F0F0F0]"
          >
            <Pen width={20} height={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            className="bg-white w-12 h-12 rounded-full items-center justify-center border border-[#F0F0F0]"
          >
            <Trash width={20} height={20} />
          </TouchableOpacity>
        </View>
      }
    >
      <View className="pb-10">
        {/* Avatar */}
        <View className="items-center my-6">
          <View className="relative">
            <View className="w-[130px] h-[130px] rounded-full bg-[#F9F5FF] items-center justify-center overflow-hidden">
              {technician?.avatarUrl ? (
                <Image
                  source={{ uri: technician.avatarUrl }}
                  className="w-full h-full"
                />
              ) : (
                <Text className="text-[#7F56D9] text-[32px] font-lexendMedium">
                  {technician?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "?"}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Detail rows */}
        <View className="bg-white rounded-[12px] p-5 ">
          <DetailRow
            icon="person-outline"
            value={technician?.name}
            isName={true}
          />
          <DetailRow
            icon="call-outline"
            value={technician?.phone}
            isPhone={true}
          />
          <DetailRow
            icon="calendar-outline"
            label="Date"
            value={dateValue ? format(dateValue, "d MMMM, yyyy") : undefined}
            subValue={relativeDate}
          />
          <DetailRow
            icon="construct-outline"
            label="SkillSet"
            value={technician?.specialty}
          />
          <DetailRow
            icon="location-outline"
            label="Location"
            value={technician?.location || "Not provided"}
          />
          <DetailRow
            icon="document-text-outline"
            label="Notes / Description"
            value={technician?.notes}
            isNote={true}
          />
        </View>
      </View>
    </BottomSheet>
  );
}
