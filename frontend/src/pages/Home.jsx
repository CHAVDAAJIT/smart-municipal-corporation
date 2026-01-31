import "./../styles/Home.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";



function Home() {
  return (
    
    <div>
        {/* <Navbar /> */}
      {/* HERO SECTION */}
      <section className="hero">
        <h1>Smart Municipal Corporation</h1>
        <p>Efficient Governance for a Better City</p>

        <div className="hero-buttons">
          <Link to="/login" className="btn user-btn">User Login</Link>
          <Link to="/admin/login" className="btn admin-btn">Admin Login</Link>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services">
        <h2>Citizen Services</h2>

        <div className="card-container">
          <div className="card">
            <h3>Online Complaints</h3>
            <p>Register civic complaints easily.</p>
          </div>

          <div className="card">
            <h3>Track Requests</h3>
            <p>Check real-time complaint status.</p>
          </div>

          <div className="card">
            <h3>Smart Solutions</h3>
            <p>Digital solutions for city management.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 Smart Municipal Corporation</p>
      </footer>

    </div>
  );
}

export default Home;
