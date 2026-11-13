import * as Sentry from "@sentry/react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { useEffect } from "react";
import { isReloadingForNewVersion } from "./chunkReload";

const SENTRY_DSN = "https://cf8686780338d6ac0370478a9b857330@o4510807613833216.ingest.us.sentry.io/4510807614881792";

export function initSentry() {
  Sentry.init({
    dsn: SENTRY_DSN,
        
    // Integração com React Router para rastreamento de navegação
    integrations: [
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.browserTracingIntegration(),
        Sentry.breadcrumbsIntegration({
        console: true, 
        dom: true, 
        fetch: true, 
        history: true, 
        xhr: true, 
      }),
    ],


    beforeSend(event, hint) {
      // Chunk errors from an outdated tab that is already reloading
      if (isReloadingForNewVersion()) {
        return null;
      }

      if (hint.originalException instanceof Error) {
        event.contexts = {
          ...event.contexts,
          runtime: {
            name: "browser",
            version: navigator.userAgent,
          },
        };
      }
      return event;
    },

    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      "chrome-extension://",
      "moz-extension://",
      "Network request failed",
      "NetworkError",
      "AbortError",
      "The user aborted a request",
      // Analytics/ads requests blocked by ad blockers or extensions
      /Failed to fetch \([^)]*google[^)]*\)/,
      // Thrown by the AdSense RUM script
      /^int64$/,
      // Safari extensions
      "Invalid call to runtime.sendMessage()",
      // Scripts injected by in-app browsers (Twitter/X, Firefox iOS)
      "Can't find variable: CONFIG",
      "window.__firefox__",
    ],
    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
      /^safari-(web-)?extension:\/\//i,
      /pagead2\.googlesyndication\.com/i,
      /googletagmanager\.com/i,
    ],
  });

  // Unhandled promise rejections are already captured by Sentry's default
  // integrations; a manual listener here reported each one twice.
}
