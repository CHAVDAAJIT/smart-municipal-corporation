import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      {/* LEFT SIDE */}
      <div className="logo">
        Smart Municipal
      </div>

      {/* RIGHT SIDE */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">User Login</Link></li>
        <li><Link to="/admin/login">Admin Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
