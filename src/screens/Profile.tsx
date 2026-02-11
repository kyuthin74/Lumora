import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Alert, ActivityIndicator } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ProfileInput from "../components/ProfileInput";
import OutButton from "../components/OutButton";
import ConfirmModal from "../components/ConfirmModal";
import EditProfile from "../components/EditProfile";
import { RootStackParamList } from "../navigation/AppNavigator";
import { BottomTabParamList } from "../navigation/BottomTabNavigator";

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000"
    : "http://127.0.0.1:8000";

// Retrieve credentials from AsyncStorage
const getUserCredentials = async (): Promise<{ userId: string | null; token: string | null }> => {
  const userId = await AsyncStorage.getItem("userId");
  const token = await AsyncStorage.getItem("authToken");
  return { userId, token };
};

interface UserProfileResponse {
  full_name: string;
  email: string;
  is_notify_enabled: boolean;
  daily_reminder_time: string;
  is_risk_alert_enabled: boolean;
  emergency_contact: {
    contact_name: string;
    contact_email: string;
    relationship: string;
  };
}

interface EmergencyContactResponse {
  id: number;
  user_id: number;
  contact_name: string;
  contact_email: string;
  relationship: string;
  created_at: string;
}

interface UserProfileUpdateResponse {
  id: number;
  email: string;
  full_name: string;
  is_notify_enabled: boolean;
  daily_reminder_time: string;
  is_risk_alert_enabled: boolean;
  created_at: string;
}


const Profile = () => {
  const tabNavigation = useNavigation<BottomTabNavigationProp<BottomTabParamList, "Profile">>();
  const rootNavigation = useMemo(() => {
    return tabNavigation.getParent<NavigationProp<RootStackParamList>>();
  }, [tabNavigation]);
  const [isLoading, setIsLoading] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    displayName: "",
    email: "",
  });
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "",
    email: "",
  });
  const [activeEditModal, setActiveEditModal] = useState<null | "profile" | "contact">(null);

  // Fetch user profile data
  const fetchUserProfile = useCallback(async (userId: string, token: string): Promise<UserProfileResponse | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || "Failed to fetch profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }, []);

  // Fetch emergency contact data
  const fetchEmergencyContact = useCallback(async (userId: string, token: string): Promise<EmergencyContactResponse | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/emergency-contact/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || "Failed to fetch emergency contact");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching emergency contact:", error);
      return null;
    }
  }, []);

  // Update emergency contact
  const updateEmergencyContact = useCallback(async (
    userId: string,
    token: string,
    contactData: { contact_name?: string; contact_email?: string; relationship?: string }
  ): Promise<EmergencyContactResponse | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/emergency-contact/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || "Failed to update emergency contact");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating emergency contact:", error);
      throw error;
    }
  }, []);

  // Update user profile
  const updateUserProfile = useCallback(async (
    userId: string,
    token: string,
    profileData: {
      full_name?: string;
      email?: string;
      is_notify_enabled?: boolean;
      is_risk_alert_enabled?: boolean;
    }
  ): Promise<UserProfileUpdateResponse | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || "Failed to update profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }, []);

  // Delete user account
  const deleteUserAccount = useCallback(async (userId: string, token: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || "Failed to delete account");
      }

      // Clear stored credentials
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("authToken");
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  }, []);

  // Load profile data on mount
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);

      const { userId, token } = await getUserCredentials();

      if (!userId || !token) {
        Alert.alert("Error", "Please log in to view your profile.");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch both endpoints in parallel
        const [profileData, contactData] = await Promise.all([
          fetchUserProfile(userId, token),
          fetchEmergencyContact(userId, token),
        ]);

        // Update profile info
        if (profileData) {
          setProfileInfo({
            displayName: profileData.full_name || "",
            email: profileData.email || "",
          });
          setPushNotificationsEnabled(profileData.is_notify_enabled);
          setRiskAlerts(profileData.is_risk_alert_enabled);

          // Update emergency contact from profile response if available
          if (profileData.emergency_contact) {
            setEmergencyContact({
              name: profileData.emergency_contact.contact_name || "",
              relationship: profileData.emergency_contact.relationship || "",
              email: profileData.emergency_contact.contact_email || "",
            });
          }
        }

        // Override with dedicated emergency contact endpoint data if available
        if (contactData) {
          setEmergencyContact({
            name: contactData.contact_name || "",
            relationship: contactData.relationship || "",
            email: contactData.contact_email || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        Alert.alert("Error", "Failed to load profile data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [fetchUserProfile, fetchEmergencyContact]);

  const handleLogoutPress = () => setLogoutModalVisible(true);
  const handleLogoutCancel = () => setLogoutModalVisible(false);
  const handleLogoutConfirm = () => {
    setLogoutModalVisible(false);
    rootNavigation?.navigate("Login");
  };

  const handleDeletePress = () => setDeleteModalVisible(true);
  const handleDeleteCancel = () => setDeleteModalVisible(false);
  const handleDeleteConfirm = async () => {
    const { userId, token } = await getUserCredentials();
    
    if (!userId || !token) {
      Alert.alert("Error", "Please log in to delete your account.");
      setDeleteModalVisible(false);
      return;
    }

    try {
      await deleteUserAccount(userId, token);
      setDeleteModalVisible(false);
      rootNavigation?.navigate("AccountRemoved");
    } catch (error) {
      setDeleteModalVisible(false);
      const message = error instanceof Error ? error.message : "Failed to delete account";
      Alert.alert("Delete failed", message);
    }
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

  const handleEditSave = async (values: Record<string, string>) => {
    const { userId, token } = await getUserCredentials();
    
    if (!userId || !token) {
      Alert.alert("Error", "Please log in to update your profile.");
      return;
    }

    if (activeEditModal === "profile") {
      try {
        const updatedProfile = await updateUserProfile(userId, token, {
          full_name: values.displayName,
          email: values.email,
        });

        if (updatedProfile) {
          setProfileInfo({
            displayName: updatedProfile.full_name || "",
            email: updatedProfile.email || "",
          });
        }
        closeEditModal();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update profile";
        Alert.alert("Update failed", message);
      }
    } else if (activeEditModal === "contact") {
      try {
        const updatedContact = await updateEmergencyContact(userId, token, {
          contact_name: values.name,
          contact_email: values.email,
          relationship: values.relationship,
        });

        if (updatedContact) {
          setEmergencyContact({
            name: updatedContact.contact_name || "",
            relationship: updatedContact.relationship || "",
            email: updatedContact.contact_email || "",
          });
        }
        closeEditModal();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update emergency contact";
        Alert.alert("Update failed", message);
      }
    }
  };

  // Toggle push notifications
  const handleToggleNotifications = async () => {
    const newValue = !pushNotificationsEnabled;
    const { userId, token } = await getUserCredentials();
    
    if (!userId || !token) {
      Alert.alert("Error", "Please log in to update settings.");
      return;
    }

    try {
      await updateUserProfile(userId, token, { is_notify_enabled: newValue });
      setPushNotificationsEnabled(newValue);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update notifications";
      Alert.alert("Update failed", message);
    }
  };

  // Toggle risk alerts
  const handleToggleRiskAlerts = async () => {
    const newValue = !riskAlerts;
    const { userId, token } = await getUserCredentials();
    
    if (!userId || !token) {
      Alert.alert("Error", "Please log in to update settings.");
      return;
    }

    try {
      await updateUserProfile(userId, token, { is_risk_alert_enabled: newValue });
      setRiskAlerts(newValue);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update risk alerts";
      Alert.alert("Update failed", message);
    }
  };


  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#4093D6" />
        <Text className="mt-4 text-gray-600">Loading profile...</Text>
      </View>
    );
  }

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
            onPress={handleToggleNotifications}
          >
            <FontAwesome
              name={pushNotificationsEnabled ? "toggle-on" : "toggle-off"}
              size={38}
              color={pushNotificationsEnabled ? "#4093D6" : "#9CA3AF"}
            />
          </TouchableOpacity>
        </View>

        {/* Risk Alerts */}
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-800 font-semibold">Risk Alerts</Text>
            <Text className="text-gray-600 text-sm">High-risk pattern notifications</Text>
          </View>

          <TouchableOpacity onPress={handleToggleRiskAlerts}>
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
