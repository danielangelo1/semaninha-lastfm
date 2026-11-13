import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import "./HowToUse.css";

interface Step {
  key: string;
  href?: string;
}

const STEPS: Step[] = [
  { key: "account", href: "https://www.last.fm/join" },
  { key: "connect", href: "https://www.last.fm/settings/applications" },
  { key: "listen" },
  { key: "generate" },
];

const FAQ_KEYS = ["notFound", "notEnough", "noImage"];

const HowToUse = () => {
  const { t } = useTranslation();

  return (
    <main className="how-to-use">
      <div className="how-to-use-hero">
        <span className="how-to-use-eyebrow">{t("howToUse.eyebrow")}</span>
        <h1>{t("howToUse.title")}</h1>
        <p>{t("howToUse.intro")}</p>
      </div>

      <ol className="how-to-use-steps">
        {STEPS.map(({ key, href }, index) => (
          <li key={key} className="how-to-use-step">
            <span className="how-to-use-step-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="how-to-use-step-body">
              <h2>{t(`howToUse.steps.${key}.title`)}</h2>
              <p>{t(`howToUse.steps.${key}.text`)}</p>
              {href && (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="how-to-use-external"
                >
                  {t(`howToUse.steps.${key}.link`)}
                  <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>

      <section className="how-to-use-faq" aria-labelledby="how-to-use-faq-title">
        <h2 id="how-to-use-faq-title">{t("howToUse.faqTitle")}</h2>
        <dl>
          {FAQ_KEYS.map((key) => (
            <div key={key} className="how-to-use-faq-item">
              <dt>{t(`howToUse.faq.${key}.question`)}</dt>
              <dd>{t(`howToUse.faq.${key}.answer`)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Link to="/" className="how-to-use-cta">
        {t("howToUse.cta")}
        <ArrowRight size={16} weight="bold" aria-hidden="true" />
      </Link>
    </main>
  );
};

export default HowToUse;
