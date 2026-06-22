import { useTranslation } from "react-i18next";
import UserInput from "../../components/UserInput/UserInput";
import "./Home.css";

const Home = () => {
  const { t } = useTranslation();

  return (
    <main className="home">
      <p>{t("home.description")}</p>
      <UserInput />
    </main>
  );
};

export default Home;
