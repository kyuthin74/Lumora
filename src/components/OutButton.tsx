import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

type OutButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: string; // Ionicons icon name
  type?: "default" | "danger";
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const OutButton: React.FC<OutButtonProps> = ({
  label,
  onPress,
  icon,
  type = "default",
  style,
  textStyle,
}) => {
  const isDanger = type === "danger";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        isDanger ? styles.dangerBorder : styles.defaultBorder,
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={isDanger ? "#D32F2F" : "#000"}
          style={{ marginRight: 8 }}
        />
      )}

      <Text
        style={[
          styles.label,
          isDanger ? styles.dangerText : styles.defaultText,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default OutButton;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  /* Default outline */
  defaultBorder: {
    borderWidth: 1,
    borderColor: "#4093D6",
    backgroundColor: "#FFF",
  },
  defaultText: {
    color: "#000",
    fontSize: 16,
  },

  /* Danger red outline */
  dangerBorder: {
    borderWidth: 1,
    borderColor: "#D32F2F",
    backgroundColor: "#FFF",
  },
  dangerText: {
    color: "#D32F2F",
    fontSize: 16,
    fontWeight: "600",
  },

  label: {
    fontSize: 16,
  },
});
