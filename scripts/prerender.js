// Runs after both Vite builds: writes one HTML file per page, with its content
// and metadata already in place, plus the sitemap. See src/entry-server.tsx.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const serverDir = join(root, "dist-ssr");

const { render, PAGE_META, SITE_URL, getCanonicalUrl } = await import(
  pathToFileURL(join(serverDir, "entry-server.js")).href
);

const escapeAttribute = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Fails the build if the template changes and a tag stops matching
const replaceOrFail = (html, pattern, replacement, label) => {
  const found = typeof pattern === "string" ? html.includes(pattern) : pattern.test(html);
  if (!found) {
    throw new Error(`prerender: could not find ${label} in index.html`);
  }
  return html.replace(pattern, replacement);
};

const setMeta = (html, attribute, name, value) =>
  replaceOrFail(
    html,
    new RegExp(`(<meta\\s+${attribute}="${name}"\\s+content=")[^"]*(")`),
    `$1${escapeAttribute(value)}$2`,
    `${attribute}="${name}"`,
  );

const buildPage = (template, page, appHtml) => {
  const url = getCanonicalUrl(page.path);
  let html = template;

  html = replaceOrFail(html, /<title>[^<]*<\/title>/, `<title>${escapeAttribute(page.title)}</title>`, "<title>");
  html = setMeta(html, "name", "description", page.description);
  html = setMeta(html, "property", "og:title", page.title);
  html = setMeta(html, "property", "og:description", page.description);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "name", "twitter:title", page.title);
  html = setMeta(html, "name", "twitter:description", page.description);
  html = replaceOrFail(html, /(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${url}$2`, "canonical link");
  html = replaceOrFail(html, '<div id="root"></div>', `<div id="root">${appHtml}</div>`, "root element");

  return html;
};

const buildSitemap = (pages) => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map(
      (page) =>
        `  <url>\n    <loc>${getCanonicalUrl(page.path)}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

const template = await readFile(join(distDir, "index.html"), "utf8");

for (const page of PAGE_META) {
  const html = buildPage(template, page, await render(page.path));
  // "/how-to-use" -> how-to-use.html, served without the extension by Vercel's cleanUrls
  const outFile = page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`;
  await mkdir(dirname(join(distDir, outFile)), { recursive: true });
  await writeFile(join(distDir, outFile), html);
  console.log(`prerendered ${page.path}`);
}

await writeFile(join(distDir, "sitemap.xml"), buildSitemap(PAGE_META));
await rm(serverDir, { recursive: true, force: true });
console.log(`sitemap.xml written for ${SITE_URL}`);
