import { GithubLogo, LastfmLogo, TwitterLogo } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <p>Desenvolvido por Daniel Ângelo © 2024.</p>
      <div className="social-medias">
        <LastfmLogo size={24} />
        <TwitterLogo size={24} />
        <GithubLogo size={24} />
      </div>
      <div className="link-pages">
        <Link to="/privacy">Política de Privacidade</Link>
        <Link to="/about">Sobre</Link>
      </div>
    </footer>
  );
};

export default Footer;
