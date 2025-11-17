import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ProfileInput from "../components/ProfileInput";
import OutButton from "../components/OutButton";

const Profile = () => {
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [dailyRemindersEnabled, setDailyRemindersEnabled] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);

  return (
    <ScrollView className="flex-1 bg-background px-6 pt-12">
      {/* Page Title */}
      <View className="pt-4 pb-6" >
        <Text className="text-center text-2xl font-bold text-gray-900">Profile</Text>
        <Text className="mt-1 text-center text-base text-gray-600">
          Manage your LUMORA experience
        </Text>
      </View>

      {/* --- USER INFO CARD --- */}
      <View className="bg-white rounded-2xl p-5 border border-primary-200 mb-6">
        <View className="items-center">
          <View className="bg-primary h-20 w-20 rounded-full items-center justify-center">
            <FontAwesome name="user" color="white" size={40} />
          </View>
          <Text className="mt-3 text-gray-600">Member since Sep 2025</Text>
        </View>

        {/* Edit icon */}
        <TouchableOpacity className="absolute top-4 right-4">
          <FontAwesome name="edit" size={22} color="#4093D6" />
        </TouchableOpacity>

        {/* Inputs */}
        <View className="mt-5">
          <ProfileInput label="Display Name" value="Alex Johnson" />
          <ProfileInput label="Email" value="alexjohnson@gmail.com" />
        </View>
      </View>

      {/* --- EMERGENCY CONTACT CARD --- */}
      <View className="bg-white rounded-2xl p-5 border border-primary-200 mb-6">
        <View className="flex-row items-center mb-1">
          <FontAwesome name="warning" size={18} color="#000" />
          <Text className="text-lg font-semibold text-gray-900 ml-2">
            Emergency Contact
          </Text>
        </View>

        <TouchableOpacity className="absolute top-4 right-4">
          <FontAwesome name="edit" size={22} color="#4093D6" />
        </TouchableOpacity>

        <View className="mt-3">
          <ProfileInput label="Name" value="Alex Johnson" />
          <ProfileInput label="Relationship" value="Cousin" />
          <ProfileInput label="Email" value="johndoe@gmail.com" />
        </View>
      </View>

      {/* --- NOTIFICATION SETTINGS CARD --- */}
      <View className="bg-white rounded-2xl p-5 border border-primary-200 mb-6">
        <View className="flex-row items-center mb-4">
          <FontAwesome name="bell" size={18} color="#000" />
          <Text className="text-lg font-semibold text-gray-900 ml-2">
            Notifications
          </Text>
        </View>

        {/* Push Notifications */}
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-gray-800 font-semibold">Push Notifications</Text>
            <Text className="text-gray-600 text-sm">General app notifications</Text>
          </View>

          <TouchableOpacity
            onPress={() => setPushNotificationsEnabled(!pushNotificationsEnabled)}
          >
            <FontAwesome
              name={pushNotificationsEnabled ? "toggle-on" : "toggle-off"}
              size={38}
              color={pushNotificationsEnabled ? "#4093D6" : "#9CA3AF"}
            />
          </TouchableOpacity>
        </View>

        {/* Daily Reminders */}
        <View className="flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <Text className="text-gray-800 font-semibold">Daily Reminders</Text>
            <Text className="text-gray-600 text-sm">Mood check-in reminders</Text>
          </View>

          <TouchableOpacity onPress={() => setDailyRemindersEnabled(!dailyRemindersEnabled)}>
            <FontAwesome
              name={dailyRemindersEnabled ? "toggle-on" : "toggle-off"}
              size={38}
              color={dailyRemindersEnabled ? "#4093D6" : "#9CA3AF"}
            />
          </TouchableOpacity>
        </View>

        {dailyRemindersEnabled && (
          <View className="flex-row items-stretch mt-4 mb-5 pl-2">
            <View className="w-[2px] rounded-full bg-[#D9D9D9]" />
            <View className="flex-1 ml-4">
              <Text className="text-gray-800 font-semibold mb-2">Reminder Time</Text>
              <View className="border border-muted bg-background rounded-xl p-2 flex-row items-center justify-between w-1/2 min-w-[140px] self-start">
                <Text className="text-gray-900 text-lg">09:00 AM</Text>
                <FontAwesome name="clock-o" size={20} color="#333" />
              </View>
            </View>
          </View>
        )}

        {/* Risk Alerts */}
        <View className="flex-row justify-between items-center mt-3">
          <View>
            <Text className="text-gray-800 font-semibold">Risk Alerts</Text>
            <Text className="text-gray-600 text-sm">High-risk pattern notifications</Text>
          </View>

          <TouchableOpacity onPress={() => setRiskAlerts(!riskAlerts)}>
            <FontAwesome
              name={riskAlerts ? "toggle-on" : "toggle-off"}
              size={38}
              color={riskAlerts ? "#4093D6" : "#9CA3AF"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- SUPPORT CARD --- */}
      <View className="bg-white rounded-2xl p-5 border border-primary-200 mb-6">
        <View className="flex-row items-center mb-4">
          <FontAwesome name="question-circle" size={20} color="#000" />
          <Text className="text-lg font-semibold text-gray-900 ml-2">Support</Text>
        </View>

        {/* Help Center */}
        <TouchableOpacity className="border border-muted rounded-xl p-3 flex-row items-center mb-4">
          <FontAwesome name="question-circle" size={18} color="#000" />
          <Text className="ml-3 text-gray-900">Help Center</Text>
        </TouchableOpacity>

        {/* Contact Support */}
        <TouchableOpacity className="border border-muted rounded-xl p-3 flex-row items-center mb-4">
          <FontAwesome name="envelope" size={18} color="#000" />
          <Text className="ml-3 text-gray-900">Contact Support</Text>
        </TouchableOpacity>

        {/* Crisis Support Box */}
        <View className="border border-red-400 bg-red-50 rounded-xl p-4">
          <View className="flex-row items-center mb-2">
            <FontAwesome name="info-circle" size={18} color="#D32F2F" />
            <Text className="text-red-600 font-semibold ml-2">Crisis Support</Text>
          </View>

          <Text className="text-red-700 mb-3">
            If you’re experiencing a mental health crisis:
          </Text>

          <TouchableOpacity className="bg-red-500 rounded-lg py-2 items-center">
            <Text className="text-white font-semibold">Call 1323 (Thai Crisis Hotline)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- LOGOUT BUTTON --- */}
      <OutButton
        label="Logout"
        icon="log-out-outline"
        onPress={() => console.log("Logout pressed")}
      />
      {/* --- DANGER ZONE --- */}
      <View className="mt-6 mb-20">
        <View className="flex-row items-center mb-3">
          <FontAwesome name="warning" size={18} color="#DC2626" />
          <Text className="text-red-600 text-lg font-semibold ml-2">Danger Zone</Text>
        </View>

        <OutButton
          label="Delete Account"
          icon="trash-outline"
          type="danger"
          onPress={() => console.log("Delete Account pressed")}
        />
      </View>
    </ScrollView>
  );
};

export default Profile;
