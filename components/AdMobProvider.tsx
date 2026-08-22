/**
 * AdMobProvider
 *
 * Initializes Google Mobile Ads SDK at app startup (native only).
 * Skips entirely on web.
 */
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface AdMobProviderProps {
  children: React.ReactNode;
}

// Native-only: load AdMob modules
let MobileAds: any = null;
let AdsConsent: any = null;
let admobConfig: any = null;

if (Platform.OS !== 'web') {
  try {
    MobileAds = require('react-native-google-mobile-ads').MobileAds;
    AdsConsent = require('react-native-google-mobile-ads').AdsConsent;
    admobConfig = require('../lib/mobile/admob-config');
  } catch {
    // AdMob not available
  }
}

export function AdMobProvider({ children }: AdMobProviderProps) {
  const [initialized, setInitialized] = useState(Platform.OS === 'web');

  useEffect(() => {
    if (Platform.OS === 'web' || !MobileAds) {
      setInitialized(true);
      return;
    }

    async function initAdMob() {
      try {
        await MobileAds.initialize();
        const consentInfo = await AdsConsent.requestInfoUpdate();
        if (consentInfo.isConsentFormAvailable && admobConfig?.TEST_ADS) {
          await AdsConsent.showForm();
        }
      } catch (err) {
        console.error('AdMob initialization failed:', err);
      }
      setInitialized(true);
    }
    initAdMob();
  }, []);

  return <>{children}</>;
}
