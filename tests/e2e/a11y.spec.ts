import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PAGE_META } from "../../src/constants/seo";
import { mockLastFm, seedStorage } from "./fixtures/lastfm";

test.describe("Acessibilidade", () => {
  for (const { path } of PAGE_META) {
    test(`${path} não tem problemas sérios de acessibilidade`, async ({ page }) => {
      await mockLastFm(page);
      await seedStorage(page);
      await page.goto(path);
      await expect(page.getByRole("main")).toBeVisible();

      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );

      expect(
        serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
      ).toEqual([]);
    });
  }
});
