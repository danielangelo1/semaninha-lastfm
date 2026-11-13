import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCanonicalUrl, getPageMeta } from "../constants/seo";

const setAttribute = (selector: string, attribute: string, value: string) => {
  document.head.querySelector(selector)?.setAttribute(attribute, value);
};

/** Keeps the title, description and canonical in sync on client-side navigation */
export const usePageMeta = (): void => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = getPageMeta(pathname);
    const url = getCanonicalUrl(meta.path);

    document.title = meta.title;
    setAttribute('meta[name="description"]', "content", meta.description);
    setAttribute('link[rel="canonical"]', "href", url);
    setAttribute('meta[property="og:url"]', "content", url);
  }, [pathname]);
};
