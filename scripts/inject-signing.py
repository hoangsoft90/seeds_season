import re
import sys

with open('build.gradle', 'r') as f:
    content = f.read()

# Add keyProperties loader if not exists
if 'keyProperties' not in content:
    loader = """
// Load signing properties from key.properties
def keyProperties = new Properties()
keyProperties.load(new FileInputStream(rootProject.file('key.properties')))
project.ext.set('keyProperties', keyProperties)
"""
    content = loader + content

# Add signingConfigs block if not exists
if 'signingConfigs' not in content:
    signing_block = """    signingConfigs {
        release {
            storeFile file(keyProperties.storeFile)
            storePassword keyProperties.storePassword
            keyAlias keyProperties.keyAlias
            keyPassword keyProperties.keyPassword
        }
    }
"""
    content = content.replace('android {', 'android {\n' + signing_block)

# Add signingConfig to release buildType if not exists
if 'signingConfig signingConfigs.release' not in content:
    content = re.sub(
        r'(buildTypes \{[^}]*release \{[^}]*?)(})',
        r'\1        signingConfig signingConfigs.release\n    \2',
        content,
        flags=re.DOTALL
    )

with open('build.gradle', 'w') as f:
    f.write(content)

print('Signing config injected successfully')
