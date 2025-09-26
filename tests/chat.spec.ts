import { test, expect } from "@playwright/test";

test.describe("Composant Chat", () => {
  test.beforeEach(async ({ page }) => {
    // Mock du health check
    await page.route("**/api/health", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "ok" }),
      });
    });

    await page.goto("/chat");
    await page.waitForLoadState("networkidle");
  });

  test("affiche l'interface de chat", async ({ page }) => {
    const textarea = page.locator("textarea");
    const button = page.locator("button#submit");

    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveAttribute(
      "placeholder",
      "Posez votre question..."
    );
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
  });

  test("active le bouton quand du texte est saisi", async ({ page }) => {
    const textarea = page.locator("textarea");
    const button = page.locator("button#submit");

    await textarea.fill("Test message");
    await expect(button).toBeEnabled();

    await textarea.clear();
    await expect(button).toBeDisabled();
  });

  test("envoie un message et affiche la réponse", async ({ page }) => {
    // Mock de la réponse API
    await page.route("**/api/chatMistral", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ response: "Réponse test" }),
      });
    });

    const textarea = page.locator("textarea");
    const button = page.locator("button#submit");

    await textarea.fill("Test message");
    await button.click();

    // Vérifier l'état de chargement
    await expect(button).toHaveText("Envoyer");
    await expect(button).toBeDisabled();

    // Vérifier l'affichage du message et de la réponse
    await expect(page.locator("h3")).toHaveText("Votre question :");
    await expect(page.locator("p")).toHaveText("Test message");

    /* await expect(page.locator(".response h3").nth(1)).toHaveText(
      "Réponse du Chat Mistral :"
    );
    await expect(page.locator(".response p").nth(1)).toHaveText("Réponse test"); */
  });

  test("gère les erreurs de l'API", async ({ page }) => {
    await page.route("**/api/chatMistral", (route) => {
      route.fulfill({ status: 500 });
    });

    const textarea = page.locator("textarea");
    const button = page.locator("button#submit");

    await textarea.fill("Test message");
    await button.click();

    /* await expect(page.locator(".error p")).toHaveText(
      "Une erreur est survenue lors de la communication avec le serveur"
    ); */
  });
});
