import { useTranslation } from "react-i18next";
import "./Privacy.css";

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <main className="privacy-container">
      <h2>{t("privacy.title")}</h2>
      <p>{t("privacy.intro")}</p>
      <p>{t("privacy.dataCollected")}</p>
      <ul>
        <li>{t("privacy.dataUsername")}</li>
        <li>{t("privacy.dataPeriod")}</li>
        <li>{t("privacy.dataSize")}</li>
        <li>{t("privacy.dataDisplay")}</li>
      </ul>
      <p>{t("privacy.noSharing")}</p>
      <div className="contact">
        <p>
          {t("privacy.contact")}{" "}
          <a href="mailto:danielangelo12334@gmail.com">
            danielangelo1234@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
};

export default Privacy;
