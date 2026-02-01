import * as Sentry from "@sentry/react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { useEffect } from "react";

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
    ],
    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
    ],
  });

  // Captura erros não tratados em promises
  window.addEventListener("unhandledrejection", (event) => {
    Sentry.captureException(event.reason, {
      contexts: {
        promise: {
          rejection_reason: event.reason,
        },
      },
    });
  });
}
