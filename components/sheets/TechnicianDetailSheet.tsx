import BottomSheet from "@/components/shared/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Text, TouchableOpacity, View } from "react-native";

interface Technician {
  _id: string;
  name: string;
  specialty: string;
  phone?: string;
  location?: string;
  createdAt?: string;
  notes?: string;
  isVerified?: boolean;
}

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
}: {
  icon: string;
  label: string;
  value?: string;
}) {
  return (
    <View className="flex-row items-start py-4 border-b border-[#F5F5F5] gap-3">
      <Ionicons name={icon as any} size={18} color="#ADADAD" />
      <View className="flex-1">
        <Text className="text-[#ADADAD] text-[10px] font-lexendRegular mb-0.5">
          {label}
        </Text>
        <Text className="text-[#00343F] text-[14px] font-lexendMedium">
          {value || "—"}
        </Text>
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
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Your Auto-Technician"
      scrollable={true}
      height="70%"
      backgroundColor="#F0F0F0"
      headerRight={
        <View className="flex-row gap-3">
          <TouchableOpacity onPress={onEdit}>
            <Ionicons name="pencil-outline" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color="#E53935" />
          </TouchableOpacity>
        </View>
      }
    >
      <View className="px-4 pb-10">
        {/* Avatar */}
        <View className="items-center my-6">
          <View className="w-20 h-20 rounded-full bg-[#E5F9F9] items-center justify-center mb-1">
            <Text className="text-[#00AEB5] text-[28px] font-lexendBold">
              {technician?.name?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
          {technician?.isVerified && (
            <View className="flex-row items-center gap-1 mt-1">
              <View className="w-2 h-2 rounded-full bg-[#29D7DE]" />
              <Text className="text-[#29D7DE] text-[10px] font-lexendMedium">
                Verified
              </Text>
            </View>
          )}
        </View>

        {/* Detail rows */}
        <DetailRow
          icon="person-outline"
          label="Full Name"
          value={technician?.name}
        />
        <DetailRow
          icon="call-outline"
          label="Phone"
          value={technician?.phone}
        />
        <DetailRow
          icon="calendar-outline"
          label="Date Added"
          value={
            technician?.createdAt
              ? format(new Date(technician.createdAt), "d MMMM, yyyy")
              : undefined
          }
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
          value={technician?.notes || "No notes added"}
        />
      </View>
    </BottomSheet>
  );
}

export type { Technician };
