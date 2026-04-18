import React, { useState, useEffect } from "react";
import { getApiBaseUrl } from "../config/api";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import type { BottomTabParamList } from '../navigation/BottomTabNavigator';
import Button from '../components/Button';
import { useUnreadNotifications } from '../hooks/useUnreadNotifications';
import { getRandomNudge } from '../utils/nudges';

const API_BASE_URL = getApiBaseUrl();

const allAffirmations = [
  "You are capable of amazing things. Every step forward is progress, no matter how small.",
  "You deserve care every day. With rest, movement, nourishment, and compassion, you lay the ground where confidence grows.",
  "Celebrate your small wins. Every healthy choice, boundary you protect, and moment you choose gentleness over criticism.",
  "When you listen with kindness, you make space for healing, learning, and the next small, caring step forward.",
  "You’re allowed to move at your own pace. Every breath, sip of water, and tiny action you take is a quiet vote for your well-being.",
  "Your worth is not defined by your productivity. Rest is a valid and necessary choice.",
  "You are allowed to feel whatever you are feeling. Your emotions are valid.",
  "Every day is a fresh start. You can always try again tomorrow, without judgment.",
  "You are stronger than the obstacles you are facing right now.",
  "Be gentle with yourself. True healing and personal growth take time.",
  "You do not have to have it all figured out right now. Take it one day at a time.",
  "Your presence brings light to the world, even on the days your light feels dim.",
  "It is okay to ask for support. Reaching out is a profound sign of courage.",
  "Trust your own journey. You are exactly where you need to be to learn and grow.",
  "You are worthy of the exact same love and kindness that you readily offer others.",
  "Focus on your own path. You are uniquely you, and comparing yourself steals your joy.",
  "Every slow, deep breath you take is a quiet moment of care for your body and mind.",
  "Your mistakes are just proof that you are trying and learning. Keep moving forward.",
  "You have survived 100% of your hardest days. You possess the resilience to get through this.",
  "Give yourself permission to pause and reset. The world will wait for you.",
  "Embrace your beautifully imperfect self. Striving for perfection is an illusion.",
  "You are planting seeds for a wonderful future. Trust the natural timing of your life.",
  "Your voice matters, your thoughts matter, your feelings matter, and you matter.",
  "Forgive yourself for what you didn't know before you learned it.",
  "You are entirely enough, just as you are right now, in this very moment.",
];

// Seeded random approach to get the same 5 quotes for any given day
const getDailyAffirmations = () => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Predictable pseudo-random generator
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  
  const shuffled = [...allAffirmations];
  let currentSeed = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random(currentSeed++) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, 5);
};

const Home: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<BottomTabParamList, 'Home'>>();
  const [dailyAffirmations, setDailyAffirmations] = useState<string[]>([]);
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  useEffect(() => {
    setDailyAffirmations(getDailyAffirmations());
  }, []);
  const unreadCount = useUnreadNotifications();
  const [riskValue, setRiskValue] = useState<number | undefined>(route.params?.riskValue);
  const [riskLevel, setRiskLevel] = useState<string | undefined>(route.params?.riskLevel);
  const [isLoadingRisk, setIsLoadingRisk] = useState(false);
  const [currentNudge, setCurrentNudge] = useState<string>("");

  useFocusEffect(
    React.useCallback(() => {
      const fetchNudge = async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          if (!userId) return;

          const savedNudge = await AsyncStorage.getItem(`lastNudge_${userId}`);
          if (savedNudge) {
            setCurrentNudge(savedNudge);
          } else {
            const newNudge = getRandomNudge(riskLevel);
            setCurrentNudge(newNudge);
            await AsyncStorage.setItem(`lastNudge_${userId}`, newNudge);
          }
        } catch (error) {
          console.error("Error fetching nudge", error);
        }
      };
      
      fetchNudge();
    }, [riskLevel])
  );

  // Fetch latest risk result from API
  useEffect(() => {
    const fetchLatestRiskResult = async () => {
      try {
        setIsLoadingRisk(true);
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('authToken');

        if (!userId || !token) {
          console.log('No user ID or token found');
          // Don't show cached data for unauthenticated users
          setRiskValue(undefined);
          setRiskLevel(undefined);
          setIsLoadingRisk(false);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/depression-risk-results/${userId}/latest`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.risk_score !== undefined && data.risk_level !== undefined) {
            setRiskValue(data.risk_score);
            setRiskLevel(data.risk_level);
            
            // Save to AsyncStorage with user validation
            await AsyncStorage.setItem('lastRiskValue', data.risk_score.toString());
            await AsyncStorage.setItem('lastRiskLevel', data.risk_level);
            await AsyncStorage.setItem('riskDataUserId', userId);
          } else {
            // No risk data available for this user
            setRiskValue(undefined);
            setRiskLevel(undefined);
          }
        } else {
          // API call failed or no data - don't show cached data for new users
          console.log('No risk data available from API');
          setRiskValue(undefined);
          setRiskLevel(undefined);
        }
      } catch (error) {
        console.error('Error fetching latest risk result:', error);
        // Don't show cached data on error - keep state clean for new users
        setRiskValue(undefined);
        setRiskLevel(undefined);
      } finally {
        setIsLoadingRisk(false);
      }
    };

    fetchLatestRiskResult();
  }, []);

  // Update risk values when received from route params (after completing test)
  useEffect(() => {
    const updateRiskFromParams = async () => {
      if (route.params?.riskValue !== undefined) {
        setRiskValue(route.params.riskValue);
        await AsyncStorage.setItem('lastRiskValue', route.params.riskValue.toString());
      }
      
      if (route.params?.riskLevel !== undefined) {
        setRiskLevel(route.params.riskLevel);
        await AsyncStorage.setItem('lastRiskLevel', route.params.riskLevel);
      }
    };

    updateRiskFromParams();
  }, [route.params?.riskValue, route.params?.riskLevel]);

  const nextAffirmation = () => {
    if (dailyAffirmations.length === 0) return;
    setAffirmationIndex((prev) => (prev + 1) % dailyAffirmations.length);
  };

  const prevAffirmation = () => {
    if (dailyAffirmations.length === 0) return;
    setAffirmationIndex((prev) => (prev - 1 + dailyAffirmations.length) % dailyAffirmations.length);
  };

  const handleStartCheckIn = () => {
    navigation.navigate('LogMood');
  };

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row items-center justify-between px-5 pb-3"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Image source={require('../assets/Logo_Long.png')} resizeMode="contain" />
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} className="relative">
          <Bell className="w-6 h-6" color="#4093d6" />
          {unreadCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-danger rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              <Text className="text-white text-xs font-bold">{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
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
              {dailyAffirmations[affirmationIndex] || ""}
            </Text>

            <View className="flex-row items-center justify-between">
              {/* Dots */}
              <View className="flex-row gap-1">
                {dailyAffirmations.map((_, idx) => (
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


          {/* AI Insights */}
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
                  {riskValue !== undefined ? (
                    riskValue <= 0.3 
                      ? `Based on your recent entries, you have a low depression risk of ${Math.round(riskValue * 100)}%. Keep up your positive habits and self-care practices.`
                      : riskValue <= 0.65
                      ? `Based on your recent entries, you have a moderate depression risk of ${Math.round(riskValue * 100)}%. Consider maintaining regular self-care and reaching out to friends or family.`
                      : `Based on your recent entries, you have a high depression risk of ${Math.round(riskValue * 100)}%. We strongly suggest you to take an appointment with a mental health professional.`
                  ) : (
                    "Take your first depression assessment test to receive your personalized risk analysis. You'll see your risk percentage (0-100%) and risk level (Low, Medium, or High) based on your responses, along with tailored recommendations for your mental wellness."
                  )}
                </Text>
              </View>
              {riskLevel !== undefined && (
                <View className="flex-row gap-3 items-center">
                  <Text className="text-md">Depression Risk</Text>
                  <View className={`px-4 py-1 rounded-xl ${
                    riskLevel === 'Low' ? 'bg-green-600' :
                    riskLevel === 'Medium' ? 'bg-yellow-600' :
                    'bg-danger'
                  }`}>
                    <Text className="text-white font-semibold text-md">
                      {riskLevel}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </Card>

          {/*  Today's Science-Based Nudges*/}
          <Card className="p-5 bg-paleGreen border border-green-300">
            <View className="flex-row items-start gap-2 mb-2">
              <Star className="w-5 h-5 mt-0.5" color="#D7BB0A" fill="#D7BB0A"/>
              <Text className="text-[#0c141b] text-lg font-semibold">
                Today's Nudge
              </Text>
            </View>

            <Text className="text-gray-800 text-lg mb-3">
              {currentNudge}
            </Text>

          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
