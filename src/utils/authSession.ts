import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef } from "../navigation/navigationRef";

// Kept as a literal (not imported from services/pushNotifications) to avoid
// a circular import, since that module also needs to call handleUnauthorized.
const PUSH_STATUS_STORAGE_KEY = "dailyReminderEnabled";

const SESSION_KEYS = [
  "userId",
  "authToken",
  "lastRiskValue",
  "lastRiskLevel",
  "riskDataUserId",
  PUSH_STATUS_STORAGE_KEY,
];

export const clearSession = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(SESSION_KEYS);
  } catch (error) {
    console.error("Error clearing AsyncStorage session:", error);
  }
};

/**
 * A 401 from any authenticated endpoint means the stored token is dead
 * (expired, or its user no longer exists). Clear it and send the user
 * back to Login instead of retrying with the same token forever.
 */
export const handleUnauthorized = async (): Promise<void> => {
  await clearSession();

  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  }
};
