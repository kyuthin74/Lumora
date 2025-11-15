import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/Button';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    navigation.replace("HighRiskAlert");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center items-center px-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-[350px]">
          {/* Logo */}
          <View className="items-center mb-8 justify-center">
            <Image
              source={require("../assets/Lumora.png")}
              className="w-35 h-35 mb-4"
              resizeMode="contain"
            />
                </View>

          {/* Welcome text */}
          <View className="mb-8">
            <Text className="text-2xl font-semibold text-gray-800 mb-1 text-center">
             Your mental health companion
            </Text>
          </View>

          {/* Email input */}
          <View className="mb-4 flex-row items-center border border-gray-300 rounded-md px-3 bg-white">
            <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
            <TextInput
              className="flex-1 px-2 py-3 text-gray-800"
              placeholder="Email / Username"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password input */}
          <View className="mb-4 flex-row items-center border border-gray-300 rounded-md px-3 bg-white">
            <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
            <TextInput
              className="flex-1 px-2 py-3 text-gray-800"
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Forgot password */}
          <TouchableOpacity className="mb-6 self-end" onPress={() => {}}>
            <Text className="text-blue-600 text-sm">Forgot password?</Text>
          </TouchableOpacity>

          {/* Log in button */}
          <Button title="Log in" onPress={handleLogin} />

          {/* Signup link */}
          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-gray-600">Don’t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text className="text-blue-600 font-semibold">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
