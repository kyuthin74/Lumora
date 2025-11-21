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
} from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import Icon from "react-native-vector-icons/Feather";

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

  const registerUser = async () => {
    return {
      success: true,
      message: "Account created successfully",
    };
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

    const res = await registerUser();

    if (res.success) {
      navigation.navigate("EmergencyContact");
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

          <Button title="Sign up" onPress={handleSignUp} />

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
