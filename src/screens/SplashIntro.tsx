import React from 'react';
import { View, Text, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import type { RootStackParamList } from '../navigation/AppNavigator';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SplashIntro'>;
}

const SplashIntro: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 items-center justify-between px-10 pb-10 pt-20">
        <Image
          source={require('../assets/Lumora.png')}
          className="top-20 h-[250px] w-[250px] "
          resizeMode="contain"
        />

        <Text className="text-center text-xl font-bold leading-[26px] text-gray-600 mt-10">
          Your Daily Companion for Emotional Well-being.
        </Text>
        <Button
          title="Continue"
          onPress={() => navigation.navigate('SplashFeatures')}
        />
      </View>
    </View>
  );
};

export default SplashIntro;
