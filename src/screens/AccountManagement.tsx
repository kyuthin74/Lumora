import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OutButton from "../components/OutButton";
import { ArrowLeft } from "lucide-react-native";
import ConfirmModal from "../components/ConfirmModal";

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

const AccountManagement = ({ navigation }) => {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Delete user account API call
  const deleteUserAccount = useCallback(async (userId: string, token: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/`, {
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

  const handleLogoutConfirm = async () => {
    setLogoutModalVisible(false);
    // Clear all cached data on logout
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('lastRiskValue');
      await AsyncStorage.removeItem('lastRiskLevel');
      await AsyncStorage.removeItem('riskDataUserId');
    } catch (err) {
      console.error('Error clearing AsyncStorage on logout:', err);
    }
    navigation.navigate("Login");
  };

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
      navigation.navigate("AccountRemoved");
    } catch (error) {
      setDeleteModalVisible(false);
      const message = error instanceof Error ? error.message : "Failed to delete account";
      Alert.alert("Delete failed", message);
    }
  };

  return (
    <View className="flex-1 bg-background px-6 pt-12">
      {/* Back Arrow */}
      <TouchableOpacity
        onPress={() => navigation.navigate("MainTabs", { screen: "Profile" })}
        className="flex-row items-center mb-2 pt-6"
      >
        <ArrowLeft size={24} color="#4B5563" />
        <Text className="text-gray-700 text-lg ml-2">Back</Text>
      </TouchableOpacity>
      <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">Account Management</Text>
      <OutButton
        label="Logout"
        icon="log-out-outline"
        onPress={() => setLogoutModalVisible(true)}
      />
      <View className="mt-6">
        <OutButton
          label="Delete Account"
          icon="trash-outline"
          type="danger"
          onPress={() => setDeleteModalVisible(true)}
        />
      </View>

      {/* Confirm Modals */}
      <ConfirmModal
        visible={logoutModalVisible}
        title="Log out"
        message="Are you sure you want to log out?"
        onCancel={() => setLogoutModalVisible(false)}
        onConfirm={handleLogoutConfirm}
      />
      <ConfirmModal
        visible={deleteModalVisible}
        title="Delete account"
        message="Are you sure you want to delete your account?"
        subMessage="Deleting your account will remove all of your information from our database. This cannot be undone."
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
};

export default AccountManagement;
