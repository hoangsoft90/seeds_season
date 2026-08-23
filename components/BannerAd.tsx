/**
 * BannerAd Component
 *
 * Hiển thị banner ad ở cuối màn hình (native only).
 * Returns null on web.
 */
import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

// Native-only: load AdMob modules
let BannerAdComponent: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;
let admobConfig: any = null;

if (Platform.OS !== 'web') {
  try {
    const ads = require('react-native-google-mobile-ads');
    BannerAdComponent = ads.BannerAd;
    BannerAdSize = ads.BannerAdSize;
    TestIds = ads.TestIds;
    admobConfig = require('../lib/mobile/admob-config');
  } catch {
    // AdMob not available
  }
}

export function AppBannerAd() {
  if (Platform.OS === 'web' || !BannerAdComponent) return null;

  const [loaded, setLoaded] = useState(false);
  const { AdUnitIds, TEST_ADS, ENABLE_ADS } = admobConfig || {};

  if (!ENABLE_ADS) return null;

  if (!TEST_ADS && AdUnitIds?.banner?.includes('XXXXXXXXXXXXXXXX')) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BannerAdComponent
        unitId={TEST_ADS ? TestIds.BANNER : AdUnitIds.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => setLoaded(true)}
        onAdFailedToLoad={(error: any) => {
          console.log('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    // Fixed bottom — sits outside ScrollView, never overlaps content
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
