import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header>
      <div className="header-content">
        <Link to="/" className="logo-link">
          <h1>SEMANINHA.NET</h1>
        </Link>
        <nav className="header-nav" aria-label="Navegação principal">
          <Link to="/" className="nav-link">Colagens</Link>
          <Link to="/wrapped" className="nav-link wrapped-link">🎵 Wrapped 2025</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
