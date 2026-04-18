import type { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { Alert } from "react-native";

export const displayForegroundNotification = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
): Promise<void> => {
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
