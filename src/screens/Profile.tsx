import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ProfileInput from "../components/ProfileInput";
import OutButton from "../components/OutButton";
import ConfirmModal from "../components/ConfirmModal";
import EditProfile from "../components/EditProfile";
import { RootStackParamList } from "../navigation/AppNavigator";
import { BottomTabParamList } from "../navigation/BottomTabNavigator";
import DateTimePicker from "@react-native-community/datetimepicker";


const Profile = () => {
  const tabNavigation = useNavigation<BottomTabNavigationProp<BottomTabParamList, "Profile">>();
  const rootNavigation = useMemo(() => {
    return tabNavigation.getParent<NavigationProp<RootStackParamList>>();
  }, [tabNavigation]);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [dailyRemindersEnabled, setDailyRemindersEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    displayName: "Alex Johnson",
    email: "alexjohnson@gmail.com",
  });
  const [emergencyContact, setEmergencyContact] = useState({
    name: "Alex Johnson",
    relationship: "Cousin",
    email: "johndoe@gmail.com",
  });
  const [activeEditModal, setActiveEditModal] = useState<null | "profile" | "contact">(null);

  const handleLogoutPress = () => setLogoutModalVisible(true);
  const handleLogoutCancel = () => setLogoutModalVisible(false);
  const handleLogoutConfirm = () => {
    setLogoutModalVisible(false);
    rootNavigation?.navigate("Login");
  };

  const handleDeletePress = () => setDeleteModalVisible(true);
  const handleDeleteCancel = () => setDeleteModalVisible(false);
  const handleDeleteConfirm = () => {
    setDeleteModalVisible(false);
    rootNavigation?.navigate("AccountRemoved");
  };

  const editModalConfig = useMemo(() => {
    if (activeEditModal === "profile") {
      return {
        title: "Edit Profile",
        fields: [
          { key: "displayName", label: "Display Name", value: profileInfo.displayName },
          { key: "email", label: "Email", value: profileInfo.email },
        ],
      };
    }

    if (activeEditModal === "contact") {
      return {
        title: "Edit Emergency Contact",
        fields: [
          { key: "name", label: "Name", value: emergencyContact.name },
          { key: "relationship", label: "Relationship", value: emergencyContact.relationship },
          { key: "email", label: "Email", value: emergencyContact.email },
        ],
      };
    }

    return { title: "", fields: [] };
  }, [activeEditModal, profileInfo, emergencyContact]);

  const closeEditModal = () => setActiveEditModal(null);

  const handleEditSave = (values: Record<string, string>) => {
    if (activeEditModal === "profile") {
      setProfileInfo((prev) => ({
        ...prev,
        displayName: values.displayName ?? prev.displayName,
        email: values.email ?? prev.email,
      }));
    } else if (activeEditModal === "contact") {
      setEmergencyContact((prev) => ({
        ...prev,
        name: values.name ?? prev.name,
        relationship: values.relationship ?? prev.relationship,
        email: values.email ?? prev.email,
      }));
    }

    closeEditModal();
  };

  const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

  const onTimeChange = (_: any, selectedTime?: Date) => {
    setShowTimePicker(false);

    if (selectedTime) {
      setReminderTime(selectedTime);
    }
  };


  return (
    <>
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
        <TouchableOpacity className="absolute top-4 right-4" onPress={() => setActiveEditModal("profile")}>
          <FontAwesome name="edit" size={22} color="#4093D6" />
        </TouchableOpacity>

        {/* Inputs */}
        <View className="mt-5">
          <ProfileInput label="Display Name" value={profileInfo.displayName} />
          <ProfileInput label="Email" value={profileInfo.email} />
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

        <TouchableOpacity className="absolute top-4 right-4" onPress={() => setActiveEditModal("contact")}>
          <FontAwesome name="edit" size={22} color="#4093D6" />
        </TouchableOpacity>

        <View className="mt-3">
          <ProfileInput label="Name" value={emergencyContact.name} />
          <ProfileInput label="Relationship" value={emergencyContact.relationship} />
          <ProfileInput label="Email" value={emergencyContact.email} />
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
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                className="border border-muted bg-background rounded-xl p-2 flex-row items-center justify-between w-1/2 min-w-[140px] self-start"
                >
                <Text className="text-gray-900 text-lg">
                  {formatTime(reminderTime)}
                </Text>
                <FontAwesome name="clock-o" size={20} color="#333" />
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={reminderTime}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={onTimeChange}
                />
              )}
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
        onPress={handleLogoutPress}
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
          onPress={handleDeletePress}
        />
      </View>
      </ScrollView>

      <ConfirmModal
        visible={logoutModalVisible}
        title="Log out"
        message="Are you sure you want to log out?"
        onCancel={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />

      <ConfirmModal
        visible={deleteModalVisible}
        title="Delete account"
        message="Are you sure you want to delete your account?"
        subMessage="Deleting your account will remove all of your information from our database. This cannot be undone."
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      <EditProfile
        visible={!!activeEditModal}
        title={editModalConfig.title}
        fields={editModalConfig.fields}
        onCancel={closeEditModal}
        onSave={handleEditSave}
      />
    </>
  );
};

export default Profile;
