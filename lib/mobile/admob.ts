/**
 * AdMob utility (change admob-integration).
 *
 * Wrapper cho @capacitor-community/admob với test_ads flag.
 * Khi test_ads = true: dùng Google test Ad Unit IDs + test device IDs.
 * Khi test_ads = false: dùng production Ad Unit IDs.
 *
 * Chỉ chạy được trên native (Capacitor) — web browser noop.
 */

import { AdMob } from "@capacitor-community/admob";
import type { BannerAdOptions } from "@capacitor-community/admob";
import { BannerAdPosition, BannerAdSize } from "@capacitor-community/admob";
import { getAdId } from "./config";

let initialized = false;
let testAds = true;

/** Khởi tạo AdMob — gọi 1 lần khi app start. */
export async function initAdMob(isTestMode: boolean): Promise<void> {
  testAds = isTestMode;
  if (initialized) return;

  try {
    await AdMob.initialize({
      initializeForTesting: testAds,
    });
    initialized = true;
  } catch {
    // AdMob không khả dụng (web browser hoặc emulator không có Google Play Services)
    console.warn("AdMob initialization failed — ads will not be shown");
  }
}

/** Hiển thị banner ad ở cuối màn hình. */
export async function showBanner(): Promise<void> {
  if (!initialized) return;

  const adId = getAdId("banner", testAds);
  const options: BannerAdOptions = {
    adId,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    isTesting: testAds,
  };

  try {
    await AdMob.showBanner(options);
  } catch {
    console.warn("Failed to show banner ad");
  }
}

/** Ẩn banner ad. */
export async function hideBanner(): Promise<void> {
  if (!initialized) return;
  try {
    await AdMob.hideBanner();
  } catch {
    // noop
  }
}

/** Kiểm tra xem AdMob có khả dụng không (native device). */
export async function isAdMobAvailable(): Promise<boolean> {
  try {
    // Nếu không có Capacitor (web browser), sẽ throw
    if (typeof window === "undefined") return false;
    // Quick check: Capacitor plugin exists?
    return !!AdMob?.initialize;
  } catch {
    return false;
  }
}
