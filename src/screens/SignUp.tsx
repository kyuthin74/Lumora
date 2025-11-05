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
import Button from '../components/Button';

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainTabs: undefined;
};

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

interface Props {
  navigation: SignUpScreenNavigationProp;
}

const SignUp: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    // Navigate to main app after successful signup
    navigation.replace('MainTabs');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-purple-50"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-[350px] mx-auto">
          {/* Logo */}
          <View className="mb-8 items-center justify-center">
            <Image
              source={require('../assets/Lumora.png')}
              className="w-35 h-35 mb-4"
              resizeMode="contain"
            />
          <Text className="text-lg text-gray-600">
            Start Your Wellness Journey
          </Text>
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-2xl font-bold text-gray-800">
            Create Account
          </Text>
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-gray-700">
            Full Name
          </Text>
          <TextInput
            className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-base"
            placeholder="Enter your full name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-gray-700">
            Email
          </Text>
          <TextInput
            className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-base"
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-gray-700">
            Password
          </Text>
          <TextInput
            className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-base"
            placeholder="Create a password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-sm font-semibold text-gray-700">
            Confirm Password
          </Text>
          <TextInput
            className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-base"
            placeholder="Confirm your password"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        {/* Log in button */}
        <Button title="Sign Up" onPress={handleSignUp} />

        <View className="flex-row items-center justify-center mt-2">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="font-semibold text-blue-600">Sign In</Text>
          </TouchableOpacity>
        </View>
        </View>
      
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
