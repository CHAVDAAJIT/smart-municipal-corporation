import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/apiAdmin";
import "../../styles/RecentComplaints.css";

function RecentComplaintsTable() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentComplaints();
  }, []);

  const fetchRecentComplaints = async () => {
    try {
      const res = await API.get("/complaints/all");
      setComplaints(res.data.slice(0, 5));
    } catch (err) {
      console.log("Admin recent complaints error:", err);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "resolved": return "resolved";
      case "pending": return "pending";
      case "assigned": return "assigned";
      default: return "";
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "garbage": return "🚛";
      case "water": return "💧";
      case "road": return "🛣️";
      case "street light": return "💡";
      default: return "📋";
    }
  };

  return (
    <div className="recent-complaints-card">

      {/* Header */}
      <div className="recent-complaints-header">
        <div>
          <h3>📋 Recent Complaints</h3>
          <p>Latest 5 citizen complaints</p>
        </div>
        <button
          className="view-all-btn"
          onClick={() => navigate("/admin/complaints")}
        >
          View All →
        </button>
      </div>

      {/* List */}
      {complaints.length === 0 ? (
        <div className="recent-complaints-empty">
          No complaints found
        </div>
      ) : (
        <div className="recent-complaints-list">
          {complaints.map((c) => (
            <div key={c._id} className="complaint-item">

              {/* Left */}
              <div className="complaint-item-left">
                <div className="complaint-icon-circle">
                  {getTypeIcon(c.type)}
                </div>
                <div className="complaint-item-info">
                  <p className="complaint-item-title">{c.type}</p>
                  <p className="complaint-item-meta">
                    👤 {c.user?.name || "Citizen"} &nbsp;•&nbsp; 📍 {c.area}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="complaint-item-right">
                <span className={`complaint-status-badge ${getStatusClass(c.status)}`}>
                  {c.status}
                </span>
                <span className="complaint-item-date">
                  📅 {new Date(c.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentComplaintsTable;