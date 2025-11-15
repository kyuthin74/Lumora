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

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  EmergencyContact: undefined;
  MainTabs: undefined;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EmergencyContact"
>;

interface Props {
  navigation: NavigationProp;
}

const EmergencyContact: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [email, setEmail] = useState("");

  const handleSave = () => {
    if (!name || !relationship || !email) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    // Navigate to MainTabs after saving
    navigation.replace("MainTabs");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F7F9FC]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerClassName="flex-grow px-12 pt-10 pb-16">
        <View className="flex-row justify-end mt-6 mb-6">
          <TouchableOpacity onPress={() => navigation.replace("MainTabs")}>
            <Text className="text-gray-600 text-2xl">Skip</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-center text-lg text-gray-700 mb-10">
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

        <TouchableOpacity
          onPress={handleSave}
          className="mt-6 bg-blue-500 py-2 rounded-lg items-center self-center w-36"
        >
          <Text className="text-white text-xl font-semibold">Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EmergencyContact;
