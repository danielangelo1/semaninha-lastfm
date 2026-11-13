import { expect, test } from "@playwright/test";
import { getCanonicalUrl, getPageMeta } from "../../src/constants/seo";
import { mockLastFm, seedStorage } from "./fixtures/lastfm";

const canonical = (page: import("@playwright/test").Page) =>
  page.locator('link[rel="canonical"]');

test.describe("Navegação", () => {
  test.beforeEach(async ({ page }) => {
    await mockLastFm(page);
  });

  test("troca de página pelos links e atualiza título e canonical", async ({ page }) => {
    await seedStorage(page);
    await page.goto("/");

    await page.getByRole("banner").getByRole("link", { name: "Como usar" }).click();
    await expect(page).toHaveURL(/\/how-to-use$/);
    await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toHaveText(
      "Como usar o semaninha",
    );
    await expect(page).toHaveTitle(getPageMeta("/how-to-use").title);
    await expect(canonical(page)).toHaveAttribute("href", getCanonicalUrl("/how-to-use"));

    await page.getByRole("contentinfo").getByRole("link", { name: "Apoie o semaninha" }).click();
    await expect(page).toHaveURL(/\/support$/);
    await expect(page).toHaveTitle(getPageMeta("/support").title);

    await page.getByRole("link", { name: "SEMANINHA.NET" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle(getPageMeta("/").title);
  });

  test("rota desconhecida mostra a home", async ({ page }) => {
    await seedStorage(page);
    await page.goto("/pagina-que-nao-existe");

    await expect(page.getByLabel("Nome do usuário")).toBeVisible();
  });

  test("mantém a língua escolhida depois de recarregar", async ({ page }) => {
    await seedStorage(page);
    await page.goto("/");

    await page.getByRole("button", { name: "Switch to English" }).click();
    await expect(page.getByLabel("Username")).toBeVisible();

    await page.reload();

    await expect(page.getByLabel("Username")).toBeVisible();
  });

  test("mostra o aviso do Wrapped uma vez e não volta depois de fechado", async ({ page }) => {
    await seedStorage(page, { announcementSeen: false });
    await page.goto("/");

    const notice = page.getByRole("complementary");
    await expect(notice).toBeVisible();
    await notice.getByRole("button", { name: "Agora não" }).click();
    await expect(notice).toHaveCount(0);

    await page.reload();
    await page.waitForTimeout(1500);

    await expect(notice).toHaveCount(0);
  });

  test("recarrega sozinha quando um chunk sumiu depois de um deploy", async ({ page }) => {
    await seedStorage(page);
    await page.goto("/");
    await expect(page.getByLabel("Nome do usuário")).toBeVisible();

    // A tab opened before a deploy: the next page's chunk is gone for good,
    // until the page reloads and gets the new version
    let reloaded = false;
    page.on("request", (request) => {
      if (request.isNavigationRequest()) reloaded = true;
    });
    await page.route(/\/assets\/HowToUse-[^/]+\.js$/, (route) =>
      reloaded ? route.continue() : route.fulfill({ status: 404, body: "Not found" }),
    );

    await page.getByRole("banner").getByRole("link", { name: "Como usar" }).click();

    await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toHaveText(
      "Como usar o semaninha",
    );
    expect(reloaded).toBe(true);
    await expect(page.locator(".error-boundary")).toHaveCount(0);
  });
});
