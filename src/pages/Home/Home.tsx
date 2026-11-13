import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import UserInput from "../../components/UserInput/UserInput";
import WrappedAnnouncement from "../../components/WrappedAnnouncement/WrappedAnnouncement";
import "./Home.css";

const GUIDES = [
  { to: "/how-to-use", key: "howToUse" },
  { to: "/what-is-a-scrobble", key: "scrobble" },
  { to: "/connect-your-player", key: "connectPlayer" },
];

const Home = () => {
  const { t } = useTranslation();
  const steps = t("home.steps", { returnObjects: true }) as string[];

  return (
    <main className="home">
      <p>{t("home.description")}</p>
      <UserInput />

      {/* Explains the tool below it, for first-time visitors and search engines */}
      <section className="home-about" aria-labelledby="home-about-title">
        <div className="home-about-block">
          <h2 id="home-about-title">{t("home.aboutTitle")}</h2>
          <p>{t("home.aboutText")}</p>
        </div>

        <div className="home-about-block">
          <h2>{t("home.stepsTitle")}</h2>
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="home-about-block">
          <h2>{t("home.guidesTitle")}</h2>
          <ul className="home-guides">
            {GUIDES.map(({ to, key }) => (
              <li key={to}>
                <Link to={to}>{t(`home.guides.${key}`)}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WrappedAnnouncement />
    </main>
  );
};

export default Home;
