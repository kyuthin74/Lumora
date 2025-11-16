import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Brain,
  Bell,
  Star
} from "lucide-react-native";
import type { RootStackParamList } from '../navigation/AppNavigator';
import Button from '../components/Button';

const affirmations = [
  "You are capable of amazing things. Every step forward is progress, no matter how small.",
  "You deserve care every day. With rest, movement, nourishment, and compassion, you lay the ground where confidence grows.",
  "Celebrate your small wins. Every healthy choice, boundary you protect, and moment you choose gentleness over criticism.",
  "When you listen with kindness, you make space for healing, learning, and the next small, caring step forward.",
  "You’re allowed to move at your own pace. Every breath, sip of water, and tiny action you take is a quiet vote for your well-being.",
];

const Home: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  const nextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % affirmations.length);
  };

  const prevAffirmation = () => {
    setAffirmationIndex((prev) => (prev - 1 + affirmations.length) % affirmations.length);
  };

  const handleStartCheckIn = () => {
    navigation.navigate('TestForm');
  };

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row items-center justify-between px-5 pb-3"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Image source={require('../assets/Logo_Long.png')} resizeMode="contain" />
        <Bell className="w-6 h-6" color="#4093d6" />
      </View>
      <ScrollView
        contentContainerClassName="px-5 pb-12 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col gap-4">
          {/* Daily Affirmation */}
          <Card className="bg-primary text-white p-6 border-0">
            <View className="flex-row items-start gap-2 mb-3">
              <Sparkles className="w-5 h-5 mt-1" color="#ffffff" />
              <Text className="text-white text-lg font-semibold">
                Daily Affirmation
              </Text>
            </View>

            <Text className="text-white/95 text-lg mb-2 min-h-[80px]">
              {affirmations[affirmationIndex]}
            </Text>

            <View className="flex-row items-center justify-between">
              {/* Dots */}
              <View className="flex-row gap-1">
                {affirmations.map((_, idx) => (
                  <View
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${idx === affirmationIndex
                      ? "bg-white w-6"
                      : "bg-white/40 w-1.5"
                      }`}
                  />
                ))}
              </View>

              {/* Prev / Next buttons */}
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={prevAffirmation}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                  activeOpacity={0.7}
                >
                  <ChevronLeft className="w-4 h-4" color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={nextAffirmation}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                  activeOpacity={0.7}
                >
                  <ChevronRight className="w-4 h-4" color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Daily Check-in Button */}
          <View className="flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white p-5">
            <View className="flex-1 pr-4">
              <Text className="text-lg font-semibold text-gray-900">
                Daily Depression Check-In
              </Text>
              <Text className="mt-1 text-sm text-gray-600">
                Check your risk level today and receive a personalized nudge.
              </Text>
            </View>
            <Button
              title="Start"
              onPress={handleStartCheckIn}
              variant="short"
            />
          </View>


          {/* Today's Science-Based Nudges */}
          <Card className="p-5 bg-primary-100 border border-primary">
            <View className="flex-row items-start gap-2 mb-2">
              <Brain className="w-5 h-5 mt-0.5" color="#4093d6" />
              <Text className="text-[#0c141b] text-lg font-semibold">
                AI Insights
              </Text>
            </View>

            <View className="flex gap-4 px-2">
              <View>
                <Text className="text-gray-800 text-lg">
                  Based on your recent entries, you will likely be at depression risk 70%. We suggest you to take an appointment with a mental health doctor.                </Text>
              </View>
              <View className="flex-row gap-3 items-center">
                <Text className="text-md ">Depression Risk
                </Text>
                <View className="bg-danger px-4 py-1 rounded-xl">
                  <Text className="text-white font-semibold text-md"> High </Text>
                </View>
              </View>
            </View>
          </Card>

          {/* AI Insights */}
          <Card className="p-5 bg-paleGreen border border-green-300">
            <View className="flex-row items-start gap-2 mb-2">
              <Star className="w-5 h-5 mt-0.5" color="#D7BB0A" fill="#D7BB0A"/>
              <Text className="text-[#0c141b] text-lg font-semibold">
                Today's Nudge
              </Text>
            </View>

            <Text className="text-gray-800 text-lg mb-3">
              Try a 5-minutes breathing exercise. Research shows it can reduce anxiety up to 25% and improve focus.
            </Text>

          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
