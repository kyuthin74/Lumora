import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Mood from '../screens/Mood';
import Analysis from '../screens/Analysis';
import Chatbot from '../screens/Chatbot';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4093D6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size ?? 24} />,
        }}
      />
      <Tab.Screen
        name="Mood"
        component={Mood}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tab.Screen
        name="Analysis"
        component={Analysis}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="line-chart" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tab.Screen
        name="Chatbot"
        component={Chatbot}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="comments" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size ?? 24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
