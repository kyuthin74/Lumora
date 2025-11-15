import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

interface Props {
  navigation: SignUpScreenNavigationProp;
}
const Home: React.FC<Props> = ({navigation}) => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 pt-12 pb-6">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back! 👋
          </Text>
          <Text className="text-gray-600">
            How are you feeling today?
          </Text>
        </View>

        {/* Mood Card */}
        <TouchableOpacity className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 mb-6 shadow-lg">
          <Text className="text-white text-xl font-bold mb-2">
            Track Your Mood
          </Text>
          <Text className="text-white/90 text-base mb-4">
            Log how you're feeling right now
          </Text>
          <View className="bg-white/20 rounded-xl px-4 py-2 self-start">
            <Text className="text-white font-semibold">Log Mood →</Text>
          </View>
        </TouchableOpacity>

        {/* Take depression risk test */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center">
            {/* Text Card */}
              <View className="bg-white rounded-xl p-4 flex-1 mr-3 shadow-sm">
                <Text className="text-2xl font-bold text-gray-700 mb-1">
                  Daily Depression Risk Test
                </Text>
                <Text className="text-gray-600 text-sm">
                  Check your depression risk for today and receive personalized nudge.
                </Text>
              </View>

              {/* Start Button */}
              <TouchableOpacity
                className="bg-blue-500 px-4 py-3 rounded-xl"
                onPress={() => navigation.navigate("LogMood")}
              >
                <Text className="text-white font-semibold">Start</Text>
              </TouchableOpacity>
          </View>
        </View>


        {/* Quick Stats */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Quick Stats</Text>
          <View className="flex-row justify-between">
            <View className="bg-white rounded-xl p-4 flex-1 mr-3 shadow-sm">
              <Text className="text-2xl font-bold text-purple-600 mb-1">7</Text>
              <Text className="text-gray-600 text-sm">Days Streak</Text>
            </View>
            <View className="bg-white rounded-xl p-4 flex-1 ml-3 shadow-sm">
              <Text className="text-2xl font-bold text-pink-600 mb-1">12</Text>
              <Text className="text-gray-600 text-sm">Moods Logged</Text>
            </View>
          </View>
        </View>

        {/* Activities */}
        <View>
          <Text className="text-xl font-bold text-gray-800 mb-4">Today's Activities</Text>
          <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center">
            <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">💭</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800 mb-1">Mindfulness Exercise</Text>
              <Text className="text-gray-600 text-sm">5 minutes meditation</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center">
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">📝</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800 mb-1">Journal Entry</Text>
              <Text className="text-gray-600 text-sm">Reflect on your day</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-xl p-4 shadow-sm flex-row items-center">
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">📊</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800 mb-1">View Analysis</Text>
              <Text className="text-gray-600 text-sm">Check your progress</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
