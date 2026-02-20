import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../components/Button";
import Icon from "react-native-vector-icons/FontAwesome";
import { ArrowLeft } from "lucide-react-native";
import type { RootStackParamList } from "../navigation/AppNavigator";

const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://127.0.0.1:8000";

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

const activityOptions = [
  { id: 1, icon: "users", label: "Friends" },
  { id: 2, icon: "heart", label: "Romance" },
  { id: 3, icon: "briefcase", label: "Work" },
  { id: 4, icon: "paint-brush", label: "Creative" },
  { id: 5, icon: "book", label: "Learning" },
  { id: 6, icon: "music", label: "Music" },
  { id: 7, icon: "bed", label: "Rest" },
  { id: 8, icon: "gamepad", label: "Gaming" },
  { id: 9, icon: "shopping-cart", label: "Shopping" },
  { id: 10, icon: "coffee", label: "Cafe" },
];

type MoodJournalNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MoodJournal"
>;

const MoodJournal = () => {
  const navigation = useNavigation<MoodJournalNavigationProp>();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // -------------------------------------------------------
  // ACTIVITY SELECTION
  // -------------------------------------------------------
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

  const moodLabel = useMemo(() => {
    const match = moods.find((mood) => mood.id === selectedMood);
    return match?.label ?? null;
  }, [selectedMood]);

  const selectedActivityLabels = useMemo(() => {
    return selectedActivities
      .map((id) => activityOptions.find((activity) => activity.id === id)?.label)
      .filter((value): value is string => Boolean(value));
  }, [selectedActivities]);

  const handleSaveMood = async () => {
    if (!moodLabel) {
      Alert.alert("Select a mood", "Please choose how you feel before saving.");
      return;
    }

    try {
      setIsSaving(true);
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("authToken");

      if (!userId || !token) {
        Alert.alert("Not signed in", "Log in again to save your mood entry.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/moods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mood_type: moodLabel,
          activities: selectedActivityLabels,
          note: note.trim() || null,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = data?.message || data?.detail || "Unable to save your mood entry.";
        throw new Error(message);
      }

      navigation.navigate('MainTabs', { screen: 'Mood' });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again later.";
      Alert.alert("Save failed", message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Mood' });
    }
  };

  return (
    <ScrollView className="flex-1 bg-background px-6 pt-10" nestedScrollEnabled={false}
      >
      <TouchableOpacity
        onPress={handleBack}
        className="flex-row items-center mb-2 pt-6
        "
      >
        <ArrowLeft size={24} color="#4B5563" />
        <Text className="text-gray-700 text-lg ml-2">Back</Text>
      </TouchableOpacity>
      {/* Title */}
      <Text className="text-2xl font-bold text-center mb-2">Mood Journaling</Text>
      <Text className="text-gray-600 text-center mb-5">
        Log your daily activities and mood here!
      </Text>

      {/* Mood Section */}
      <Text className="text-lg font-semibold text-gray-900 mb-3">What's your mood?</Text>

      <View className="flex-row flex-wrap justify-between mb-4">
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.id;

          return (
            <TouchableOpacity
              key={mood.id}
              onPress={() => setSelectedMood(mood.id)}
              className="w-[22%] items-center mb-2"
            >
              <View
                className="w-full items-center justify-center rounded-2xl bg-white p-2"
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

      <View className="flex-row flex-wrap justify-between mb-3">
        {activityOptions.map((item) => {
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
              <Text
                className="mt-2 text-xs font-medium text-center"
                style={{ color: isSelected ? "#2E8BC0" : "#6B7280" }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notes Section */}
      <View
        className="bg-white rounded-2xl p-6 shadow-sm mb-5 border"
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
        <Button
          title={isSaving ? "Saving..." : "Done"}
          disabled={!moodLabel || isSaving}
          onPress={handleSaveMood}
        />
      </View>

    </ScrollView>
  );
};

export default MoodJournal;
