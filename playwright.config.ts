import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    // URL de base pour les tests
    baseURL: "http://localhost:4173",
    // Capture de trace uniquement en cas d'échec
    trace: "on-first-retry",
  },
  // Configuration du serveur web pour les tests
  webServer: {
    command: "npm run preview",
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
  // Utiliser uniquement Chrome pour simplifier
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
