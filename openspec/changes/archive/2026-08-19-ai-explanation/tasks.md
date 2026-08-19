# Tasks: ai-explanation

## Tasks

- [x] 1. Define ExplainProvider interface trong lib/explanation/ai-provider.ts
- [x] 2. Implement OpenAIExplanationProvider (gpt-4o-mini, system prompt tiếng Việt, max 150 tokens)
- [x] 3. Thêm cache + fallback logic (no key = template, API fail = template, cache 5 phút)
- [x] 4. Wire provider vào /api/recommendations route (Promise.all cho 3 crops song song)
- [x] 5. Unit tests: provider + cache + fallback + template unchanged (5 tests)
- [x] 6. Verify: tsc/lint干净, 84/84 test, build OK
