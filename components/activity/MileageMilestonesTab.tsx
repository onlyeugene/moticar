import React, { useState } from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { useMilestones } from "@/hooks/useActivity";
import MilestoneCard from "./MilestoneCard";
import AddMileageSheet from "../sheets/AddMileageSheet";
import { format, isToday, isYesterday } from "date-fns";
import MilestoneAttentionSheet from "../sheets/MilestoneAttentionSheet";
import EmptyIcon from "@/assets/icons/empty.svg";
import{ LoadingModal} from "@/components/ui/LoadingModal";

interface MileageMilestonesTabProps {
  carId: string;
}

export default function MileageMilestonesTab({ carId }: MileageMilestonesTabProps) {
  const { data, isLoading, refetch } = useMilestones(carId);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [isResolveVisible, setIsResolveVisible] = useState(false);
  const [isAddVisible, setIsAddVisible] = useState(false);

  const groupMilestonesByDate = (milestones: any[]) => {
    const groups: { [key: string]: any[] } = {};
    milestones.forEach((m) => {
      const date = new Date(m.timestamp);
      let dateKey = format(date, "do MMMM, yyyy").toUpperCase();
      
      if (isToday(date)) dateKey = "TODAY";
      else if (isYesterday(date)) dateKey = "YESTERDAY";

      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(m);
    });
    return Object.keys(groups).map((date) => ({
      date,
      data: groups[date],
    }));
  };

  const milestonesWithDelta = React.useMemo(() => {
    const raw = data?.milestones || [];
    return raw.map((m, index) => {
      const nextMilestone = raw[index + 1];
      // Delta = current mileage - previous mileage (the next one in the descending list)
      const delta = nextMilestone ? m.mileage - nextMilestone.mileage : undefined;
      return { ...m, delta };
    });
  }, [data?.milestones]);

  const sections = groupMilestonesByDate(milestonesWithDelta);

  return (
    <View className="flex-1">
      <LoadingModal visible={isLoading} />
      {/* <TouchableOpacity 
        onPress={() => setIsAddVisible(true)}
        className="border border-[#00AEB5] rounded-full h-[40px] items-center justify-center mb-8"
      >
        <Text className="text-[#00AEB5] text-[0.875rem] font-lexendSemiBold">
          + Add manual mileage
        </Text>
      </TouchableOpacity> */}

      {sections.map((section) => (
        <View key={section.date} className="mb-6">
          <Text className="text-[#81B4B4] font-lexendBold text-[0.75rem] mb-4 px-1">
            {section.date}
          </Text>
          {section.data.map((milestone) => (
            <MilestoneCard 
              key={milestone.id || milestone._id} 
              milestone={milestone} 
              delta={milestone.delta}
              gpsDistance={(milestone as any).gpsDistance}
              onResolve={() => {
                setSelectedMilestone(milestone);
                setIsResolveVisible(true);
              }}
            />


          ))}
        </View>
      ))}

      {sections.length === 0 && (
         <View className="flex-1 px-4 items-center justify-center">
              <EmptyIcon />
              <Text className="text-[#888282] text-[0.875rem] font-lexendRegular mt-4">
                No milestones recorded
              </Text>
            </View>
      )}

      {selectedMilestone && (
        <MilestoneAttentionSheet
          visible={isResolveVisible}
          onClose={() => setIsResolveVisible(false)}
          milestone={selectedMilestone}
          carId={carId}
        />
      )}

      <AddMileageSheet
        visible={isAddVisible}
        onClose={() => setIsAddVisible(false)}
        carId={carId}
      />
    </View>
  );
}

