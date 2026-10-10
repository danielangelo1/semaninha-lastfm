import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import "./index.css";
import "./assets/FiraSans-Italic.ttf";
import "./i18n";
import { initSentry } from "./config/sentry.config";
import { initWebVitals } from "./config/webVitals";
import { queryClient } from "./config/queryClient";

initSentry();
initWebVitals();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
