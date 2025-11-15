import React from "react";
import { Pressable, Text, GestureResponderEvent } from "react-native";

type ButtonProps = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ title, onPress, disabled }) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`w-[350px] p-[12px] rounded-xl items-center justify-center
        ${disabled ? "bg-blue-300" : "bg-blue-500"}
      `}
    >
      <Text className="text-white text-xl font-semibold">{title}</Text>
    </Pressable>
  );
};

export default Button;
