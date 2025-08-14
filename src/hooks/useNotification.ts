import { useState, useEffect } from "react";

const NOTIFICATION_KEY = "semaninha-notification-v1";
const NOTIFICATION_DELAY = 1000;

export const useNotification = () => {
  const [shouldShowNotification, setShouldShowNotification] = useState(false);

  useEffect(() => {
    const hasSeenNotification = localStorage.getItem(NOTIFICATION_KEY);

    if (!hasSeenNotification) {
      const timer = setTimeout(() => {
        setShouldShowNotification(true);
      }, NOTIFICATION_DELAY);

      return () => clearTimeout(timer);
    }
  }, []);

  const dismissNotification = () => {
    localStorage.setItem(NOTIFICATION_KEY, "true");
    setShouldShowNotification(false);
  };

  const resetNotification = () => {
    localStorage.removeItem(NOTIFICATION_KEY);
    setShouldShowNotification(true);
  };

  return {
    shouldShowNotification,
    dismissNotification,
    resetNotification,
  };
};
