import { ToastContainer } from "react-toastify";
import Router from "./router/Router";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // const { shouldShowNotification, dismissNotification } = useNotification();

  return (
    <>
      <Router />
      <ToastContainer autoClose={2000} />
      {/* {shouldShowNotification && (
        <NotificationPopup onClose={dismissNotification} />
      )} */}
    </>
  );
}

export default App;
