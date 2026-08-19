# Skill: Build Debug APK

## Trigger
When user asks to "build debug APK", "push code and build", "deploy to GitHub", or "build Android APK".

## ⚠️ CRITICAL: NO LOCAL ANDROID BUILD
Local environment does NOT have Android SDK / Gradle installed. ALL builds MUST go through GitHub Actions. Do NOT attempt to install Android SDK locally or run Gradle locally.

## Context
- **Repo**: `https://github.com/hoangsoft90/seeds_season`
- **Branch**: `main`
- **GitHub Token**: stored in `.env.local` as `GH_TOKEN` (do NOT commit tokens to repo)

## Workflow

### 1. Ensure code is committed and pushed
```bash
git add -A
git commit -m "feat: <description>"
git push origin main
```

### 2. GitHub Actions workflow triggers automatically on push to `main`
- **Build Debug APK** workflow: `.github/workflows/build-debug-apk.yml`
- **CI** workflow: `.github/workflows/ci.yml`

### 3. Check workflow status
```bash
curl -s -H "Authorization: token $GH_TOKEN" \
  "https://api.github.com/repos/hoangsoft90/seeds_season/actions/runs?per_page=3" | \
  python3 -c "import sys,json; data=json.load(sys.stdin); [print(f'{r[\"id\"]}: {r[\"status\"]} — {r[\"conclusion\"] or \"running\"} — {r[\"name\"]}') for r in data.get('workflow_runs',[])]"
```

### 4. Download APK artifact
- Go to: `https://github.com/hoangsoft90/seeds_season/actions`
- Click on the latest successful "Build Debug APK" run
- Download "debug-apk-xxx" artifact (contains `app-debug.apk`)
- Artifact expires after 7 days

### 5. Install on phone (if connected via ADB)
```bash
adb install -r app-debug.apk
# or for live reload testing:
adb reverse tcp:3000 tcp:3000  # forward localhost:3000 to phone
```

## Technical Details

### Build process (GitHub Actions only)
1. `npm ci` — install dependencies
2. `npm test` — run 84 tests
3. `npm run build` — build Next.js
4. Create placeholder `out/index.html` (Capacitor needs web assets)
5. `npx cap sync android` — sync Capacitor Android (requires Node.js 22+)
6. `./gradlew assembleDebug` — build debug APK

### Known issues to watch for
- **Node.js version**: Capacitor 8 requires Node.js ≥22.0.0
- **XML comments**: Android resource parser doesn't allow `--` in XML comments
- **Android SDK**: `ubuntu-latest` has pre-installed SDK, no need for `android-actions/setup-android`
- **Static export**: Next.js with API routes can't use `output: "export"`, so workflow creates placeholder `out/index.html`
- **Disk space**: local `/home` partition may be full — always build on CI

### Android config
- `android/variables.gradle`: targetSdkVersion = 36
- `android/app/src/main/res/xml/network_security_config.xml`: HTTP allowed for all domains
- `capacitor.config.ts`: appId = `com.tronggihomnay.app`
- `capacitor.config.ts`: server.url = `http://localhost:3000` (live reload via ADB reverse)

## Verification
After build completes:
```bash
# Check latest run status
curl -s -H "Authorization: token $GH_TOKEN" \
  "https://api.github.com/repos/hoangsoft90/seeds_season/actions/runs?per_page=1" | \
  python3 -c "import sys,json; r=json.load(sys.stdin)['workflow_runs'][0]; print(f'{r[\"name\"]}: {r[\"conclusion\"]}')"
```
