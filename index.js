/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'This method is deprecated',
  'SafeAreaView has been deprecated',
]);

messaging().setBackgroundMessageHandler(async () => {
	// Background notifications are handled by the OS; no-op keeps handler registered.
});

AppRegistry.registerComponent(appName, () => App);
