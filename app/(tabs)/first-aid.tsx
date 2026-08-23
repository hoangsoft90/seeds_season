/**
 * First Aid Screen — Sơ cứu cây (client-side, no auth, no API).
 * Wizard: chọn triệu chứng → câu hỏi → diagnosis + remedy.
 */
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from "react-native";
import { useRouter } from "expo-router";
import {
  getFirstAidSymptoms,
  getNextNode,
  getNode,
  isDiagnosis,
  isQuestion,
} from "../../lib/first-aid";
import type { FirstAidNode, FirstAidSymptom } from "../../lib/data/first-aid";
import { t, onLanguageChange } from "../../lib/i18n";
import { AppBannerAd } from "../../components/BannerAd";

export default function FirstAidScreen() {
  const router = useRouter();
  const symptoms = getFirstAidSymptoms();

  // Re-render on language change
  const [, setTick] = useState(0);
  useEffect(() => {
    return onLanguageChange(() => setTick((n) => n + 1));
  }, []);

  const [selectedSymptom, setSelectedSymptom] = useState<FirstAidSymptom | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const currentNode = selectedSymptom && currentNodeId
    ? getNode(selectedSymptom, currentNodeId)
    : null;

  const handleSelectSymptom = (symptom: FirstAidSymptom) => {
    setSelectedSymptom(symptom);
    setCurrentNodeId(symptom.startNodeId);
    setHistory([]);
  };

  const handleAnswer = (answerId: string) => {
    if (!selectedSymptom || !currentNodeId) return;
    const next = getNextNode(selectedSymptom, currentNodeId, answerId);
    if (next) {
      setHistory([...history, currentNodeId]);
      setCurrentNodeId(next.id);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentNodeId(prev);
    }
  };

  const handleRestart = () => {
    setSelectedSymptom(null);
    setCurrentNodeId(null);
    setHistory([]);
  };

  // Safe back handler
  useEffect(() => {
    const onBackPress = () => {
      if (currentNodeId) {
        // If in a question/diagnosis, go back within wizard
        if (history.length > 0) {
          handleBack();
          return true;
        }
        // If at first question, restart
        handleRestart();
        return true;
      }
      // If at symptom list, go to home tab
      router.navigate("/(tabs)/index");
      return true;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [router, currentNodeId, history]);

  // Show symptom selection
  if (!selectedSymptom || !currentNode) {
    return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("firstAid.title")}</Text>
        <Text style={styles.subtitle}>{t("firstAid.subtitle")}</Text>
        <View style={styles.symptomGrid}>
          {symptoms.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.symptomCard}
              onPress={() => handleSelectSymptom(s)}
            >
              <Text style={styles.symptomIcon}>{s.icon}</Text>
              <Text style={styles.symptomLabel}>{s.label}</Text>
              <Text style={styles.symptomDesc}>{s.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.adSpacer} />
      </ScrollView>
      <AppBannerAd />
    </View>
    );
  }

  // Show question
  if (isQuestion(currentNode)) {
    return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>{t("firstAid.back")}</Text>
        </TouchableOpacity>
        <Text style={styles.questionText}>{currentNode.question}</Text>
        {currentNode.answers.map((a) => (
          <TouchableOpacity
            key={a.id}
            style={styles.answerBtn}
            onPress={() => handleAnswer(a.id)}
          >
            <Text style={styles.answerText}>{a.label}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.adSpacer} />
      </ScrollView>
      <AppBannerAd />
    </View>
    );
  }

  // Show diagnosis
  return (
  <View style={styles.screen}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.diagnosisCard}>
        <Text style={styles.diagnosisTitle}>{t("firstAid.diagnosis")}</Text>
        <Text style={styles.diagnosisText}>{currentNode.diagnosis}</Text>

        <Text style={styles.remedyTitle}>{t("firstAid.remedy")}</Text>
        {currentNode.remedy.map((step, i) => (
          <Text key={i} style={styles.remedyStep}>
            {i + 1}. {step}
          </Text>
        ))}

        <View style={styles.seekHelp}>
          <Text style={styles.seekHelpText}>💡 {currentNode.seekHelp}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.restartBtn} onPress={handleRestart}>
        <Text style={styles.restartBtnText}>{t("firstAid.restart")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.homeBtn} onPress={() => router.navigate("/(tabs)/index")}>
        <Text style={styles.homeBtnText}>{t("firstAid.home")}</Text>
      </TouchableOpacity>
      <View style={styles.adSpacer} />
    </ScrollView>
    <AppBannerAd />
  </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fef2f2" },
  container: { flex: 1, backgroundColor: "#fef2f2" },
  content: { padding: 16, paddingBottom: 80 },
  adSpacer: { height: 60 },
  title: { fontSize: 26, fontWeight: "bold", color: "#991b1b", marginBottom: 4 },
  subtitle: { fontSize: 15, color: "#6b7280", marginBottom: 16 },
  symptomGrid: { gap: 12 },
  symptomCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  symptomIcon: { fontSize: 32, marginBottom: 4 },
  symptomLabel: { fontSize: 18, fontWeight: "bold", color: "#991b1b" },
  symptomDesc: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  backBtn: { marginBottom: 16 },
  backBtnText: { fontSize: 14, color: "#22c55e", fontWeight: "600" },
  questionText: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 20 },
  answerBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  answerText: { fontSize: 15, color: "#374151" },
  diagnosisCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#22c55e",
  },
  diagnosisTitle: { fontSize: 18, fontWeight: "bold", color: "#166534", marginBottom: 8 },
  diagnosisText: { fontSize: 15, color: "#374151", marginBottom: 16 },
  remedyTitle: { fontSize: 16, fontWeight: "bold", color: "#166534", marginBottom: 8 },
  remedyStep: { fontSize: 14, color: "#374151", marginBottom: 6, lineHeight: 20 },
  seekHelp: { backgroundColor: "#fef3c7", borderRadius: 8, padding: 12, marginTop: 12 },
  seekHelpText: { fontSize: 13, color: "#92400e" },
  restartBtn: {
    marginTop: 16,
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  restartBtnText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  homeBtn: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#22c55e",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  homeBtnText: { color: "#22c55e", fontSize: 15, fontWeight: "600" },
});
