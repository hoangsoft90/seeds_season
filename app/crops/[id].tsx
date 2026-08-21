/**
 * Crop Detail Screen — shows full crop info with timeline, growing rules, etc.
 */
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { getCropById } from "../../lib/data/crops";
import { addPlant } from "../../lib/garden/store";
import {
  CATEGORY_LABEL,
  DIFFICULTY_LABEL,
  WATER_LABEL,
  soilLabel,
  REGION_LABELS,
} from "../../lib/labels";
import { AppBannerAd } from "../../components/BannerAd";

const DEMO_USER = "demo-user";

export default function CropDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const crop = getCropById(id ?? "");

  if (!crop) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Không tìm thấy loại cây này</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>← Quay lại</Text>
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
      Alert.alert("Thành công", `Đã thêm ${base.names.canonical_vi} vào vườn!`, [
        { text: "Xem vườn", onPress: () => router.push("/garden") },
        { text: "OK" },
      ]);
    } catch (e: any) {
      Alert.alert("Lỗi", e.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.name}>{base.names.canonical_vi}</Text>
      <Text style={styles.scientific}>{base.names.scientific}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaChip}>{CATEGORY_LABEL[base.category]}</Text>
        <Text style={styles.metaChip}>{DIFFICULTY_LABEL[base.base_difficulty]}</Text>
      </View>

      {/* Timeline */}
      <Section title="📅 Thời gian生长">
        <Text style={styles.text}>
          Nảy mầm: {minGerm}-{maxGerm} ngày
        </Text>
        <Text style={styles.text}>
          Thu hoạch: {minDays}-{maxDays} ngày
        </Text>
      </Section>

      {/* Growing Stages */}
      {base.timeline_base.growth_stages.length > 0 && (
        <Section title="🌱 Giai đoạn生长">
          {base.timeline_base.growth_stages.map((stage, i) => (
            <Text key={i} style={styles.text}>
              • {stage.stage}: ngày {stage.day_range[0]}-{stage.day_range[1]}
            </Text>
          ))}
        </Section>
      )}

      {/* Optimal conditions */}
      <Section title="🌡️ Điều kiện lý tưởng">
        <Text style={styles.text}>
          Nhiệt độ: {rules.optimal_conditions.temperature_c.optimal_min}-
          {rules.optimal_conditions.temperature_c.optimal_max}°C
          (tối thiểu {rules.optimal_conditions.temperature_c.min}°C, tối đa{" "}
          {rules.optimal_conditions.temperature_c.max}°C)
        </Text>
        <Text style={styles.text}>
          Nắng: ≥{rules.optimal_conditions.sunlight_hours.min}h, lý tưởng{" "}
          {rules.optimal_conditions.sunlight_hours.optimal}h/ngày
        </Text>
        <Text style={styles.text}>
          Nước: {WATER_LABEL[rules.optimal_conditions.water] ?? rules.optimal_conditions.water}
        </Text>
        <Text style={styles.text}>
          Đất: {soilLabel(rules.optimal_conditions.soil)}
        </Text>
      </Section>

      {/* Hard constraints */}
      <Section title="⚠️ Ngưỡng sống-chết">
        <Text style={styles.text}>
          Tối đa: {hc.temp_death_max_c.value}°C ({hc.temp_death_max_c.reason})
        </Text>
        <Text style={styles.text}>
          Tối thiểu: {hc.temp_death_min_c.value}°C ({hc.temp_death_min_c.reason})
        </Text>
        <Text style={styles.text}>
          Nắng tối thiểu: {hc.min_sunlight_hours}h/ngày
        </Text>
        <Text style={styles.text}>
          Chậu tối thiểu: {hc.min_pot_depth_cm}cm
        </Text>
      </Section>

      {/* Regional rules */}
      {Object.keys(rules.regional_rules).length > 0 && (
        <Section title="🌍 Quy tắc vùng miền">
          {Object.entries(rules.regional_rules).map(([region, rule]) => {
            if (!rule) return null;
            return (
              <View key={region} style={styles.regionBlock}>
                <Text style={styles.regionTitle}>
                  {REGION_LABELS[region as keyof typeof REGION_LABELS] ?? region}
                </Text>
                {rule.planting_windows.map((w, i) => (
                  <Text key={i} style={styles.text}>
                    • Vụ {w.type ?? "chính"}: tháng {w.months.join(", ")}
                  </Text>
                ))}
                {rule.regional_notes && (
                  <Text style={styles.text}>📝 {rule.regional_notes}</Text>
                )}
              </View>
            );
          })}
        </Section>
      )}

      {/* Beginner factors */}
      <Section title="👤 Phù hợp người mới">
        <Text style={styles.text}>
          Chịu tưới nhiều: {beg.forgiveness_overwatering}
        </Text>
        <Text style={styles.text}>
          Chịu thiếu nước: {beg.forgiveness_underwatering}
        </Text>
        <Text style={styles.text}>
          Kháng bệnh: {beg.disease_resistance}
        </Text>
        {beg.notes && <Text style={styles.text}>📝 {beg.notes}</Text>}
      </Section>

      {/* Add to garden */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddToGarden}>
        <Text style={styles.addButtonText}>🪴 Thêm vào vườn</Text>
      </TouchableOpacity>

      {/* First Aid link */}
      <TouchableOpacity
        style={styles.firstAidLink}
        onPress={() => router.push("/first-aid")}
      >
        <Text style={styles.firstAidText}>🆘 Cây có vấn đề? → Sơ cứu</Text>
      </TouchableOpacity>

      <AppBannerAd />
    </ScrollView>
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
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  content: { padding: 16, paddingBottom: 80 },
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
