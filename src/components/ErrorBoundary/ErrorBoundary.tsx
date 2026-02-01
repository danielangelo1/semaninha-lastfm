import { ReactNode } from "react";
import * as Sentry from "@sentry/react";
import "./ErrorBoundary.css";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

function ErrorBoundary({ children, fallback }: Props) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => {
        if (fallback) {
          return <>{fallback}</>;
        }

        return (
          <div className="error-boundary">
            <div className="error-boundary-content">
              <h2>Oops! Algo deu errado</h2>
              <p>
                Ocorreu um erro inesperado. Tente recarregar a página ou entre
                em contato conosco se o problema persistir.
              </p>
              <details className="error-details">
                <summary>Detalhes técnicos</summary>
                <pre>{error instanceof Error ? error.message : String(error)}</pre>
              </details>
              <button onClick={resetError} className="error-reload-button">
                Tentar Novamente
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
