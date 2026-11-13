import { defineConfig, devices } from "@playwright/test";

// Set E2E_BASE_URL to test a deployed site (e.g. a Vercel preview): only tests
// tagged @smoke or @deployed run there. Without it, everything except @deployed
// runs against a local production build, with Last.fm mocked.
const deployedUrl = process.env.E2E_BASE_URL;
const PORT = 4173;
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "../tests/e2e",
  outputDir: "../test-results",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI
    ? [["github"], ["html", { open: "never", outputFolder: "../playwright-report" }]]
    : [["list"]],
  // @deployed tests need the real /api/lastfm proxy; the untagged ones need mocks
  grep: deployedUrl ? /@smoke|@deployed/ : undefined,
  grepInvert: deployedUrl ? undefined : /@deployed/,
  use: {
    baseURL: deployedUrl ?? `http://localhost:${PORT}`,
    locale: "pt-BR",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: deployedUrl
    ? undefined
    : {
        // The prerendered HTML only exists in a production build
        command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
        cwd: "..",
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !isCI,
        timeout: 240_000,
      },
});
