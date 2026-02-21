import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RootStackParamList } from "../navigation/AppNavigator";

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000"
    : "http://127.0.0.1:8000";

interface NotificationResponse {
  id: number;
  user_id: number;
  type: "result" | "reminder";
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationItem {
  id: string;
  type: "result" | "reminder";
  icon: string;
  iconColor: string;
  title: string;
  message: string;
  time: string;
}

// Calculate relative time from ISO date string
const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
};

// Map API response to UI format
const mapNotification = (notification: NotificationResponse): NotificationItem => {
  const iconConfig = notification.type === "result"
    ? { icon: "bar-chart", iconColor: "#4093D6" }
    : { icon: "bell", iconColor: "#F59E0B" };

  return {
    id: String(notification.id),
    type: notification.type,
    icon: iconConfig.icon,
    iconColor: iconConfig.iconColor,
    title: notification.title,
    message: notification.message,
    time: getRelativeTime(notification.created_at),
  };
};

const Notifications: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/notifications/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data: NotificationResponse[] = await response.json();
      setNotifications(data.map(mapNotification));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;
      await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  }, []);

  // Reload notifications and mark as read when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      markAllAsRead();
      fetchNotifications();
    }, [markAllAsRead, fetchNotifications])
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDeleteNotification = async (notificationId: string) => {
    setDeletingId(notificationId);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setDeleteSuccess(true);
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        setTimeout(() => {
          setDeleteSuccess(false);
          setDeletingId(null);
        }, 2000);
      } else {
        // Optionally handle error
        setDeletingId(null);
      }
    } catch {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#4093D6" />
        <Text className="mt-4 text-gray-600">Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="flex-row items-center px-5 pb-4 border-b border-gray-200 bg-white"
        style={{ paddingTop: insets.top + 12 }}
      >
        <TouchableOpacity onPress={handleBack} className="mr-4">
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Notifications</Text>
      </View>

      {/* Success popup */}
      {deleteSuccess && (
        <View className="absolute top-4 left-0 right-0 items-center z-50">
          <View className="bg-black/80 px-4 py-2 rounded-xl">
            <Text className="text-white text-sm">Notification deleted</Text>
          </View>
        </View>
      )}

      <ScrollView
        contentContainerClassName="px-5 py-4"
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View className="items-center justify-center py-20">
            <FontAwesome name="bell-slash-o" size={48} color="#9CA3AF" />
            <Text className="mt-4 text-gray-500 text-base">No notifications yet</Text>
          </View>
        ) : (
          <View className="gap-3">
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                className="bg-white rounded-xl p-4 border border-gray-200 flex-row"
                activeOpacity={0.7}
              >
                {/* Icon */}
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: `${notification.iconColor}20` }}
                >
                  <FontAwesome
                    name={notification.icon}
                    size={20}
                    color={notification.iconColor}
                  />
                </View>

                {/* Content */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-base font-semibold text-gray-900">
                      {notification.title}
                    </Text>
                    <TouchableOpacity onPress={() => handleDeleteNotification(notification.id)}>
                      <FontAwesome name="trash" size={20} color="#DC2626" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                  </View>
                  <Text className="text-gray-600 text-sm leading-5 mb-2">
                    {notification.message}
                  </Text>
                  <Text className="text-gray-400 text-xs">{notification.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Notifications;
