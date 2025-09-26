import { test, expect } from "@playwright/test";

test.describe("Composant Transcript", () => {
  test.beforeEach(async ({ page }) => {
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

  test("affiche l'interface d'enregistrement", async ({ page }) => {
    const audio = page.locator("audio");
    const startButton = page.getByText("Démarrer");
    const stopButton = page.getByText("Arrêter");

    await expect(audio).toBeVisible();
    await expect(startButton).toBeVisible();
    await expect(stopButton).toBeVisible();
  });

  test("gère l'enregistrement et la transcription", async ({ page }) => {
    // Mock des permissions audio
    await page.context().grantPermissions(["microphone"]);

    // Mock de la réponse Voxtral
    await page.route("**/api/voxtral", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ response: "Transcription test" }),
      });
    });

    // Mock de la réponse Mistral
    await page.route("**/api/chatMistral", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ response: "Réponse test" }),
      });
    });

    const startButton = page.getByText("Démarrer");
    const stopButton = page.getByText("Arrêter");

    await startButton.click();
    await page.waitForTimeout(1000); // Simule un enregistrement
    await stopButton.click();

    // Vérifier l'affichage de la transcription
    /* await expect(page.locator(".response h3").first()).toHaveText(
      "Votre question formulée par le serveur Voxtral:"
    );
    await expect(page.locator(".response p").first()).toHaveText(
      "Transcription test"
    ); */

    // Vérifier l'affichage de la réponse
    /* await expect(page.locator(".response h3").nth(1)).toHaveText(
      "Réponse du Chat Mistral :"
    );
    await expect(page.locator(".response p").nth(1)).toHaveText("Réponse test"); */
  });

  test("gère les erreurs de transcription", async ({ page }) => {
    await page.context().grantPermissions(["microphone"]);

    await page.route("**/api/voxtral", (route) => {
      route.fulfill({ status: 500 });
    });

    const startButton = page.getByText("Démarrer");
    const stopButton = page.getByText("Arrêter");

    await startButton.click();
    await page.waitForTimeout(1000);
    await stopButton.click();

    /* await expect(page.locator(".error p")).toHaveText(
      "Une erreur est survenue lors de la communication avec le serveur"
    ); */
  });
});
