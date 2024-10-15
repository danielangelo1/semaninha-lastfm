import { GithubLogo, LastfmLogo, TwitterLogo } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <p>
        Desenvolvido por{" "}
        <Link
          to={"https://github.com/danielangelo1"}
          target="_blank"
          rel="noreferrer"
          className="author"
        >
          Daniel Ângelo
        </Link>{" "}
        © 2024.
      </p>
      <div className="social-medias">
        <Link
          to={"https://www.last.fm/user/dandowski"}
          target="_blank"
          rel="noreferrer"
        >
          <LastfmLogo size={32} />
        </Link>
        <Link
          to={"https://twitter.com/dandowski"}
          target="_blank"
          rel="noreferrer"
        >
          <TwitterLogo size={32} />
        </Link>
        <Link
          to={"https://github.com/danielangelo1"}
          target="_blank"
          rel="noreferrer"
        >
          <GithubLogo size={32} />
        </Link>
      </div>
      <div className="link-pages">
        <Link to="/privacy">Política de Privacidade</Link>
      </div>
    </footer>
  );
};

export default Footer;
