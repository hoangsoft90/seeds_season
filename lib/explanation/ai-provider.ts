/**
 * AI Explanation Provider (change ai-explanation, plan mục 7).
 *
 * Gọi OpenAI gpt-4o-mini để generate explanation text tự nhiên hơn template.
 * KHÔNG thay đổi recommendation engine — chỉ diễn giải kết quả.
 *
 * Fallback: khi không có API key hoặc API fail → dùng template text hiện tại.
 */

import type { ComponentScores } from "../recommendation-engine/scoring";
import type { Crop, Region, WeatherInfo } from "../recommendation-engine/types";
import { REGION_LABELS } from "../labels";

interface ExplainInput {
  crop: Crop;
  components: ComponentScores;
  region: Region;
  role: "easy" | "step_up";
  month: number;
  weather?: WeatherInfo;
}

interface CacheEntry {
  text: string;
  timestamp: number;
}

const explanationCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function cacheKey(cropId: string, region: Region, month: number): string {
  return `${cropId}:${region}:${month}`;
}

function getCached(cropId: string, region: Region, month: number): string | null {
  const key = cacheKey(cropId, region, month);
  const entry = explanationCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.text;
  }
  explanationCache.delete(key);
  return null;
}

function setCache(cropId: string, region: Region, month: number, text: string): void {
  const key = cacheKey(cropId, region, month);
  explanationCache.set(key, { text, timestamp: Date.now() });
}

/** Xây prompt cho OpenAI từ crop data + scores. */
function buildPrompt(input: ExplainInput): string {
  const { crop, components, region, role, month, weather } = input;
  const name = crop.crop_base.names.canonical_vi;
  const category = crop.crop_base.category;
  const [minDays, maxDays] = crop.crop_base.timeline_base.days_to_harvest;

  let prompt = `Giải thích ngắn gọn (2-3 câu, thân thiện, đơn giản) tại sao ${name} (${category}) là gợi ý tốt cho người mới trồng ban công ở ${REGION_LABELS[region]} tháng ${month}.\n\n`;
  prompt += `Điểm số: Season ${components.season}/100, Temperature ${components.temperature}/100, Beginner ${components.beginner}/100, Fast Harvest ${components.fast_harvest}/100.\n`;
  prompt += `Thu hoạch: ${minDays}-${maxDays} ngày.\n`;

  if (weather) {
    const tMin = weather.forecast_temp_min_c ?? 20;
    const tMax = weather.forecast_temp_max_c ?? 30;
    prompt += `Nhiệt độ hiện tại: ${tMin}–${tMax}°C`;
    if (weather.forecast_condition) prompt += `, ${weather.forecast_condition}`;
    prompt += ".\n";
  }

  if (role === "step_up") {
    prompt += `Đây là cây "bước lên" — khó hơn rau lá nhưng cho quả ăn thật.\n`;
  }

  prompt += `\nChỉ trả lời nội dung giải thích, không thêm tiêu đề hay định dạng markdown.`;

  return prompt;
}

/**
 * Gọi OpenAI để generate explanation. Trả null nếu fail.
 * Dùng gpt-4o-mini (cheap, fast, good Vietnamese).
 */
async function callOpenAI(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Bạn là trợ lý làm vườn thân thiện. Giải thích ngắn gọn, đơn giản, bằng tiếng Việt. Không dùng markdown.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

/**
 * Generate explanation — thử AI trước, fallback template.
 * Template fallback được truyền vào từ bên ngoài để tránh circular dependency.
 */
export async function buildWhyTextAI(
  input: ExplainInput,
  templateFallback: string,
): Promise<string> {
  const { crop, region, month } = input;

  // Check cache
  const cached = getCached(crop.crop_base.id, region, month);
  if (cached) return cached;

  // Try AI
  const prompt = buildPrompt(input);
  const aiText = await callOpenAI(prompt);

  if (aiText) {
    setCache(crop.crop_base.id, region, month, aiText);
    return aiText;
  }

  // Fallback to template
  return templateFallback;
}

/** Clear cache — dùng cho test. */
export function clearExplanationCache(): void {
  explanationCache.clear();
}
