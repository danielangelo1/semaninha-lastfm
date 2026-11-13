import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import "./index.css";
import "./assets/FiraSans-Italic.ttf";
import "./i18n";
import { initSentry } from "./config/sentry.config";
import { initChunkReload } from "./config/chunkReload";
import { initWebVitals } from "./config/webVitals";
import { queryClient } from "./config/queryClient";
import { preloadPage } from "./router/pages";

initChunkReload();
initSentry();
initWebVitals();

const renderApp = () =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>,
  );

// The prerendered page stays on screen until its chunk is ready, so React
// replaces it with the same page instead of flashing the loading fallback
preloadPage(window.location.pathname).then(renderApp, renderApp);
