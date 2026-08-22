/**
 * Crop Detail Screen — shows full crop info with timeline, growing rules, etc.
 */
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import { getCropById } from "../../lib/data/crops";
import { getCountryConfig } from "../../lib/data/countries";
import { addPlant } from "../../lib/garden/store";
import {
  CATEGORY_LABEL,
  DIFFICULTY_LABEL,
  WATER_LABEL,
  soilLabel,
} from "../../lib/labels";
import { AppBannerAd } from "../../components/BannerAd";
import { t } from "../../lib/i18n";
import { getCropLocalName } from "../../lib/i18n/crops-i18n";

const DEMO_USER = "demo-user";

export default function CropDetailScreen() {
  const { id, country } = useLocalSearchParams<{ id: string; country?: string }>();
  const router = useRouter();
  const cropId = id ?? "";
  const countryId = country ?? "vietnam";
  const crop = getCropById(countryId, cropId);
  const countryConfig = getCountryConfig(countryId);

  // Build region labels from country config
  const regionLabels: Record<string, string> = {};
  if (countryConfig) {
    for (const r of countryConfig.regions) {
      regionLabels[r.id] = r.name;
    }
  }

  // Safe back handler (hardware back button)
  useEffect(() => {
    const onBackPress = () => {
      router.back();
      return true; // prevent default
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [router]);

  if (!crop) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>{t("cropDetail.notFound")}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>{t("cropDetail.back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const base = crop.crop_base;
  const hc = crop.hard_constraints;
  const rules = crop.growing_rules;
  const beg = crop.beginner_success_factors;
  const [minDays, maxDays] = base.timeline_base.days_to_harvest;
  const [minGerm, maxGerm] = base.timeline_base.germination_days;

  const handleAddToGarden = async () => {
    try {
      await addPlant(DEMO_USER, base.id);
      Alert.alert(t("common.success"), t("cropDetail.addedSuccess", { name: getCropLocalName(base.id, base.names.canonical_vi) }), [
        { text: t("cropDetail.viewGarden"), onPress: () => router.navigate("/(tabs)/garden") },
        { text: "OK" },
      ]);
    } catch (e: any) {
      Alert.alert(t("common.error"), e.message);
    }
  };

  return (
    <View style={styles.screen}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.name}>{getCropLocalName(base.id, base.names.canonical_vi)}</Text>
      <Text style={styles.scientific}>{base.names.scientific}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaChip}>{CATEGORY_LABEL[base.category]}</Text>
        <Text style={styles.metaChip}>{DIFFICULTY_LABEL[base.base_difficulty]}</Text>
      </View>

      {/* Timeline */}
      <Section title={t("cropDetail.timeline")}>
        <Text style={styles.text}>
          {t("cropDetail.germination", { min: minGerm, max: maxGerm })}
        </Text>
        <Text style={styles.text}>
          {t("cropDetail.harvest", { min: minDays, max: maxDays })}
        </Text>
      </Section>

      {/* Growing Stages */}
      {base.timeline_base.growth_stages.length > 0 && (
        <Section title={t("cropDetail.stages")}>
          {base.timeline_base.growth_stages.map((stage, i) => (
            <Text key={i} style={styles.text}>
              • {stage.stage}: {t("cropDetail.days")} {stage.day_range[0]}-{stage.day_range[1]}
            </Text>
          ))}
        </Section>
      )}

      {/* Optimal conditions */}
      <Section title={t("cropDetail.conditions")}>
        <Text style={styles.text}>
          {t("cropDetail.temperature", {
            min: rules.optimal_conditions.temperature_c.optimal_min,
            max: rules.optimal_conditions.temperature_c.optimal_max,
            deathMin: rules.optimal_conditions.temperature_c.min,
            deathMax: rules.optimal_conditions.temperature_c.max,
          })}
        </Text>
        <Text style={styles.text}>
          {t("cropDetail.sunlight", {
            min: rules.optimal_conditions.sunlight_hours.min,
            optimal: rules.optimal_conditions.sunlight_hours.optimal,
          })}
        </Text>
        <Text style={styles.text}>
          {t("cropDetail.water")}: {WATER_LABEL[rules.optimal_conditions.water] ?? rules.optimal_conditions.water}
        </Text>
        <Text style={styles.text}>
          {t("cropDetail.soil")}: {soilLabel(rules.optimal_conditions.soil)}
        </Text>
      </Section>

      {/* Hard constraints */}
      <Section title={t("cropDetail.constraints")}>
        <Text style={styles.text}>
          {t("cropDetail.maxTemp", { value: hc.temp_death_max_c.value, reason: hc.temp_death_max_c.reason })}
        </Text>
        <Text style={styles.text}>
          {t("cropDetail.minTemp", { value: hc.temp_death_min_c.value, reason: hc.temp_death_min_c.reason })}
        </Text>
        <Text style={styles.text}>
          {t("cropDetail.minSun", { value: hc.min_sunlight_hours })}
        </Text>
        <Text style={styles.text}>
          {t("cropDetail.minPot", { value: hc.min_pot_depth_cm })}
        </Text>
      </Section>

      {/* Regional rules */}
      {Object.keys(rules.regional_rules).length > 0 && (
        <Section title={t("cropDetail.regional")}>
          {Object.entries(rules.regional_rules).map(([region, rule]) => {
            if (!rule) return null;
            return (
              <View key={region} style={styles.regionBlock}>
                <Text style={styles.regionTitle}>
                  {regionLabels[region] ?? region}
                </Text>
                {rule.planting_windows.map((w, i) => (
                  <Text key={i} style={styles.text}>
                    • {t("cropDetail.window", { type: w.type ?? "primary", months: w.months.join(", ") })}
                  </Text>
                ))}
                {rule.regional_notes && <Text style={styles.text}>📝 {rule.regional_notes}</Text>}
              </View>
            );
          })}
        </Section>
      )}

      {/* Beginner factors */}
      <Section title={t("cropDetail.beginner")}>
        <Text style={styles.text}>
          {t("cropDetail.overwatering", { value: beg.forgiveness_overwatering })}
        </Text>
        <Text style={styles.text}>
          {t("cropDetail.underwatering", { value: beg.forgiveness_underwatering })}
        </Text>
        <Text style={styles.text}>
          {t("cropDetail.disease", { value: beg.disease_resistance })}
        </Text>
        {beg.notes && <Text style={styles.text}>📝 {beg.notes}</Text>}
      </Section>

      {/* Add to garden */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddToGarden}>
        <Text style={styles.addButtonText}>{t("cropDetail.addToGarden")}</Text>
      </TouchableOpacity>

      {/* First Aid link */}
      <TouchableOpacity
        style={styles.firstAidLink}
        onPress={() => router.navigate("/(tabs)/first-aid")}
      >
        <Text style={styles.firstAidText}>{t("cropDetail.firstAidLink")}</Text>
      </TouchableOpacity>

      {/* Spacer so content doesn't overlap fixed bottom ad */}
      <View style={styles.adSpacer} />
    </ScrollView>

    {/* Fixed bottom ad — never inside ScrollView */}
    <AppBannerAd />
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f0fdf4" },
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  content: { padding: 16, paddingBottom: 80 },
  adSpacer: { height: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { fontSize: 16, color: "#6b7280" },
  link: { fontSize: 14, color: "#22c55e", marginTop: 8 },
  name: { fontSize: 28, fontWeight: "bold", color: "#166534" },
  scientific: { fontSize: 14, color: "#6b7280", fontStyle: "italic", marginTop: 2 },
  metaRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  metaChip: {
    backgroundColor: "#dcfce7",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 13,
    color: "#166534",
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#166534", marginBottom: 8 },
  text: { fontSize: 14, color: "#374151", marginBottom: 4, lineHeight: 20 },
  regionBlock: { marginTop: 8 },
  regionTitle: { fontSize: 14, fontWeight: "bold", color: "#166534" },
  addButton: {
    marginTop: 20,
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  firstAidLink: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#fca5a5",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  firstAidText: { fontSize: 14, color: "#991b1b" },
});
