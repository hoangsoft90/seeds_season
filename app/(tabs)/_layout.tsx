/**
 * Tab Layout — 3 main tabs: Home, Garden, First Aid.
 * Titles update dynamically when language changes (via useFocusEffect).
 */
import { Tabs, useFocusEffect } from "expo-router";
import { Text } from "react-native";
import { useState, useCallback } from "react";
import { t, getCurrentLanguage } from "../../lib/i18n";

export default function TabLayout() {
  // Track language to force re-render on language change
  const [lang, setLang] = useState(getCurrentLanguage());

  useFocusEffect(
    useCallback(() => {
      const current = getCurrentLanguage();
      if (current !== lang) {
        setLang(current);
      }
    }, [lang])
  );

  // Re-compute titles on each render (lang dependency triggers re-render)
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
