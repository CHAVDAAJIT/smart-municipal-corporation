import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-left">
        <img src="/assets/logo.png" alt="Logo" className="nav-logo" />
        <span className="nav-title">Smart Municipal Corporation</span>
      </div>

      <nav className="nav-center">
        <Link to="/">Home</Link>
        <a href="#services">Services</a>
        <a href="#features">Features</a>
        <a href="#contact">Contact Us</a>
      </nav>

      <div className="nav-right">
        <Link to="/user/login" className="nav-btn">Get Started</Link>
      </div>
    </header>
  );
}

export default Navbar;