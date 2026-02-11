import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import type { RootStackParamList } from "../navigation/AppNavigator";

interface NotificationItem {
  id: string;
  type: "result" | "reminder";
  icon: string;
  iconColor: string;
  title: string;
  message: string;
  time: string;
}

// Mock notification data
const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    type: "result",
    icon: "bar-chart",
    iconColor: "#4093D6",
    title: "Depression Test Result",
    message: "Your latest assessment shows low risk. Keep up the great work with your mental wellness!",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "reminder",
    icon: "bell",
    iconColor: "#F59E0B",
    title: "Daily Reminder",
    message: "Time for your daily mood check-in. How are you feeling today?",
    time: "5 hours ago",
  },
  {
    id: "3",
    type: "result",
    icon: "bar-chart",
    iconColor: "#4093D6",
    title: "Depression Test Result",
    message: "Your weekly assessment is ready. Tap to view your progress report.",
    time: "1 day ago",
  },
  {
    id: "4",
    type: "reminder",
    icon: "bell",
    iconColor: "#F59E0B",
    title: "Daily Reminder",
    message: "Don't forget to log your mood today. Consistency helps track your progress!",
    time: "1 day ago",
  },
  {
    id: "5",
    type: "result",
    icon: "bar-chart",
    iconColor: "#4093D6",
    title: "Depression Test Result",
    message: "Your assessment from last week indicates moderate improvement. Great progress!",
    time: "3 days ago",
  },
  {
    id: "6",
    type: "reminder",
    icon: "bell",
    iconColor: "#F59E0B",
    title: "Daily Reminder",
    message: "Your daily check-in is waiting. Take a moment to reflect on your day.",
    time: "4 days ago",
  },
];

const Notifications: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    navigation.goBack();
  };

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

      <ScrollView
        contentContainerClassName="px-5 py-4"
        showsVerticalScrollIndicator={false}
      >
        {mockNotifications.length === 0 ? (
          <View className="items-center justify-center py-20">
            <FontAwesome name="bell-slash-o" size={48} color="#9CA3AF" />
            <Text className="mt-4 text-gray-500 text-base">No notifications yet</Text>
          </View>
        ) : (
          <View className="gap-3">
            {mockNotifications.map((notification) => (
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
