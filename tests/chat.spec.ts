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

  //test("envoie un message et affiche la réponse", async ({ page }) => {
  //  // Mock de la réponse API
  //  await page.route("**/api/chatMistral", (route) => {
  //    route.fulfill({
  //      status: 200,
  //      contentType: "application/json",
  //      body: JSON.stringify({ response: "Réponse test" }),
  //    });
  //  });

  //  const textarea = page.locator("textarea");
  //  const button = page.locator("button#submit");

  //  await textarea.fill("Test message");
  //  await button.click();

  // Attendre que la section question soit visible avant de vérifier son contenu
  //  const questionSection = page.locator("#question");
  //  await expect(questionSection).toBeVisible();

  // Vérifier l'affichage du message et de la réponse
  //  await expect(questionSection.locator("h3")).toHaveText("Votre question :");
  //  await expect(questionSection.locator("p")).toHaveText("Test message");

  // Attendre que la réponse apparaisse dans le DOM
  //  const responseSection = page.locator("#response");
  //  await expect(responseSection).toBeVisible({ timeout: 5000 });
  //  await expect(responseSection.locator("h3")).toHaveText(
  //    "Réponse du Chat Mistral :"
  //  );
  //  await expect(responseSection.locator("p")).toHaveText("Réponse test");
  //});

  //test("gère les erreurs de l'API", async ({ page }) => {
  //  await page.route("**/api/chatMistral", (route) => {
  //    route.fulfill({
  //      status: 500,
  //      contentType: "application/json",
  //      body: JSON.stringify({
  //        error:
  //          "Une erreur est survenue lors de la communication avec le serveur",
  //      }),
  //    });
  //  });

  //  const textarea = page.locator("textarea");
  //  const button = page.locator("button#submit");

  //  await textarea.fill("Test message");
  //  await button.click();

  // Attendre que le message d'erreur apparaisse avec un timeout suffisant
  //  const errorElement = page.locator(".error p");
  //  await expect(errorElement).toBeVisible({ timeout: 5000 });
  //  await expect(errorElement).toHaveText(
  //    "Une erreur est survenue lors de la communication avec le serveur",
  //    { timeout: 5000 }
  //  );

  //  await expect(button).toBeEnabled();
  //  await expect(button).toHaveText("Envoyer");
  //});
});
