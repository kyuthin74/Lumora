import React, { useState } from "react";
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import Button from "../components/Button";
import Input from "../components/Input";
import { Image } from "react-native";

const ResetPassword: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { email } = route.params as { email: string };
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const API_BASE_URL =
    Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://127.0.0.1:8000";

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const response = await fetch(`${API_BASE_URL}/email/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = data?.message || data?.detail || "Failed to reset password. Please try again.";
        setErrorMsg(message);
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
      Alert.alert("Password reset successful");
      navigation.navigate("Login");
    } catch (error) {
      setIsSubmitting(false);
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
     <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 bg-background px-6 justify-center">
        <View className="items-center mb-10">
          <Image
            source={require("../assets/Lumora.png")}
            className="h-[140px] w-[140px] mb-6"
            resizeMode="contain"
          />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-4">Reset Password</Text>
        <Text className="mb-6 text-gray-700">Enter your new password.</Text>
        <Input
          icon="lock"
          placeholder="New Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          rightIcon={showPassword ? "eye" : "eye-slash"}
          onRightIconPress={() => setShowPassword((prev) => !prev)}
        />
        <Input
          icon="lock"
          placeholder="Confirm New Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          rightIcon={showConfirmPassword ? "eye" : "eye-slash"}
          onRightIconPress={() => setShowConfirmPassword((prev) => !prev)}
        />
        {errorMsg ? (
          <Text style={{ color: 'red', marginTop: 4 }}>{errorMsg}</Text>
        ) : null}
        <Button
          title={isSubmitting ? "Resetting..." : "Reset Password"}
          onPress={handleResetPassword}
          disabled={!password || !confirmPassword || password !== confirmPassword || isSubmitting}
        />
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;
