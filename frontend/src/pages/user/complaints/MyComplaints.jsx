import { useEffect, useState } from "react";
import API from "../../../services/apiUser";
import DashboardSidebar from "../../../components/user/DashboardSidebar";
import DashboardHeader from "../../../components/user/DashboardHeader";
import "../../../styles/Complaint.css";
import "../../../styles/UserDashboard.css";
import "../../../styles/MyCertificates.css";
import "../../../styles/ComplaintTimeline.css";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null); // timeline modal
  const [editModal, setEditModal] = useState(null); // edit modal
  const [editForm, setEditForm] = useState({ description: "", area: "", priority: "" });
  const [editMsg, setEditMsg] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async () => {
    try {
      await API.put(`/complaints/edit/${editModal._id}`, editForm);
      setEditMsg("✅ Updated successfully!");
      fetchComplaints();
      setTimeout(() => {
        setEditModal(null);
        setEditMsg("");
      }, 1500);
    } catch (err) {
      setEditMsg("❌ " + (err.response?.data?.message || "Failed"));
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this complaint?")) return;
    try {
      await API.put(`/complaints/cancel/${id}`);
      fetchComplaints();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Failed to cancel"));
    }
  };

  const getTimelineIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "⏳";
      case "assigned": return "🏢";
      case "resolved": return "✅";
      case "cancelled": return "❌";
      default: return "📋";
    }
  };

  const filtered = complaints.filter(c => {
    if (filter === "All") return true;
    return c.status === filter;
  });

  return (
    <div className="dashboard-container">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <div className="dashboard-home">
          <h2>My Complaints</h2>
          <p className="sub-text">Track your complaint status</p>

          {/* Filter Tabs */}
          <div className="mycert-filter-tabs">
            {["All", "Pending", "Assigned", "Resolved", "Cancelled"].map(tab => (
              <button
                key={tab}
                className={`mycert-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
                <span className="mycert-tab-count">
                  {tab === "All"
                    ? complaints.length
                    : complaints.filter(c => c.status === tab).length}
                </span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="complaint-card wide">
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Area</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, index) => (
                    <tr key={c._id}>
                      <td>{index + 1}</td>
                      <td>{c.type}</td>
                      <td>{c.area}</td>
                      <td>
                        <span className={`priority-badge ${c.priority?.toLowerCase() || "medium"}`}>
                          {c.priority || "Medium"}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${c.status.toLowerCase()}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                      <td>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {/* Timeline */}
                          <button
                            className="cert-view-btn"
                            onClick={() => setSelected(c)}
                          >
                            📋 Timeline
                          </button>

                          {/* Edit — only Pending */}
                          {c.status === "Pending" && (
                            <button
                              style={{
                                padding: "5px 10px",
                                background: "#e8f4fd",
                                color: "#0f4c75",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "12px",
                                cursor: "pointer",
                                fontWeight: "500"
                              }}
                              onClick={() => {
                                setEditModal(c);
                                setEditForm({
                                  description: c.description,
                                  area: c.area,
                                  priority: c.priority || "Medium"
                                });
                                setEditMsg("");
                              }}
                            >
                              ✏️ Edit
                            </button>
                          )}

                          {/* Cancel — only Pending */}
                          {c.status === "Pending" && (
                            <button
                              style={{
                                padding: "5px 10px",
                                background: "#ffe4e4",
                                color: "#e63946",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "12px",
                                cursor: "pointer",
                                fontWeight: "500"
                              }}
                              onClick={() => handleCancel(c._id)}
                            >
                              ❌ Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== TIMELINE MODAL ===== */}
      {selected && (
        <div className="cert-modal-overlay" onClick={() => setSelected(null)}>
          <div className="cert-modal" onClick={e => e.stopPropagation()}>
            <h3>📋 Complaint Timeline</h3>
            <hr />

            <div className="cert-modal-info">
              <p><strong>Type:</strong> {selected.type}</p>
              <p><strong>Area:</strong> {selected.area}</p>
              <p><strong>Priority:</strong>{" "}
                <span className={`priority-badge ${selected.priority?.toLowerCase() || "medium"}`}>
                  {selected.priority || "Medium"}
                </span>
              </p>
              <p><strong>Description:</strong> {selected.description}</p>
              {selected.department && (
                <p><strong>Department:</strong> {selected.department}</p>
              )}
            </div>

            {/* Timeline */}
            <div className="cert-modal-data">
              <h4>🕐 Activity Timeline</h4>
              <div className="complaint-timeline" style={{ marginTop: "12px" }}>
                {selected.timeline && selected.timeline.length > 0 ? (
                  selected.timeline.map((item, i) => (
                    <div key={i} className="timeline-item">
                      <div className={`timeline-dot ${item.status.toLowerCase()}`}>
                        {getTimelineIcon(item.status)}
                      </div>
                      <div className="timeline-content">
                        <p className="timeline-status">{item.status}</p>
                        <p className="timeline-message">{item.message}</p>
                        <p className="timeline-time">
                          {new Date(item.timestamp).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#888", fontSize: "13px" }}>
                    No timeline available
                  </p>
                )}
              </div>
            </div>

            {/* Photos */}
            {selected.photos && selected.photos.length > 0 && (
              <div className="cert-modal-data">
                <h4>📸 Photos</h4>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "8px" }}>
                  {selected.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={`http://localhost:5000/${photo}`}
                      alt={`complaint-${i}`}
                      style={{
                        width: "90px", height: "90px",
                        objectFit: "cover", borderRadius: "8px",
                        border: "2px solid #eef2f7"
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <button className="cert-close-btn" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {editModal && (
        <div className="cert-modal-overlay" onClick={() => setEditModal(null)}>
          <div className="edit-complaint-modal" onClick={e => e.stopPropagation()}>
            <h3>✏️ Edit Complaint</h3>

            {editMsg && (
              <p style={{
                color: editMsg.includes("✅") ? "#059669" : "#e63946",
                fontSize: "13px", fontWeight: "500", marginBottom: "10px"
              }}>
                {editMsg}
              </p>
            )}

            <label style={{ fontSize: "12px", color: "#888", fontWeight: "600" }}>
              Area / Ward
            </label>
            <input
              value={editForm.area}
              onChange={e => setEditForm({ ...editForm, area: e.target.value })}
              placeholder="Area / Ward"
            />

            <label style={{ fontSize: "12px", color: "#888", fontWeight: "600" }}>
              Priority
            </label>
            <select
              value={editForm.priority}
              onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>

            <label style={{ fontSize: "12px", color: "#888", fontWeight: "600" }}>
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={e => setEditForm({ ...editForm, description: e.target.value })}
              placeholder="Describe your complaint"
            />

            <div className="edit-modal-actions">
              <button className="edit-save-btn" onClick={handleEdit}>
                💾 Save Changes
              </button>
              <button className="edit-cancel-btn" onClick={() => setEditModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyComplaints;