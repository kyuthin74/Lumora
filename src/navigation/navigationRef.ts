import { createNavigationContainerRef } from "@react-navigation/native";
import type { RootStackParamList } from "./AppNavigator";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

let pendingRouteNavigation: keyof RootStackParamList | null = null;

export const navigateToDepressionTestForm = () => {
  if (!navigationRef.isReady()) {
    pendingRouteNavigation = "TestForm";
    return;
  }

  navigationRef.navigate("TestForm", { mood: "neutral" });
};

export const navigateToLogMood = () => {
  if (!navigationRef.isReady()) {
    pendingRouteNavigation = "LogMood";
    return;
  }

  navigationRef.navigate("LogMood");
};

export const flushPendingNavigation = () => {
  if (!pendingRouteNavigation || !navigationRef.isReady()) {
    return;
  }

  const routeName = pendingRouteNavigation;
  pendingRouteNavigation = null;

  if (routeName === "TestForm") {
    navigationRef.navigate("TestForm", { mood: "neutral" });
    return;
  }

  navigationRef.navigate(routeName);
};
