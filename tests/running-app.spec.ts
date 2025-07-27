import { test, expect } from "@playwright/test";

test.describe("Chat Application", () => {
  test.beforeEach(async ({ page }) => {
    // Attendre que l'application soit chargée
    await page.goto("http://localhost:8080");
    await page.waitForLoadState("networkidle");
  });

  test("should have chat interface elements", async ({ page }) => {
    // Vérifier la présence du textarea
    const textarea = page.locator(
      'textarea[placeholder="Posez votre question..."]'
    );
    await expect(textarea).toBeVisible();

    // Vérifier la présence du bouton
    const button = page.getByRole("button", { name: "Envoyer" });
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled(); // Le bouton devrait être désactivé initialement
  });

  test("should enable submit button when text is entered", async ({ page }) => {
    const textarea = page.locator(
      'textarea[placeholder="Posez votre question..."]'
    );
    const button = page.getByRole("button", { name: "Envoyer" });

    // Vérifier que le bouton est désactivé initialement
    await expect(button).toBeDisabled();

    // Saisir du texte
    await textarea.fill("Test message");

    // Vérifier que le bouton est activé
    await expect(button).toBeEnabled();
  });

  test("should show loading state when sending message", async ({ page }) => {
    const textarea = page.locator(
      'textarea[placeholder="Posez votre question..."]'
    );
    await textarea.fill("Test message");

    // Cliquer sur le bouton et vérifier l'état de chargement
    const button = page.getByRole("button");
    await button.click();

    await expect(button).toHaveText("Envoi en cours...");
    await expect(button).toBeDisabled();
  });

  test("should handle API errors gracefully", async ({ page }) => {
    // Intercepter les requêtes API et simuler une erreur
    await page.route("/api/chatMistral", (route) => {
      route.fulfill({
        status: 500,
        body: "Internal Server Error",
      });
    });

    // Envoyer un message
    const textarea = page.locator(
      'textarea[placeholder="Posez votre question..."]'
    );
    await textarea.fill("Test message");
    await page.getByRole("button").click();

    // Vérifier l'affichage du message d'erreur
    const errorMessage = page.locator(".error");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("Une erreur est survenue");
  });
});
