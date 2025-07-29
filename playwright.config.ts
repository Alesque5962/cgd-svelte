import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run preview",
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

/* import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        launchOptions: {
          headless: true,
        },
        contextOptions: {
          viewport: { width: 1280, height: 720 },
        },
      },
    },
  ],
  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
    video: "on-first-retry",
  },
  webServer: {
    command: "docker compose up",
    url: "http://localhost:8080",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
 */
