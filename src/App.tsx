import { ToastContainer } from "react-toastify";
import Router from "./router/Router";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // const { shouldShowNotification, dismissNotification } = useNotification();

  return (
    <ErrorBoundary>
      <Router />
      <ToastContainer autoClose={2000} />
      {/* {shouldShowNotification && (
        <NotificationPopup onClose={dismissNotification} />
      )} */}
    </ErrorBoundary>
  );
}

export default App;
