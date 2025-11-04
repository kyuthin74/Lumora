import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

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
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Navigate to Login screen using the composite navigation
            (navigation as any).navigate('Login');
          },
        },
      ]
    );
  };

  const menuItems = [
    { icon: '👤', title: 'Edit Profile', onPress: () => Alert.alert('Coming Soon') },
    { icon: '🔔', title: 'Notifications', onPress: () => Alert.alert('Coming Soon') },
    { icon: '🔒', title: 'Privacy & Security', onPress: () => Alert.alert('Coming Soon') },
    { icon: '💬', title: 'Help & Support', onPress: () => Alert.alert('Coming Soon') },
    { icon: 'ℹ️', title: 'About', onPress: () => Alert.alert('Coming Soon') },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 pt-12 pb-6">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-purple-600 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            John Doe
          </Text>
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
          onPress={handleLogout}
        >
          <Text className="text-center text-red-600 font-semibold text-base">
            Logout
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-400 text-sm">
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

export default Profile;
