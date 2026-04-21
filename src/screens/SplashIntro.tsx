import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import type { RootStackParamList } from '../navigation/AppNavigator';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SplashIntro'>;
}

const SplashIntro: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const [userId, token] = await Promise.all([
          AsyncStorage.getItem('userId'),
          AsyncStorage.getItem('authToken'),
        ]);

        if (!userId || !token) {
          return;
        }

        if (!isMounted) {
          return;
        }

        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs', params: { screen: 'Home' } }],
        });
      } catch (error) {
        console.error('Session restore failed:', error);
      } finally {
        if (isMounted) {
          setIsRestoringSession(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [navigation]);

  if (isRestoringSession) {
    return (
      <View
        className="flex-1 bg-white"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <View className="flex-1 items-center justify-center px-10">
          <Image
            source={require('../assets/Lumora.png')}
            className="h-[180px] w-[180px]"
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#7BA7C6" />
        </View>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 items-center justify-between px-10 pb-10 pt-20">
        <Image
          source={require('../assets/Lumora.png')}
          className="top-20 h-[200px] w-[200px] "
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
