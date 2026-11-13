import { expect, test } from "@playwright/test";
import { getCanonicalUrl, PAGE_META, SITE_URL } from "../../src/constants/seo";

// Checks the raw HTML (no JavaScript), which is what crawlers and the AdSense
// review read first. Locally `vite preview` doesn't serve clean URLs, so ask for
// the .html file; on a deployment, Vercel's cleanUrls serves the clean path.
const isDeployed = !!process.env.E2E_BASE_URL;
const htmlPath = (path: string) => (path === "/" || isDeployed ? path : `${path}.html`);

test.describe("HTML pré-renderizado @smoke", () => {
  for (const page of PAGE_META) {
    test(`${page.path} já vem com conteúdo e metadados próprios`, async ({ request }) => {
      const response = await request.get(htmlPath(page.path));
      expect(response.status()).toBe(200);
      const html = await response.text();

      expect(html).toContain(`<title>${page.title}</title>`);
      expect(html).toContain(`<link rel="canonical" href="${getCanonicalUrl(page.path)}"`);
      // The app markup is in the file, not an empty root
      expect(html).not.toContain('<div id="root"></div>');
      expect(html).toMatch(/<div id="root">(<!--\$-->)?<header>/);
    });
  }

  test("sitemap lista todas as páginas e o robots.txt aponta para ele", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const page of PAGE_META) {
      expect(sitemap).toContain(`<loc>${getCanonicalUrl(page.path)}</loc>`);
    }

    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });
});
