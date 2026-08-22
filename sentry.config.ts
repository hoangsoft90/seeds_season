import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://03b5fcdde98ec98f878b2763bb0c9c01@o4505474077753344.ingest.us.sentry.io/4511948209127424",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Session tracking to monitor user crashes
  enableAutoSessionTracking: true,

  // If you wish to attach crash reports to specific tags
  environment: __DEV__ ? "development" : "production",

  // Enable native crash reporting
  enableNativeCrashHandling: true,

  // Set dist for build number tracking
  dist: "1.0.0",

  // Set release for version tracking
  release: "seeds-season@1.0.0",
});
