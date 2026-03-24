import EmptyIcon from "@/assets/icons/empty.svg";
import { TECHNICIAN_CATEGORIES } from "@/types/technician";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

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

interface TechnicianSectionProps {
  filteredTechnicians: Technician[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onAddTechnician: () => void;
  onSelectTechnician?: (tech: Technician) => void;
}

export function TechnicianSection({
  filteredTechnicians,
  selectedCategory,
  onSelectCategory,
  onAddTechnician,
  onSelectTechnician,
}: TechnicianSectionProps) {
  return (
    <View className="mb- bg-white rounded-[8px] p-4">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-[#036D7D] text-[20px] font-lexendMedium">
          Your auto-technicians
        </Text>
        <TouchableOpacity
          onPress={onAddTechnician}
          className="bg-[#B8F2F4] p-2 rounded-[20px]"
        >
          <Ionicons name="add" size={20} color="#00AEB5" />
        </TouchableOpacity>
      </View>

      {/* Category pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-5"
        contentContainerStyle={{ gap: 10 }}
      >
        {TECHNICIAN_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => onSelectCategory(category)}
            className={`px-[18px] py-2 rounded-full border ${
              selectedCategory === category
                ? "bg-[#7AE6EB] border-[#7AE6EB]"
                : "bg-white border-[#C1C3C3]"
            }`}
          >
            <Text
              className={`text-[11px] font-lexendMedium ${
                selectedCategory === category
                  ? "text-[#425658]"
                  : "text-[#425658]"
              }`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Technicians grid */}
      {filteredTechnicians.length > 0 ? (
        <View className="flex-row flex-wrap gap-3">
          {filteredTechnicians.map((tech) => (
            <TouchableOpacity
              key={tech._id}
              onPress={() => onSelectTechnician?.(tech)}
              className="w-[22%] items-center gap-1.5"
            >
              <View className="w-14 h-14 rounded-full bg-[#E5F9F9] items-center justify-center overflow-hidden">
                <Ionicons name="person" size={24} color="#00AEB5" />
              </View>
              <Text
                className="text-[#00343F] text-[11px] font-lexendBold text-center"
                numberOfLines={2}
              >
                {tech.name}
              </Text>
              <Text className="text-[#888282] text-[9px] font-lexendRegular text-center">
                {tech.specialty}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View className="bg-white p-10 rounded-[24px] items-center">
          <EmptyIcon width={80} height={60} />
          <Text className="text-[#888282] text-[14px] font-lexendMedium mt-4">
            No details recorded
          </Text>
          <TouchableOpacity
            onPress={onAddTechnician}
            className="mt-4 bg-[#C6F1F1] px-6 py-2.5 rounded-full"
          >
            <Text className="text-[#00343F] font-lexendBold text-[13px]">
              Add Technician
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
