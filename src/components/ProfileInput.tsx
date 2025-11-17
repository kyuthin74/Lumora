import React from "react";
import { View, Text, TextInput } from "react-native";

interface ProfileInputProps {
  label: string;
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
}

const ProfileInput = ({ label, value, placeholder, onChangeText }: ProfileInputProps) => {
  return (
    <View className="mb-5" >
      {/* Label */}
      <Text className="text-gray-800 font-semibold mb-2">{label}</Text>

      {/* Input Box */}
      <View className="border border-muted rounded-lg bg-background px-2 py-1">
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          className="text-gray-800"
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );
};

export default ProfileInput;
