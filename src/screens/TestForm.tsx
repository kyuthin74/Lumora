import React, { useState } from 'react';
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

import SelectField from '../components/SelectField';
import ScaleSelector from '../components/ScaleSelector';
import YesNoToggle from '../components/YesNoToggle';
import Button from '../components/Button';

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000"
    : "http://127.0.0.1:8000";

const TestForm: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TestForm'>>();
  const { mood } = route.params;
  const [energy, setEnergy] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  const handleBack = () => navigation.navigate('LogMood');

  const handleSubmit = async () => {
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
              message: data.message || "Your latest assessment shows low risk.",
            }),
          });
        } catch (err) {
          console.error("Failed to create notification", err);
        }
        navigation.navigate('Nudge', { riskLevel, riskValue });
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

  return (
    <ScrollView
      className="mb-12 flex-1 bg-gray-50 px-6 pt-6"
      nestedScrollEnabled={true}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={handleBack}
        className="mb-2 mt-6 flex-row items-center"
      >
        <ArrowLeft size={24} color="#4B5563" />
        <Text className="ml-2 text-lg text-gray-700">Back</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text className="mb-2 text-center text-2xl font-bold text-gray-800">
        Log Your Mood
      </Text>
      <Text className="mb-6 text-center text-gray-600">
        Select your current mood and share your thoughts
      </Text>

      {/* FORM FIELDS - each SelectField receives value/options/onSelect */}
      <SelectField
        label="How many hours did you sleep last night?"
        value={sleepHours}
        options={[
          'Less than 4 hours',
          '4-5 hours',
          '6-7 hours',
          '8 or more hours',
        ]}
        onSelect={setSleepHours}
        isOpen={openDropdown === 'sleepHours'}
        onToggle={() =>
          setOpenDropdown(openDropdown === 'sleepHours' ? null : 'sleepHours')
        }
      />

      <SelectField
        label="How is your appetite today?"
        value={appetite}
        options={['Less than usual', 'Usual', 'More than usual']}
        onSelect={setAppetite}
        isOpen={openDropdown === 'appetite'}
        onToggle={() =>
          setOpenDropdown(openDropdown === 'appetite' ? null : 'appetite')
        }
      />

      <SelectField
        label="How many hours did you spend doing physical activity or exercise today?"
        value={exerciseHours}
        options={[
          'None',
          'Less than 30 minutes',
          '30 - 60 minutes',
          'More than 60 minutes',
        ]}
        onSelect={setExerciseHours}
        dropdownOffset={100}
        isOpen={openDropdown === 'exerciseHours'}
        onToggle={() =>
          setOpenDropdown(
            openDropdown === 'exerciseHours' ? null : 'exerciseHours',
          )
        }
      />

      <SelectField
        label="How many hours did you spend on screens (phone, computer, TV)?"
        value={screenHours}
        options={[
          'Less than 2 hours',
          '2-4 hours',
          '5-7 hours',
          '7 or more hours',
        ]}
        onSelect={setScreenHours}
        dropdownOffset={100}
        isOpen={openDropdown === 'screenHours'}
        onToggle={() =>
          setOpenDropdown(openDropdown === 'screenHours' ? null : 'screenHours')
        }
      />

      <SelectField
        label="How many hours did you spend on academic work?"
        value={studyHours}
        options={[
          'Less than 4 hours',
          '4 - 5 hours',
          '6 - 7 hours',
          '8 or more hours',
        ]}
        onSelect={setStudyHours}
        dropdownOffset={100}
        isOpen={openDropdown === 'studyHours'}
        onToggle={() =>
          setOpenDropdown(openDropdown === 'studyHours' ? null : 'studyHours')
        }
      />

      <SelectField
        label="How much did you socialize today?"
        value={socializeAmount}
        options={['Very little', 'Moderate', 'High', 'Very high']}
        onSelect={setSocializeAmount}
        isOpen={openDropdown === 'socializeAmount'}
        onToggle={() =>
          setOpenDropdown(
            openDropdown === 'socializeAmount' ? null : 'socializeAmount',
          )
        }
      />

      {/* SCALE SELECTOR */}
      <Text className="mb-3 mt-2 text-base font-semibold text-gray-700">
        How was your energy level today?
      </Text>
      <ScaleSelector
        value={energy!}
        onChange={setEnergy}
        minLabel="Very Low"
        maxLabel="Very High"
      />

      <SelectField
        label="How much have you had trouble concentrating on daily activities?"
        value={concentration}
        options={[
          'Not at all',
          'Several times a day',
          'Half of the day',
          'All day',
        ]}
        onSelect={setConcentration}
        dropdownOffset={100}
        isOpen={openDropdown === 'concentration'}
        onToggle={() =>
          setOpenDropdown(
            openDropdown === 'concentration' ? null : 'concentration',
          )
        }
      />

      {/* YES / NO */}
      <View className="mb-3 mt-3">
        <Text className="mb-3 mt-2 text-base  font-semibold text-gray-700">
          Did you have any negative thoughts about yourself today?
        </Text>
        <YesNoToggle value={negativeThoughts} onChange={setNegativeThoughts} />
      </View>

      <SelectField
        label="How clear was your thinking and decision-making today?"
        value={clarity}
        options={['Clear', 'Normal', 'A little foggy', 'Foggy']}
        onSelect={setClarity}
        dropdownOffset={100}
        isOpen={openDropdown === 'clarity'}
        onToggle={() =>
          setOpenDropdown(openDropdown === 'clarity' ? null : 'clarity')
        }
      />

      {/* YES / NO */}
      <View className="mb-3 mt-3">
        <Text className="mb-3 mt-2 text-base  font-semibold text-gray-700">
          Did you feel bothered by things that normally wouldn't bother you
          today?
        </Text>
        <YesNoToggle value={bothered} onChange={setBothered} />
      </View>

      <View className="mb-3 mt-3">
        <Text className="mb-3 mt-2 text-base  font-semibold text-gray-700">
          Did you experience any stressful events today?
        </Text>
        <YesNoToggle value={stressfulEvents} onChange={setStressfulEvents} />
      </View>

      <SelectField
        label="How sleepy or tired did you feel during the day?"
        value={sleepiness}
        options={[
          'Not at all',
          'A little',
          'Moderately',
          'Very sleepy or tired',
        ]}
        onSelect={setSleepiness}
        isOpen={openDropdown === 'sleepiness'}
        onToggle={() =>
          setOpenDropdown(openDropdown === 'sleepiness' ? null : 'sleepiness')
        }
      />

      <SelectField
        label="How hopeful did you feel about the future today?"
        value={hopefulness}
        options={[
          'Very hopeful',
          'Somewhat hopeful',
          'Not very hopeful',
          'No hope at all',
        ]}
        onSelect={setHopefulness}
        isOpen={openDropdown === 'hopefulness'}
        onToggle={() =>
          setOpenDropdown(openDropdown === 'hopefulness' ? null : 'hopefulness')
        }
      />

      {/* SUBMIT */}
      <View className="mb-4 mt-4">
        <Button
          disabled={
            isSubmitting ||
            !sleepHours ||
            !appetite ||
            !exerciseHours ||
            !screenHours ||
            !studyHours ||
            !socializeAmount ||
            energy === null ||
            !concentration ||
            negativeThoughts === null ||
            !clarity ||
            bothered === null ||
            stressfulEvents === null ||
            !sleepiness ||
            !hopefulness
          }
          title={isSubmitting ? 'Submitting...' : 'Submit'}
          onPress={handleSubmit}
          variant="primary"
        />
      </View>
    </ScrollView>
  );
};

export default TestForm;
