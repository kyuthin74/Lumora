import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronDown } from "lucide-react-native";

interface SelectFieldProps {
  label?: string;
  value: string | null;
  options: string[];
  onSelect: (value: string) => void;
  dropdownOffset?: number;
  isOpen?: boolean;
  onToggle?: () => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  options,
  onSelect,
  dropdownOffset,
  isOpen,
  onToggle,
}) => {
  const [open, setOpen] = useState(false);
  const isControlled = isOpen !== undefined && onToggle !== undefined;
  const isDropdownOpen = isControlled ? isOpen : open;

  return (
    <View className="mb-4 mt-2" style={{ zIndex: isDropdownOpen ? 10 : 1,position: "relative",
    overflow: "visible", }}>
      
      {label && <Text className="text-gray-700 text-base font-semibold mb-3">{label}</Text>}

      {/* Input Field */}
      <TouchableOpacity
        onPress={() => {
          if (isControlled) {
            onToggle();
          } else {
            setOpen((prev) => !prev);
          }
        }}
        className="border border-primary-200 bg-white rounded-lg px-4 h-14 flex-row items-center justify-between"
      >
        <Text className={value ? "text-gray-700" : "text-gray-500"}>
          {value || "Select option"}
        </Text>
        <ChevronDown size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Dropdown List */}
      {isDropdownOpen && (
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
                if (isControlled) {
                  onToggle();
                } else {
                  setOpen(false);
                }
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
