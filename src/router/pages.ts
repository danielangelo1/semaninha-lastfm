import { ComponentType, createElement, lazy } from "react";

type PageModule = { default: ComponentType };

// A lazy page that can also be loaded ahead of time. Once preloaded it renders
// straight away, so the prerendered HTML isn't swapped for the Suspense fallback.
const lazyPage = (load: () => Promise<PageModule>) => {
  let Loaded: ComponentType | null = null;
  const Lazy = lazy(load);

  const Page = () => createElement(Loaded ?? Lazy);
  const preload = () =>
    load().then((module) => {
      Loaded = module.default;
    });

  return Object.assign(Page, { preload });
};

export const PAGES = {
  "/": lazyPage(() => import("../pages/Home/Home")),
  "/privacy": lazyPage(() => import("../pages/Privacy/Privacy")),
  "/wrapped": lazyPage(() => import("../pages/Wrapped/Wrapped")),
  "/how-to-use": lazyPage(() => import("../pages/HowToUse/HowToUse")),
  "/support": lazyPage(() => import("../pages/Support/Support")),
};

/** Loads the page for a path; unknown paths fall back to Home, like the router */
export const preloadPage = (pathname: string): Promise<void> => {
  const page = PAGES[pathname as keyof typeof PAGES] ?? PAGES["/"];
  return page.preload();
};
