import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

const NudgeScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="flex-1 bg-primary items-center justify-center px-6">
      
      <View className="bg-white rounded-2xl p-6 w-full items-center shadow-lg relative">

        {/* Floating Icon */}
        <View className="absolute -top-10 bg-white rounded-full p-3 shadow-lg">
          <Image
            source={require("../assets/Lumora.png")}
            className="w-14 h-14"
            resizeMode="contain"
          />
        </View>

        <Text className="text-xl font-semibold mt-10 mb-3">
          Nudge for You
        </Text>

        <Text className="text-center text-lg text-gray-600 mb-5 leading-6">
          Try a 5-minutes breathing exercise. Research shows it can reduce anxiety up to 25% and improve focus.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("MainTabs")}
          className="mt-6 bg-primary py-2 rounded-lg items-center self-center w-32"
        >
          <Text className="text-white text-lg">Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NudgeScreen;
