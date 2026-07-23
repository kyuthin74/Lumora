# Lumora

Lumora is a React Native frontend for a mental health support app. It focuses on mood tracking, mental health screening, guided navigation, notifications, and profile/account management. The app is built with TypeScript, NativeWind, and React Navigation, and it connects to a separate backend API for authentication, risk scoring, notifications, and push token sync.

## Features

- Authentication flow with login, sign up, forgot password, verification, and reset password screens
- Guided onboarding with splash and feature introduction screens
- Mood logging and mood journal history
- Depression risk screening and result-based nudges
- Analysis view for trends and insights
- AI chatbot tab for conversational support
- Emergency contact and high-risk alert flows
- Push notifications and daily reminder preference sync
- Profile, notifications, and account management screens
- Native mobile navigation with stack and bottom tab flows

## Tech Stack

- React Native CLI
- TypeScript
- NativeWind and Tailwind CSS styling
- React Navigation stack and bottom tabs
- Firebase Cloud Messaging
- Notifee local notifications
- AsyncStorage for session and preference persistence
- React Native Reanimated, Gesture Handler, SVG, and charting libraries

## Setup

### Prerequisites

- Node.js 20 or newer
- Android Studio with an emulator or device set up
- Xcode and CocoaPods for iOS development on macOS
- A running backend API for authentication, risk prediction, and notifications

### Install dependencies

```sh
npm install
```

### Start Metro

```sh
npm start
```

### Run on Android

```sh
npm run android
```

### Run on iOS

```sh
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
```

## Backend Integration

Lumora expects a separate backend for API calls such as depression risk scoring, push notification registration, notification history, and account workflows.

- Backend repository: [Lumora backend](https://github.com/kyuthin74/lumora_backend)

## Project Structure

- [App.tsx](App.tsx): app bootstrap, navigation container, and notification/session setup
- [src/navigation/AppNavigator.tsx](src/navigation/AppNavigator.tsx): root stack navigation
- [src/navigation/BottomTabNavigator.tsx](src/navigation/BottomTabNavigator.tsx): main tab navigation
- [src/screens/](src/screens): all user-facing screens
- [src/services/](src/services): push and local notification services
- [src/components/](src/components): reusable UI components

## Development Notes

- The app uses async storage to keep auth and notification preferences between sessions.
- Push notifications are synchronized with the backend when a user is signed in.
- The depression test flow posts form data to the backend and shows a nudge screen based on the returned risk score.

## Testing

```sh
npm test
```

## Troubleshooting

- If Metro is already running, close the old terminal before starting a new session.
- If iOS pods are out of date, rerun `bundle exec pod install` inside the `ios` folder.
- If backend calls fail, confirm the API base URL in [src/config/api.ts](src/config/api.ts) and verify the server is running.
