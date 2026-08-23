#!/usr/bin/env python3
"""Patch android/app/build.gradle to use keystore.properties for release signing."""
import re

with open('android/app/build.gradle', 'r') as f:
    c = f.read()

if 'keystoreProperties' in c:
    print('Already patched')
    exit(0)

# Add keystoreProperties loader before android {
loader = 'def keystorePropertiesFile = rootProject.file("keystore.properties")\n'
loader += 'def keystoreProperties = new Properties()\n'
loader += 'if (keystorePropertiesFile.exists()) {\n'
loader += '    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))\n'
loader += '}\n\n'
c = re.sub(r'(android \{)', loader + r'\1', c, count=1)

# Replace signingConfigs block
sc = 'signingConfigs {\n'
sc += '    release {\n'
sc += '        storeFile keystoreProperties.storeFile ? file(keystoreProperties.storeFile) : file("release.keystore")\n'
sc += '        storePassword keystoreProperties["storePassword"]\n'
sc += '        keyAlias keystoreProperties["keyAlias"]\n'
sc += '        keyPassword keystoreProperties["keyPassword"]\n'
sc += '    }\n'
sc += '}'
c = re.sub(r'signingConfigs \{[\s\S]*?\n    \}', sc, c)

with open('android/app/build.gradle', 'w') as f:
    f.write(c)

print('Patched signing config')
