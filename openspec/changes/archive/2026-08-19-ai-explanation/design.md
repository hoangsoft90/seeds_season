# Design: ai-explanation

## Architecture

```
API Route (/api/recommendations)
    │
    ▼
getExplanations(context, crops, provider)
    │
    ├── provider exists + API key configured?
    │       │
    │       ├── cache hit (< 5min) → cached explanations
    │       │
    │       ├── AI success → cache + return explanations
    │       │
    │       └── AI fail/timeout → template fallback
    │
    └── no provider / no key → template fallback (as before)
```

## ExplainProvider Interface

```typescript
interface ExplainInput {
  cropName: string;
  cropCategory: string;
  score: number;
  components: ComponentScores;
  region: string;
  month: number;
  weather?: WeatherInfo;
}

interface ExplainProvider {
  explain(input: ExplainInput): Promise<string>;
}
```

## OpenAI Integration
- Model: `gpt-4o-mini` (cheap, fast, good Vietnamese)
- System prompt: "Bạn là trợ lý làm vườn. Giải thích ngắn gọn (2-3 câu) tại sao cây X phù hợp với điều kiện Y. Dùng ngôn ngữ đơn giản, thân thiện."
- Max tokens: 150
- Temperature: 0.7 (tự nhiên nhưng không quá sáng tạo)

## Fallback
Khi không có API key hoặc API fail → dùng template text hiện tại từ `lib/explanation.ts`.

## Caching
In-memory cache với TTL 5 phút, key = `cropId + region + month`.

## Files
- `lib/explanation/ai-provider.ts` — mới: ExplainProvider interface + OpenAI implementation
- `lib/explanation/index.ts` — sửa: thêm cache + fallback logic
- `app/api/recommendations/route.ts` — sửa: dùng ExplainProvider
- `tests/explanation-ai.test.ts` — mới: test provider + cache + fallback
