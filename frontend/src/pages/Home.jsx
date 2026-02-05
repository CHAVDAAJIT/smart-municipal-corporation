import "./../styles/Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      {/* ================= NAVBAR ================= */}
      {/* <Navbar /> */}

      {/* ================= HERO SECTION ================= */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/hero-bg.jpg)`,
        }}
      >
        <div className="hero-content">

          {/* LEFT TEXT */}
          <div className="hero-text">
            <h4>Welcome to</h4>
            <h1>Smart Municipal Corporation</h1>
            <p>Efficient Governance for a Better City</p>

            {/* HERO BUTTONS */}
            <div className="hero-buttons">
              <Link to="/login" className="btn user-btn">
                <img src="/assets/icon-user.png" alt="User" />
                User Login
              </Link>

              <Link to="/admin/login" className="btn admin-btn">
                <img src="/assets/icon-admin.png" alt="Admin" />
                Admin Login
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="services-section" id="services">
        <div className="services-cards">

          <div className="service-card">
            <img src="/assets/service-citizen.png" alt="Citizen Services" />
            <h3>Citizen Services</h3>
            <p>
              Register complaints, track requests,
              and get quick resolutions.
            </p>
          </div>

          <div className="service-card">
            <img src="/assets/service-mission.png" alt="Mission" />
            <h3>About Our Mission</h3>
            <p>
              Committed to creating a smart,
              sustainable, and responsive city.
            </p>
          </div>

          <div className="service-card">
            <img src="/assets/service-admin.png" alt="Admin Management" />
            <h3>Admin Management</h3>
            <p>
              Efficient tools for administrators
              to manage city operations.
            </p>
          </div>

        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="features-section" id="features">
        <h2>Our Key Features</h2>

        <div className="features-list">

          <div className="feature-item">
            <img src="/assets/feature-complaint.png" alt="Complaints" />
            <h4>Online Complaints</h4>
            <p>Easily report civic issues.</p>
          </div>

          <div className="feature-item">
            <img src="/assets/feature-tracking.jpg" alt="Tracking" />
            <h4>Real-Time Tracking</h4>
            <p>Track your complaint status live.</p>
          </div>

          <div className="feature-item">
            <img src="/assets/feature-smart.jpg" alt="Smart Solutions" />
            <h4>Smart Solutions</h4>
            <p>Innovative services for a better city.</p>
          </div>

          <div className="feature-item">
            <img src="/assets/feature-secure.jpg" alt="Secure" />
            <h4>Secure Access</h4>
            <p>Safe and reliable login portals.</p>
          </div>

        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="cta-section" id="contact">
        <div className="cta-content">

          {/* LEFT IMAGE */}
          <div className="cta-image">
            <img src="/assets/cta-worker.png" alt="Worker" />
          </div>

          {/* RIGHT TEXT */}
          <div className="cta-text">
            <h2>Join Us in Building a Smarter City!</h2>
            <p>
              Enhance your city's services and be a part of
              positive change.
            </p>

            <Link to="/register" className="btn cta-btn">
              Get Started
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;
