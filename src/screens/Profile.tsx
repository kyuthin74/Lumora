import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ConfirmModal from '../components/ConfirmModal';

type ProfileTabParamList = {
  Home: undefined;
  Mood: undefined;
  Analysis: undefined;
  Chatbot: undefined;
  Profile: undefined;
};

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<ProfileTabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const Profile: React.FC<Props> = ({ navigation }) => {
  const [showLogout, setShowLogout] = useState(false);
  const [showDeleteAcc, setShowDeleteAcc] = useState(false);

  const menuItems = [
    { icon: '👤', title: 'Edit Profile', onPress: () => {} },
    { icon: '🔔', title: 'Notifications', onPress: () => {} },
    { icon: '🔒', title: 'Privacy & Security', onPress: () => {} },
    { icon: '💬', title: 'Help & Support', onPress: () => {} },
    { icon: 'ℹ️', title: 'About', onPress: () => {} },
  ];

  const handleLogoutConfirm = () => {
    setShowLogout(false);
    navigation.navigate('Login');
  };

  const handleDeleteConfirm = () => {
    setShowDeleteAcc(false);
    navigation.navigate('AccountRemoved');
  };

  return (
    <>
      {/* LOGOUT MODAL */}
      <ConfirmModal
        visible={showLogout}
        title="Logout"
        message="Are you sure you want to log out?"
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogoutConfirm}
      />

      {/* DELETE ACCOUNT MODAL */}
      <ConfirmModal
        visible={showDeleteAcc}
        title="Delete Account"
        message="Are you sure you want to delete your account?"
        subMessage="Deleting your account will remove all of your information from our database. This cannot be undone."
        onCancel={() => setShowDeleteAcc(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* MAIN PAGE */}
      <ScrollView className="flex-1 bg-gray-50">
        <View className="px-6 pt-12 pb-6">
          {/* Profile Header */}
          <View className="items-center mb-8">
            <View className="w-24 h-24 bg-purple-600 rounded-full items-center justify-center mb-4">
              <Text className="text-4xl">👤</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-1">John Doe</Text>
            <Text className="text-gray-600">john.doe@example.com</Text>
          </View>

          {/* Stats */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-bold text-gray-800 mb-4">Your Stats</Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-3xl font-bold text-purple-600 mb-1">45</Text>
                <Text className="text-gray-600 text-sm">Days Active</Text>
              </View>
              <View className="w-px bg-gray-200 mx-4" />
              <View className="items-center flex-1">
                <Text className="text-3xl font-bold text-pink-600 mb-1">120</Text>
                <Text className="text-gray-600 text-sm">Moods Logged</Text>
              </View>
              <View className="w-px bg-gray-200 mx-4" />
              <View className="items-center flex-1">
                <Text className="text-3xl font-bold text-green-600 mb-1">7.2</Text>
                <Text className="text-gray-600 text-sm">Avg Mood</Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View className="mb-6">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center"
                onPress={item.onPress}
              >
                <Text className="text-2xl mr-4">{item.icon}</Text>
                <Text className="flex-1 text-base font-semibold text-gray-800">
                  {item.title}
                </Text>
                <Text className="text-gray-400">›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="bg-red-50 rounded-xl p-4 mb-4 border border-red-200"
            onPress={() => setShowLogout(true)}
          >
            <Text className="text-center text-red-600 font-semibold text-base">
              Logout
            </Text>
          </TouchableOpacity>

          {/* Delete Account */}
          <TouchableOpacity
            className="bg-red-50 rounded-xl p-4 mb-4 border border-red-200"
            onPress={() => setShowDeleteAcc(true)}
          >
            <Text className="text-center text-red-600 font-semibold text-base">
              Delete Account
            </Text>
          </TouchableOpacity>

          <Text className="text-center text-gray-400 text-sm">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default Profile;
