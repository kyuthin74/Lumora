# Mental Health App - Lumora

A React Native CLI application built with TypeScript and NativeWind (Tailwind CSS) for mental health tracking and support.

## Features

- 🔐 **Authentication**: Login and Sign Up screens
- 🏠 **Home**: Dashboard with quick stats and activity cards
- 😊 **Mood Tracking**: Log your daily mood with notes
- 📊 **Analysis**: View mood trends and insights
- 💬 **AI Chatbot**: 24/7 mental health assistant
- 👤 **Profile**: User profile and settings

## Tech Stack

- React Native CLI
- TypeScript
- NativeWind (Tailwind CSS for React Native)
- React Navigation (Stack & Bottom Tabs)
- React Native Reanimated
- React Native Gesture Handler

## Installation

All dependencies have been installed. If you need to reinstall:

```bash
npm install
```

## Running the App

### Android

```bash
npx react-native run-android
```

### iOS

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

## Project Structure

```
MentalHealthApp/
├── src/
│   ├── screens/
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx
│   │   ├── Home.tsx
│   │   ├── Mood.tsx
│   │   ├── Analysis.tsx
│   │   ├── Chatbot.tsx
│   │   └── Profile.tsx
│   └── navigation/
│       ├── AppNavigator.tsx
│       └── BottomTabNavigator.tsx
├── App.tsx
├── global.d.ts
├── tailwind.config.js
└── babel.config.js
```

## Navigation Flow

1. **Auth Stack**: Login → SignUp → MainTabs
2. **Main Tabs**: Home, Mood, Analysis, Chatbot, Profile

## Notes

- TypeScript warnings about `className` props are expected with NativeWind. The app will work correctly at runtime.
- The AI Chatbot currently has simulated responses. You can integrate with your preferred AI service.
- Mood data is currently stored in local state. Consider integrating with AsyncStorage or a backend for persistence.

## Next Steps

1. Add backend API integration for authentication
2. Implement AsyncStorage for local data persistence
3. Integrate real AI chatbot service
4. Add more detailed analytics and charts
5. Implement push notifications for mood reminders
