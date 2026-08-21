/**
 * AdMob Configuration
 *
 * test_ads = true → sử dụng Google Test Ad Unit IDs (không bị giới hạn)
 * test_ads = false → sử dụng Production Ad Unit IDs (cần thay bằng ID thật từ AdMob Dashboard)
 *
 * Google Test Ad Unit IDs (official, unlimited impressions):
 *   Banner:    ca-app-pub-3940256099942544/6300978111
 *   Interstitial: ca-app-pub-3940256099942544/1033173712
 *   Rewarded:  ca-app-pub-3940256099942544/5224354917
 */

// ⚠️ ĐỔI THÀNH false KHI UPLOAD LÊN STORE
export const TEST_ADS = true;

// Banner Ad Unit IDs
const BANNER_TEST = 'ca-app-pub-3940256099942544/6300978111';
const BANNER_PROD = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'; // TODO: Thay bằng ID thật

// Interstitial Ad Unit IDs
const INTERSTITIAL_TEST = 'ca-app-pub-3940256099942544/1033173712';
const INTERSTITIAL_PROD = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'; // TODO: Thay bằng ID thật

// Rewarded Ad Unit IDs
const REWARDED_TEST = 'ca-app-pub-3940256099942544/5224354917';
const REWARDED_PROD = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'; // TODO: Thay bằng ID thật

export const AdUnitIds = {
  banner: TEST_ADS ? BANNER_TEST : BANNER_PROD,
  interstitial: TEST_ADS ? INTERSTITIAL_TEST : INTERSTITIAL_PROD,
  rewarded: TEST_ADS ? REWARDED_TEST : REWARDED_PROD,
} as const;

// Google Test Device IDs (để test trên thiết bị thật)
export const TEST_DEVICE_IDS = [
  '33CE224D85FFB981', // Example test device ID
];
