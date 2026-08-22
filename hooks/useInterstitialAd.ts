/**
 * useInterstitialAd Hook
 *
 * Hiển thị interstitial ad sau mỗi N lần hành động (native only).
 */
import { useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';

const INTERSTITIAL_INTERVAL = 5;
let actionCount = 0;

export function useInterstitialAd() {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let unsub1: (() => void) | undefined;
    let unsub2: (() => void) | undefined;

    try {
      const { InterstitialAd, AdEventType, TestIds } = require('react-native-google-mobile-ads');
      const { AdUnitIds, TEST_ADS } = require('../lib/mobile/admob-config');

      const unitId = TEST_ADS ? TestIds.INTERSTITIAL : AdUnitIds.interstitial;
      const ad = InterstitialAd.createForAdRequest(unitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      unsub1 = ad.addAdEventListener(AdEventType.LOADED, () => {
        loadedRef.current = true;
      });
      unsub2 = ad.addAdEventListener(AdEventType.CLOSED, () => {
        loadedRef.current = false;
        ad.load();
      });
      ad.load();
    } catch (err) {
      console.error('InterstitialAd load failed:', err);
    }

    return () => {
      unsub1?.();
      unsub2?.();
    };
  }, []);

  const showIfReady = useCallback(() => {
    if (Platform.OS === 'web') return;
    actionCount++;
  }, []);

  return { showIfReady };
}
