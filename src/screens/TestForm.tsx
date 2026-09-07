import React, { useState } from 'react';
import { getApiBaseUrl } from "../config/api";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import RadioGroup from '../components/RadioGroup';
import ScaleSelector from '../components/ScaleSelector';
import YesNoToggle from '../components/YesNoToggle';
import Button from '../components/Button';
import { getDailyCheckInStorageKey, getLocalDateKey } from '../utils/dailyCheckIn';

const API_BASE_URL = getApiBaseUrl();

interface DailyRiskResult {
  date: string;
  risk_level: string;
  risk_score: number;
}

// Helper function to check if user has 7 consecutive days of high risk
const checkSevenDayHighRiskStreak = async (
  userId: string,
  token: string,
): Promise<boolean> => {
  try {
    // Fetch daily risk results for the last 7 days
    const response = await fetch(
      `${API_BASE_URL}/depression-risk-results/${userId}/daily?days=7`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch daily risk results');
      return false;
    }

    const data = await response.json();
    const dailyResults: DailyRiskResult[] = data.results || [];

    // Check if we have results for all 7 days
    if (dailyResults.length < 7) {
      return false;
    }

    // Check if all 7 days are "High" risk
    const allHighRisk = dailyResults.every(
      (result) => result.risk_level === 'High'
    );

    return allHighRisk;
  } catch (error) {
    console.error('Error checking 7-day high risk streak:', error);
    return false;
  }
};

// Function to send emergency alert email
const sendEmergencyAlert = async (
  userId: string,
  token: string,
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/emergency-alert/send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          alert_type: 'seven_day_high_risk',
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to send emergency alert:', errorData);
    } else {
      console.log('Emergency alert sent successfully');
    }
  } catch (error) {
    console.error('Error sending emergency alert:', error);
  }
};

const TestForm: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TestForm'>>();
  const { mood } = route.params;
  const [energy, setEnergy] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [sleepHours, setSleepHours] = useState<string | null>(null);
  const [appetite, setAppetite] = useState<string | null>(null);
  const [exerciseHours, setExerciseHours] = useState<string | null>(null);
  const [screenHours, setScreenHours] = useState<string | null>(null);
  const [studyHours, setStudyHours] = useState<string | null>(null);
  const [socializeAmount, setSocializeAmount] = useState<string | null>(null);
  const [concentration, setConcentration] = useState<string | null>(null);
  const [clarity, setClarity] = useState<string | null>(null);
  const [bothered, setBothered] = useState<boolean | null>(null);
  const [sleepiness, setSleepiness] = useState<string | null>(null);
  const [hopefulness, setHopefulness] = useState<string | null>(null);
  const [negativeThoughts, setNegativeThoughts] = useState<boolean | null>(
    null,
  );
  const [stressfulEvents, setStressfulEvents] = useState<boolean | null>(null);
  const [isDailyCheckInCompleted, setIsDailyCheckInCompleted] = useState(false);

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');

        if (!userId) {
          setIsDailyCheckInCompleted(false);
          return;
        }

        const savedDate = await AsyncStorage.getItem(getDailyCheckInStorageKey(userId));
        setIsDailyCheckInCompleted(savedDate === getLocalDateKey());
      } catch (error) {
        console.error('Error checking daily check-in status on test form:', error);
        setIsDailyCheckInCompleted(false);
      }
    };

    checkStatus();
  }, []);


  const handleSubmit = async () => {
    if (isDailyCheckInCompleted) {
      Alert.alert(
        'Already Completed',
        'You have already taken today\'s check-in. It will be available again after midnight.',
      );

      return;
    }
    setIsSubmitting(true);
    try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("authToken");

        if (!userId || !token) {
          Alert.alert(
            'Authentication Error',
            'Please log in again to continue.',
            [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
          );
          return;
        }

      const formData = {
        user_id: userId,
        mood: mood,
        sleep_hour: sleepHours || '',
        appetite: appetite || '',
        exercise: exerciseHours || '',
        screen_time: screenHours || '',
        academic_work: studyHours || '',
        socialize: socializeAmount || '',
        energy_level: energy || 0,
        trouble_concentrating: concentration || '',
        negative_thoughts: negativeThoughts ? 'Yes' : 'No',
        decision_making: clarity || '',
        bothered_things: bothered ? 'Yes' : 'No',
        stressful_events: stressfulEvents ? 'Yes' : 'No',
        sleepy_tired: sleepiness || '',
        future_hope: hopefulness || '',
      };

      const response = await fetch(
        // 'https://lumora-backend-6utw.onrender.com/predict_depression_risk/',
        `${API_BASE_URL}/depression-test`,
        {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        const riskLevel = data.risk_level;
        const riskValue = data.risk_score;
        const riskPercentage = Math.round(riskValue * 100);

        try {
          await AsyncStorage.setItem('latestDepressionPercent', riskPercentage.toString());
          if (userId) {
            await AsyncStorage.setItem(getDailyCheckInStorageKey(userId), getLocalDateKey());
          }
          setIsDailyCheckInCompleted(true);
        } catch (err) {
          console.error('Failed to save depression percent to AsyncStorage', err);
        }

        let notificationMessage = '';
        if (riskValue <= 0.3) {
          notificationMessage = `Based on your recent entries, you have a low depression risk of ${riskPercentage}%. Keep up your positive habits and self-care practices.`;
        } else if (riskValue <= 0.65) {
          notificationMessage = `Based on your recent entries, you have a moderate depression risk of ${riskPercentage}%. Consider maintaining regular self-care and reaching out to friends or family.`;
        } else {
          notificationMessage = `Based on your recent entries, you have a high depression risk of ${riskPercentage}%. We strongly suggest you to take an appointment with a mental health professional.`;
        }

        // Create notification for depression test result
        try {
          await fetch(`${API_BASE_URL}/notifications/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              type: "result",
              title: "Depression Test Result",
              message: notificationMessage,
            }),
          });
        } catch (err) {
          console.error("Failed to create notification", err);
        }
        
        // Check for 7 consecutive days of high risk and send alert if needed
        try {
          const hasSevenDayStreak = await checkSevenDayHighRiskStreak(userId, token);
          
          if (hasSevenDayStreak) {
            console.log('Detected 7 consecutive days of high risk - sending emergency alert');
            await sendEmergencyAlert(userId, token);
          }
        } catch (err) {
          console.error('Error checking/sending emergency alert:', err);
        }
        
        navigation.replace('Nudge', { riskLevel, riskValue });
      } else {
        console.error('Error submitting form:', data);
        console.error('Response status:', response.status);
        console.error('Response full data:', JSON.stringify(data, null, 2));
        
        // Handle authentication errors specifically
        if (response.status === 401 || response.status === 403) {
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please log in again.',
            [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
          );
        } else {
          Alert.alert(
            'Submission Error',
            data.detail || data.message || 'Failed to submit test. Please try again.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      Alert.alert(
        'Network Error',
        'Unable to connect to server. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  type Step =
    | {
        id: string;
        type: 'select';
        question: string;
        options: string[];
        value: string | null;
        onSelect: (v: string) => void;
      }
    | {
        id: string;
        type: 'scale';
        question: string;
        minLabel: string;
        maxLabel: string;
        value: number | null;
        onSelect: (v: number) => void;
      }
    | {
        id: string;
        type: 'yesno';
        question: string;
        value: boolean | null;
        onSelect: (v: boolean) => void;
      };

  const steps: Step[] = [
    {
      id: 'sleepHours',
      type: 'select',
      question: 'How many hours did you sleep last night?',
      options: ['Less than 4 hours', '4-5 hours', '6-7 hours', '8 or more hours'],
      value: sleepHours,
      onSelect: setSleepHours,
    },
    {
      id: 'appetite',
      type: 'select',
      question: 'How is your appetite today?',
      options: ['Less than usual', 'Usual', 'More than usual'],
      value: appetite,
      onSelect: setAppetite,
    },
    {
      id: 'exerciseHours',
      type: 'select',
      question:
        'How many hours did you spend doing physical activity or exercise today?',
      options: [
        'None',
        'Less than 30 minutes',
        '30 - 60 minutes',
        'More than 60 minutes',
      ],
      value: exerciseHours,
      onSelect: setExerciseHours,
    },
    {
      id: 'screenHours',
      type: 'select',
      question: 'How many hours did you spend on screens (phone, computer, TV)?',
      options: ['Less than 2 hours', '2-4 hours', '5-7 hours', '7 or more hours'],
      value: screenHours,
      onSelect: setScreenHours,
    },
    {
      id: 'studyHours',
      type: 'select',
      question: 'How many hours did you spend on academic work?',
      options: ['Less than 4 hours', '4 - 5 hours', '6 - 7 hours', '8 or more hours'],
      value: studyHours,
      onSelect: setStudyHours,
    },
    {
      id: 'socializeAmount',
      type: 'select',
      question: 'How much did you socialize today?',
      options: ['Very little', 'Moderate', 'High', 'Very high'],
      value: socializeAmount,
      onSelect: setSocializeAmount,
    },
    {
      id: 'energy',
      type: 'scale',
      question: 'How was your energy level today?',
      minLabel: 'Very Low',
      maxLabel: 'Very High',
      value: energy,
      onSelect: setEnergy,
    },
    {
      id: 'concentration',
      type: 'select',
      question: 'How much have you had trouble concentrating on daily activities?',
      options: ['Not at all', 'Several times a day', 'Half of the day', 'All day'],
      value: concentration,
      onSelect: setConcentration,
    },
    {
      id: 'negativeThoughts',
      type: 'yesno',
      question: 'Did you have any negative thoughts about yourself today?',
      value: negativeThoughts,
      onSelect: setNegativeThoughts,
    },
    {
      id: 'clarity',
      type: 'select',
      question: 'How clear was your thinking and decision-making today?',
      options: ['Clear', 'Normal', 'A little foggy', 'Foggy'],
      value: clarity,
      onSelect: setClarity,
    },
    {
      id: 'bothered',
      type: 'yesno',
      question:
        "Did you feel bothered by things that normally wouldn't bother you today?",
      value: bothered,
      onSelect: setBothered,
    },
    {
      id: 'stressfulEvents',
      type: 'yesno',
      question: 'Did you experience any stressful events today?',
      value: stressfulEvents,
      onSelect: setStressfulEvents,
    },
    {
      id: 'sleepiness',
      type: 'select',
      question: 'How sleepy or tired did you feel during the day?',
      options: ['Not at all', 'A little', 'Moderately', 'Very sleepy or tired'],
      value: sleepiness,
      onSelect: setSleepiness,
    },
    {
      id: 'hopefulness',
      type: 'select',
      question: 'How hopeful did you feel about the future today?',
      options: ['Very hopeful', 'Somewhat hopeful', 'Not very hopeful', 'No hope at all'],
      value: hopefulness,
      onSelect: setHopefulness,
    },
  ];

  const totalSteps = steps.length;
  const currentQuestion = steps[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const isCurrentAnswered = currentQuestion.value !== null;

  const goToPreviousStep = () => {
    if (currentStep === 0) {
      navigation.navigate('LogMood');
    } else {
      setCurrentStep((s) => s - 1);
    }
  };

  const goToNextStep = () => {
    if (!isCurrentAnswered) return;
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header + Progress */}
      <View className="px-6 pb-4 pt-6">
        <TouchableOpacity
          onPress={goToPreviousStep}
          className="mb-4 flex-row items-center"
        >
          <ArrowLeft size={24} color="#4B5563" />
          <Text className="ml-2 text-lg text-gray-700">Back</Text>
        </TouchableOpacity>

        <Text className="mb-2 text-sm font-medium text-gray-500">
          Question {currentStep + 1} of {totalSteps}
        </Text>
        <View className="h-2 overflow-hidden rounded-full bg-gray-200">
          <View
            className="h-2 rounded-full bg-primary"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="mt-2 rounded-3xl border border-gray-100 bg-white p-6"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.18,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text className="mb-6 text-xl font-bold text-gray-800">
            {currentQuestion.question}
          </Text>

          {currentQuestion.type === 'select' && (
            <RadioGroup
              options={currentQuestion.options}
              value={currentQuestion.value}
              onSelect={currentQuestion.onSelect}
            />
          )}

          {currentQuestion.type === 'scale' && (
            <ScaleSelector
              value={currentQuestion.value ?? 0}
              onChange={currentQuestion.onSelect}
              minLabel={currentQuestion.minLabel}
              maxLabel={currentQuestion.maxLabel}
            />
          )}

          {currentQuestion.type === 'yesno' && (
            <YesNoToggle
              value={currentQuestion.value}
              onChange={currentQuestion.onSelect}
            />
          )}
        </View>

        {/* NEXT / SUBMIT */}
        <View className="mt-6">
          <Button
            disabled={
              !isCurrentAnswered ||
              (isLastStep && (isSubmitting || isDailyCheckInCompleted))
            }
            title={
              isLastStep
                ? isDailyCheckInCompleted
                  ? 'Completed'
                  : isSubmitting
                  ? 'Submitting...'
                  : 'Submit'
                : 'Next'
            }
            onPress={goToNextStep}
            variant="primary"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default TestForm;
