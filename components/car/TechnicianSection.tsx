import EmptyIcon from "@/assets/icons/technician_empty.svg";
import { TECHNICIAN_CATEGORIES, Technician } from "@/types/technician";
import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
              className="w-[22%] items-center gap-1.5 "
            >
              <View className="w-[75px] h-[105px] relative rounded-[8px] items-center justify-center overflow-hidden">
                {tech.avatarUrl ? (
                  <Image
                    source={{ uri: tech.avatarUrl }}
                    className="w-full h-full rounded-[8px]"
                  />
                ) : (
                  <View className="bg-[#E5F9F9] w-full h-full rounded-[8px] items-center justify-center">
                    <Ionicons name="person" size={24} color="#00AEB5" />
                  </View>
                )}
                <View className="absolute bg-white/60 w-[75px] h-[105px] top-0 left-0 right-0 bottom-0" />
                  <Text
                  className="text-[#293536] text-[11px] font-lexendRegular text-center absolute bottom-2 left-2"
                    numberOfLines={2}
                  >
                    {tech.name}
                  </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View className="bg-white p-10 rounded-[24px] items-center">
          <EmptyIcon width={95} height={88} />
          <Text className="text-[#888282] text-[14px] font-lexendMedium mt-4">
            No details recorded
          </Text>
        </View>
      )}
    </View>
  );
}
