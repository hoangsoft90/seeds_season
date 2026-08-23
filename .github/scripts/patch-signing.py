#!/usr/bin/env python3
"""Patch android/app/build.gradle to use keystore.properties for release signing."""
import re
import sys

BUILD_GRADLE = "android/app/build.gradle"

with open(BUILD_GRADLE, "r") as f:
    content = f.read()

if "keystoreProperties" in content:
    print("Already patched, skipping")
    sys.exit(0)

# 1. Add keystoreProperties loader before 'android {'
loader = (
    'def keystorePropertiesFile = rootProject.file("keystore.properties")\n'
    "def keystoreProperties = new Properties()\n"
    "if (keystorePropertiesFile.exists()) {\n"
    "    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))\n"
    "}\n\n"
)
content = re.sub(r"(android \{)", loader + r"\1", content, count=1)

# 2. Replace signingConfigs block with release signing
signing = """signingConfigs {
    release {
        storeFile keystoreProperties.storeFile ? file(keystoreProperties.storeFile) : file("release.keystore")
        storePassword keystoreProperties["storePassword"]
        keyAlias keystoreProperties["keyAlias"]
        keyPassword keystoreProperties["keyPassword"]
    }
}"""
content = re.sub(r"signingConfigs \{[\s\S]*?\n    \}", signing, content)

with open(BUILD_GRADLE, "w") as f:
    f.write(content)

print("Patched build.gradle with release signing config")
