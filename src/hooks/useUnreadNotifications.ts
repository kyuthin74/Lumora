import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000"
    : "http://127.0.0.1:8000";

export function useUnreadNotifications() {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setUnreadCount(0);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/notifications/?limit=100`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        setUnreadCount(0);
        return;
      }
      const data = await response.json();
      const unread = Array.isArray(data)
        ? data.filter((n) => n.is_read === false).length
        : 0;
      setUnreadCount(unread);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return unreadCount;
}
