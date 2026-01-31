import { Component, ErrorInfo, ReactNode } from "react";
import * as Sentry from "@sentry/react";
import "./ErrorBoundary.css";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    Sentry.withScope((scope) => {
      scope.setContext("errorInfo", {
        componentStack: errorInfo.componentStack,
      });
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Oops! Algo deu errado</h2>
            <p>
              Ocorreu um erro inesperado. Tente recarregar a página ou entre em
              contato conosco se o problema persistir.
            </p>
            <details className="error-details">
              <summary>Detalhes técnicos</summary>
              <pre>{this.state.error?.message}</pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="error-reload-button"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
