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
    imageSrc: require('../assets/mood/neutral.png'),
  },
  {
    id: 'nudges',
    title: 'Science-based Nudges',
    imageSrc: require('../assets/mood/satisfied.png'),
  },
  {
    id: 'analysis',
    title: 'Weekly Mood Analysis',
    imageSrc: require('../assets/mood/happy.png'),
  },
  {
    id: 'risk',
    title: 'AI-predicted Depression Risk',
    imageSrc: require('../assets/mood/energetic.png'),
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
        <View className="flex-1 justify-between">
          <View className="mb-3 ml-10 mt-3">
            {featureItems.map(({ id, title, imageSrc }) => (
              <View
                key={id}
                className="flex-row items-center gap-1 rounded-xl bg-background px-4 py-3"
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

          <View className="flex-row mt-12 items-center">
            <View className="relative h-[300px] w-[140px]">
              <Image
                source={require('../assets/AnalysisPage.png')}
                className="absolute -left-4 top-8 h-full w-full -rotate-[25deg] rounded-3xl border border-white/60 bg-white shadow-md"
                resizeMode="cover"
              />
            </View>
            <View className="relative h-[300px] w-[140px]">
              <Image
                source={require('../assets/HomePage.png')}
                className="absolute -left-4 top-4 h-full w-full -rotate-[17deg] rounded-3xl border border-white/70 bg-white shadow-md"
                resizeMode="cover"
              />
            </View>
            <View className="relative h-[300px] w-[140px]">
              <Image
                source={require('../assets/MoodPage.png')}
                className="absolute -left-3 top-1 z-10 h-full w-full -rotate-[8deg] rounded-3xl border border-white bg-white shadow-lg"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SplashFeatures;
