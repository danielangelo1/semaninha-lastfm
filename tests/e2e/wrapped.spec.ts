import { expect, test, type Page } from "@playwright/test";
import { WRAPPED_YEAR } from "../../src/constants/wrapped";
import { mockLastFm, seedStorage, USERS } from "./fixtures/lastfm";

const generate = async (page: Page, user: string) => {
  await page.getByLabel("Usuário do Last.fm").fill(user);
  await page.getByRole("button", { name: `Gerar Wrapped ${WRAPPED_YEAR}` }).click();
};

const wrappedImage = (page: Page) => page.locator(".wrapped-figure img");

test.describe("Wrapped", () => {
  test.beforeEach(async ({ page }) => {
    await seedStorage(page);
  });

  test("gera a imagem do ano no formato de story", async ({ page }) => {
    const lastfm = await mockLastFm(page);
    await page.goto("/wrapped");

    await generate(page, USERS.active);

    await expect(wrappedImage(page)).toBeVisible();
    const size = await wrappedImage(page).evaluate((img: HTMLImageElement) => [
      img.naturalWidth,
      img.naturalHeight,
    ]);
    expect(size).toEqual([1080, 1920]);

    // Calendar year so far, and only the top tracks (the image doesn't show the track count)
    const trackChart = lastfm.calls.find((p) => p.get("method") === "user.getweeklytrackchart");
    expect(trackChart?.get("limit")).toBe("5");
    const from = Number(trackChart?.get("from"));
    expect(new Date(from * 1000).getFullYear()).toBe(WRAPPED_YEAR);
    expect(new Date(from * 1000).getMonth()).toBe(0);
  });

  test("baixa a imagem com o nome do usuário e o ano", async ({ page }) => {
    await mockLastFm(page);
    await page.goto("/wrapped");
    await generate(page, USERS.active);
    await expect(wrappedImage(page)).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /baixar/i }).click(),
    ]);

    expect(download.suggestedFilename()).toBe(`${USERS.active}-wrapped-${WRAPPED_YEAR}.png`);
  });

  test("refaz só a chamada que falhou com erro 500", async ({ page }) => {
    const lastfm = await mockLastFm(page);
    lastfm.failNext("user.getweeklyalbumchart");
    await page.goto("/wrapped");

    await generate(page, USERS.active);

    await expect(wrappedImage(page)).toBeVisible();
    const count = (method: string) => lastfm.calls.filter((p) => p.get("method") === method).length;
    expect(count("user.getweeklyalbumchart")).toBe(2);
    expect(count("user.getweeklyartistchart")).toBe(1);
  });

  test("avisa quando o usuário não existe, sem repetir a chamada", async ({ page }) => {
    const lastfm = await mockLastFm(page);
    await page.goto("/wrapped");

    await generate(page, USERS.missing);

    await expect(page.getByRole("alert").filter({ hasText: "Usuário não encontrado" })).toBeVisible();
    const artistCalls = lastfm.calls.filter((p) => p.get("method") === "user.getweeklyartistchart");
    expect(artistCalls).toHaveLength(1);
  });
});
