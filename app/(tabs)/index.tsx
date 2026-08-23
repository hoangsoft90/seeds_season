/**
 * Home Screen — Onboarding + Recommendations (Multi-country).
 */
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import { useRouter } from "expo-router";
import { getRecommendations } from "../../lib/recommendation-engine/engine";
import { OpenMeteoWeatherProvider } from "../../lib/recommendation-engine/weather";
import { getCropsForCountry } from "../../lib/data/crops";
import { getAllCountries, getCountryConfig } from "../../lib/data/countries";
import type {
  LocationType,
  RecommendationContext,
} from "../../lib/recommendation-engine/types";
import type { CountryConfig } from "../../lib/data/countries/types";
import { CATEGORY_LABEL, DIFFICULTY_LABEL } from "../../lib/labels";
import { buildWhyText } from "../../lib/explanation";
import { t, getCurrentLanguage, onLanguageChange } from "../../lib/i18n";
import { getCropLocalName } from "../../lib/i18n/crops-i18n";
import { AppBannerAd } from "../../components/BannerAd";

const LOCATION_TYPES: LocationType[] = ["window", "balcony", "garden"];

const MONTHS = [
  "T1", "T2", "T3", "T4", "T5", "T6",
  "T7", "T8", "T9", "T10", "T11", "T12",
];

const COUNTRIES = getAllCountries();

export default function HomeScreen() {
  const router = useRouter();
  const backPressCount = useRef(0);

  // Re-render on language change
  const [, setTick] = useState(0);
  useEffect(() => {
    return onLanguageChange(() => setTick((n) => n + 1));
  }, []);

  // Safe back handler — double-tap to exit on Home tab
  useEffect(() => {
    const onBackPress = () => {
      if (backPressCount.current === 0) {
        backPressCount.current = 1;
        Alert.alert(t("common.exitTitle") || "Exit", t("common.exitMsg") || "Press back again to exit", [
          { text: "OK", onPress: () => { backPressCount.current = 0; } },
        ]);
        setTimeout(() => { backPressCount.current = 0; }, 2000);
        return true; // prevent default exit
      }
      return false; // allow default exit
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, []);

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
  const [sunlight, setSunlight] = useState(5);
  const [potDepth, setPotDepth] = useState(20);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [recommendations, setRecommendations] = useState<ReturnType<typeof getRecommendations> | null>(null);

  const countryConfig = useMemo(() => {
    if (!selectedCountry) return null;
    return getCountryConfig(selectedCountry);
  }, [selectedCountry]);

  const countryCrops = useMemo(() => {
    if (!selectedCountry) return [];
    return getCropsForCountry(selectedCountry);
  }, [selectedCountry]);

  const regionLabels = useMemo(() => {
    if (!countryConfig) return {};
    const labels: Record<string, string> = {};
    for (const r of countryConfig.regions) {
      labels[r.id] = r.name;
    }
    return labels;
  }, [countryConfig]);

  const monthNames = useMemo(() => {
    if (!countryConfig) return MONTHS;
    return countryConfig.month_names?.map((_: string, i: number) => `T${i + 1}`) ?? MONTHS;
  }, [countryConfig]);

  const runRecommendation = useCallback(async () => {
    if (!selectedCountry || !selectedRegion || !selectedLocation) {
      Alert.alert(t("onboarding.missingInfo"), t("onboarding.missingInfoMsg"));
      return;
    }

    const ctx: RecommendationContext = {
      country: selectedCountry,
      region: selectedRegion,
      month: selectedMonth,
      location_type: selectedLocation,
      sunlight_hours: sunlight,
      pot_depth_cm: potDepth,
    };

    // Use real weather from Open-Meteo API (free, no key needed)
    let weatherData = undefined;
    try {
      const weatherProvider = new OpenMeteoWeatherProvider();
      weatherData = await weatherProvider.getWeather(ctx);
    } catch {
      // Fallback to dummy weather if API fails
    }
    const ctxWithWeather = weatherData ? { ...ctx, weather: weatherData } : ctx;
    const result = getRecommendations(ctxWithWeather, countryCrops);
    setRecommendations(result);
    setShowOnboarding(false);
  }, [selectedCountry, selectedRegion, selectedMonth, selectedLocation, sunlight, potDepth, countryCrops]);

  const handleCountrySelect = useCallback((countryId: string) => {
    setSelectedCountry(countryId);
    setSelectedRegion(null);
  }, []);

  const locationLabels: Record<LocationType, string> = {
    window: t("location.window"),
    balcony: t("location.balcony"),
    garden: t("location.garden"),
  };

  if (showOnboarding || !recommendations) {
    return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("onboarding.title")}</Text>
        <Text style={styles.subtitle}>{t("onboarding.subtitle")}</Text>

        <Text style={styles.label}>{t("onboarding.country")}</Text>
        <View style={styles.row}>
          {COUNTRIES.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.chip, selectedCountry === c.id && styles.chipActive]}
              onPress={() => handleCountrySelect(c.id)}
            >
              <Text style={[styles.chipText, selectedCountry === c.id && styles.chipTextActive]}>
                {c.name_local} ({c.name_en})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {countryConfig ? (
          <View>
            <Text style={styles.label}>{t("onboarding.region")}</Text>
            <View style={styles.row}>
              {countryConfig.regions.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.chip, selectedRegion === r.id && styles.chipActive]}
                  onPress={() => setSelectedRegion(r.id)}
                >
                  <Text style={[styles.chipText, selectedRegion === r.id && styles.chipTextActive]}>
                    {r.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}

        <Text style={styles.label}>{t("onboarding.month")}</Text>
        <View style={styles.row}>
          {monthNames.map((m, i) => (
            <TouchableOpacity
              key={`m${i}`}
              style={[styles.chipSmall, selectedMonth === i + 1 && styles.chipActive]}
              onPress={() => setSelectedMonth(i + 1)}
            >
              <Text style={[styles.chipText, selectedMonth === i + 1 && styles.chipTextActive]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{t("onboarding.location")}</Text>
        <View style={styles.row}>
          {LOCATION_TYPES.map((lt) => (
            <TouchableOpacity
              key={lt}
              style={[styles.chip, selectedLocation === lt && styles.chipActive]}
              onPress={() => setSelectedLocation(lt)}
            >
              <Text style={[styles.chipText, selectedLocation === lt && styles.chipTextActive]}>
                {locationLabels[lt]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{t("onboarding.sunlight", { hours: sunlight })}</Text>
        <View style={styles.row}>
          {[2, 4, 6, 8].map((h) => (
            <TouchableOpacity
              key={`s${h}`}
              style={[styles.chipSmall, sunlight === h && styles.chipActive]}
              onPress={() => setSunlight(h)}
            >
              <Text style={[styles.chipText, sunlight === h && styles.chipTextActive]}>
                {h}h
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{t("onboarding.potDepth", { depth: potDepth })}</Text>
        <View style={styles.row}>
          {[10, 15, 20, 30].map((d) => (
            <TouchableOpacity
              key={`p${d}`}
              style={[styles.chipSmall, potDepth === d && styles.chipActive]}
              onPress={() => setPotDepth(d)}
            >
              <Text style={[styles.chipText, potDepth === d && styles.chipTextActive]}>
                {d}cm
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedCountry ? (
          <Text style={styles.cropCount}>
            📊 {t("onboarding.cropCount", { count: countryCrops.length, country: countryConfig?.name_local ?? selectedCountry })}
          </Text>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={runRecommendation}>
          <Text style={styles.buttonText}>{t("onboarding.submit")}</Text>
        </TouchableOpacity>
        <View style={styles.adSpacer} />
      </ScrollView>
      <AppBannerAd />
    </View>
    );
  }

  return (
    <View style={styles.screen}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t("results.title")}</Text>
      <Text style={styles.subtitle}>
        {countryConfig?.name_local} · {regionLabels[selectedRegion!] ?? selectedRegion}
      </Text>

      {recommendations.status === "no_match" ? (
        <View style={styles.noMatch}>
          <Text style={styles.noMatchText}>{t("engine.noMatch")}</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.sectionTitle}>{t("results.bestForYou")}</Text>
          {recommendations.recommendations.map((rec) => (
            <TouchableOpacity
              key={rec.crop.crop_base.id}
              style={styles.cropCard}
              onPress={() =>
                router.push(`/crops/${rec.crop.crop_base.id}?country=${selectedCountry}`)
              }
            >
              <View style={styles.cropHeader}>
                <Text style={styles.cropName}>
                  {getCropLocalName(rec.crop.crop_base.id, rec.crop.crop_base.names.canonical_vi)}
                </Text>
                <Text style={styles.cropRole}>
                  {rec.role === "easy" ? t("results.easy") : t("results.stepUp")}
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
                  rec.role,
                  { regionLabels },
                  t
                )}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.buttonOutline}
              onPress={() => setShowOnboarding(true)}
            >
              <Text style={styles.buttonOutlineText}>{t("results.rechoose")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.navigate("/(tabs)/garden")}
            >
              <Text style={styles.buttonText}>{t("results.myGarden")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.adSpacer} />
    </ScrollView>
    <AppBannerAd />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f0fdf4" },
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  content: { padding: 16, paddingBottom: 80 },
  adSpacer: { height: 60 },
  title: { fontSize: 26, fontWeight: "bold", color: "#166534", marginBottom: 4 },
  subtitle: { fontSize: 15, color: "#4b5563", marginBottom: 20 },
  label: { fontSize: 15, fontWeight: "600", color: "#374151", marginTop: 16, marginBottom: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: "#e5e7eb" },
  chipSmall: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, backgroundColor: "#e5e7eb" },
  chipActive: { backgroundColor: "#22c55e" },
  chipText: { fontSize: 13, color: "#374151" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  cropCount: { fontSize: 13, color: "#6b7280", marginTop: 12, fontStyle: "italic" },
  button: { marginTop: 20, backgroundColor: "#22c55e", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  buttonOutline: { marginTop: 12, borderWidth: 2, borderColor: "#22c55e", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  buttonOutlineText: { color: "#22c55e", fontSize: 15, fontWeight: "600" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#166534", marginBottom: 12 },
  cropCard: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cropHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cropName: { fontSize: 18, fontWeight: "bold", color: "#166534" },
  cropRole: { fontSize: 12, color: "#6b7280" },
  cropMeta: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  cropWhy: { fontSize: 13, color: "#374151", marginTop: 8, lineHeight: 18 },
  noMatch: { backgroundColor: "#fef3c7", padding: 16, borderRadius: 12, marginTop: 16 },
  noMatchText: { fontSize: 15, color: "#92400e" },
  actions: { flexDirection: "row", gap: 12, marginTop: 12 },
});
