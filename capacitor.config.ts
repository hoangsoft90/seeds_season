import type { CapacitorConfig } from "@capacitor/cli";

// Live reload: Capacitor WebView trỏ tới dev server trên máy tính.
// Dùng ADB reverse (adb reverse tcp:3000 tcp:3000) để phone truy cập localhost:3000.
// API routes hoạt động bình thường vì request đi qua dev server.
const config: CapacitorConfig = {
  appId: "com.tronggihomnay.app",
  appName: "Trồng Gì Hôm Nay",
  webDir: "out",
  server: {
    // Live reload mode — Capacitor WebView load từ dev server
    url: "http://localhost:3000",
    cleartext: true,
    androidScheme: "https",
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
};

export default config;
