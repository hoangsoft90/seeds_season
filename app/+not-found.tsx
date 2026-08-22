/**
 * Not Found Screen — catches invalid deep links and routes.
 */
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { t } from "../lib/i18n";

export default function NotFoundScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ url?: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <Text style={styles.title}>{t("notFound.title") || "Page Not Found"}</Text>
      <Text style={styles.subtitle}>
        {params.url
          ? `${t("notFound.invalidUrl") || "Invalid URL"}: ${params.url}`
          : t("notFound.message") || "The page you're looking for doesn't exist."}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.buttonText}>{t("notFound.goHome") || "Go to Home"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    padding: 24,
  },
  icon: { fontSize: 64, marginBottom: 16 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
