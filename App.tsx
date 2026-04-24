/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './global.css';
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import AppNavigator from './src/navigation/AppNavigator';
import { displayForegroundNotification } from './src/services/localNotifications';
import {
  attachFcmTokenRefreshListener,
  loadPushStatusForSession,
  registerFcmToken,
} from './src/services/pushNotifications';
import {
  flushPendingNavigation,
  navigateToLogMood,
  navigationRef,
} from './src/navigation/navigationRef';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const initializePushState = async () => {
      const [authToken, userId] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('userId'),
      ]);

      if (!authToken || !userId) {
        return;
      }

      try {
        await loadPushStatusForSession(authToken);
      } catch (error) {
        // Push status should never force a logout; keep session intact.
        console.error('Failed to load push notification status on app start:', error);
      }
    };

    initializePushState();

    const unsubscribeNotificationTap = messaging().onNotificationOpenedApp(() => {
      navigateToLogMood();
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          navigateToLogMood();
        }
      })
      .catch((error) => {
        console.error('Failed to read initial notification:', error);
      });

    const unsubscribeTokenRefresh = attachFcmTokenRefreshListener(async (newFcmToken) => {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        return;
      }

      await registerFcmToken(authToken, newFcmToken);
    });

    const unsubscribeForegroundMessages = messaging().onMessage(async (remoteMessage) => {
      try {
        await displayForegroundNotification(remoteMessage);
      } catch (error) {
        console.error('Failed to display foreground notification:', error);
      }
    });

    return () => {
      unsubscribeNotificationTap();
      unsubscribeTokenRefresh();
      unsubscribeForegroundMessages();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} onReady={flushPendingNavigation}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
