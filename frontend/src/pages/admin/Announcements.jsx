import { useEffect, useState } from "react";
import API from "../../services/apiAdmin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import "../../styles/AdminDashboard.css";
import "../../styles/Announcements.css";

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    title: "", description: "", category: "General", priority: "Medium"
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await API.get("/announcements/all");
      setAnnouncements(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/announcements", form);
      setForm({ title: "", description: "", category: "General", priority: "Medium" });
      fetchAnnouncements();
      alert("✅ Announcement created!");
    } catch (err) {
      alert("❌ Failed to create");
    }
  };

  const toggleActive = async (id) => {
    try {
      await API.put(`/announcements/${id}/toggle`);
      fetchAnnouncements();
    } catch (err) {
      alert("❌ Failed to toggle");
    }
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await API.delete(`/announcements/${id}`);
      fetchAnnouncements();
    } catch (err) {
      alert("❌ Failed to delete");
    }
  };

  const filtered = filter === "All"
    ? announcements
    : filter === "Active"
      ? announcements.filter(a => a.isActive)
      : announcements.filter(a => !a.isActive);

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <div className="admin-dashboard-main">
        <AdminHeader />

        <div className="admin-dashboard-home">
          <h2>📢 Announcements</h2>
          <p className="sub-text">Create and manage city announcements</p>

          {/* Create Form */}
          <div className="announce-form-card">
            <h3>➕ Create New Announcement</h3>
            <form onSubmit={handleSubmit}>
              <div className="announce-form-grid">
                <input
                  placeholder="Announcement Title"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                  style={{ gridColumn: "1 / -1" }}
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
                  <option value="Water">Water</option>
                  <option value="Garbage">Garbage</option>
                  <option value="Road">Road</option>
                  <option value="Event">Event</option>
                  <option value="Emergency">Emergency</option>
                </select>
                <select
                  value={form.priority}
                  onChange={e => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
              <button type="submit" className="announce-submit-btn">
                📢 Publish Announcement
              </button>
            </form>
          </div>

          {/* Filter Tabs */}
          <div className="announce-filter-tabs">
            {["All", "Active", "Inactive"].map(tab => (
              <button
                key={tab}
                className={`announce-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab} ({
                  tab === "All" ? announcements.length
                  : tab === "Active" ? announcements.filter(a => a.isActive).length
                  : announcements.filter(a => !a.isActive).length
                })
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
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="cert-empty-row">
                      No announcements found
                    </td>
                  </tr>
                ) : (
                  filtered.map((a, index) => (
                    <tr key={a._id}>
                      <td>{index + 1}</td>
                      <td>{a.title}</td>
                      <td>
                        <span className="announce-category">{a.category}</span>
                      </td>
                      <td>
                        <span className={`announce-priority ${a.priority.toLowerCase()}`}>
                          {a.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`cert-status ${a.isActive ? "approved" : "pending"}`}>
                          {a.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{new Date(a.createdAt).toLocaleDateString("en-IN")}</td>
                      <td>
                        <div className="announce-action-btns">
                          <button
                            className={`announce-toggle-btn ${a.isActive ? "active" : "inactive"}`}
                            onClick={() => toggleActive(a._id)}
                          >
                            {a.isActive ? "✅ Active" : "❌ Inactive"}
                          </button>
                          <button
                            className="announce-delete-btn"
                            onClick={() => deleteAnnouncement(a._id)}
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

export default AdminAnnouncements;