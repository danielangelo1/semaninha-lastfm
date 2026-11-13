import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ArrowUpRight, Check, Copy } from "@phosphor-icons/react";
import { SUPPORT_CONFIG } from "../../constants";
import "./Support.css";

const REPOSITORY_URL = "https://github.com/danielangelo1/semaninha-lastfm";
const COPIED_RESET_MS = 2000;
const OTHER_WAYS = ["share", "star", "feedback"];

const Support = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_CONFIG.PIX_KEY);
      setCopied(true);
    } catch {
      toast.error(t("support.copyError"));
    }
  };

  return (
    <main className="support">
      <div className="support-hero">
        <span className="support-eyebrow">{t("support.eyebrow")}</span>
        <h1>{t("support.title")}</h1>
        <p>{t("support.intro")}</p>
      </div>

      {SUPPORT_CONFIG.PIX_KEY && (
        <section className="support-pix" aria-labelledby="support-pix-label">
          <span id="support-pix-label" className="support-pix-label">
            {t("support.pixLabel")}
          </span>
          <div className="support-pix-row">
            <code className="support-pix-key">{SUPPORT_CONFIG.PIX_KEY}</code>
            <button
              type="button"
              className="support-pix-copy"
              onClick={copyPixKey}
              aria-live="polite"
            >
              {copied ? (
                <Check size={16} weight="bold" aria-hidden="true" />
              ) : (
                <Copy size={16} weight="bold" aria-hidden="true" />
              )}
              {copied ? t("support.copied") : t("support.copy")}
            </button>
          </div>
          <p>{t("support.pixNote")}</p>
        </section>
      )}

      <section className="support-other" aria-labelledby="support-other-title">
        <h2 id="support-other-title">{t("support.otherTitle")}</h2>
        <ul>
          {OTHER_WAYS.map((key) => (
            <li key={key}>{t(`support.other.${key}`)}</li>
          ))}
        </ul>
        <a
          href={REPOSITORY_URL}
          target="_blank"
          rel="noreferrer"
          className="support-external"
        >
          {t("support.github")}
          <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
        </a>
      </section>
    </main>
  );
};

export default Support;
