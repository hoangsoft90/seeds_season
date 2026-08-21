/**
 * BannerAd Component
 *
 * Hiển thị banner ad ở cuối màn hình.
 * Tự ẩn khi test_ads = false và chưa có production ad unit ID.
 */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { AdUnitIds, TEST_ADS } from '../lib/mobile/admob-config';

// Banner height based on size
const BANNER_HEIGHT = 60;

export function AppBannerAd() {
  const [loaded, setLoaded] = useState(false);

  // Skip if production ID not set
  if (!TEST_ADS && AdUnitIds.banner.includes('XXXXXXXXXXXXXXXX')) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={TEST_ADS ? TestIds.BANNER : AdUnitIds.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => setLoaded(true)}
        onAdFailedToLoad={(error) => {
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
    // Bottom safe area padding handled by parent
  },
});
