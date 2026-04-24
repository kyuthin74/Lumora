import type { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "../config/api";

const API_BASE_URL = getApiBaseUrl();

const isDailyReminderNotification = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
): boolean => {
  const messageType =
    typeof remoteMessage.data?.type === "string"
      ? remoteMessage.data.type.toLowerCase()
      : "";
  const title =
    typeof remoteMessage.notification?.title === "string"
      ? remoteMessage.notification.title.toLowerCase()
      : "";

  return messageType === "reminder" || title.includes("daily reminder");
};

export const displayForegroundNotification = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
): Promise<void> => {
  // For daily reminders, do not show OS-style alert while user is already in the app.
  if (isDailyReminderNotification(remoteMessage)) {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      return;
    }

    const title =
      remoteMessage.notification?.title ||
      (typeof remoteMessage.data?.title === "string" ? remoteMessage.data.title : "Daily Reminder");
    const body =
      remoteMessage.notification?.body ||
      (typeof remoteMessage.data?.body === "string"
        ? remoteMessage.data.body
        : "It's time for your daily check-in.");

    try {
      await fetch(`${API_BASE_URL}/notifications/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "reminder",
          title,
          message: body,
        }),
      });
    } catch (error) {
      console.error("Failed to create foreground reminder notification", error);
    }

    return;
  }

  const title =
    remoteMessage.notification?.title ||
    (typeof remoteMessage.data?.title === "string" ? remoteMessage.data.title : "Lumora");
  const body =
    remoteMessage.notification?.body ||
    (typeof remoteMessage.data?.body === "string"
      ? remoteMessage.data.body
      : "You have a new notification.");

  Alert.alert(title, body);
};
