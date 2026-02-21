import React, { useState } from "react";
import { View, Text ,KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import Button from "../components/Button";
import Input from "../components/Input";
import { Image } from "react-native";
import { ScrollView } from "react-native";

const ForgotPassword: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const API_BASE_URL =
    Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://127.0.0.1:8000";

  const handleSendCode = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/email/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.status === 404) {
        const data = await response.json().catch(() => ({}));
        if (data.detail === "Email not found") {
          setErrorMsg("Email not found. Please check your email.");
        } else {
          setErrorMsg("");
          console.warn(data.detail || "Failed to send code. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setErrorMsg("");
        const message = data?.message || data?.detail || "Failed to send code. Please try again.";
        console.warn(message);
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
      setErrorMsg("");
      navigation.navigate("VerifyCode", { email });
    } catch (error) {
      setIsSubmitting(false);
      setErrorMsg("");
      console.warn("Network error. Please try again.");
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
        <Text className="text-2xl font-bold text-gray-900 mb-4">Forgot Password</Text>
        <Text className="mb-6 text-gray-700">Enter your email to receive a verification code.</Text>
        <Input
          icon="envelope"
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        {errorMsg ? (
          <Text style={{ color: 'red', marginTop: 4, marginBottom: 7 }}>{errorMsg}</Text>
        ) : null}
        <Button
          title={isSubmitting ? "Sending..." : "Send Code"}
          onPress={handleSendCode}
          disabled={!email || isSubmitting}
        />
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
