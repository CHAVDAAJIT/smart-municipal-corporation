import { useEffect, useState } from "react";
import API from "../../services/apiAdmin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import "../../styles/AdminDashboard.css";
import "../../styles/CitizensManagement.css";
import "../../styles/CertificatesManagement.css";

function CitizensManagement() {
  const [citizens, setCitizens] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    fetchCitizens();
  }, []);

  const fetchCitizens = async () => {
    try {
      const res = await API.get("/citizens");
      setCitizens(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCitizenDetail = async (id) => {
    try {
      const res = await API.get(`/citizens/${id}`);
      setSelectedDetail(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleView = async (citizen) => {
    setSelected(citizen);
    await fetchCitizenDetail(citizen._id);
  };

  const toggleBlock = async (id) => {
    try {
      await API.put(`/citizens/${id}/toggle-block`);
      fetchCitizens();
      if (selectedDetail) {
        fetchCitizenDetail(id);
      }
    } catch (err) {
      alert("❌ Failed to update");
    }
  };

  const deleteCitizen = async (id) => {
    if (!window.confirm("Delete this citizen? This cannot be undone.")) return;
    try {
      await API.delete(`/citizens/${id}`);
      fetchCitizens();
      setSelected(null);
      setSelectedDetail(null);
    } catch (err) {
      alert("❌ Failed to delete");
    }
  };

  // Search filter
  const filtered = citizens.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search)
  );

  const totalCitizens = citizens.length;
  const blockedCitizens = citizens.filter(c => c.isBlocked).length;
  const activeCitizens = citizens.filter(c => !c.isBlocked).length;
  const totalComplaints = citizens.reduce((sum, c) => sum + (c.complaintCount || 0), 0);

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <div className="admin-dashboard-main">
        <AdminHeader />

        <div className="admin-dashboard-home">
          <h2>👥 Citizens Management</h2>
          <p className="sub-text">Manage all registered citizens</p>

          {/* Stats */}
          <div className="citizens-stats">
            <div className="citizens-stat">
              <div className="citizens-stat-icon">👥</div>
              <div>
                <h4>{totalCitizens}</h4>
                <p>Total Citizens</p>
              </div>
            </div>
            <div className="citizens-stat">
              <div className="citizens-stat-icon">✅</div>
              <div>
                <h4>{activeCitizens}</h4>
                <p>Active</p>
              </div>
            </div>
            <div className="citizens-stat">
              <div className="citizens-stat-icon">🚫</div>
              <div>
                <h4>{blockedCitizens}</h4>
                <p>Blocked</p>
              </div>
            </div>
            <div className="citizens-stat">
              <div className="citizens-stat-icon">📋</div>
              <div>
                <h4>{totalComplaints}</h4>
                <p>Total Complaints</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="citizens-search-bar">
            <input
              placeholder="🔍 Search by name, email or mobile..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span>{filtered.length} citizens found</span>
          </div>

          {/* Table */}
          <div className="recent-complaints">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Citizen</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Complaints</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="cert-empty-row">
                      No citizens found
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, index) => (
                    <tr key={c._id}>
                      <td>{index + 1}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div className="citizen-avatar">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          {c.name}
                        </div>
                      </td>
                      <td>{c.email}</td>
                      <td>{c.mobile}</td>
                      <td>
                        <span style={{
                          background: "#e8f4fd",
                          color: "#0f4c75",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}>
                          {c.complaintCount || 0}
                        </span>
                      </td>
                      <td>
                        <span className={`citizen-block-badge ${c.isBlocked ? "blocked" : "active"}`}>
                          {c.isBlocked ? "🚫 Blocked" : "✅ Active"}
                        </span>
                      </td>
                      <td>
                        <div className="citizen-action-btns">
                          <button
                            className="cert-view-btn"
                            onClick={() => handleView(c)}
                          >
                            👁️ View
                          </button>
                          <button
                            className={`citizen-block-btn ${c.isBlocked ? "unblock" : "block"}`}
                            onClick={() => toggleBlock(c._id)}
                          >
                            {c.isBlocked ? "✅ Unblock" : "🚫 Block"}
                          </button>
                          <button
                            className="citizen-delete-btn"
                            onClick={() => deleteCitizen(c._id)}
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

      {/* Modal */}
      {selected && selectedDetail && (
        <div className="cert-modal-overlay" onClick={() => { setSelected(null); setSelectedDetail(null); }}>
          <div className="cert-modal" onClick={e => e.stopPropagation()}>
            <h3>👤 Citizen Details</h3>
            <hr />

            {/* Avatar + Name */}
            <div style={{
              display: "flex", alignItems: "center",
              gap: "14px", marginBottom: "16px"
            }}>
              <div className="citizen-avatar" style={{ width: "50px", height: "50px", fontSize: "20px" }}>
                {selected.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: "600", fontSize: "16px" }}>
                  {selected.name}
                </p>
                <span className={`citizen-block-badge ${selected.isBlocked ? "blocked" : "active"}`}>
                  {selected.isBlocked ? "🚫 Blocked" : "✅ Active"}
                </span>
              </div>
            </div>

            <div className="cert-modal-info">
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Mobile:</strong> {selected.mobile}</p>
              <p><strong>Total Complaints:</strong> {selected.complaintCount || 0}</p>
            </div>

            {/* Complaints List */}
            {selectedDetail.complaints?.length > 0 && (
              <div className="cert-modal-data">
                <h4>📋 Recent Complaints</h4>
                {selectedDetail.complaints.slice(0, 5).map(c => (
                  <div key={c._id} className="citizen-complaint-item">
                    <span>{c.type} — {c.area}</span>
                    <span className={`cert-status ${c.status.toLowerCase()}`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="cert-modal-actions">
              <button
                className={`cert-approve-btn`}
                style={{ background: selected.isBlocked ? "#059669" : "#b08900" }}
                onClick={() => toggleBlock(selected._id)}
              >
                {selected.isBlocked ? "✅ Unblock Citizen" : "🚫 Block Citizen"}
              </button>
              <button
                className="cert-reject-btn"
                onClick={() => deleteCitizen(selected._id)}
              >
                🗑️ Delete
              </button>
            </div>

            <button
              className="cert-close-btn"
              onClick={() => { setSelected(null); setSelectedDetail(null); }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CitizensManagement;