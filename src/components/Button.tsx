import React from "react";
import { Pressable, Text, GestureResponderEvent } from "react-native";

type ButtonProps = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
};

const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-primary w-[350px] p-[10px] rounded-xl items-center justify-center"
    >
      <Text className="text-white text-lg font-semibold">{title}</Text>
    </Pressable>
  );
};

export default Button;
