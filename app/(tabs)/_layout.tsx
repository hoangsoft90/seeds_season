/**
 * Tab Layout — 4 tabs: Home, Garden, First Aid, Settings.
 * headerTitle shows full text (no truncation), tab bar shows short emoji labels.
 */
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useState, useEffect } from "react";
import { t, onLanguageChange } from "../../lib/i18n";

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
        headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: homeTitle,
          headerTitle: t("tabs.homeFull") || "Home",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="garden"
        options={{
          title: gardenTitle,
          headerTitle: t("tabs.gardenFull") || "My Garden",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🪴</Text>,
        }}
      />
      <Tabs.Screen
        name="first-aid"
        options={{
          title: firstAidTitle,
          headerTitle: t("tabs.firstAidFull") || "First Aid",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🆘</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: settingsTitle,
          headerTitle: t("tabs.settingsFull") || "Settings",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
