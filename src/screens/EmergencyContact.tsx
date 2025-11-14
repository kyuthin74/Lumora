// EmergencyContact.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
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
      <ScrollView contentContainerClassName="flex-grow px-6 pt-10 pb-16">
        <View className="flex-row justify-end mb-6">
          <TouchableOpacity onPress={() => navigation.replace("MainTabs")}>
            <Text className="text-gray-600 text-base">Skip</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-center text-base text-gray-700 mb-10">
          Add an emergency contact who can be contacted in case of emotional
          distress or urgent mental health concerns.
        </Text>

        <View className="space-y-5">
          <View>
            <Text className="text-gray-700 mb-2 font-medium">Name</Text>
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-3 bg-white text-gray-800"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2 font-medium">Relationship</Text>
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-3 bg-white text-gray-800"
              placeholder="Cousin"
              value={relationship}
              onChangeText={setRelationship}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2 font-medium">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-3 bg-white text-gray-800"
              placeholder="johndoe@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          className="mt-10 bg-blue-500 py-3 rounded-md items-center"
        >
          <Text className="text-white text-lg font-semibold">Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EmergencyContact;
