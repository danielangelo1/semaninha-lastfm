import { GithubLogo, LastfmLogo, TwitterLogo } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./Footer.css";

const actualYear = new Date().getFullYear();

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer>
      <p>
        {t("footer.developedBy")}{" "}
        <Link
          to={"https://github.com/danielangelo1"}
          target="_blank"
          rel="noreferrer"
          className="author"
        >
          Daniel Ângelo
        </Link>{" "}
        © {actualYear}.
      </p>
      <div className="social-medias">
        <Link
          to={"https://www.last.fm/user/dandowski"}
          target="_blank"
          rel="noreferrer"
          aria-label="Last.fm"
        >
          <LastfmLogo size={32} />
        </Link>
        <Link
          to={"https://twitter.com/dandowski"}
          target="_blank"
          rel="noreferrer"
          aria-label="Twitter"
        >
          <TwitterLogo size={32} />
        </Link>
        <Link
          to={"https://github.com/danielangelo1"}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <GithubLogo size={32} />
        </Link>
      </div>
      <div className="link-pages">
        <Link to="/privacy">{t("footer.privacy")}</Link>
      </div>
    </footer>
  );
};

export default Footer;
