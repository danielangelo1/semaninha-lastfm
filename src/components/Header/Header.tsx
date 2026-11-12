import { Link } from "react-router-dom";
import { WRAPPED_YEAR } from "../../constants/wrapped";
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
          <Link to="/wrapped" className="nav-link wrapped-link">
            Wrapped {WRAPPED_YEAR}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
};

export default Header;
