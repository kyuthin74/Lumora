import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BellRing ,X} from 'lucide-react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';

const HighRiskAlert: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const handleDismiss = () => {
    navigation.replace('MainTabs');
  };

  return (
    <View
      className="flex-1 bg-primary"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-[320px] rounded-xl bg-white p-6 shadow-lg">
          <View className="flex-row justify-end">
            <TouchableOpacity
              onPress={handleDismiss}
              className="h-8 w-8 items-center justify-center"
              activeOpacity={0.7}
            >
              <X className="text-lg text-gray-800" />
            </TouchableOpacity>
          </View>

          <View className="mt-2 items-center px-3">
            <Text className="text-xl font-semibold text-gray-900 mb-3">High Risk Alert!</Text>
            <BellRing className="my-4" color="#FE0202" fill="#FE0202" size={35} />
            <Text className="text-center text-lg font-bold text-danger mt-4">
              "We have detected signs of high risk for depression"
            </Text>
            <Text className="mt-4 text-center text-md text-gray-900">
              Your well-being is very important. If you are experiencing overwhelming feelings or
              thoughts of harming yourself, please seek help immediately.
            </Text>
          </View>

        </View>
      </View>
    </View>
  );
};

export default HighRiskAlert;
