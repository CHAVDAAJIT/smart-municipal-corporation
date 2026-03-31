import { useEffect, useState } from "react";
import API from "../../services/apiAdmin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import "../../styles/AdminDashboard.css";
import "../../styles/CityUpdates.css";
import "../../styles/CertificatesManagement.css";

function AdminCityUpdates() {
  const [updates, setUpdates] = useState([]);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    title: "", description: "", category: "General", image: ""
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const res = await API.get("/city-updates/all");
      setUpdates(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/city-updates", form);
      setForm({ title: "", description: "", category: "General", image: "" });
      fetchUpdates();
      setMsg("✅ Update published!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("❌ Failed to publish");
    }
  };

  const toggleActive = async (id) => {
    try {
      await API.put(`/city-updates/${id}/toggle`);
      fetchUpdates();
    } catch (err) {
      alert("❌ Failed");
    }
  };

  const deleteUpdate = async (id) => {
    if (!window.confirm("Delete this update?")) return;
    try {
      await API.delete(`/city-updates/${id}`);
      fetchUpdates();
    } catch (err) {
      alert("❌ Failed to delete");
    }
  };

  const filtered = filter === "All"
    ? updates
    : filter === "Active"
      ? updates.filter(u => u.isActive)
      : updates.filter(u => !u.isActive);

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <div className="admin-dashboard-main">
        <AdminHeader />

        <div className="admin-dashboard-home">
          <h2>🏙️ City Updates Management</h2>
          <p className="sub-text">Create and manage city updates for citizens</p>

          {/* Create Form */}
          <div className="cityupdate-form-card">
            <h3>➕ Publish New Update</h3>
            {msg && (
              <div style={{
                padding: "10px 14px",
                borderRadius: "8px",
                marginBottom: "12px",
                background: msg.includes("✅") ? "#d1fae5" : "#ffe4e4",
                color: msg.includes("✅") ? "#059669" : "#e63946",
                fontSize: "13px",
                fontWeight: "500"
              }}>
                {msg}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Update Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
              />
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Road">Road</option>
                <option value="Water">Water</option>
                <option value="Park">Park</option>
                <option value="Event">Event</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
              <button type="submit" className="cityupdate-submit-btn">
                🏙️ Publish Update
              </button>
            </form>
          </div>

          {/* Filter Tabs */}
          <div className="cert-filter-tabs">
            {["All", "Active", "Inactive"].map(tab => (
              <button
                key={tab}
                className={`cert-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
                <span className="cert-tab-count">
                  {tab === "All" ? updates.length
                    : tab === "Active" ? updates.filter(u => u.isActive).length
                    : updates.filter(u => !u.isActive).length}
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
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="cert-empty-row">
                      No updates found
                    </td>
                  </tr>
                ) : (
                  filtered.map((u, index) => (
                    <tr key={u._id}>
                      <td>{index + 1}</td>
                      <td style={{ maxWidth: "250px" }}>
                        <p style={{ margin: 0, fontWeight: "600", fontSize: "13px" }}>
                          {u.title}
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>
                          {u.description.slice(0, 60)}...
                        </p>
                      </td>
                      <td>
                        <span className={`cityupdate-category ${u.category.toLowerCase()}`}>
                          {u.category}
                        </span>
                      </td>
                      <td>
                        <span className={`cert-status ${u.isActive ? "approved" : "pending"}`}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {new Date(u.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className={`announce-toggle-btn ${u.isActive ? "active" : "inactive"}`}
                            onClick={() => toggleActive(u._id)}
                          >
                            {u.isActive ? "✅ Active" : "❌ Inactive"}
                          </button>
                          <button
                            className="announce-delete-btn"
                            onClick={() => deleteUpdate(u._id)}
                          >
                            🗑️
                          </button>
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
    </div>
  );
}

export default AdminCityUpdates;