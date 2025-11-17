import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import Button from "../components/Button";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { ArrowLeft} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const moods = [
  {
    id: 1,
    label: "Neutral",
    color: "#60A5FA",
    image: require("../assets/mood/neutral.png"),
  },
  {
    id: 2,
    label: "Energetic",
    color: "#EC4899",
    image: require("../assets/mood/energetic.png"),
  },
  {
    id: 3,
    label: "Happy",
    color: "#34D399",
    image: require("../assets/mood/happy.png"),
  },
  {
    id: 4,
    label: "Satisfied",
    color: "#FBBF24",
    image: require("../assets/mood/satisfied.png"),
  },
  {
    id: 5,
    label: "Tired",
    color: "#FB923C",
    image: require("../assets/mood/tired.png"),
  },
  {
    id: 6,
    label: "Stressed",
    color: "#A78BFA",
    image: require("../assets/mood/stressed.png"),
  },
  {
    id: 7,
    label: "Angry",
    color: "#F87171",
    image: require("../assets/mood/angry.png"),
  },
  {
    id: 8,
    label: "Sad",
    color: "#9CA3AF",
    image: require("../assets/mood/sad.png"),
  },
];

const LogMood: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
      const handleBack = () => {
          navigation.navigate('Home');
      }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-6 pt-6">
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

      {/* Mood Grid */}
      <View className="flex-row flex-wrap px-8 mb-6 justify-between">
        {moods.map((mood) => {
          const isActive = selected === mood.id;

          return (
            <TouchableOpacity
              key={mood.id}
              onPress={() => setSelected(mood.id)}
              className={`
                w-[42%] h-[25%] bg-white rounded-2xl mb-4 items-center shadow-md
              `}
              style={{
                borderWidth: isActive ? 2 : 0,
                borderColor: isActive ? mood.color : "transparent",
              }}
            >
              <Image
                source={mood.image}
                className="w-20 h-20"
                resizeMode="contain"
              />

              <Text
                className="text-lg font-semibold"
                style={{ color: mood.color }}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Continue Button */}
      <View className="mt-14 items-center">
        <Button
          title="Continue"
          disabled={!selected}
          onPress={() => navigation.navigate("TestForm")}
        />
      </View>
    </ScrollView>
  );
};

export default LogMood;
