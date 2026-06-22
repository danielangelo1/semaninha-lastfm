import { Link } from "react-router-dom";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import "./Header.css";

const Header = () => {
  return (
    <header>
      <div className="header-content">
        <Link to="/" className="logo-link">
          <h1>SEMANINHA.NET</h1>
        </Link>
        <nav className="header-nav" aria-label="Navigation">
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
};

export default Header;
