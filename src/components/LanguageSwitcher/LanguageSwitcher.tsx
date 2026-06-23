import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language?.startsWith("pt") ? "en" : "pt";
    i18n.changeLanguage(newLang);
  };

  const currentLang = i18n.language?.startsWith("pt") ? "PT" : "EN";

  return (
    <button
      className="language-switcher"
      onClick={toggleLanguage}
      aria-label={`Switch to ${currentLang === "PT" ? "English" : "Português"}`}
      title={currentLang === "PT" ? "Switch to English" : "Mudar para Português"}
    >
      {currentLang === "PT" ? "EN" : "PT"}
    </button>
  );
};

export default LanguageSwitcher;
