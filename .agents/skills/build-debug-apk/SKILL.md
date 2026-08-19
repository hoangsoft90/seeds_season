# Skill: Build Debug APK (Expo + EAS)

## Trigger
When user asks to "build debug APK", "push code and build", "deploy to GitHub", or "build Android APK".

## ⚠️ CRITICAL: Build via EAS (no local Android SDK)
The project is now **Expo React Native**. Builds use **EAS Build** (Expo Application Services) — cloud-based, no local SDK needed.

## Context
- **Repo**: `https://github.com/hoangsoft90/seeds_season`
- **Branch**: `main`
- **GitHub Token**: `$GH_TOKEN` (from `.env.local`)
- **Expo Token**: stored as `EXPO_TOKEN` secret in GitHub repo settings

## Workflow

### 1. Ensure code is committed and pushed
```bash
git add -A
git commit -m "feat: <description>"
git push origin main
```

### 2. GitHub Actions workflow triggers automatically on push to `main`
- **CI** workflow: `.github/workflows/ci.yml` (tests + typecheck)
- **Build Debug APK (EAS)** workflow: `.github/workflows/build-debug-apk.yml`

### 3. Check workflow status
```bash
curl -s -H "Authorization: token $GH_TOKEN" \
  "https://api.github.com/repos/hoangsoft90/seeds_season/actions/runs?per_page=3" | \
  python3 -c "import sys,json; data=json.load(sys.stdin); [print(f'{r[\"id\"]}: {r[\"status\"]} — {r[\"conclusion\"] or \"pending\"} — {r[\"name\"]}') for r in data.get('workflow_runs',[])]"
```

### 4. Download APK from EAS
- Go to: `https://expo.dev` → find project `seeds-season`
- Click latest build → Download APK
- Or use: `eas build:list --limit 1` to get build URL

## Technical Details

### Build process (EAS Build — cloud)
1. `npm ci` — install dependencies
2. `npm test` — run 37 tests (golden + first-aid + explanation)
3. `eas build --platform android --profile preview` — build APK on EAS cloud
4. APK available for download from Expo dashboard

### Project structure (Expo React Native)
- `app/` — Expo Router screens (tabs + detail pages)
- `lib/` — Pure TypeScript logic (recommendation engine, first-aid, garden store)
- `components/` — React Native components
- `tests/` — Vitest tests (37 golden + first-aid + explanation)
- `app.json` — Expo config
- `eas.json` — EAS build profiles

### Known issues
- **EAS Token**: Need `EXPO_TOKEN` secret in GitHub repo settings for CI builds
- **First build**: May need to run `eas build:configure` locally first
- **Expo Go**: Use `npx expo start` for development (no APK needed)

## Verification
After build completes:
```bash
# Check latest run status
curl -s -H "Authorization: token $GH_TOKEN" \
  "https://api.github.com/repos/hoangsoft90/seeds_season/actions/runs?per_page=1" | \
  python3 -c "import sys,json; r=json.load(sys.stdin)['workflow_runs'][0]; print(f'{r[\"name\"]}: {r[\"conclusion\"]}')"
```
