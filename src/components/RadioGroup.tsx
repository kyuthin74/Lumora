import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface RadioGroupProps {
  options: string[];
  value: string | null;
  onSelect: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, value, onSelect }) => {
  return (
    <View>
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            activeOpacity={0.7}
            className={`mb-3 flex-row items-center rounded-2xl border px-4 py-4 ${
              selected ? "border-primary bg-primary-100" : "border-gray-200 bg-white"
            }`}
          >
            <View
              className={`mr-3 h-6 w-6 items-center justify-center rounded-full border-2 ${
                selected ? "border-primary" : "border-gray-300"
              }`}
            >
              {selected && <View className="h-3 w-3 rounded-full bg-primary" />}
            </View>
            <Text
              className={`flex-1 text-base ${
                selected ? "font-semibold text-primary" : "text-gray-700"
              }`}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default RadioGroup;
