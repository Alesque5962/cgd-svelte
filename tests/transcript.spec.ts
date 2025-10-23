import { test, expect, type Page } from "@playwright/test";

test.describe("Composant Transcript", () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Mock du health check
    await page.route("**/api/health", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "ok" }),
      });
    });

    await page.goto("/transcript");
    await page.waitForLoadState("networkidle");
  });

  test("affiche l'interface d'enregistrement", async ({
    page,
  }: {
    page: Page;
  }) => {
    const audio = page.locator("audio");
    const startButton = page.getByText("Démarrer");
    const stopButton = page.getByText("Arrêter");

    await expect(audio).toBeVisible();
    await expect(startButton).toBeVisible();
    await expect(stopButton).toBeVisible();
  });

  //test("gère l'enregistrement et la transcription", async ({
  //  page,
  //}: {
  //  page: Page;
  //}) => {
  // Mock des permissions audio
  //  await page.context().grantPermissions(["microphone"]);

  // Mock de la réponse Voxtral
  //  await page.route("**/api/voxtral", (route) => {
  //    route.fulfill({
  //      status: 200,
  //      contentType: "application/json",
  //      body: JSON.stringify({ response: "Transcription test" }),
  //    });
  //  });

  // Mock de la réponse Mistral
  //  await page.route("**/api/chatMistral", (route) => {
  //    route.fulfill({
  //      status: 200,
  //      contentType: "application/json",
  //      body: JSON.stringify({ response: "Réponse test" }),
  //    });
  //  });

  //  const startButton = page.getByText("Démarrer");
  //  const stopButton = page.getByText("Arrêter");

  //  await startButton.click();
  //  await page.waitForTimeout(1000); // Simule un enregistrement
  //  await stopButton.click();

  // Vérifier l'affichage de la transcription
  //  await expect(
  //    page.getByText("Votre question formulée par le serveur Voxtral:")
  //  ).toBeVisible();
  //  await expect(page.getByText("Transcription test")).toBeVisible();

  // Vérifier l'affichage de la réponse
  //  await expect(page.getByText("Réponse du Chat Mistral :")).toBeVisible();
  //  await expect(page.getByText("Réponse test")).toBeVisible();
  //});

  //test("gère les erreurs de transcription", async ({
  //  page,
  //}: {
  //  page: Page;
  //}) => {
  //  await page.context().grantPermissions(["microphone"]);

  //  await page.route("**/api/voxtral", (route) => {
  //    route.fulfill({ status: 500 });
  //  });

  //  const startButton = page.getByText("Démarrer");
  //  const stopButton = page.getByText("Arrêter");

  //  await startButton.click();
  //  await page.waitForTimeout(1000);
  //  await stopButton.click();

  //  await expect(page.locator(".error p")).toHaveText(
  //    "Une erreur est survenue lors de la communication avec le serveur",
  //    { timeout: 5000 }
  //  );
  //});
});
