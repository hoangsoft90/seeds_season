import { Tabs } from "expo-router";
import { Text } from "react-native";
import { t } from "../../lib/i18n";

export default function TabLayout() {
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
          title: t("tabs.home"),
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="garden"
        options={{
          title: t("tabs.garden"),
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🪴</Text>,
        }}
      />
      <Tabs.Screen
        name="first-aid"
        options={{
          title: t("tabs.firstAid"),
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🆘</Text>,
        }}
      />
    </Tabs>
  );
}
