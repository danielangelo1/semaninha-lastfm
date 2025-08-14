import { ToastContainer } from "react-toastify";
import Router from "./router/Router";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ErrorBoundary>
      <Router />
      <ToastContainer autoClose={2000} />
    </ErrorBoundary>
  );
}

export default App;
