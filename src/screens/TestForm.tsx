import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

import SelectField from "../components/SelectField";
import ScaleSelector from "../components/ScaleSelector";
import YesNoToggle from "../components/YesNoToggle";
import Button from "../components/Button";

const TestForm: React.FC = () => {
  // all hooks are declared unconditionally at the top
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [energy, setEnergy] = useState(0);

  // state for each select field (give them explicit defaults)
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
  const [negativeThoughts, setNegativeThoughts] = useState<boolean | null>(null);
  const [stressfulEvents, setStressfulEvents] = useState<boolean | null>(null);

  const handleBack = () => navigation.navigate("LogMood");
  const handleSubmit = () => navigation.navigate("Nudge");

  return (
    <ScrollView className="flex-1 bg-gray-50 px-6 pt-6 mb-12" nestedScrollEnabled={true} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Back Button */}
        <TouchableOpacity
            onPress={handleBack}
            className="flex-row items-center mt-6 mb-2"
        >
            <ArrowLeft size={24} color="#4B5563" />
            <Text className="text-gray-700 text-lg ml-2">Back</Text>
        </TouchableOpacity>
      
        {/* Header */}
        <Text className="text-2xl font-bold text-center text-gray-800 mb-2">
            Log Your Mood
        </Text>
        <Text className="text-gray-600 text-center mb-6">
            Select your current mood and share your thoughts
        </Text>

      {/* FORM FIELDS - each SelectField receives value/options/onSelect */}
      <SelectField
        label="How many hours did you sleep last night?"
        value={sleepHours}
        options={["Less than 4 hours", "4 - 5 hours", "6 - 7 hours", "8 or more hours"]}
        onSelect={setSleepHours}
      />

      <SelectField
        label="How is your appetite today?"
        value={appetite}
        options={["Less than usual", "Usual", "More than usual"]}
        onSelect={setAppetite}
      />

      <SelectField
        label="How many hours did you spend doing physical activity or exercise today?"
        value={exerciseHours}
        options={["None", "Less than 30 minutes", "30 - 60 minutes", "More than 60 minutes"]}
        onSelect={setExerciseHours}
        dropdownOffset={86}
      />

      <SelectField
        label="How many hours did you spend on screens (phone, computer, TV)?"
        value={screenHours}
        options={["Less than 2 hours", "2 - 4 hours", "5 - 7 hours", "7 or more hours"]}
        onSelect={setScreenHours}
        dropdownOffset={86}
      />

      <SelectField
        label="How many hours did you spend on academic work?"
        value={studyHours}
        options={["Less than 4 hours", "4 - 5 hours", "6 - 7 hours", "8 or more hours"]}
        onSelect={setStudyHours}
        dropdownOffset={86}
      />

      <SelectField
        label="How much did you socialize today?"
        value={socializeAmount}
        options={["Very little", "Moderate", "High", "Very high"]}
        onSelect={setSocializeAmount}
      />

      {/* SCALE SELECTOR */}
      <Text className="text-gray-700 text-base font-semibold mb-2">How was your energy level today?</Text>
      <ScaleSelector value={energy} onChange={setEnergy} minLabel="Very Low" maxLabel="Very High" />

      <SelectField
        label="How much have you had trouble concentrating on daily activities?"
        value={concentration}
        options={["Not at all", "Several times a day", "Half of the day", "All day"]}
        onSelect={setConcentration}
        dropdownOffset={86}
      />

      {/* YES / NO */}
      <Text className="text-gray-700 text-base font-semibold mb-1">
        Did you have any negative thoughts about yourself today?
      </Text>
      <YesNoToggle value={negativeThoughts} onChange={setNegativeThoughts} />

      <SelectField
        label="How clear was your thinking and decision-making today?"
        value={clarity}
        options={["Clear", "Normal", "A little foggy", "Foggy"]}
        onSelect={setClarity}
        dropdownOffset={86}
      />
      
      {/* YES / NO */}
      <Text className="text-gray-700 text-base font-semibold mb-1">
        Did you feel bothered by things that normally wouldn't bother you today?
      </Text>
      <YesNoToggle value={bothered} onChange={setBothered} />

      <Text className="text-gray-700 text-base font-semibold mb-1">Did you experience any stressful events today?</Text>
      <YesNoToggle value={stressfulEvents} onChange={setStressfulEvents} />

      <SelectField
        label="How sleepy or tired did you feel during the day?"
        value={sleepiness}
        options={["Not at all", "A little", "Moderately", "Very sleepy or tired"]}
        onSelect={setSleepiness}
      />

      <SelectField
        label="How hopeful did you feel about the future today?"
        value={hopefulness}
        options={["Very hopeful", "Somewhat hopeful", "Not Very Hopeful", "No hope at all"]}
        onSelect={setHopefulness}
      />

      {/* SUBMIT */}
      <View className="mt-4 mb-10">
        <Button 
          disabled={!sleepHours || !appetite || !exerciseHours || !screenHours || !studyHours || !socializeAmount || energy === null || !concentration || negativeThoughts === null || !clarity || bothered === null || stressfulEvents === null || !sleepiness || !hopefulness}
          title="Submit" 
          onPress={handleSubmit} 
          variant="primary"
        />
      </View>
    </ScrollView>
  );
};

export default TestForm;
