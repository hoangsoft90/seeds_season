/**
 * LanguageSwitcher — compact language selection UI.
 *
 * Shows current language as a chip; tapping opens a modal with all options.
 * Used in onboarding and settings.
 */
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import {
  LANGUAGES,
  getCurrentLanguage,
  setLanguage,
  type LanguageCode,
  t,
} from "../lib/i18n";

interface Props {
  /** Called after language changes so parent can re-render with new translations. */
  onLanguageChange?: (lang: LanguageCode) => void;
}

export function LanguageSwitcher({ onLanguageChange }: Props) {
  const [visible, setVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageCode>(getCurrentLanguage());

  const current = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[0];

  const handleSelect = (lang: LanguageCode) => {
    setLanguage(lang);
    setCurrentLang(lang);
    setVisible(false);
    onLanguageChange?.(lang);
  };

  return (
    <>
      <TouchableOpacity style={styles.chip} onPress={() => setVisible(true)}>
        <Text style={styles.chipText}>
          {current.flag} {current.label} ▾
        </Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>🌐 {t("languageSwitcher.title") || "Select Language"}</Text>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.option,
                  lang.code === currentLang && styles.optionActive,
                ]}
                onPress={() => handleSelect(lang.code)}
              >
                <Text style={styles.optionFlag}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    lang.code === currentLang && styles.optionLabelActive,
                  ]}
                >
                  {lang.label}
                </Text>
                {lang.code === currentLang && (
                  <Text style={styles.check}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
    alignSelf: "flex-start",
  },
  chipText: { fontSize: 13, color: "#374151" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "80%",
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 16,
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionActive: { backgroundColor: "#dcfce7" },
  optionFlag: { fontSize: 24, marginRight: 12 },
  optionLabel: { fontSize: 16, color: "#374151", flex: 1 },
  optionLabelActive: { color: "#166534", fontWeight: "bold" },
  check: { fontSize: 18, color: "#22c55e", fontWeight: "bold" },
});
