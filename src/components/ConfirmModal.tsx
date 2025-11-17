import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  subMessage?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  subMessage,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View className="flex-1 justify-center items-center bg-black/40 px-10">

        {/* Popup */}
        <View className="bg-white rounded-2xl w-full">

          {/* Title */}
          <Text className="text-center text-xl mt-6 font-semibold text-red-500">
            {title}
          </Text>

          {/* Message */}
          <Text className="text-center text-lg text-gray-800 mt-4">
            {message}
          </Text>

          {/* Optional sub-message */}
          {subMessage && (
            <Text className="text-center px-4 mt-1 text-gray-500 text-base">
              {subMessage}
            </Text>
          )}

          {/* Divider */}
          <View className="h-px bg-gray-300 mt-4" />

          {/* Buttons */}
          <View className="flex-row justify-between">

            <TouchableOpacity className="flex-1 py-3" onPress={onCancel}>
              <Text className="text-center text-gray-600 text-lg">Cancel</Text>
            </TouchableOpacity>

            <View className="w-px bg-gray-300" />

            <TouchableOpacity className="flex-1 py-3" onPress={onConfirm}>
              <Text className="text-center text-primary text-lg">
                Confirm
              </Text>
            </TouchableOpacity>

          </View>
        </View>

      </View>
    </Modal>
  );
};

export default ConfirmModal;
