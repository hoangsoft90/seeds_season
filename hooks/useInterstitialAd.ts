/**
 * useInterstitialAd Hook
 *
 * Hiển thị interstitial ad sau mỗi N lần hành động.
 * Configurable: interval, test mode.
 */
import { useEffect, useRef, useCallback } from 'react';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { AdUnitIds, TEST_ADS } from '../lib/mobile/admob-config';

// Show interstitial every N actions
const INTERSTITIAL_INTERVAL = 5;

let actionCount = 0;

let interstitial: InterstitialAd | null = null;

function getInterstitial(): InterstitialAd {
  if (!interstitial) {
    const unitId = TEST_ADS ? TestIds.INTERSTITIAL : AdUnitIds.interstitial;
    interstitial = InterstitialAd.createForAdRequest(unitId, {
      requestNonPersonalizedAdsOnly: true,
    });
  }
  return interstitial;
}

export function useInterstitialAd() {
  const loadedRef = useRef(false);

  useEffect(() => {
    const ad = getInterstitial();

    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      loadedRef.current = true;
    });

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      loadedRef.current = false;
      // Pre-load next ad
      ad.load();
    });

    // Pre-load first ad
    ad.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const showIfReady = useCallback(() => {
    actionCount++;
    if (actionCount >= INTERSTITIAL_INTERVAL && loadedRef.current) {
      actionCount = 0;
      getInterstitial().show();
    }
  }, []);

  return { showIfReady };
}
