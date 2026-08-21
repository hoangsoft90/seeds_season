/**
 * AdMobProvider
 *
 * Initializes Google Mobile Ads SDK at app startup.
 * Wraps the app to provide ad context.
 */
import React, { useEffect, useState } from 'react';
import { MobileAds, AdsConsent } from 'react-native-google-mobile-ads';
import { TEST_ADS } from '../lib/mobile/admob-config';

interface AdMobProviderProps {
  children: React.ReactNode;
}

export function AdMobProvider({ children }: AdMobProviderProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function initAdMob() {
      try {
        // Initialize SDK
        await MobileAds().initialize();

        // Request consent (GDPR/UMP)
        const consentInfo = await AdsConsent.requestInfoUpdate();

        if (consentInfo.isConsentFormAvailable) {
          if (TEST_ADS) {
            // In test mode, show consent form for debugging
            await AdsConsent.showForm();
          }
        }

        setInitialized(true);
      } catch (err) {
        console.error('AdMob initialization failed:', err);
        // Don't block app if AdMob fails
        setInitialized(true);
      }
    }

    initAdMob();
  }, []);

  // Always render children — don't block app for ads
  return <>{children}</>;
}
