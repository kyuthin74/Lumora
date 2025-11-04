import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';

const Mood: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const moods = [
    { emoji: '😊', label: 'Happy', color: 'bg-yellow-100' },
    { emoji: '😢', label: 'Sad', color: 'bg-blue-100' },
    { emoji: '😰', label: 'Anxious', color: 'bg-orange-100' },
    { emoji: '😴', label: 'Tired', color: 'bg-gray-100' },
    { emoji: '😡', label: 'Angry', color: 'bg-red-100' },
    { emoji: '😌', label: 'Calm', color: 'bg-green-100' },
    { emoji: '😟', label: 'Worried', color: 'bg-purple-100' },
    { emoji: '😄', label: 'Excited', color: 'bg-pink-100' },
  ];

  const handleSaveMood = () => {
    if (!selectedMood) {
      Alert.alert('Error', 'Please select a mood');
      return;
    }
    Alert.alert('Success', 'Mood logged successfully!', [
      {
        text: 'OK',
        onPress: () => {
          setSelectedMood(null);
          setNote('');
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 pt-12 pb-6">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            How are you feeling?
          </Text>
          <Text className="text-gray-600">
            Select the mood that best describes how you feel right now
          </Text>
        </View>

        {/* Mood Selection */}
        <View className="mb-6">
          <View className="flex-row flex-wrap justify-between">
            {moods.map((mood, index) => (
              <TouchableOpacity
                key={index}
                className={`w-[22%] aspect-square rounded-2xl items-center justify-center mb-4 ${
                  selectedMood === mood.emoji
                    ? `${mood.color} border-2 border-purple-600`
                    : 'bg-white border border-gray-200'
                }`}
                onPress={() => setSelectedMood(mood.emoji)}
              >
                <Text className="text-4xl mb-2">{mood.emoji}</Text>
                <Text className={`text-xs font-semibold ${
                  selectedMood === mood.emoji ? 'text-purple-600' : 'text-gray-600'
                }`}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Note Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Add a note (optional)
          </Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-4 border border-gray-200 text-base min-h-[120px]"
            placeholder="What's on your mind? What might have influenced your mood today?"
            placeholderTextColor="#9CA3AF"
            value={note}
            onChangeText={setNote}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className={`rounded-xl py-4 shadow-lg ${
            selectedMood
              ? 'bg-purple-600'
              : 'bg-gray-300'
          }`}
          onPress={handleSaveMood}
          disabled={!selectedMood}
        >
          <Text className={`text-center text-lg font-semibold ${
            selectedMood ? 'text-white' : 'text-gray-500'
          }`}>
            Save Mood
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Mood;
