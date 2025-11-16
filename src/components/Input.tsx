import React from "react";
import { TextInput, View, TextInputProps } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

interface InputProps extends TextInputProps {
  icon?: string;
}

const Input: React.FC<InputProps> = ({ icon, className, ...props }) => {
  return (
    <View className="w-full flex-row items-center border border-muted rounded-lg px-3 py-2 bg-white mb-4">
      {icon && <Icon name={icon} size={18} color="#ACACAC" style={{ marginRight: 8 }} />}
      <TextInput
        className={`flex-1 font-arimo text-base text-lg text-gray-600 ${className}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  );
};

export default Input;
