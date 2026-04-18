import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000"
    : "http://127.0.0.1:8000";

export const PUSH_STATUS_STORAGE_KEY = "dailyReminderEnabled";
export const PUSH_PREFERRED_STORAGE_KEY = "dailyReminderPreferredEnabled";

type PushStatusResponse = {
  enabled: boolean;
};

const normalizeBoolean = (value: unknown): boolean | null => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }

  if (typeof value === "string") {
    const lowered = value.trim().toLowerCase();
    if (["true", "1", "yes", "enabled", "on"].includes(lowered)) {
      return true;
    }
    if (["false", "0", "no", "disabled", "off"].includes(lowered)) {
      return false;
    }
  }

  return null;
};

const findEnabledValue = (data: unknown): boolean | null => {
  if (!data || typeof data !== "object") {
    return null;
  }

  const obj = data as Record<string, unknown>;
  const directEnabled =
    obj.enabled ??
    obj.is_notify_enabled ??
    obj.isNotifyEnabled ??
    obj.is_enabled ??
    obj.dailyReminderEnabled ??
    obj.daily_reminder_enabled ??
    obj.notify_enabled ??
    obj.push_enabled;

  const normalizedDirect = normalizeBoolean(directEnabled);
  if (normalizedDirect !== null) {
    return normalizedDirect;
  }

  const nestedCandidates = [obj.data, obj.preference, obj.preferences, obj.status];
  for (const nested of nestedCandidates) {
    const nestedValue = findEnabledValue(nested);
    if (nestedValue !== null) {
      return nestedValue;
    }
  }

  return null;
};

const parsePushStatus = (
  data: unknown,
  fallbackEnabled = false
): PushStatusResponse => {
  const enabled = findEnabledValue(data);

  return {
    enabled: enabled ?? fallbackEnabled,
  };
};

const authHeaders = (authToken: string, includeJson = false) => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${authToken}`,
  };

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    if (Platform.Version < 33) {
      return true;
    }

    const permissionResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    return permissionResult === PermissionsAndroid.RESULTS.GRANTED;
  }

  const authorizationStatus = await messaging().requestPermission();
  const authorized =
    authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return authorized;
};

export const registerFcmToken = async (
  authToken: string,
  fcmToken: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/push-notifications/register-token`,
    {
      method: "POST",
      headers: authHeaders(authToken, true),
      body: JSON.stringify({ fcm_token: fcmToken }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData && (errorData.message || errorData.detail)) ||
        "Failed to register FCM token"
    );
  }
};

export const syncCurrentFcmToken = async (authToken: string): Promise<void> => {
  const token = await messaging().getToken();
  if (!token) {
    throw new Error("Failed to get FCM token");
  }

  await registerFcmToken(authToken, token);
};

export const fetchPushNotificationStatus = async (
  authToken: string
): Promise<PushStatusResponse> => {
  const response = await fetch(`${API_BASE_URL}/push-notifications/status`, {
    method: "GET",
    headers: authHeaders(authToken),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData && (errorData.message || errorData.detail)) ||
        "Failed to fetch push notification status"
    );
  }

  const data = await response.json().catch(() => ({}));
  return parsePushStatus(data, false);
};

export const updateDailyReminderPreference = async (
  authToken: string,
  enabled: boolean
): Promise<PushStatusResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/push-notifications/preferences`,
    {
      method: "PATCH",
      headers: authHeaders(authToken, true),
      body: JSON.stringify({
        enabled,
        is_notify_enabled: enabled,
        daily_reminder_enabled: enabled,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData && (errorData.message || errorData.detail)) ||
        "Failed to update daily reminder preference"
    );
  }

  const data = await response.json().catch(() => ({}));
  const patchedStatus = parsePushStatus(data, enabled);

  // Keep user intent so we can re-sync if backend resets state during token lifecycle.
  await AsyncStorage.setItem(
    PUSH_PREFERRED_STORAGE_KEY,
    String(patchedStatus.enabled)
  );

  // Read-after-write from status endpoint to ensure backend actually persisted it.
  let confirmedStatus = patchedStatus;
  try {
    confirmedStatus = await fetchPushNotificationStatus(authToken);
  } catch (statusError) {
    console.warn(
      "Failed to confirm daily reminder status after PATCH; using patched value.",
      statusError
    );
  }

  await AsyncStorage.setItem(
    PUSH_STATUS_STORAGE_KEY,
    String(confirmedStatus.enabled)
  );

  return confirmedStatus;
};

const restorePreferredDailyReminderIfNeeded = async (
  authToken: string,
  currentStatus: PushStatusResponse
): Promise<PushStatusResponse> => {
  const preferredValue = await AsyncStorage.getItem(PUSH_PREFERRED_STORAGE_KEY);
  if (preferredValue === null) {
    return currentStatus;
  }

  const preferredEnabled = preferredValue === "true";
  if (currentStatus.enabled === preferredEnabled) {
    return currentStatus;
  }

  return updateDailyReminderPreference(authToken, preferredEnabled);
};

export const ensurePushTokenRegistrationForSession = async (
  authToken: string
): Promise<boolean> => {
  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) {
    return false;
  }

  await syncCurrentFcmToken(authToken);
  return true;
};

export const deleteRegisteredPushToken = async (authToken: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/push-notifications/token`, {
    method: "DELETE",
    headers: authHeaders(authToken),
  });

  if (!response.ok && response.status !== 204) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData && (errorData.message || errorData.detail)) ||
        "Failed to delete push notification token"
    );
  }
};

export const initializePushNotificationsForSession = async (
  authToken: string
): Promise<void> => {
  await ensurePushTokenRegistrationForSession(authToken);

  const status = await fetchPushNotificationStatus(authToken);
  const syncedStatus = await restorePreferredDailyReminderIfNeeded(authToken, status);
  await AsyncStorage.setItem(PUSH_STATUS_STORAGE_KEY, String(syncedStatus.enabled));
};

export const loadPushStatusForSession = async (
  authToken: string
): Promise<void> => {
  const status = await fetchPushNotificationStatus(authToken);
  const syncedStatus = await restorePreferredDailyReminderIfNeeded(authToken, status);
  await AsyncStorage.setItem(PUSH_STATUS_STORAGE_KEY, String(syncedStatus.enabled));
};

export const attachFcmTokenRefreshListener = (
  onNewToken: (newFcmToken: string) => Promise<void>
) => {
  return messaging().onTokenRefresh(async (newToken) => {
    try {
      await onNewToken(newToken);
    } catch (error) {
      console.error("Failed to sync refreshed FCM token:", error);
    }
  });
};
