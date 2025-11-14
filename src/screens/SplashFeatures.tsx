import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ImageSourcePropType,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import type { RootStackParamList } from '../navigation/AppNavigator';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SplashFeatures'>;
}

const featureItems: Array<{
  id: string;
  title: string;
  imageSrc: ImageSourcePropType;
}> = [
  {
    id: 'mood',
    title: 'Daily Mood Logging',
    imageSrc: require('../assets/Neutral.png'),
  },
  {
    id: 'nudges',
    title: 'Science-based Nudges',
    imageSrc: require('../assets/Satisfied.png'),
  },
  {
    id: 'analysis',
    title: 'Weekly Mood Analysis',
    imageSrc: require('../assets/Happy.png'),
  },
  {
    id: 'risk',
    title: 'AI-predicted Depression Risk',
    imageSrc: require('../assets/Energetic.png'),
  },
];

const SplashFeatures: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScrollView
        contentContainerClassName="flex-grow px-6 py-12"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-4 mt-4 ml-10">
          {featureItems.map(({ id, title, imageSrc }) => (
            <View
              key={id}
              className="flex-row items-center gap-3 rounded-xl bg-background px-4 py-3"
            >
              <Image
                source={imageSrc}
                className="h-[45px] w-[45px] rounded-md border border-primary-100 bg-background shadow-md"
                resizeMode="contain"
              />
              <Text className="mx-3 text-lg font-medium text-primary">
                {title}{' '}
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-2 items-center">
          <Button
            title="Get Started"
            onPress={() => navigation.replace('Login')}
          />
        </View>

        <View className="mt-10 flex-row items-center gap-2">
          <Image
            source={require('../assets/MoodPage.png')}
            className="h-[200px] w-[200px] rounded-2xl"
            resizeMode="contain"
          />
          <Image
            source={require('../assets/HomePage.png')}
            className="h-[200px] w-[200px] rounded-2xl"
            resizeMode="contain"
          />
          <Image
            source={require('../assets/AnalysisPage.png')}
            className="h-[200px] w-[200px] rounded-2xl"
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default SplashFeatures;
