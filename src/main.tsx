import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import "./index.css";
import "./assets/FiraSans-Italic.ttf";
import "./i18n";
import { initSentry } from "./config/sentry.config";
import { initWebVitals } from "./config/webVitals";

initSentry();
initWebVitals();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
