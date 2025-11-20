import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronDown } from "lucide-react-native";

interface SelectFieldProps {
  label?: string;
  value: string | null;
  options: string[];
  onSelect: (value: string) => void;
  dropdownOffset?: number;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  options,
  onSelect,
  dropdownOffset,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View className="mb-4" style={{ zIndex: open ? 10 : 1,position: "relative",
    overflow: "visible", }}>
      
      {label && <Text className="text-gray-700 text-base font-semibold mb-1">{label}</Text>}

      {/* Input Field */}
      <TouchableOpacity
        onPress={() => setOpen((prev) => !prev)}
        className="border border-primary-200 bg-white rounded-lg px-4 h-12 flex-row items-center justify-between"
      >
        <Text className={value ? "text-gray-700" : "text-gray-500"}>
          {value || "Select option"}
        </Text>
        <ChevronDown size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Dropdown List */}
      {open && (
        <View className="mt-1 border border-primary-200 bg-white rounded-lg shadow-lg" style={{
        position: "absolute",
        top: dropdownOffset?? 65,
        left: 0,
        right: 0,
        zIndex: 100,
        elevation: 10
      }}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => {
                onSelect(opt);
                setOpen(false); // close dropdown
              }}
              className="px-4 py-3"
            >
              <Text className="text-gray-700">{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default SelectField;
