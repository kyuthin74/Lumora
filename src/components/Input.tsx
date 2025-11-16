import React from "react";
import { TextInput, View, TextInputProps, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

interface InputProps extends TextInputProps {
  icon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

const Input: React.FC<InputProps> = ({ icon, rightIcon, onRightIconPress, className, ...props }) => {
  return (
    <View className="w-full flex-row items-center border border-muted rounded-lg px-3 py-2 bg-white mb-4">
      {icon && <Icon name={icon} size={18} color="#ACACAC" style={{ marginRight: 8 }} />}
      <TextInput
        className={`flex-1 font-arimo text-base text-lg text-gray-600 ${className}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {rightIcon ? (
        <TouchableOpacity
          onPress={onRightIconPress}
          disabled={!onRightIconPress}
          accessibilityRole="button"
          className="pl-2"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name={rightIcon} size={18} color="#4B5563" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Input;
