import { useEffect, useState } from "react";
import API from "../../../services/apiAdmin";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";
import "../../../styles/AdminDashboard.css";
import "../../../styles/CertificatesManagement.css";

function ComplaintsManagement() {
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All"); // ✅ Filter state

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/all");
      setComplaints(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const assignDepartment = async (id, department) => {
    try {
      await API.put(`/complaints/assign/${id}`, { department });
      fetchComplaints();
      setSelected(prev => prev ? { ...prev, department } : null);
    } catch (err) {
      alert("Failed to assign department");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/complaints/status/${id}`, { status });
      fetchComplaints();
      setSelected(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // ✅ Filter logic
  const filtered = filter === "All"
    ? complaints
    : complaints.filter(c => c.status === filter);

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <div className="admin-dashboard-main">
        <AdminHeader />

        <div className="admin-dashboard-home">
          <h2>Complaint Management</h2>
          <p className="sub-text">All citizen complaints</p>

          {/* ✅ FILTER TABS */}
          <div className="cert-filter-tabs">
            {["All", "Pending", "Assigned", "Resolved"].map(tab => (
              <button
                key={tab}
                className={`cert-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
                <span className="cert-tab-count">
                  {tab === "All"
                    ? complaints.length
                    : complaints.filter(c => c.status === tab).length}
                </span>
              </button>
            ))}
          </div>

          <div className="recent-complaints">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Citizen</th>
                  <th>Type</th>
                  <th>Area</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, index) => (
                    <tr key={c._id}>
                      <td>{index + 1}</td>
                      <td>{c.user?.name}</td>
                      <td>{c.type}</td>
                      <td>{c.area}</td>
                      <td>
                        <select
                          value={c.department || ""}
                          onChange={(e) => assignDepartment(c._id, e.target.value)}
                        >
                          <option value="">Assign</option>
                          <option value="Garbage Dept">Garbage Dept</option>
                          <option value="Water Dept">Water Dept</option>
                          <option value="Electric Dept">Electric Dept</option>
                          <option value="Road Dept">Road Dept</option>
                        </select>
                      </td>
                      <td>
                        <span className={`cert-status ${c.status.toLowerCase()}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                      <td>
                        <button
                          className="cert-view-btn"
                          onClick={() => setSelected(c)}
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
            <h3>📋 Complaint Details</h3>
            <hr />
            <div className="cert-modal-info">
              <p><strong>Citizen:</strong> {selected.user?.name}</p>
              <p><strong>Email:</strong> {selected.user?.email}</p>
              <p><strong>Type:</strong> {selected.type}</p>
              <p><strong>Area:</strong> {selected.area}</p>
              <p><strong>Description:</strong> {selected.description}</p>
              <p><strong>Date:</strong> {new Date(selected.createdAt).toLocaleDateString("en-IN")}</p>
              <p><strong>Status:</strong>{" "}
                <span className={`cert-status ${selected.status.toLowerCase()}`}>
                  {selected.status}
                </span>
              </p>
            </div>

            <div className="cert-modal-data">
              <h4>🏢 Assign Department</h4>
              <select
                value={selected.department || ""}
                onChange={(e) => assignDepartment(selected._id, e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", marginTop: "8px" }}
              >
                <option value="">Select Department</option>
                <option value="Garbage Dept">🚛 Garbage Dept</option>
                <option value="Water Dept">💧 Water Dept</option>
                <option value="Electric Dept">⚡ Electric Dept</option>
                <option value="Road Dept">🛣️ Road Dept</option>
              </select>
            </div>

            <div className="cert-modal-actions">
              <button
                className="cert-approve-btn"
                onClick={() => updateStatus(selected._id, "Resolved")}
              >
                ✅ Mark Resolved
              </button>
              <button
                className="cert-reject-btn"
                onClick={() => updateStatus(selected._id, "Pending")}
              >
                🔄 Mark Pending
              </button>
            </div>

            <button className="cert-close-btn" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplaintsManagement;