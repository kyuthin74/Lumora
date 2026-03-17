import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getRandomNudge } from '../utils/nudges';

const NudgeScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'Nudge'>>();
    const { riskLevel, riskValue } = route.params;

    console.log('Nudge screen - received riskLevel:', riskLevel);
    console.log('Nudge screen - received riskValue:', riskValue);

    const [nudge] = useState(getRandomNudge(riskLevel));

    useEffect(() => {
        // Save this nudge specifically for this user so it persists across logins
        const saveNudgeForUser = async () => {
          try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
              await AsyncStorage.setItem(`lastNudge_${userId}`, nudge);
            }
          } catch (error) {
            console.error('Error saving user nudge:', error);
          }
        };
        
        saveNudgeForUser();
    }, [nudge]);

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

        <Text className={`text-center font-semibold text-sm mb-2 ${
          riskLevel === 'Low' ? 'text-green-600' : 
          riskLevel === 'Medium' ? 'text-yellow-600' : 
          'text-red-600'
        }`}>
          Risk Level: {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
        </Text>

        <Text className="text-center text-lg text-gray-600 mb-5 leading-6">
          {nudge}
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("MainTabs", { screen: 'Home', params: { riskLevel, riskValue } })}
           className="mt-6 bg-primary py-2 rounded-lg items-center self-center w-32"
        >
          <Text className="text-white text-lg">Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NudgeScreen;
