import { useEffect, useState } from "react";
import API from "../../services/apiAdmin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import "../../styles/AdminDashboard.css";
import "../../styles/CertificatesManagement.css";

function CertificatesManagement() {
  const [docs, setDocs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null); // modal ke liye

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await API.get("/documents/all");
      setDocs(res.data);
    } catch (err) {
      console.log("Certificates fetch error:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/documents/${id}/status`, { status });
      fetchDocs();
      setSelected(null);
      alert(`✅ Request ${status}!`);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filtered = filter === "All"
    ? docs
    : docs.filter(d => d.status === filter);

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <div className="admin-dashboard-main">
        <AdminHeader />

        <div className="admin-dashboard-home">
          <h2>📄 Certificate Requests</h2>
          <p className="sub-text">Manage all citizen certificate applications</p>

          {/* FILTER TABS */}
          <div className="cert-filter-tabs">
            {["All", "Pending", "Approved", "Rejected"].map(tab => (
              <button
                key={tab}
                className={`cert-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
                <span className="cert-tab-count">
                  {tab === "All"
                    ? docs.length
                    : docs.filter(d => d.status === tab).length}
                </span>
              </button>
            ))}
          </div>

          {/* TABLE */}
          <div className="recent-complaints">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Citizen</th>
                  <th>Email</th>
                  <th>Certificate Type</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                      No requests found
                    </td>
                  </tr>
                ) : (
                  filtered.map((doc, index) => (
                    <tr key={doc._id}>
                      <td>{index + 1}</td>
                      <td>{doc.user?.name || "N/A"}</td>
                      <td>{doc.user?.email || "N/A"}</td>
                      <td>
                        <span className="cert-type-badge">
                          {doc.type === "birth" && "🍼 Birth"}
                          {doc.type === "death" && "🕊️ Death"}
                          {doc.type === "income" && "💼 Income"}
                        </span>
                      </td>
                      <td>{new Date(doc.createdAt).toLocaleDateString("en-IN")}</td>
                      <td>
                        <span className={`cert-status ${doc.status.toLowerCase()}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="cert-view-btn"
                          onClick={() => setSelected(doc)}
                        >
                          👁️ View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selected && (
        <div className="cert-modal-overlay" onClick={() => setSelected(null)}>
          <div className="cert-modal" onClick={e => e.stopPropagation()}>
            <h3>📋 Certificate Request Details</h3>
            <hr />

            <div className="cert-modal-info">
              <p><strong>Citizen:</strong> {selected.user?.name}</p>
              <p><strong>Email:</strong> {selected.user?.email}</p>
              <p><strong>Mobile:</strong> {selected.user?.mobile}</p>
              <p><strong>Type:</strong> {selected.type}</p>
              <p><strong>Applied:</strong> {new Date(selected.createdAt).toLocaleDateString("en-IN")}</p>
              <p><strong>Status:</strong>
                <span className={`cert-status ${selected.status.toLowerCase()}`}>
                  {" "}{selected.status}
                </span>
              </p>
            </div>

            {/* FORM DATA */}
            <div className="cert-modal-data">
              <h4>📝 Submitted Information</h4>
              {Object.entries(selected.data || {}).map(([key, value]) => (
                <div key={key} className="cert-data-row">
                  <span className="cert-data-key">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="cert-data-value">{value}</span>
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            {selected.status === "Pending" && (
              <div className="cert-modal-actions">
                <button
                  className="cert-approve-btn"
                  onClick={() => updateStatus(selected._id, "Approved")}
                >
                  ✅ Approve
                </button>
                <button
                  className="cert-reject-btn"
                  onClick={() => updateStatus(selected._id, "Rejected")}
                >
                  ❌ Reject
                </button>
              </div>
            )}

            <button className="cert-close-btn" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificatesManagement;