import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.tronggihomnay.app",
  appName: "Trồng Gì Hôm Nay",
  webDir: "out",
  server: {
    // Cho phép HTTP trong release APK (Android security config sẽ xử lý thêm)
    androidScheme: "https",
  },
  android: {
    // Target SDK 36 (Google Play requirement từ 31/8/2026)
    buildOptions: {
      keystorePath: undefined, // Signing sẽ config khi deploy
      keystoreAlias: undefined,
    },
  },
};

export default config;
