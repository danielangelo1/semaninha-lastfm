import { expect, test } from "@playwright/test";

// Runs only against a deployment (E2E_BASE_URL), with the real Last.fm behind
// the /api/lastfm proxy. Kept to checks that don't depend on any user's data.
test.describe("Deploy @deployed", () => {
  test("um asset inexistente é 404, não o HTML da home", async ({ request }) => {
    const response = await request.get("/assets/nao-existe-123.js");
    expect(response.status()).toBe(404);
  });

  test("o proxy do Last.fm responde e não aceita POST", async ({ request }) => {
    const missing = await request.get(
      "/api/lastfm/?method=user.getinfo&user=usuario-que-nao-existe-e2e-9x7&format=json",
    );
    expect(missing.status()).toBe(404);
    expect(await missing.json()).toMatchObject({ error: 6 });

    const post = await request.post("/api/lastfm/");
    expect(post.status()).toBe(405);
  });

  test("usuário inexistente mostra o aviso traduzido", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("i18nextLng", "pt"));
    await page.goto("/");

    await page.getByLabel("Nome do usuário").fill("usuario-que-nao-existe-e2e-9x7");
    await page.getByRole("button", { name: "Gerar" }).click();

    await expect(page.getByRole("alert").filter({ hasText: "Usuário não encontrado" })).toBeVisible();
  });
});
