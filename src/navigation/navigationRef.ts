import { createNavigationContainerRef } from "@react-navigation/native";
import type { RootStackParamList } from "./AppNavigator";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

let pendingDepressionTestNavigation = false;

export const navigateToDepressionTestForm = () => {
  if (!navigationRef.isReady()) {
    pendingDepressionTestNavigation = true;
    return;
  }

  navigationRef.navigate("TestForm", { mood: "neutral" });
};

export const flushPendingNavigation = () => {
  if (!pendingDepressionTestNavigation || !navigationRef.isReady()) {
    return;
  }

  pendingDepressionTestNavigation = false;
  navigationRef.navigate("TestForm", { mood: "neutral" });
};
