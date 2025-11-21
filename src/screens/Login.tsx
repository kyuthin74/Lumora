import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

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

  const handleLogin = () => {
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

    navigation.navigate("EmergencyContact");
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

          <Button title="Log in" onPress={handleLogin} />

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
