import { useEffect, useState } from "react";
import API from "../../../services/apiUser";
import DashboardSidebar from "../../../components/user/DashboardSidebar";
import DashboardHeader from "../../../components/user/DashboardHeader";
import "../../../styles/Announcements.css";
import "../../../styles/UserDashboard.css";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await API.get("/announcements");
      setAnnouncements(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const categories = ["All", "General", "Water", "Garbage", "Road", "Event", "Emergency"];

  const filtered = filter === "All"
    ? announcements
    : announcements.filter(a => a.category === filter);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High": return "🔴";
      case "Medium": return "🟡";
      case "Low": return "🟢";
      default: return "⚪";
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <div className="announce-page">
          <h2>📢 Announcements</h2>
          <p className="sub-text" style={{ marginBottom: "20px" }}>
            Latest city announcements and updates
          </p>

          {/* Filter Tabs */}
          <div className="announce-filter-tabs">
            {categories.map(tab => (
              <button
                key={tab}
                className={`announce-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Announcement Cards */}
          {filtered.length === 0 ? (
            <div className="announce-empty">
              No announcements available
            </div>
          ) : (
            <div className="announce-grid">
              {filtered.map((a) => (
                <div
                  key={a._id}
                  className={`announce-card ${a.priority.toLowerCase()}`}
                >
                  <div className="announce-card-header">
                    <h4>{a.title}</h4>
                    <span className={`announce-priority ${a.priority.toLowerCase()}`}>
                      {getPriorityIcon(a.priority)} {a.priority}
                    </span>
                  </div>
                  <p>{a.description}</p>
                  <div className="announce-card-footer">
                    <span className="announce-category">{a.category}</span>
                    <span className="announce-date">
                      📅 {new Date(a.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Announcements;