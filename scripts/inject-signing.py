import re
import sys

with open('build.gradle', 'r') as f:
    content = f.read()

# Step 1: Add keyProperties loader at the top of android block
if 'keyProperties' not in content:
    loader = """// Load signing properties from key.properties
def keyProperties = new Properties()
keyProperties.load(new FileInputStream(rootProject.file('key.properties')))
project.ext.set('keyProperties', keyProperties)

"""
    # Insert after "android {" line
    content = re.sub(r'(android\s*\{)', r'\1\n' + loader, content, count=1)

# Step 2: Add signingConfigs block inside android block (before buildTypes)
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
    # Insert before buildTypes
    content = re.sub(r'(\s*buildTypes\s*\{)', signing_block + r'\1', content, count=1)

# Step 3: Add signingConfig to release buildType
if 'signingConfig signingConfigs.release' not in content:
    # Find "release {" inside buildTypes and add signingConfig after it
    # Simple approach: find "release {" and insert after the opening brace
    content = re.sub(
        r'(\brelease\s*\{)',
        r'\1\n            signingConfig signingConfigs.release',
        content,
        count=1
    )

with open('build.gradle', 'w') as f:
    f.write(content)

print('Signing config injected successfully')
print('--- Verifying ---')
# Verify
with open('build.gradle', 'r') as f:
    verify = f.read()
if 'signingConfig signingConfigs.release' in verify:
    print('OK: signingConfig signingConfigs.release found')
else:
    print('ERROR: signingConfig signingConfigs.release NOT found')
    sys.exit(1)
if 'signingConfigs' in verify:
    print('OK: signingConfigs block found')
else:
    print('ERROR: signingConfigs block NOT found')
    sys.exit(1)
if 'keyProperties' in verify:
    print('OK: keyProperties loader found')
else:
    print('ERROR: keyProperties loader NOT found')
    sys.exit(1)
