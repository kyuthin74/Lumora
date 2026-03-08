import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const AccountManagementCard = ({ onPress }) => (
  <View className="bg-white rounded-2xl p-5 border border-primary-200 mb-6">
    <TouchableOpacity
      className="flex-row items-center justify-between"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text className="text-lg font-semibold text-gray-900">Account Management</Text>
      <FontAwesome name="chevron-right" size={22} color="#4093D6" />
    </TouchableOpacity>
  </View>
);

export default AccountManagementCard;
