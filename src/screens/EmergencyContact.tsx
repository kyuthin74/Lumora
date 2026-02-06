// EmergencyContact.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Button from "../components/Button";

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000"
    : "http://127.0.0.1:8000";

const EmergencyContact: React.FC = () => {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "EmergencyContact">>();
  const userId = route.params?.userId;
  const token = route.params?.token;

  const handleSave = async () => {
    if (!name || !relationship || !email) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "Missing user id. Please log in again.");
      return;
    }

    if (!token) {
      Alert.alert("Error", "Missing auth token. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/emergency-contact/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contact_name: name,
          contact_email: email,
          relationship,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          (data && (data.message || data.detail)) ||
          "Unable to save contact. Please try again.";
        throw new Error(message);
      }

      navigation.replace("MainTabs");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      Alert.alert("Save failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F7F9FC]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerClassName="flex-grow px-12 pt-10 pb-16">
        <View className="flex-row justify-end mt-6 mb-6">
          <TouchableOpacity onPress={() => navigation.navigate("HighRiskAlert")}>
            <Text className="text-gray-600 text-xl">Skip</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-center text-md text-gray-700 mb-10">
          Add an emergency contact who can be contacted in case of emotional
          distress or urgent mental health concerns.
        </Text>

        <View className="space-y-5">
          <View>
            <Text className="text-gray-700 mb-2 text-xl font-medium">Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg mb-6 px-3 py-3 bg-white text-gray-800"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2 text-lg font-medium">Relationship</Text>
            <TextInput
              className="border border-gray-300 rounded-lg mb-6 px-3 py-3 bg-white text-gray-800"
              placeholder="eg. Cousin"
              value={relationship}
              onChangeText={setRelationship}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2 text-lg font-medium">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg mb-6 px-3 py-3 bg-white text-gray-800"
              placeholder="example@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <Button
          disabled={!name || !relationship || !email || isSubmitting}
          title={isSubmitting ? "Saving..." : "Save"}
          onPress={handleSave}
          variant="short"
          className="mt-6 self-center w-36"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EmergencyContact;
