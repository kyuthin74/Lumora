import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  GestureResponderEvent,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import Icon from "react-native-vector-icons/Feather";

// Use Android emulator loopback when on Android
const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000"
    : "http://127.0.0.1:8000";

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignUp"
>;

const Checkbox = ({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) => (
  <TouchableOpacity
    accessibilityRole="checkbox"
    accessibilityState={{ checked }}
    onPress={(event: GestureResponderEvent) => {
      event.stopPropagation();
      onToggle();
    }}
    className={`w-5 h-5 mr-2 rounded-sm border-2 border-primary items-center justify-center ${
      checked ? "bg-primary" : "bg-white"
    }`}
    activeOpacity={0.8}
  >
    {checked && <Icon name="check" size={16} color="#FFFFFF" />}
  </TouchableOpacity>
);

type SignUpErrors = {
  username: string;
  email: string;
  password: string;
  agree: string;
};

const SignUp = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<SignUpErrors>({
    username: "",
    email: "",
    password: "",
    agree: "",
  });

  const clearError = useCallback((field: keyof SignUpErrors) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  }, []);

  const toggleAgree = () => {
    setAgree((prev) => {
      const next = !prev;
      if (next) {
        clearError("agree");
      }
      return next;
    });
  };

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

  const registerUser = async (payload: {
    email: string;
    full_name: string;
    password: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        is_notify_enabled: false,
        daily_reminder_time: null,
        is_risk_alert_enabled: false,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        (data && (data.message || data.detail)) ||
        "Unable to create account. Please try again.";
      throw new Error(message);
    }

    return data;
  };

  const isValidEmail = (value: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  };

  const handleSignUp = async () => {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const newErrors: SignUpErrors = {
      username: trimmedUsername ? "" : "Username is required",
      email: !trimmedEmail
        ? "Email is required"
        : isValidEmail(trimmedEmail)
        ? ""
        : "Please enter a valid email",
      password: trimmedPassword ? "" : "Password is required",
      agree: agree ? "" : "You must agree to the terms",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((msg) => msg !== "")) return;

    setIsSubmitting(true);

    try {
      const data = await registerUser({
        email: trimmedEmail,
        full_name: trimmedUsername,
        password: trimmedPassword,
      });

      const userId = extractUserId(data);
      const token = extractToken(data);

      if (!userId) {
        const keys = data && typeof data === "object" ? Object.keys(data as Record<string, unknown>).join(", ") : "";
        console.warn("Signup response missing user id", data);
        Alert.alert(
          "Sign up failed",
          `Missing user id from server response. Returned keys: ${keys || "none"}`
        );
        return;
      }

      if (!token) {
        console.warn("Signup response missing access token", data);
        Alert.alert("Sign up failed", "Missing access token from server response.");
        return;
      }

      navigation.navigate("EmergencyContact", { userId, token });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      Alert.alert("Sign up failed", message);
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
          <View className="items-center mb-8">
            <Image
              source={require("../assets/Lumora.png")}
              className="h-[140px] w-[140px] mb-6"
              resizeMode="contain"
            />
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Create account
          </Text>

          {/* Username */}
          <Input
            icon="user"
            placeholder="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (errors.username) clearError("username");
            }}
          />
          {errors.username ? (
            <Text className="text-red-500 ml-2 -mt-3 mb-4">
              {errors.username}
            </Text>
          ) : null}

          {/* Email */}
          <Input
            icon="envelope"
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) clearError("email");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email ? (
            <Text className="text-red-500 ml-2 -mt-3 mb-4">
              {errors.email}
            </Text>
          ) : null}

          {/* Password */}
          <Input
            icon="lock"
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) clearError("password");
            }}
            rightIcon={passwordVisible ? "eye" : "eye-slash"}
            onRightIconPress={() => setPasswordVisible((prev) => !prev)}
          />
          {errors.password ? (
            <Text className="text-red-500 ml-2 -mt-3 mb-4">
              {errors.password}
            </Text>
          ) : null}

          {/* Terms */}
          <TouchableOpacity
            className="flex-row items-center mb-6"
            onPress={toggleAgree}
            activeOpacity={0.8}
          >
            <Checkbox checked={agree} onToggle={toggleAgree} />
            <Text className="ml-1 text-primary">I agree Terms & Conditions</Text>
          </TouchableOpacity>

          {errors.agree ? (
            <Text className="text-red-500 ml-2 mb-4">{errors.agree}</Text>
          ) : null}

          <Button
            title={isSubmitting ? "Signing up..." : "Sign up"}
            onPress={handleSignUp}
            disabled={isSubmitting}
          />

          <View className="flex-row justify-center mt-[60px]">
            <Text className="text-lg text-gray-700">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-lg text-primary font-semibold">Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
