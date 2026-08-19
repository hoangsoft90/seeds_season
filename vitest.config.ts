import { defineConfig } from "vitest/config";
import path from "path";

/**
 * Vitest config — resolve alias `@/*` (Next.js tsconfig paths) để test có thể
 * import trực tiếp route handlers / code dùng `@/lib/...` (vd tests/garden-api.test.ts).
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
});
