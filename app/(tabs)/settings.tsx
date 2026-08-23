/**
 * Settings Screen — language picker, app info, links.
 */
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import {
  LANGUAGES,
  getCurrentLanguage,
  setLanguage,
  onLanguageChange,
  type LanguageCode,
  t,
} from "../../lib/i18n";

export default function SettingsScreen() {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState<LanguageCode>(getCurrentLanguage());

  // Re-render when language changes from any source
  useEffect(() => {
    return onLanguageChange(() => setCurrentLang(getCurrentLanguage()));
  }, []);

  const handleSelectLanguage = async (lang: LanguageCode) => {
    await setLanguage(lang);
    setCurrentLang(lang);
  };

  const current = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t("settings.title") || "⚙️ Settings"}</Text>

      {/* Language Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("settings.language") || "🌐 Language"}</Text>
        <Text style={styles.sectionDesc}>
          {t("settings.languageDesc") || "Choose your preferred language"}
        </Text>
        <View style={styles.languageGrid}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageCard,
                lang.code === currentLang && styles.languageCardActive,
              ]}
              onPress={() => handleSelectLanguage(lang.code)}
            >
              <Text style={styles.languageFlag}>{lang.flag}</Text>
              <Text
                style={[
                  styles.languageLabel,
                  lang.code === currentLang && styles.languageLabelActive,
                ]}
              >
                {lang.label}
              </Text>
              {lang.code === currentLang && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("settings.about") || "ℹ️ About"}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t("settings.appName") || "App"}</Text>
          <Text style={styles.infoValue}>🌱 Seeds Season</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t("settings.version") || "Version"}</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t("settings.currentLang") || "Current language"}</Text>
          <Text style={styles.infoValue}>{current.flag} {current.label}</Text>
        </View>
      </View>

      {/* Privacy Policy */}
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.push("/privacy-policy")}
      >
        <Text style={styles.linkText}>{t("settings.privacyPolicy") || "🔒 Privacy Policy"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  content: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 26, fontWeight: "bold", color: "#166534", marginBottom: 20 },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#166534", marginBottom: 4 },
  sectionDesc: { fontSize: 13, color: "#6b7280", marginBottom: 12 },
  languageGrid: { gap: 8 },
  languageCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 2,
    borderColor: "transparent",
  },
  languageCardActive: {
    backgroundColor: "#dcfce7",
    borderColor: "#22c55e",
  },
  languageFlag: { fontSize: 28, marginRight: 12 },
  languageLabel: { fontSize: 16, color: "#374151", flex: 1 },
  languageLabelActive: { color: "#166534", fontWeight: "bold" },
  check: { fontSize: 20, color: "#22c55e", fontWeight: "bold" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoLabel: { fontSize: 14, color: "#6b7280" },
  infoValue: { fontSize: 14, color: "#374151", fontWeight: "500" },
  linkButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    elevation: 1,
  },
  linkText: { fontSize: 15, color: "#22c55e", fontWeight: "600" },
});
