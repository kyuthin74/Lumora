import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import BottomTabNavigator from './BottomTabNavigator';
import type { BottomTabParamList } from './BottomTabNavigator';
import EmergencyContact from '../screens/EmergencyContact';
import SplashIntro from '../screens/SplashIntro';
import SplashFeatures from '../screens/SplashFeatures';
import LogMood from '../screens/LogMood';
import TestForm from '../screens/TestForm';
import HighRiskAlert from '../screens/HighRiskAlert';
import MoodJournal from '../screens/MoodJournal';
import Home from '../screens/Home';
import NudgeScreen from '../screens/Nudge';
import AccountRemoved from '../screens/AccRemoved';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  SplashIntro: undefined;
  SplashFeatures: undefined;
  Login: undefined;
  SignUp: undefined;
  EmergencyContact: { userId?: string; token?: string } | undefined;
  Home: undefined,
  LogMood: undefined;
  TestForm: { mood: string };
  HighRiskAlert: undefined;
  MoodJournal: undefined;
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  Nudge: { riskValue: number };
  AccountRemoved: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashIntro"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SplashIntro" component={SplashIntro} />
      <Stack.Screen name="SplashFeatures" component={SplashFeatures} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="EmergencyContact" component={EmergencyContact} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="LogMood" component={LogMood} />
      <Stack.Screen name="TestForm" component={TestForm} />
      <Stack.Screen name="HighRiskAlert" component={HighRiskAlert} />
      <Stack.Screen name="MoodJournal" component={MoodJournal} />
      <Stack.Screen name="Nudge" component={NudgeScreen} />
      <Stack.Screen name="AccountRemoved" component={AccountRemoved} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
