/**
 * Mobile app configuration (Capacitor Android/iOS).
 *
 * Flag `test_ads`: khi true, dùng AdMob test device IDs để tránh bị giới hạn quảng cáo.
 * Đặt trong capacitor.config.ts hoặc env variable.
 */

/** Test device IDs của AdMob (dùng khi test_ads = true). */
export const ADMOB_TEST_DEVICE_IDS = [
  "33BE2250B4ED9D4C", // Android emulator
  "G-4F7E8B1A9C",      // iOS simulator (example)
];

/** AdMob Ad Unit IDs — thay bằng IDs thật khi deploy. */
export const ADMOB_IDS = {
  /** Banner ads — hiển thị ở cuối màn hình. */
  banner: {
    test: "ca-app-pub-3940256099942544/6300978111", // Google test banner
    production: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX", // Thay bằng ID thật
  },
  /** Interstitial ads — hiển thị toàn màn hình giữa các lần mở app. */
  interstitial: {
    test: "ca-app-pub-3940256099942544/1033173712", // Google test interstitial
    production: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
  },
  /** Rewarded ads — user xem广告 để nhận reward (có thể dùng cho premium feature). */
  rewarded: {
    test: "ca-app-pub-3940256099942544/5224354917", // Google test rewarded
    production: "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
  },
} as const;

/** Lấy Ad Unit ID theo chế độ test/production. */
export function getAdId(type: "banner" | "interstitial" | "rewarded", testAds: boolean): string {
  return testAds ? ADMOB_IDS[type].test : ADMOB_IDS[type].production;
}

/**
 * AppConfig — cấu hình tổng thể cho mobile app.
 * Đọc từ capacitor.config.ts hoặc fallback về defaults.
 */
export interface AppConfig {
  /** Bật/tắt test ads. true = dùng test device IDs, không bị giới hạn. */
  testAds: boolean;
  /** URL của web app khi chạy trong Capacitor WebView. */
  webUrl: string;
  /** Bật/tắt crash reporting. */
  crashReporting: boolean;
}

/** Default config — override qua capacitor.config.ts plugins section. */
export const DEFAULT_APP_CONFIG: AppConfig = {
  testAds: true, // Mặc định = test mode (an toàn khi develop)
  webUrl: "https://tronggihomnay.vn", // Thay bằng URL thật khi deploy
  crashReporting: false,
};
