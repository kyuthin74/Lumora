import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000"
    : "http://127.0.0.1:8000";
// const API_BASE_URL = "http://10.0.2.2:8000";

// Check if user has emergency contact (returns true if exists)
const checkEmergencyContactExists = async (userId: string, token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/emergency-contact/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // If 200 OK and has valid data, contact exists
    if (response.ok) {
      const data = await response.json();
      return !!(data && data.contact_name);
    }
    return false;
  } catch {
    // On error, assume no contact (will show form)
    return false;
  }
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const extractUserId = useCallback((data: unknown): string | undefined => {
    if (!data || typeof data !== "object") return undefined;
    const obj = data as Record<string, unknown>;

    const direct =
      obj.user_id ?? obj.userId ?? obj.userid ?? obj.id ?? obj.user ?? obj.data;

    if (typeof direct === "string" || typeof direct === "number") {
      return String(direct);
    }

    if (direct && typeof direct === "object") {
      const nested = (direct as Record<string, unknown>).id ??
        (direct as Record<string, unknown>).user_id ??
        (direct as Record<string, unknown>).userId;
      if (typeof nested === "string" || typeof nested === "number") {
        return String(nested);
      }
    }

    return undefined;
  }, []);

  const extractToken = useCallback((data: unknown): string | undefined => {
    if (!data || typeof data !== "object") return undefined;
    const obj = data as Record<string, unknown>;
    const token = obj.access_token ?? obj.token ?? obj.accessToken;
    if (typeof token === "string") return token;
    return undefined;
  }, []);

  const loginUser = async (payload: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login-json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        (data && (data.message || data.detail)) ||
        "Unable to log in. Please try again.";
      throw new Error(message);
    }

    return data;
  };

  const handleLogin = async () => {
    const nextErrors = { email: "", password: "" };

    if (!email.trim()) {
      nextErrors.email = "Email or username is required.";
    }
    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await loginUser({ email: email.trim(), password: password.trim() });
      const userId = extractUserId(data);
      const token = extractToken(data);

      if (!userId) {
        const keys = data && typeof data === "object" ? Object.keys(data as Record<string, unknown>).join(", ") : "";
        console.warn("Login response missing user id", data);
        Alert.alert(
          "Login failed",
          `Missing user id from server response. Returned keys: ${keys || "none"}`
        );
        return;
      }

      if (!token) {
        console.warn("Login response missing access token", data);
        Alert.alert("Login failed", "Missing access token from server response.");
        return;
      }

      // Store credentials in AsyncStorage
      await AsyncStorage.setItem("userId", userId);
      await AsyncStorage.setItem("authToken", token);

      // Check if user already has emergency contact
      const hasEmergencyContact = await checkEmergencyContactExists(userId, token);
      
      if (hasEmergencyContact) {
        // Skip emergency contact form, go directly to main app
        navigation.replace("MainTabs", { screen: "Home" });
      } else {
        // Show emergency contact form
        navigation.navigate("EmergencyContact", { userId, token });
      }
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      Alert.alert("Login failed", message);
    } finally {
      setIsSubmitting(false);
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

          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Welcome back
          </Text>

          {/* Email input */}
          <Input
            icon="envelope"
            placeholder="Email / Username"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: "" }));
              }
            }}
          />
          {errors.email ? (
            <Text className="text-red-500 mb-4">{errors.email}</Text>
          ) : (
            <View className="mb-2" />
          )}

          {/* Password */}
          <Input
            icon="lock"
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
            rightIcon={passwordVisible ? "eye" : "eye-slash"}
            onRightIconPress={() => setPasswordVisible((prev) => !prev)}
          />
          {errors.password ? (
            <Text className="text-red-500 mb-2">{errors.password}</Text>
          ) : (
            <View className="mb-2" />
          )}

          <TouchableOpacity className="items-end mb-8">
            <Text className="text-primary font-arimo">Forgot password?</Text>
          </TouchableOpacity>

          <Button
            title={isSubmitting ? "Logging in..." : "Log in"}
            onPress={handleLogin}
            disabled={isSubmitting}
          />

          <View className="flex-row justify-center mt-[60px]">
            <Text className="text-lg text-gray-700 ">
              Don’t have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text className="text-lg text-primary font-semibold">
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
