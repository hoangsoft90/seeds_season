import { Tabs } from "expo-router";
import { Text } from "react-native";

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
          title: "Trang chủ",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="garden"
        options={{
          title: "Vườn",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🪴</Text>,
        }}
      />
      <Tabs.Screen
        name="first-aid"
        options={{
          title: "Sơ cứu",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🆘</Text>,
        }}
      />
    </Tabs>
  );
}
