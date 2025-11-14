import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import BottomTabNavigator from './BottomTabNavigator';
import EmergencyContact from '../screens/EmergencyContact';
import SplashIntro from '../screens/SplashIntro';
import SplashFeatures from '../screens/SplashFeatures';

export type RootStackParamList = {
  SplashIntro: undefined;
  SplashFeatures: undefined;
  Login: undefined;
  SignUp: undefined;
  EmergencyContact: undefined;
  MainTabs: undefined;
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
      <Stack.Screen name="EmergencyContact" component={EmergencyContact} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
