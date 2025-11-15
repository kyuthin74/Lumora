import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import Button from "../components/Button";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

interface Props {
  navigation: SignUpScreenNavigationProp;
}

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

const LogMood: React.FC<Props> = ({navigation}) => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <ScrollView className="flex-1 bg-gray-50 px-6 pt-12">
      {/* Header */}
      <Text className="text-2xl font-bold text-center mt-6 text-gray-800 mb-2">
        Log Your Mood
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        Select your current mood and share your thoughts
      </Text>

      {/* Mood Grid */}
      <View className="flex-row flex-wrap justify-between">
        {moods.map((mood) => {
          const isActive = selected === mood.id;

          return (
            <TouchableOpacity
              key={mood.id}
              onPress={() => setSelected(mood.id)}
              className={`
                w-[37%] bg-white rounded-2xl p-5 mb-4 items-center shadow-md
              `}
              style={{
                borderWidth: isActive ? 2 : 0,
                borderColor: isActive ? mood.color : "transparent",
              }}
            >
              <Image
                source={mood.image}
                className="w-20 h-20 mb-2"
                resizeMode="contain"
              />

              <Text
                className="text-lg font-semibold mt-1"
                style={{ color: mood.color }}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Continue Button */}
      <View className="mt-6 items-center">
  <Button
    title="Continue"
    disabled={!selected}
    onPress={() => navigation.navigate("TestForm")}
  />
</View>


      <View className="mb-10" />
    </ScrollView>
  );
};

export default LogMood;
