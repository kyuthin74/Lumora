import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  value: number;
  onChange: (v: number) => void;
  minLabel?: string;
  maxLabel?: string;
}

const ScaleSelector: React.FC<Props> = ({ value, onChange, minLabel, maxLabel }) => {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between mb-2 px-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => onChange(n)}>
            <View className="items-center justify-center">
              {/* Outer circle (radio ring) */}
              <View
                className={`w-8 h-8 rounded-full border-2 
                  ${value === n ? "border-primary" : "border-primary bg-primary-100"}
                  items-center justify-center
                `}
              >
                {/* Inner filled circle if selected */}
                {value === n && (
                  <View className="w-4 h-4 rounded-full bg-primary" />
                )}
              </View>

              {/* Number label under each radio button */}
              <Text className="text-xs mt-1 text-gray-600">{n}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row justify-between px-4">
        <Text className="text-sm text-gray-500">{minLabel}</Text>
        <Text className="text-sm text-gray-500">{maxLabel}</Text>
      </View>
    </View>
  );
};

export default ScaleSelector;
