# Build Debug APK — GitHub Actions

## Repo Info
- **Repo URL:** `https://github.com/hoangsoft90/seeds_season`
- **Workflow:** `.github/workflows/build-debug-apk.yml`
- **Trigger:** Push to `main` or manual dispatch
- **Output:** Standalone debug APK artifact (~40MB)

## How to Trigger Build
1. Make changes → commit → push to `main`
2. GitHub Actions auto-builds the APK
3. Download: Actions tab → latest "Build Debug APK" → Artifacts → `debug-apk.zip`

## How to Push Code
```bash
cd /home/dev4vn/htdocs_apps/seeds_season
git remote set-url origin "https://<GITHUB_TOKEN>@github.com/hoangsoft90/seeds_season.git"
git add -A
git commit -m "your message"
git push origin main
```

**Token:** Read from env or ask user. Never hardcode.

## Build Process (in workflow)
1. `npm install` + `npm test`
2. Patch Kotlin version: `1.9.24` → `1.9.25` in `node_modules/react-native/gradle/libs.versions.toml`
3. `npx expo prebuild --platform android --no-install --clean` — generates `android/` folder
4. **Key fix:** `sed -i 's|// debuggableVariants = ["debug"]|debuggableVariants = []|' android/app/build.gradle` — makes debug variant also bundle JS (standalone, no Metro)
5. `./gradlew assembleDebug` — builds APK with embedded JS bundle
6. Upload artifact

## Important: Standalone APK (No Metro)
The APK must be standalone — no dependency on Metro dev server.
- Default Expo: `debuggableVariants = ["debug"]` → debug skips JS bundling
- Fix: `debuggableVariants = []` → ALL variants bundle JS
- **DO NOT use `bundleInDebug = true`** — property does not exist in React Native Gradle Plugin

## Known Issues
- **Kotlin version mismatch:** `expo-modules-core` needs Kotlin 1.9.25 but RN defaults to 1.9.24 → patch version catalogs in node_modules
- **Node.js 22+ required:** Capacitor 8 / Expo SDK 52 needs Node 22
- **No local Android build:** Do NOT build locally — only via GitHub Actions
- **APK size:** ~40MB (includes Hermes engine + JS bundle + assets)

## Installing APK on Phone
```bash
adb install -r app-debug.apk
```
