/**
 * Tab Layout — 4 tabs: Home, Garden, First Aid, Settings.
 * Titles update dynamically when language changes (via event listener).
 */
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useState, useCallback } from "react";
import { t, onLanguageChange } from "../../lib/i18n";
import { useEffect } from "react";

export default function TabLayout() {
  // Force re-render when language changes
  const [, setTick] = useState(0);

  useEffect(() => {
    return onLanguageChange(() => setTick((n) => n + 1));
  }, []);

  const homeTitle = t("tabs.home");
  const gardenTitle = t("tabs.garden");
  const firstAidTitle = t("tabs.firstAid");
  const settingsTitle = t("tabs.settings") || "Settings";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#22c55e",
        headerStyle: { backgroundColor: "#22c55e" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: homeTitle,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="garden"
        options={{
          title: gardenTitle,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🪴</Text>,
        }}
      />
      <Tabs.Screen
        name="first-aid"
        options={{
          title: firstAidTitle,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🆘</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: settingsTitle,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
