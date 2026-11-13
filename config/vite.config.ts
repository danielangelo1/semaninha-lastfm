/// <reference types="vitest" />
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Read by scripts/prerender.js to link each page's CSS and JS chunk
    manifest: true,
  },
  ssr: {
    // The prerender bundle runs in plain Node, which can't import some CommonJS
    // deps (react-loader-spinner) by name, so bundle everything into it
    noExternal: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["tests/setup.ts"],
    // Playwright runs these (npm run test:e2e)
    exclude: [...configDefaults.exclude, "tests/e2e/**"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/coverage/**"
      ]
    }
  },
});
