import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import "../lib/i18n"; // Initialize i18n on app start

// Sentry + AdMob removed temporarily to debug "Text strings" error
// import * as Sentry from "@sentry/react-native";
// import "../sentry.config";
// import { AdMobProvider } from "../components/AdMobProvider";

function RootLayoutInner() {
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
          options={{ title: "Chi tiết cây", presentation: "card" }}
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
