/**
 * AdMob Configuration
 *
 * enable_ads  = false → no ads at all (dev/offline)
 * enable_ads  = true  → ads enabled
 * test_ads    = true  → Google Test Ad Unit IDs (unlimited, no revenue)
 * test_ads    = false → Production Ad Unit IDs (real ads, real revenue)
 *
 * Google Test Ad Unit IDs (official, unlimited impressions):
 *   Banner:       ca-app-pub-3940256099942544/6300978111
 *   Interstitial: ca-app-pub-3940256099942544/1033173712
 *   Rewarded:     ca-app-pub-3940256099942544/5224354917
 */

// ─── Flags ──────────────────────────────────────────────────────────────────
// Bật ads: true = có quảng cáo, false = tắt hoàn toàn
export const ENABLE_ADS = true;
// Test mode: true = test ads (không bị giới hạn), false = real ads (có doanh thu)
export const TEST_ADS = true;

// ─── App ID ─────────────────────────────────────────────────────────────────
export const ADMOB_APP_ID = 'ca-app-pub-6917313063209470~6292641213';

// ─── Production Ad Unit IDs ─────────────────────────────────────────────────
const BANNER_PROD = 'ca-app-pub-6917313063209470/8727232867';
const INTERSTITIAL_PROD = 'ca-app-pub-6917313063209470/8779254085';
const REWARDED_PROD = 'ca-app-pub-6917313063209470/5063370359';

// ─── Test Ad Unit IDs (Google official) ────────────────────────────────────
const BANNER_TEST = 'ca-app-pub-3940256099942544/6300978111';
const INTERSTITIAL_TEST = 'ca-app-pub-3940256099942544/1033173712';
const REWARDED_TEST = 'ca-app-pub-3940256099942544/5224354917';

// ─── Export resolved IDs ────────────────────────────────────────────────────
export const AdUnitIds = {
  banner: TEST_ADS ? BANNER_TEST : BANNER_PROD,
  interstitial: TEST_ADS ? INTERSTITIAL_TEST : INTERSTITIAL_PROD,
  rewarded: TEST_ADS ? REWARDED_TEST : REWARDED_PROD,
} as const;

// Google Test Device IDs (để test trên thiết bị thật)
export const TEST_DEVICE_IDS = [
  '33CE224D85FFB981',
];
