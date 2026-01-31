import * as Sentry from "@sentry/react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { useEffect } from "react";

const SENTRY_DSN = "https://cf8686780338d6ac0370478a9b857330@o4510807613833216.ingest.us.sentry.io/4510807614881792";

/**
 * Inicializa o Sentry com configuração básica
 */
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
    ],

    tracesSampleRate: import.meta.env.MODE === "production" ? 0.1 : 1.0,

    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      "chrome-extension://",
      "moz-extension://",
    ],
  });
}
