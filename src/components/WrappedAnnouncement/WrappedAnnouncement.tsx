import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, X } from "@phosphor-icons/react";
import { WRAPPED_YEAR } from "../../constants/wrapped";
import "./WrappedAnnouncement.css";

// Year-scoped, so the notice comes back on its own for next year's Wrapped
export const ANNOUNCEMENT_KEY = `semaninha-wrapped-${WRAPPED_YEAR}-seen`;
const SHOW_DELAY = 1000;

// Storage can be unavailable (private mode, blocked site data)
const hasSeen = (): boolean => {
  try {
    return localStorage.getItem(ANNOUNCEMENT_KEY) !== null;
  } catch {
    return false;
  }
};

const markSeen = (): void => {
  try {
    localStorage.setItem(ANNOUNCEMENT_KEY, "true");
  } catch {
    // Not persisted: the notice just shows again on the next visit
  }
};

const WrappedAnnouncement = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hasSeen()) return;

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    markSeen();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside className="wrapped-announcement" aria-labelledby="wrapped-announcement-title">
      <button
        type="button"
        className="wrapped-announcement-close"
        onClick={dismiss}
        aria-label={t("wrapped.announcement.close")}
      >
        <X size={14} weight="bold" aria-hidden="true" />
      </button>

      <span className="wrapped-announcement-eyebrow">
        {t("wrapped.announcement.eyebrow")}
      </span>
      <h2 id="wrapped-announcement-title">
        {t("wrapped.announcement.title", { year: WRAPPED_YEAR })}
      </h2>
      <p>{t("wrapped.announcement.text")}</p>

      <div className="wrapped-announcement-actions">
        <Link to="/wrapped" className="wrapped-announcement-cta" onClick={markSeen}>
          {t("wrapped.announcement.cta")}
          <ArrowRight size={14} weight="bold" aria-hidden="true" />
        </Link>
        <button type="button" className="wrapped-announcement-dismiss" onClick={dismiss}>
          {t("wrapped.announcement.dismiss")}
        </button>
      </div>
    </aside>
  );
};

export default WrappedAnnouncement;
