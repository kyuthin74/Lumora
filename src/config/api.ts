import { Platform } from "react-native";

export const getApiBaseUrl = (): string => {
  return Platform.OS === "android"
    ? "http://10.0.2.2:8000"
    : "http://127.0.0.1:8000";
};
