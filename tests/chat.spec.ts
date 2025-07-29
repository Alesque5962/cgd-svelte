import { test, expect } from "@playwright/test";

test.describe("Chat Application", () => {
  test.beforeEach(async ({ page }) => {
    // Mock du health check AVANT le goto
    await page.route("**/api/health", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "ok" }),
      });
    });
    await page.goto("/");
    // Attendre le textarea, preuve que le chat est monté
    await page.waitForSelector(
      'textarea[placeholder="Posez votre question..."]',
      { state: "visible" }
    );
  });

  test("interface de chat visible", async ({ page }) => {
    const textarea = page.getByPlaceholder("Posez votre question...");
    const button = page.getByRole("button", { name: "Envoyer" });

    await expect(textarea).toBeVisible();
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
  });

  test("activation du bouton avec texte", async ({ page }) => {
    const textarea = page.getByPlaceholder("Posez votre question...");
    const button = page.getByRole("button", { name: "Envoyer" });

    await textarea.fill("Test message");
    await expect(button).toBeEnabled();
  });

  test("état de chargement et réponse", async ({ page }) => {
    await page.route("**/api/chatMistral", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ response: "Test response" }),
      });
    });

    const textarea = page.getByPlaceholder("Posez votre question...");
    const button = page.getByRole("button", { name: "Envoyer" });

    await textarea.fill("Test message");
    await button.click();

    await expect(button).toHaveText("Envoi en cours...");
    await expect(button).toBeDisabled();

    await page.waitForResponse("**/api/chatMistral");
    await expect(page.locator(".response")).toBeVisible();
  });

  test("gestion des erreurs", async ({ page }) => {
    await page.route("**/api/chatMistral", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Erreur serveur" }),
      });
    });

    const textarea = page.getByPlaceholder("Posez votre question...");
    const button = page.getByRole("button", { name: "Envoyer" });

    await textarea.fill("Test message");
    await button.click();

    await expect(page.locator(".error")).toBeVisible();
    await expect(page.locator(".error")).toContainText(
      "Une erreur est survenue lors de la communication avec le serveur"
    );
  });
});

/* import { test, expect } from "@playwright/test";

test.describe("Chat Application", () => {
  test.beforeEach(async ({ page }) => {
    // Attendre que l'application soit chargée
    await page.goto("http://localhost:4173");
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
 */
