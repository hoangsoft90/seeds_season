import { Stack } from "expo-router";
import { t, onLanguageChange } from "../lib/i18n";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, Text } from "react-native";
import { useState, useEffect } from "react";
import "../lib/i18n"; // Initialize i18n on app start

// Sentry + AdMob removed temporarily to debug "Text strings" error
// import * as Sentry from "@sentry/react-native";
// import "../sentry.config";
// import { AdMobProvider } from "../components/AdMobProvider";

function RootLayoutInner() {
  // Re-render on language change so Stack screen titles update
  const [, setTick] = useState(0);
  useEffect(() => {
    return onLanguageChange(() => setTick((n) => n + 1));
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      {/* AdMobProvider removed temporarily */}
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#22c55e" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="crops/[id]"
          options={{ title: t("tabs.cropDetail"), presentation: "card" }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

// Export without Sentry.wrap temporarily
export default RootLayoutInner;

const styles = StyleSheet.create({
  root: { flex: 1 },
});
