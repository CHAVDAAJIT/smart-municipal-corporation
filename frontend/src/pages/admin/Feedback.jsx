import { useEffect, useState } from "react";
import API from "../../services/apiAdmin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import "../../styles/AdminDashboard.css";
import "../../styles/Feedback.css";
import "../../styles/CertificatesManagement.css";

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchFeedbacks();
    fetchStats();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await API.get("/feedback/all");
      setFeedbacks(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/feedback/stats");
      setStats(res.data);
    } catch (err) { console.log(err); }
  };

  const filtered = filter === "All"
    ? feedbacks
    : feedbacks.filter(f => f.rating === parseInt(filter));

  const renderStars = (rating) => "⭐".repeat(rating);

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <div className="admin-dashboard-main">
        <AdminHeader />
        <div className="admin-dashboard-home">
          <h2>⭐ Feedback & Ratings</h2>
          <p className="sub-text" style={{ marginBottom: "24px" }}>
            Citizen service quality feedback
          </p>

          {/* Stats */}
          {stats && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
              <div className="feedback-stat-card">
                <h3>⭐ {stats.avgRating}</h3>
                <p>Average Rating</p>
                <p className="star-display">{"⭐".repeat(Math.round(stats.avgRating))}</p>
              </div>
              <div className="feedback-stat-card">
                <h3>{stats.total}</h3>
                <p>Total Reviews</p>
              </div>
              <div style={{
                gridColumn: "1/-1", background: "white",
                borderRadius: "12px", padding: "20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                border: "1px solid #eef2f7"
              }}>
                <h4 style={{ fontSize: "14px", color: "#0f4c75", marginBottom: "12px" }}>
                  Rating Distribution
                </h4>
                {stats.distribution?.reverse().map(d => (
                  <div key={d.star} className="rating-bar-row">
                    <span style={{ minWidth: "20px" }}>{d.star}⭐</span>
                    <div className="rating-bar">
                      <div
                        className="rating-bar-fill"
                        style={{
                          width: stats.total > 0
                            ? `${(d.count / stats.total) * 100}%`
                            : "0%"
                        }}
                      />
                    </div>
                    <span style={{ minWidth: "30px", color: "#888" }}>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter */}
          <div className="cert-filter-tabs">
            {["All", "5", "4", "3", "2", "1"].map(tab => (
              <button
                key={tab}
                className={`cert-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab === "All" ? "All" : `${tab}⭐`}
                <span className="cert-tab-count">
                  {tab === "All"
                    ? feedbacks.length
                    : feedbacks.filter(f => f.rating === parseInt(tab)).length}
                </span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="recent-complaints">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Citizen</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Service</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="cert-empty-row">No feedback yet</td>
                  </tr>
                ) : (
                  filtered.map((f, i) => (
                    <tr key={f._id}>
                      <td>{i + 1}</td>
                      <td>
                        <p style={{ margin: 0, fontWeight: "600", fontSize: "13px" }}>
                          {f.user?.name}
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>
                          {f.user?.email}
                        </p>
                      </td>
                      <td>
                        <span style={{ fontSize: "16px" }}>
                          {"⭐".repeat(f.rating)}
                        </span>
                      </td>
                      <td style={{ maxWidth: "200px", fontSize: "13px" }}>
                        {f.comment || <span style={{ color: "#aaa" }}>No comment</span>}
                      </td>
                      <td>
                        <span className="announce-category">{f.serviceType}</span>
                      </td>
                      <td>{new Date(f.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminFeedback;