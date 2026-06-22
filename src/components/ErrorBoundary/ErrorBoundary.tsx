import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import * as Sentry from "@sentry/react";
import "./ErrorBoundary.css";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

function ErrorBoundary({ children, fallback }: Props) {
  const { t } = useTranslation();

  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => {
        if (fallback) {
          return <>{fallback}</>;
        }

        return (
          <div className="error-boundary">
            <div className="error-boundary-content">
              <h2>{t("errorBoundary.title")}</h2>
              <p>{t("errorBoundary.message")}</p>
              <details className="error-details">
                <summary>{t("errorBoundary.details")}</summary>
                <pre>
                  {error instanceof Error ? error.message : String(error)}
                </pre>
              </details>
              <button onClick={resetError} className="error-reload-button">
                {t("errorBoundary.retry")}
              </button>
            </div>
          </div>
        );
      }}
      showDialog={false}
      beforeCapture={(scope) => {
        scope.setTag("error_boundary", "custom");
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

export default ErrorBoundary;
