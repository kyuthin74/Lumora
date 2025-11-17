import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  value: boolean | null;
  onChange: (v: boolean) => void;
}

const YesNoToggle: React.FC<Props> = ({ value, onChange }) => {
  return (
    <View className="flex-row justify-between items-center space-x-10 mb-4 px-12">

      {/* YES */}
      <TouchableOpacity onPress={() => onChange(true)}>
        <View className="flex-row items-center">
          {/* Outer ring */}
          <View
            className={`
              w-7 h-7 rounded-full border-2 mr-2 items-center justify-center
              ${value === true ? "border-primary" : "border-primary bg-primary-100"}
            `}
          >
            {/* Inner filled circle if selected */}
            {value === true && (
              <View className="w-3.5 h-3.5 rounded-full bg-primary" />
            )}
          </View>

          <Text className="text-gray-700">Yes</Text>
        </View>
      </TouchableOpacity>

      {/* NO */}
      <TouchableOpacity onPress={() => onChange(false)}>
        <View className="flex-row items-center">
          {/* Outer ring */}
          <View
            className={`
              w-7 h-7 rounded-full border-2 mr-2 items-center justify-center
              ${value === false ? "border-primary" : "border-primary bg-primary-100"}
            `}
          >
            {/* Inner filled circle if selected */}
            {value === false && (
              <View className="w-3.5 h-3.5 rounded-full bg-primary" />
            )}
          </View>

          <Text className="text-gray-700">No</Text>
        </View>
      </TouchableOpacity>

    </View>
  );
};

export default YesNoToggle;
