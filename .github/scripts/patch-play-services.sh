#!/bin/bash
ROOT_BUILD="android/build.gradle"
if grep -q "resolutionStrategy" "$ROOT_BUILD" 2>/dev/null; then
  echo "Already patched"
  exit 0
fi

cat >> "$ROOT_BUILD" << 'GRADLEOF'

allprojects {
    configurations.all {
        resolutionStrategy {
            force "com.google.android.gms:play-services-ads:23.6.0"
            force "org.jetbrains.kotlin:kotlin-stdlib:1.9.25"
            force "org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.9.25"
            force "org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.9.25"
            force "org.jetbrains.kotlin:kotlin-stdlib-common:1.9.25"
        }
    }
}
GRADLEOF

echo "Patched $ROOT_BUILD"
