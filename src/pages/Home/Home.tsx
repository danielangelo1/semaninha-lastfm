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

  return (
    <main className="home">
      <p>{t("home.description")}</p>
      <UserInput />

      {/* Points first-time visitors to the guides */}
      <section className="home-about" aria-labelledby="home-guides-title">
        <div className="home-about-block">
          <h2 id="home-guides-title">{t("home.guidesTitle")}</h2>
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
