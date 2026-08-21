/**
 * Home Screen — Onboarding + Recommendations.
 * 
 * Flow:
 * 1. User picks region + month + location_type + sunlight + pot_depth
 * 2. Engine runs → Top 3 recommendations
 * 3. Display with CropCard components
 */
import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { getRecommendations } from "../../lib/recommendation-engine/engine";
import { ALL_CROPS } from "../../lib/data/crops";
import type {
  Region,
  LocationType,
  RecommendationContext,
} from "../../lib/recommendation-engine/types";
import { REGION_LABELS, CATEGORY_LABEL, DIFFICULTY_LABEL } from "../../lib/labels";
import { buildWhyText } from "../../lib/explanation";
import { AppBannerAd } from "../../components/BannerAd";

const REGIONS: Region[] = ["north_vietnam", "south_vietnam", "highland_vietnam"];
const LOCATION_TYPES: LocationType[] = ["window", "balcony", "garden"];
const LOCATION_LABELS: Record<LocationType, string> = {
  window: "🪟 Cửa sổ",
  balcony: "🌿 Ban công",
  garden: "🌳 Sân vườn",
};

const MONTHS = [
  "T1", "T2", "T3", "T4", "T5", "T6",
  "T7", "T8", "T9", "T10", "T11", "T12",
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(
    null
  );
  const [sunlight, setSunlight] = useState(5);
  const [potDepth, setPotDepth] = useState(20);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [recommendations, setRecommendations] = useState<ReturnType<typeof getRecommendations> | null>(null);

  const runRecommendation = useCallback(() => {
    if (!selectedRegion || !selectedLocation) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn vùng và vị trí trồng.");
      return;
    }

    const ctx: RecommendationContext = {
      region: selectedRegion,
      month: selectedMonth,
      location_type: selectedLocation,
      sunlight_hours: sunlight,
      pot_depth_cm: potDepth,
    };

    const result = getRecommendations(ctx, ALL_CROPS);
    setRecommendations(result);
    setShowOnboarding(false);
  }, [selectedRegion, selectedMonth, selectedLocation, sunlight, potDepth]);

  if (showOnboarding || !recommendations) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>🌱 Trồng Gì Hôm Nay</Text>
        <Text style={styles.subtitle}>
          Gợi ý cây trồng phù hợp với ban công của bạn
        </Text>

        {/* Region */}
        <Text style={styles.label}>Vùng khí hậu:</Text>
        <View style={styles.row}>
          {REGIONS.map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.chip,
                selectedRegion === r && styles.chipActive,
              ]}
              onPress={() => setSelectedRegion(r)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedRegion === r && styles.chipTextActive,
                ]}
              >
                {REGION_LABELS[r]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Month */}
        <Text style={styles.label}>Tháng hiện tại:</Text>
        <View style={styles.row}>
          {MONTHS.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.chipSmall,
                selectedMonth === i + 1 && styles.chipActive,
              ]}
              onPress={() => setSelectedMonth(i + 1)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedMonth === i + 1 && styles.chipTextActive,
                ]}
              >
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location type */}
        <Text style={styles.label}>Vị trí trồng:</Text>
        <View style={styles.row}>
          {LOCATION_TYPES.map((lt) => (
            <TouchableOpacity
              key={lt}
              style={[
                styles.chip,
                selectedLocation === lt && styles.chipActive,
              ]}
              onPress={() => setSelectedLocation(lt)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedLocation === lt && styles.chipTextActive,
                ]}
              >
                {LOCATION_LABELS[lt]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sunlight */}
        <Text style={styles.label}>Giờ nắng/ngày: {sunlight}h</Text>
        <View style={styles.row}>
          {[2, 4, 6, 8].map((h) => (
            <TouchableOpacity
              key={h}
              style={[
                styles.chipSmall,
                sunlight === h && styles.chipActive,
              ]}
              onPress={() => setSunlight(h)}
            >
              <Text
                style={[
                  styles.chipText,
                  sunlight === h && styles.chipTextActive,
                ]}
              >
                {h}h
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pot depth */}
        <Text style={styles.label}>Độ sâu chậu: {potDepth}cm</Text>
        <View style={styles.row}>
          {[10, 15, 20, 30].map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.chipSmall,
                potDepth === d && styles.chipActive,
              ]}
              onPress={() => setPotDepth(d)}
            >
              <Text
                style={[
                  styles.chipText,
                  potDepth === d && styles.chipTextActive,
                ]}
              >
                {d}cm
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.button} onPress={runRecommendation}>
          <Text style={styles.buttonText}>🔍 Gợi ý cho tôi</Text>
        </TouchableOpacity>

        <AppBannerAd />
      </ScrollView>
    );
  }

  // Show recommendations
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🌱 Kết quả gợi ý</Text>

      {recommendations.status === "no_match" ? (
        <View style={styles.noMatch}>
          <Text style={styles.noMatchText}>{recommendations.message}</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>🪴 Gợi ý tốt nhất cho bạn</Text>
          {recommendations.recommendations.map((rec, i) => (
            <TouchableOpacity
              key={rec.crop.crop_base.id}
              style={styles.cropCard}
              onPress={() =>
                router.push(`/crops/${rec.crop.crop_base.id}`)
              }
            >
              <View style={styles.cropHeader}>
                <Text style={styles.cropName}>
                  {rec.crop.crop_base.names.canonical_vi}
                </Text>
                <Text style={styles.cropRole}>
                  {rec.role === "easy" ? "🟢 Dễ" : "🟡 Bước lên"}
                </Text>
              </View>
              <Text style={styles.cropMeta}>
                {CATEGORY_LABEL[rec.crop.crop_base.category]} ·{" "}
                {DIFFICULTY_LABEL[rec.crop.crop_base.base_difficulty]} · ⭐{" "}
                {rec.score.toFixed(0)}
              </Text>
              <Text style={styles.cropWhy}>
                {buildWhyText(
                  rec.crop,
                  rec.components,
                  selectedRegion!,
                  rec.role
                )}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.buttonOutline}
              onPress={() => setShowOnboarding(true)}
            >
              <Text style={styles.buttonOutlineText}>🔄 Chọn lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/garden")}
            >
              <Text style={styles.buttonText}>🪴 Vườn của tôi</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <AppBannerAd />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  content: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 26, fontWeight: "bold", color: "#166534", marginBottom: 4 },
  subtitle: { fontSize: 15, color: "#4b5563", marginBottom: 20 },
  label: { fontSize: 15, fontWeight: "600", color: "#374151", marginTop: 16, marginBottom: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
  },
  chipSmall: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
  },
  chipActive: { backgroundColor: "#22c55e" },
  chipText: { fontSize: 13, color: "#374151" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  button: {
    marginTop: 20,
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  buttonOutline: {
    marginTop: 12,
    borderWidth: 2,
    borderColor: "#22c55e",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonOutlineText: { color: "#22c55e", fontSize: 15, fontWeight: "600" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#166534", marginBottom: 12 },
  cropCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cropHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cropName: { fontSize: 18, fontWeight: "bold", color: "#166534" },
  cropRole: { fontSize: 12, color: "#6b7280" },
  cropMeta: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  cropWhy: { fontSize: 13, color: "#374151", marginTop: 8, lineHeight: 18 },
  noMatch: { backgroundColor: "#fef3c7", padding: 16, borderRadius: 12, marginTop: 16 },
  noMatchText: { fontSize: 15, color: "#92400e" },
  actions: { flexDirection: "row", gap: 12, marginTop: 12 },
});
