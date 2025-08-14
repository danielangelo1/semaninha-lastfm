import { useState } from "react";
import { X, Heart, Bug } from "@phosphor-icons/react";
import "./NotificationPopup.css";

interface NotificationPopupProps {
  onClose?: () => void;
}

const NotificationPopup = ({ onClose }: NotificationPopupProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);

    localStorage.setItem("semaninha-notification-v1", "true");

    setTimeout(() => {
      onClose?.();
    }, 100);
  };

  const handleContactClick = () => {
    window.open(
      "mailto:danielangelo1234@gmail.com?subject=Bug Report - Semaninha&body=Olá! Encontrei um bug no site:",
      "_blank",
    );
  };

  return (
    <div
      className={`notification-popup ${isClosing ? "closing" : ""}`}
      role="dialog"
      aria-labelledby="notification-title"
      aria-describedby="notification-description"
    >
      <div className="notification-content">
        <button
          className="notification-close"
          onClick={handleClose}
          aria-label="Fechar notificação"
        >
          <X size={16} />
        </button>

        <div className="notification-header">
          <Heart size={20} className="notification-icon" />
          <h3 id="notification-title">Obrigado por usar o Semaninha! 🎵</h3>
        </div>

        <p id="notification-description">
          Fiz algumas melhorias no site para uma experiência ainda melhor! Se
          encontrar algum bug, por favor avise.
        </p>

        <div className="notification-actions">
          <button
            className="notification-btn primary"
            onClick={handleContactClick}
          >
            <Bug size={16} />
            Reportar Bug
          </button>
          <button className="notification-btn secondary" onClick={handleClose}>
            Entendi!
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
