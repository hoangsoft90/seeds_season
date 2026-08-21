# Build Debug APK — GitHub Actions

## Repo Info
- **Repo URL:** `https://github.com/hoangsoft90/seeds_season`
- **Workflow:** `.github/workflows/build-debug-apk.yml`
- **Trigger:** Push to `main` or manual dispatch
- **Output:** Standalone debug APK artifact (~140MB with embedded JS)

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
2. Patch Kotlin version: `1.9.24` → `1.9.25` in version catalogs
3. `npx expo prebuild --platform android --no-install --clean`
4. **Key fix:** `sed -i 's|//.*debuggableVariants.*|debuggableVariants = []|' android/app/build.gradle`
5. `./gradlew assembleDebug`
6. Upload artifact

## Important: Standalone APK (No Metro)
- Default: `debuggableVariants` includes debug → debug skips JS bundling → white screen
- Fix: `debuggableVariants = []` → ALL variants bundle JS → standalone APK
- **DO NOT** use `bundleInDebug = true` (property doesn't exist)
- **DO NOT** use `// debuggableVariants = ["debug"]` sed pattern (Expo generates different format)
- Correct sed: `sed -i 's|//.*debuggableVariants.*|debuggableVariants = []|'`

## Installing APK on Phone
```bash
# Uninstall old version first (signature mismatch)
adb uninstall com.tronggihomnay.app

# Push APK to device (slow over WiFi, ~7 min for 140MB)
adb push app-debug.apk /data/local/tmp/app-debug.apk

# Install from device
adb shell pm install /data/local/tmp/app-debug.apk

# Launch
adb shell am start -n com.tronggihomnay.app/.MainActivity
```

## Known Issues
- **Kotlin version mismatch:** Patch version catalogs in node_modules
- **kotlin-stdlib version conflict:** AdMob (react-native-google-mobile-ads) pulls kotlin-stdlib:2.1.0 which is incompatible with Kotlin compiler 1.9.x. Fix: append resolutionStrategy to root android/build.gradle AFTER expo prebuild.
- **Node.js 22+ required:** Expo SDK 52
- **No local Android build:** Only via GitHub Actions
- **APK size:** ~140MB (includes Hermes + JS bundle + assets)
- **WiFi ADB push is slow:** ~7 min for 140MB

## AdMob Build Fix (kotlin-stdlib:2.1.0)

**Root cause:** `react-native-google-mobile-ads@15.8.3` has transitive dep on `kotlin-stdlib:2.1.0`. Kotlin compiler 1.9.x can only read metadata up to 2.0.0 → "Incompatible classes" error.

**Fix (in workflow, AFTER expo prebuild):**
```bash
# Append to android/build.gradle (NOT sed — too fragile)
cat >> android/build.gradle << 'EOF'
allprojects {
    configurations.all {
        resolutionStrategy {
            force "org.jetbrains.kotlin:kotlin-stdlib:1.9.25"
            force "org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.9.25"
            force "org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.9.25"
            force "org.jetbrains.kotlin:kotlin-stdlib-common:1.9.25"
        }
    }
}
EOF
```

**Why this works:** Gradle allows multiple `allprojects` blocks. The appended one forces all Kotlin deps to 1.9.25, overriding the transitive 2.1.0.

**Why NOT sed:** Previous sed approach to patch individual build.gradle files was fragile — different files have different structure, and the `find | while read` pattern was unreliable in CI.
