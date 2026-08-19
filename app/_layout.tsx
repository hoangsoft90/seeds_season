import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
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
        <Stack.Screen
          name="first-aid"
          options={{ title: "🆘 Sơ cứu cây", presentation: "card" }}
        />
        <Stack.Screen
          name="garden"
          options={{ title: "🪴 Vườn của tôi", presentation: "card" }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
