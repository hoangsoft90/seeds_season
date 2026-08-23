/**
 * WeatherBadge — fetches and displays current weather from Open-Meteo.
 * Shows temperature + condition icon. Used on the home screen.
 */
import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { OpenMeteoWeatherProvider } from "../lib/recommendation-engine/weather";
import type { WeatherInfo } from "../lib/recommendation-engine/types";
import { t } from "../lib/i18n";

interface WeatherBadgeProps {
  region: string;
  country?: string;
}

/** Map condition string to emoji. */
function conditionEmoji(condition: string | undefined): string {
  switch (condition) {
    case "clear": return "☀️";
    case "cloudy": return "⛅";
    case "fog": return "🌫️";
    case "rain": return "🌧️";
    case "snow": return "❄️";
    default: return "🌤️";
  }
}

/** Map condition string to label. */
function conditionLabel(condition: string | undefined): string {
  switch (condition) {
    case "clear": return "Clear";
    case "cloudy": return "Cloudy";
    case "fog": return "Foggy";
    case "rain": return "Rainy";
    case "snow": return "Snowy";
    default: return "Fair";
  }
}

export default function WeatherBadge({ region, country }: WeatherBadgeProps) {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const provider = new OpenMeteoWeatherProvider();
    provider
      .getWeather({ region, month: new Date().getMonth() + 1, location_type: "balcony", sunlight_hours: 5, pot_depth_cm: 20, country: country ?? "vietnam" })
      .then((data) => {
        if (!cancelled) {
          setWeather(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [region, country]);

  if (loading) {
    return (
      <View style={styles.badge}>
        <Text style={styles.loadingText}>🌤️ {t("weather.loading")}</Text>
      </View>
    );
  }

  if (!weather) return null;

  const max = weather.forecast_temp_max_c ?? 0;
  const min = weather.forecast_temp_min_c ?? 0;
  const avg = Math.round((max + min) / 2);
  const emoji = conditionEmoji(weather.forecast_condition ?? undefined);
  const label = conditionLabel(weather.forecast_condition ?? undefined);

  return (
    <View style={styles.badge}>
      <Text style={styles.temp}>{emoji} {avg}°C</Text>
      <Text style={styles.detail}>
        ↑{Math.round(max)}° ↓{Math.round(min)}° · {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#dbeafe",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  temp: { fontSize: 18, fontWeight: "bold", color: "#1e40af" },
  detail: { fontSize: 13, color: "#3b82f6" },
  loadingText: { fontSize: 13, color: "#6b7280" },
});
