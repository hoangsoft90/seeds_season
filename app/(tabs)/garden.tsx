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
import { t } from "../../lib/i18n";
import { getCropLocalName } from "../../lib/i18n/crops-i18n";

// Default country for garden plants (MVP: all plants stored as Vietnam)
const DEFAULT_COUNTRY = "vietnam";

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
      <Text style={styles.title}>{t("garden.title")}</Text>

      {plants.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>{t("garden.emptyIcon")}</Text>
          <Text style={styles.emptyText}>{t("garden.empty")}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/")}
          >
            <Text style={styles.buttonText}>{t("garden.findPlants")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Growing section */}
          {growing.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{t("garden.growing", { count: growing.length })}</Text>
              {growing.map((p) => {
                const crop = getCropById(DEFAULT_COUNTRY, p.crop_id);
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.card}
                    onPress={() => router.push(`/crops/${p.crop_id}?country=${DEFAULT_COUNTRY}`)}
                  >
                    <Text style={styles.cardName}>
                      {getCropLocalName(p.crop_id, crop?.crop_base.names.canonical_vi ?? p.crop_id)}
                    </Text>
                    <Text style={styles.cardMeta}>
                      {t("garden.plantedOn", { date: new Date(p.planted_at).toLocaleDateString() })}
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
              <Text style={styles.sectionTitle}>{t("garden.harvested", { count: harvested.length })}</Text>
              {harvested.map((p) => {
                const crop = getCropById(DEFAULT_COUNTRY, p.crop_id);
                return (
                  <View key={p.id} style={styles.cardHarvested}>
                    <Text style={styles.cardName}>
                      {getCropLocalName(p.crop_id, crop?.crop_base.names.canonical_vi ?? p.crop_id)}
                    </Text>
                    <Text style={styles.cardMeta}>
                      {t("garden.harvestedOn", { date: new Date(p.harvested_at!).toLocaleDateString() })}
                    </Text>
                  </View>
                );
              })}
            </>
          )}

          {/* Ghost section */}
          {ghosts.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{t("garden.ghost", { count: ghosts.length })}</Text>
              {ghosts.map((p) => {
                const crop = getCropById(DEFAULT_COUNTRY, p.crop_id);
                const causeLabel = p.cause
                  ? GHOST_CAUSE_LABEL[p.cause as GhostCause] ?? p.cause
                  : t("garden.ghostCause");
                return (
                  <View key={p.id} style={styles.cardGhost}>
                    <Text style={styles.cardName}>
                      {getCropLocalName(p.crop_id, crop?.crop_base.names.canonical_vi ?? p.crop_id)}
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
