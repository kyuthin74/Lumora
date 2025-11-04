import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const Analysis: React.FC = () => {
  const weeklyData = [
    { day: 'Mon', mood: 8, color: 'bg-green-500' },
    { day: 'Tue', mood: 6, color: 'bg-yellow-500' },
    { day: 'Wed', mood: 7, color: 'bg-green-500' },
    { day: 'Thu', mood: 5, color: 'bg-orange-500' },
    { day: 'Fri', mood: 8, color: 'bg-green-500' },
    { day: 'Sat', mood: 9, color: 'bg-green-500' },
    { day: 'Sun', mood: 7, color: 'bg-green-500' },
  ];

  const insights = [
    {
      title: 'Mood Trend',
      description: 'Your mood has been improving over the past week!',
      icon: '📈',
      color: 'bg-green-100',
    },
    {
      title: 'Best Time',
      description: 'You tend to feel better in the mornings',
      icon: '🌅',
      color: 'bg-yellow-100',
    },
    {
      title: 'Activity Impact',
      description: 'Exercise days show higher mood scores',
      icon: '🏃',
      color: 'bg-blue-100',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 pt-12 pb-6">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Your Analysis
          </Text>
          <Text className="text-gray-600">
            Insights into your mental health journey
          </Text>
        </View>

        {/* Weekly Mood Chart */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Weekly Mood Trend
          </Text>
          <View className="flex-row items-end justify-between h-40 mb-4">
            {weeklyData.map((item, index) => (
              <View key={index} className="items-center flex-1">
                <View
                  className={`w-full rounded-t-lg ${item.color} mb-2`}
                  style={{ height: `${(item.mood / 10) * 100}%` }}
                />
                <Text className="text-xs text-gray-600 font-semibold">
                  {item.day}
                </Text>
                <Text className="text-xs text-gray-500">{item.mood}/10</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats Cards */}
        <View className="flex-row justify-between mb-6">
          <View className="bg-white rounded-xl p-4 flex-1 mr-3 shadow-sm items-center">
            <Text className="text-3xl font-bold text-purple-600 mb-1">7.1</Text>
            <Text className="text-gray-600 text-sm text-center">Average Mood</Text>
          </View>
          <View className="bg-white rounded-xl p-4 flex-1 ml-3 shadow-sm items-center">
            <Text className="text-3xl font-bold text-green-600 mb-1">5</Text>
            <Text className="text-gray-600 text-sm text-center">Good Days</Text>
          </View>
        </View>

        {/* Insights */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Insights</Text>
          {insights.map((insight, index) => (
            <View
              key={index}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center"
            >
              <View className={`w-12 h-12 ${insight.color} rounded-full items-center justify-center mr-4`}>
                <Text className="text-2xl">{insight.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 mb-1">
                  {insight.title}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {insight.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recommendations */}
        <View className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg">
          <Text className="text-white text-xl font-bold mb-2">
            Recommendations
          </Text>
          <Text className="text-white/90 text-base mb-4">
            Based on your patterns, we recommend:
          </Text>
          <View className="space-y-2">
            <Text className="text-white text-base">• Keep up your morning routine</Text>
            <Text className="text-white text-base">• Try meditation on anxious days</Text>
            <Text className="text-white text-base">• Continue logging your moods daily</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Analysis;
