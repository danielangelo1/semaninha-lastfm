/* eslint-disable react-refresh/only-export-components -- build-only module, never hot reloaded */
// Build-time entry: renders each page to HTML so crawlers get real content
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "./i18n";
import { AppRoutes } from "./router/Router";
import { preloadPage } from "./router/pages";

export { PAGE_META, SITE_URL, getCanonicalUrl } from "./constants/seo";

export const render = async (url: string): Promise<string> => {
  // The site's default language; the browser switches it after loading if needed
  await i18n.changeLanguage("pt");
  await preloadPage(url);

  return renderToString(
    <QueryClientProvider client={new QueryClient()}>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </QueryClientProvider>,
  );
};
