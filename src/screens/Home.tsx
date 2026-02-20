import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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

const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://127.0.0.1:8000';

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
  const route = useRoute<RouteProp<BottomTabParamList, 'Home'>>();
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const unreadCount = useUnreadNotifications();
  const [riskValue, setRiskValue] = useState<number | undefined>(route.params?.riskValue);
  const [riskLevel, setRiskLevel] = useState<string | undefined>(route.params?.riskLevel);
  const [isLoadingRisk, setIsLoadingRisk] = useState(false);

  // Fetch latest risk result from API
  useEffect(() => {
    const fetchLatestRiskResult = async () => {
      try {
        setIsLoadingRisk(true);
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('authToken');

        if (!userId || !token) {
          console.log('No user ID or token found');
          // Try to load from AsyncStorage
          const storedRiskValue = await AsyncStorage.getItem('lastRiskValue');
          const storedRiskLevel = await AsyncStorage.getItem('lastRiskLevel');
          
          if (storedRiskValue !== null) {
            setRiskValue(parseFloat(storedRiskValue));
          }
          if (storedRiskLevel !== null) {
            setRiskLevel(storedRiskLevel);
          }
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
            
            // Save to AsyncStorage
            await AsyncStorage.setItem('lastRiskValue', data.risk_score.toString());
            await AsyncStorage.setItem('lastRiskLevel', data.risk_level);
          }
        } else {
          // If API call fails, try to load from AsyncStorage
          const storedRiskValue = await AsyncStorage.getItem('lastRiskValue');
          const storedRiskLevel = await AsyncStorage.getItem('lastRiskLevel');
          
          if (storedRiskValue !== null) {
            setRiskValue(parseFloat(storedRiskValue));
          }
          if (storedRiskLevel !== null) {
            setRiskLevel(storedRiskLevel);
          }
        }
      } catch (error) {
        console.error('Error fetching latest risk result:', error);
        // Try to load from AsyncStorage on error
        try {
          const storedRiskValue = await AsyncStorage.getItem('lastRiskValue');
          const storedRiskLevel = await AsyncStorage.getItem('lastRiskLevel');
          
          if (storedRiskValue !== null) {
            setRiskValue(parseFloat(storedRiskValue));
          }
          if (storedRiskLevel !== null) {
            setRiskLevel(storedRiskLevel);
          }
        } catch (err) {
          console.error('Error loading from AsyncStorage:', err);
        }
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
    setAffirmationIndex((prev) => (prev + 1) % affirmations.length);
  };

  const prevAffirmation = () => {
    setAffirmationIndex((prev) => (prev - 1 + affirmations.length) % affirmations.length);
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
                    "Complete your daily check-in to get personalized insights about your mental health."
                  )}
                </Text>
              </View>
              {riskLevel !== undefined && (
                <View className="flex-row gap-3 items-center">
                  <Text className="text-md">Depression Risk</Text>
                  <View className={`px-4 py-1 rounded-xl ${
                    riskLevel === 'Low' ? 'bg-green-600' :
                    riskLevel === 'Moderate' ? 'bg-yellow-600' :
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
              Try a 5-minutes breathing exercise. Research shows it can reduce anxiety up to 25% and improve focus.
            </Text>

          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
