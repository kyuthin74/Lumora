import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Brain,
  Bell
} from "lucide-react-native";

const affirmations = [
  "You are capable of amazing things. Every step forward is progress, no matter how small.",
  "Your feelings are valid. It's okay to not be okay sometimes.",
  "Today is a new opportunity to grow and learn. Embrace it with an open heart.",
  "You are stronger than you think. You've overcome challenges before, and you will again.",
  "Be kind to yourself today. You deserve the same compassion you give to others.",
  "Your mental health matters. Taking time for yourself is not selfish, it's necessary.",
];

type HomePageProps = {
  onNavigate: (page: string) => void;
};

export function HomePage({ }: HomePageProps) {
  const insets = useSafeAreaInsets();
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  const nextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % affirmations.length);
  };

  const prevAffirmation = () => {
    setAffirmationIndex((prev) => (prev - 1 + affirmations.length) % affirmations.length);
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
              <Text className="text-white text-base font-semibold">
                Daily Affirmation
              </Text>
            </View>

            <Text className="text-white/95 mb-4 min-h-[80px]">
              {affirmations[affirmationIndex]}
            </Text>

            <View className="flex-row items-center justify-between">
              {/* Dots */}
              <View className="flex-row gap-1">
                {affirmations.map((_, idx) => (
                  <View
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === affirmationIndex
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
          <TouchableOpacity
            className="w-full h-14 bg-[#4093d6] hover:bg-[#3682c5] flex-row items-center justify-center rounded-xl"
            activeOpacity={0.8}
          >
            <Heart className="w-5 h-5 mr-2" color="#ffffff" />
            <Text className="text-white text-base font-medium">
              Daily Mood Check-In
            </Text>
          </TouchableOpacity>

          {/* Today's Science-Based Nudges */}
          <Card className="p-5">
            <View className="flex-row items-start gap-2 mb-3">
              <Brain className="w-5 h-5 mt-0.5" color="#4093d6" />
              <Text className="text-[#0c141b] text-base font-semibold">
                Today's Science-Based Nudges
              </Text>
            </View>

            <View className="space-y-3">
              <View className="flex-row gap-3">
                <View className="w-2 h-2 rounded-full bg-[#4093d6] mt-2" />
                <Text className="text-[#5a6b7a] flex-1">
                  Take a 5-minute break every hour to reduce stress and improve focus.
                </Text>
              </View>

              <View className="flex-row gap-3">
                <View className="w-2 h-2 rounded-full bg-[#4093d6] mt-2" />
                <Text className="text-[#5a6b7a] flex-1">
                  Practice deep breathing: Inhale for 4 counts, hold for 4, exhale for 4.
                </Text>
              </View>

              <View className="flex-row gap-3">
                <View className="w-2 h-2 rounded-full bg-[#4093d6] mt-2" />
                <Text className="text-[#5a6b7a] flex-1">
                  Spend 10 minutes outdoors to boost mood and vitamin D levels.
                </Text>
              </View>
            </View>
          </Card>

          {/* AI Insights */}
          <Card className="p-5 bg-gradient-to-br from-[#8dc4f1]/20 to-[#47a9f6]/20 border border-[#4093d6]/30">
            <View className="flex-row items-start gap-2 mb-3">
              <Sparkles className="w-5 h-5 mt-0.5" color="#4093d6" />
              <Text className="text-[#0c141b] text-base font-semibold">
                AI Insights
              </Text>
            </View>

            <Text className="text-[#0c141b] mb-3">
              Based on your recent entries, you tend to feel more energized in the mornings.
              Consider scheduling important tasks before noon for optimal productivity.
            </Text>

            <Text className="text-[#5a6b7a]">
              You've logged 5 consecutive days this week! Keep up the great work. 🎉
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

export default HomePage;
