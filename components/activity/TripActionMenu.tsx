import React from "react";
import { Modal, Text, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TripActionMenuProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  anchorPosition: { x: number; y: number; width: number; height: number };
}


const TripActionMenu: React.FC<TripActionMenuProps> = ({
  visible,
  onClose,
  onEdit,
  onDelete,
  anchorPosition,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/40">
          <TouchableWithoutFeedback>
            <View 
              className="bg-[#001A1F] rounded-[14px] w-[180px] overflow-hidden absolute shadow-lg shadow-black/50" 
              style={{ 
                top: anchorPosition.y + anchorPosition.height + 5, 
                left: anchorPosition.x + anchorPosition.width - 180
              }}
            >

              <TouchableOpacity
                onPress={() => {
                  onEdit();
                  onClose();
                }}
                className="flex-row items-center gap-3 px-4 py-4 border-b border-[#00343F]"
              >
                <Ionicons name="pencil-outline" size={20} color="#29D7DE" />
                <Text className="text-[#29D7DE] text-[1rem] font-lexendMedium">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  onDelete();
                  onClose();
                }}
                className="flex-row items-center gap-3 px-4 py-4"
              >
                <Ionicons name="trash-outline" size={20} color="#29D7DE" />
                <Text className="text-[#29D7DE] text-[1rem] font-lexendMedium">Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TripActionMenu;
