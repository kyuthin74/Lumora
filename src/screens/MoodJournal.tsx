import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../components/Button";
import Icon from "react-native-vector-icons/FontAwesome";
import type { RootStackParamList } from "../navigation/AppNavigator";

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

type MoodJournalNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MoodJournal"
>;

const MoodJournal = () => {
  const navigation = useNavigation<MoodJournalNavigationProp>();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  // -------------------------------------------------------
  // ACTIVITY SELECTION
  // -------------------------------------------------------
  const activities = [
    { id: 1, icon: "users" },
    { id: 2, icon: "heart" },
    { id: 3, icon: "briefcase" },
    { id: 4, icon: "paint-brush" },
    { id: 5, icon: "book" },
    { id: 6, icon: "music" },
    { id: 7, icon: "bed" },
    { id: 8, icon: "gamepad" },
    { id: 9, icon: "shopping-cart" },
    { id: 10, icon: "coffee" },
  ];

  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);

  const toggleActivity = (id: number) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // -------------------------------------------------------
  // USER NOTES
  // -------------------------------------------------------
  const [note, setNote] = useState("");

  return (
    <ScrollView className="flex-1 bg-background px-6 pt-10">
      {/* Title */}
      <Text className="text-2xl font-bold text-center mb-2">Mood Journaling</Text>
      <Text className="text-gray-600 text-center mb-10">
        Log your daily activities and mood here!
      </Text>

      {/* Mood Section */}
      <Text className="text-lg font-semibold text-gray-900 mb-3">What's your mood?</Text>

      <View className="flex-row flex-wrap justify-between mb-6">
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.id;

          return (
            <TouchableOpacity
              key={mood.id}
              onPress={() => setSelectedMood(mood.id)}
              className="w-[22%] items-center mb-4"
            >
              <View
                className="w-full items-center justify-between rounded-2xl bg-white p-2"
                style={{
                  aspectRatio: 1,
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected ? mood.color : "#E5E7EB",
                  shadowColor: "#000",
                  shadowOpacity: 0.07,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Image source={mood.image} className="w-14 h-14" resizeMode="contain" />
                <Text className="text-sm font-semibold text-center" style={{ color: mood.color }}>
                  {mood.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Activity Section */}
      <Text className="text-lg font-semibold text-gray-900 mb-3">
        What have you been up to?
      </Text>

      <View className="flex-row flex-wrap justify-between mb-6">
        {activities.map((item) => {
          const isSelected = selectedActivities.includes(item.id);

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleActivity(item.id)}
              className="w-[18%] items-center mb-4"
            >
              <View
                className={`w-14 h-14 rounded-full border items-center justify-center ${
                  isSelected ? "bg-primary/10 border-primary" : "border-gray-300 bg-white"
                }`}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  color={isSelected ? "#2E8BC0" : "#555"}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notes Section */}
      <View
        className="bg-white rounded-2xl p-6 shadow-sm mb-10 border"
        style={{ borderColor: "rgba(46, 139, 192, 0.4)", borderWidth: 1 }}
      >
        <Text className="text-lg font-semibold text-gray-900 mb-3">
          What's on your mind? (optional)
        </Text>

        <TextInput
          multiline
          value={note}
          onChangeText={setNote}
          placeholder="Share your thoughts, what happened today, or anything you'd like to remember...."
          className="h-32 rounded-2xl px-6 py-3 text-gray-700 bg-primary/10"
          placeholderTextColor="#2E8BC0"
        />
      </View>

      {/* Done Button */}
      <View className="mb-10">
        <Button title="Done" onPress={() => navigation.goBack()} />
      </View>

    </ScrollView>
  );
};

export default MoodJournal;
