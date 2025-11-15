import React from "react";
import { Pressable, Text, GestureResponderEvent } from "react-native";

type ButtonProps = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "link" | "short";
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  disabled,
  variant = "primary",
  className,
}) => {
  const baseClasses = "rounded-xl items-center justify-center px-5 py-3";
  const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: `${disabled ? "bg-primary/50" : "bg-primary"} w-full`,
    secondary: `${disabled ? "bg-gray-200" : "bg-white border border-primary"} w-full`,
    short: `${disabled ? "bg-primary/50" : "bg-primary"} w-auto px-6`,
    link: "bg-transparent",
  };

  const textClass = (() => {
    if (variant === "secondary") {
      return disabled ? "text-primary/60" : "text-primary";
    }
    if (variant === "link") {
      return disabled ? "text-primary/60" : "text-primary";
    }
    return "text-white";
  })();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`${baseClasses} ${variantClasses[variant]} ${className ?? ""}`.trim()}
    >
      <Text className={`text-lg font-semibold ${textClass}`}>
        {title}
      </Text>
    </Pressable>
  );
};

export default Button;