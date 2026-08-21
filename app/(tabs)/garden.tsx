/**
 * Garden Screen — My Garden tab (simplified without auth for MVP).
 * Uses AsyncStorage-based store.
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
import { listGarden, markGhost } from "../../lib/garden/store";
import type { GhostCause } from "../../lib/garden/types";
import { GHOST_CAUSE_LABEL } from "../../lib/labels";
import { AppBannerAd } from "../../components/BannerAd";
import { getCropById } from "../../lib/data/crops";

const DEMO_USER = "demo-user";

const GHOST_CAUSES: GhostCause[] = ["sun_heat", "pest", "waterlogged", "unknown"];

export default function GardenScreen() {
  const router = useRouter();
  const [plants, setPlants] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const list = await listGarden(DEMO_USER);
    setPlants(list);
    setLoaded(true);
  }, []);

  // Load on mount (simplified — no useEffect in this MVP)
  if (!loaded) {
    refresh();
  }

  const growing = plants.filter((p) => p.status === "growing");
  const ghosts = plants.filter((p) => p.status === "ghost");
  const harvested = plants.filter((p) => p.status === "harvested");

  const handleMarkGhost = async (plantId: string, cause: GhostCause) => {
    await markGhost(DEMO_USER, plantId, cause);
    refresh();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🪴 Vườn của tôi</Text>

      {plants.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🌱</Text>
          <Text style={styles.emptyText}>Chưa có cây nào trong vườn</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/")}
          >
            <Text style={styles.buttonText}>🔍 Tìm cây trồng</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Growing section */}
          {growing.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>🌿 Đang trồng ({growing.length})</Text>
              {growing.map((p) => {
                const crop = getCropById(p.crop_id);
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.card}
                    onPress={() => router.push(`/crops/${p.crop_id}`)}
                  >
                    <Text style={styles.cardName}>
                      {crop?.crop_base.names.canonical_vi ?? p.crop_id}
                    </Text>
                    <Text style={styles.cardMeta}>
                      Trồng ngày {new Date(p.planted_at).toLocaleDateString("vi-VN")}
                    </Text>
                    <View style={styles.ghostButtons}>
                      {GHOST_CAUSES.map((cause) => (
                        <TouchableOpacity
                          key={cause}
                          style={styles.ghostBtn}
                          onPress={() => handleMarkGhost(p.id, cause)}
                        >
                          <Text style={styles.ghostBtnText}>
                            {GHOST_CAUSE_LABEL[cause]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {/* Harvested section */}
          {harvested.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>🎉 Đã thu hoạch ({harvested.length})</Text>
              {harvested.map((p) => {
                const crop = getCropById(p.crop_id);
                return (
                  <View key={p.id} style={styles.cardHarvested}>
                    <Text style={styles.cardName}>
                      {crop?.crop_base.names.canonical_vi ?? p.crop_id}
                    </Text>
                    <Text style={styles.cardMeta}>
                      Thu hoạch ngày{" "}
                      {new Date(p.harvested_at!).toLocaleDateString("vi-VN")}
                    </Text>
                  </View>
                );
              })}
            </>
          )}

          {/* Ghost section */}
          {ghosts.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>👻 Lịch sử ({ghosts.length})</Text>
              {ghosts.map((p) => {
                const crop = getCropById(p.crop_id);
                const causeLabel = p.cause
                  ? GHOST_CAUSE_LABEL[p.cause as GhostCause] ?? p.cause
                  : "Không rõ";
                return (
                  <View key={p.id} style={styles.cardGhost}>
                    <Text style={styles.cardName}>
                      {crop?.crop_base.names.canonical_vi ?? p.crop_id}
                    </Text>
                    <Text style={styles.cardMeta}>
                      {causeLabel} ·{" "}
                      {new Date(p.died_at!).toLocaleDateString("vi-VN")}
                    </Text>
                  </View>
                );
              })}
            </>
          )}
        </>
      )}

      <AppBannerAd />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  content: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 26, fontWeight: "bold", color: "#166534", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#166534", marginTop: 16, marginBottom: 8 },
  empty: { alignItems: "center", marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: "#6b7280", marginBottom: 16 },
  button: { backgroundColor: "#22c55e", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHarvested: {
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardGhost: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    opacity: 0.7,
  },
  cardName: { fontSize: 16, fontWeight: "bold", color: "#166534" },
  cardMeta: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  ghostButtons: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  ghostBtn: { backgroundColor: "#fee2e2", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  ghostBtnText: { fontSize: 11, color: "#991b1b" },
});
