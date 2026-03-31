import { useEffect, useState } from "react";
import API from "../../../services/apiUser";
import DashboardSidebar from "../../../components/user/DashboardSidebar";
import DashboardHeader from "../../../components/user/DashboardHeader";
import "../../../styles/AboutCorporation.css";
import "../../../styles/UserDashboard.css";

const services = [
  { icon: "📋", name: "Complaint Management", desc: "Register and track civic complaints" },
  { icon: "📄", name: "Certificate Services", desc: "Birth, Death, Income certificates" },
  { icon: "💧", name: "Water Management", desc: "Supply schedule and tanker requests" },
  { icon: "🚛", name: "Garbage Collection", desc: "Truck tracking and complaints" },
  { icon: "🏠", name: "Property Tax", desc: "Online tax payment and records" },
  { icon: "📢", name: "Announcements", desc: "City news and public notices" },
  { icon: "🏙️", name: "City Updates", desc: "Infrastructure and development news" },
  { icon: "🔔", name: "Notifications", desc: "Real-time activity alerts" },
];

const timings = [
  { day: "Monday - Friday", time: "9:00 AM - 6:00 PM", closed: false },
  { day: "Saturday", time: "9:00 AM - 2:00 PM", closed: false },
  { day: "Sunday", time: "Closed", closed: true },
  { day: "Public Holidays", time: "Closed", closed: true },
];

const team = [
  { name: "Rajesh Mehta", role: "Municipal Commissioner", initial: "R" },
  { name: "Priya Shah", role: "Deputy Commissioner", initial: "P" },
  { name: "Amit Patel", role: "City Engineer", initial: "A" },
  { name: "Sunita Verma", role: "Health Officer", initial: "S" },
  { name: "Dinesh Kumar", role: "IT Director", initial: "D" },
  { name: "Meena Joshi", role: "Finance Head", initial: "M" },
];

function AboutCorporation() {
  const [stats, setStats] = useState({
    totalCitizens: 0,
    totalComplaints: 0,
    resolvedComplaints: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/complaints/stats");
      setStats({
        totalCitizens: "10,000+",
        totalComplaints: res.data.total || 0,
        resolvedComplaints: res.data.resolved || 0,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <div className="about-page">

          {/* Hero Banner */}
          <div className="about-hero">
            <div className="about-hero-icon">🏛️</div>
            <div className="about-hero-text">
              <h2>Smart Municipal Corporation</h2>
              <p>
                Smart Municipal Corporation is committed to delivering
                efficient, transparent, and citizen-centric governance.
                Through digital innovation and smart city initiatives,
                we aim to enhance the quality of life for every citizen
                of Ahmedabad. Our portal provides seamless access to
                all municipal services — anytime, anywhere.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="about-stats">
            <div className="about-stat-card">
              <div className="about-stat-icon">👥</div>
              <h3>10,000+</h3>
              <p>Citizens Registered</p>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-icon">📋</div>
              <h3>{stats.totalComplaints}</h3>
              <p>Complaints Registered</p>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-icon">✅</div>
              <h3>{stats.resolvedComplaints}</h3>
              <p>Complaints Resolved</p>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-icon">🏢</div>
              <h3>32</h3>
              <p>Municipal Wards</p>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-icon">🚛</div>
              <h3>18</h3>
              <p>Garbage Trucks</p>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-icon">⭐</div>
              <h3>4.2/5</h3>
              <p>Citizen Rating</p>
            </div>
          </div>

          {/* Vision Mission + Services */}
          <div className="about-grid">

            {/* Vision & Mission */}
            <div className="about-card">
              <h3>🎯 Vision & Mission</h3>
              <div className="about-vision-box">
                <h4>🔭 Our Vision</h4>
                <p>
                  To be a model smart city that leverages technology
                  to deliver world-class municipal services, ensuring
                  sustainable urban development and an excellent
                  quality of life for all citizens.
                </p>
              </div>
              <div className="about-mission-box">
                <h4>🚀 Our Mission</h4>
                <p>
                  To provide efficient, transparent, and accountable
                  municipal services through digital innovation,
                  citizen participation, and proactive governance
                  while ensuring environmental sustainability.
                </p>
              </div>
            </div>

            {/* Key Services */}
            <div className="about-card">
              <h3>⚡ Key Services</h3>
              {services.map((s, i) => (
                <div key={i} className="about-service-item">
                  <div className="about-service-icon">{s.icon}</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", fontSize: "13px" }}>
                      {s.name}
                    </p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="about-card">
              <h3>📞 Contact Information</h3>
              <div className="about-contact-item">
                <div className="about-contact-icon">🏢</div>
                <div className="about-contact-info">
                  <p className="about-contact-label">Head Office</p>
                  <p className="about-contact-value">
                    Municipal Corporation Office,<br />
                    Sardar Patel Bhavan, Danapith,<br />
                    Ahmedabad - 380001, Gujarat
                  </p>
                </div>
              </div>
              <div className="about-contact-item">
                <div className="about-contact-icon">📞</div>
                <div className="about-contact-info">
                  <p className="about-contact-label">Phone</p>
                  <p className="about-contact-value">+91 79 2234 5678</p>
                </div>
              </div>
              <div className="about-contact-item">
                <div className="about-contact-icon">📧</div>
                <div className="about-contact-info">
                  <p className="about-contact-label">Email</p>
                  <p className="about-contact-value">
                    admin@smartmunicipal.gov.in
                  </p>
                </div>
              </div>
              <div className="about-contact-item">
                <div className="about-contact-icon">🌐</div>
                <div className="about-contact-info">
                  <p className="about-contact-label">Website</p>
                  <p className="about-contact-value">
                    www.smartmunicipal.gov.in
                  </p>
                </div>
              </div>
              <div className="about-contact-item">
                <div className="about-contact-icon">🆘</div>
                <div className="about-contact-info">
                  <p className="about-contact-label">Emergency Helpline</p>
                  <p className="about-contact-value">1800-XXX-XXXX (Toll Free)</p>
                </div>
              </div>
            </div>

            {/* Office Timings */}
            <div className="about-card">
              <h3>🕐 Office Timings</h3>
              {timings.map((t, i) => (
                <div key={i} className="about-timing-item">
                  <span className="about-timing-day">{t.day}</span>
                  <span className={t.closed ? "about-timing-closed" : "about-timing-time"}>
                    {t.time}
                  </span>
                </div>
              ))}

              {/* Online Services Note */}
              <div style={{
                marginTop: "16px",
                background: "#d1fae5",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "12px",
                color: "#059669",
                fontWeight: "500"
              }}>
                ✅ Online services available 24/7 on this portal
              </div>
            </div>
          </div>

          {/* Leadership Team */}
          <div className="about-card">
            <h3>👨‍💼 Leadership Team</h3>
            <div className="about-team-grid">
              {team.map((member, i) => (
                <div key={i} className="about-team-card">
                  <div className="about-team-avatar">
                    {member.initial}
                  </div>
                  <p className="about-team-name">{member.name}</p>
                  <p className="about-team-role">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AboutCorporation;