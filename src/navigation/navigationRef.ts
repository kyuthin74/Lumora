import { createNavigationContainerRef } from "@react-navigation/native";
import type { RootStackParamList } from "./AppNavigator";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

type PendingPushRoute = "TestForm" | "Home";
let pendingRouteNavigation: PendingPushRoute | null = null;

export const navigateToDepressionTestForm = () => {
  if (!navigationRef.isReady()) {
    pendingRouteNavigation = "TestForm";
    return;
  }

  navigationRef.navigate("TestForm", { mood: "neutral" });
};

export const navigateToHome = () => {
  if (!navigationRef.isReady()) {
    pendingRouteNavigation = "Home";
    return;
  }

  navigationRef.navigate("MainTabs", { screen: "Home" });
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

  navigationRef.navigate("MainTabs", { screen: "Home" });
};
