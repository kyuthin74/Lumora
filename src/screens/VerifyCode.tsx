import React, { useState } from "react";
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import Button from "../components/Button";
import Input from "../components/Input";
import { Image } from "react-native";
import { ScrollView } from "react-native";

const VerifyCode: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { email } = route.params as { email: string };
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const API_BASE_URL =
    Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://127.0.0.1:8000";

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/email/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      // Check for 404 status (email not found)
      if (response.status === 404) {
        setIsSubmitting(false);
        setErrorMsg("Email not found. Please check your email.");
        return;
      }
      const data = await response.json();
      if (data.success) {
        setIsSubmitting(false);
        setErrorMsg("");
        navigation.navigate("ResetPassword", { email });
      } else {
        setIsSubmitting(false);
        // Show error message below input for incorrect code
        setErrorMsg(data.reason || "Code expired or not found");
      }
    } catch (error) {
      setIsSubmitting(false);
      setErrorMsg("");
      alert("Network error. Please try again.");
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
        <Text className="text-2xl font-bold text-gray-900 mb-4">Verify Code</Text>
        <Text className="mb-6 text-gray-700">Enter the code sent to {email}.</Text>
        <Input
          icon="key"
          placeholder="Verification Code"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />
        {errorMsg ? (
          <Text style={{ color: 'red', marginTop: 4, marginBottom: 7 }}>{errorMsg}</Text>
        ) : null}
        <Button
          title={isSubmitting ? "Submitting..." : "Submit Code"}
          onPress={handleSubmitCode}
          disabled={!code || isSubmitting}
        />
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyCode;
