import { expect, test, type Page } from "@playwright/test";
import { mockLastFm, seedStorage, USERS } from "./fixtures/lastfm";

const fillForm = async (page: Page, user: string, size: string) => {
  await page.getByLabel("Nome do usuário").fill(user);
  await page.getByLabel("Período").selectOption("1month");
  await page.getByLabel("Tamanho").selectOption(size);
  await page.getByRole("button", { name: "Gerar" }).click();
};

const collage = (page: Page) => page.locator("form img");

const naturalSize = (page: Page) =>
  collage(page).evaluate((img: HTMLImageElement) => [img.naturalWidth, img.naturalHeight]);

test.describe("Gerador de colagens", () => {
  test.beforeEach(async ({ page }) => {
    await seedStorage(page);
  });

  test("gera uma colagem 3x3 de álbuns", async ({ page }) => {
    const lastfm = await mockLastFm(page);
    await page.goto("/");

    await fillForm(page, USERS.active, "3");

    await expect(collage(page)).toBeVisible();
    expect(await naturalSize(page)).toEqual([1300, 1300]);
    await expect(collage(page)).toHaveAttribute("alt", /3x3.*rj/);

    const request = lastfm.calls.find((params) => params.get("method") === "user.gettopalbums");
    expect(request?.get("limit")).toBe("9");
    expect(request?.get("period")).toBe("1month");
  });

  test("gera o grid 2x6 numa imagem vertical com 12 capas", async ({ page }) => {
    const lastfm = await mockLastFm(page);
    await page.goto("/");

    await fillForm(page, USERS.active, "2x6");

    await expect(collage(page)).toBeVisible();
    expect(await naturalSize(page)).toEqual([433, 1300]);
    const request = lastfm.calls.find((params) => params.get("method") === "user.gettopalbums");
    expect(request?.get("limit")).toBe("12");
  });

  test("avisa quando o usuário não existe no Last.fm", async ({ page }) => {
    await mockLastFm(page);
    await page.goto("/");

    await fillForm(page, USERS.missing, "3");

    await expect(page.getByRole("alert").filter({ hasText: "Usuário não encontrado" })).toBeVisible();
    await expect(collage(page)).toHaveCount(0);
  });

  test("avisa quando não há dados suficientes para o grid", async ({ page }) => {
    await mockLastFm(page);
    await page.goto("/");

    await fillForm(page, USERS.sparse, "3");

    await expect(page.getByRole("alert").filter({ hasText: "dados suficientes" })).toBeVisible();
  });

  test("pede o nome de usuário antes de gerar", async ({ page }) => {
    const lastfm = await mockLastFm(page);
    await page.goto("/");

    await page.getByRole("button", { name: "Gerar" }).click();

    await expect(page.getByRole("alert").filter({ hasText: "Usuário é obrigatório" })).toBeVisible();
    expect(lastfm.calls).toHaveLength(0);
  });

  test("lembra o usuário e as opções ao voltar", async ({ page }) => {
    await mockLastFm(page);
    await page.goto("/");
    await fillForm(page, USERS.active, "4");
    await expect(collage(page)).toBeVisible();

    await page.reload();

    await expect(page.getByLabel("Nome do usuário")).toHaveValue(USERS.active);
    await expect(page.getByLabel("Tamanho")).toHaveValue("4");
  });
});
