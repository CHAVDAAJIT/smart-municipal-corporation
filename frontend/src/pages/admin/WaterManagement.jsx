import { useEffect, useState } from "react";
import API from "../../services/apiAdmin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import "../../styles/AdminDashboard.css";
import "../../styles/CertificatesManagement.css";
import "../../styles/AdminWater.css";

function AdminWaterManagement() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const [schedule, setSchedule] = useState([]);
  const [outages, setOutages] = useState([]);
  const [, setBill] = useState(null);

  const [scheduleForm, setScheduleForm] = useState({ area: "", time: "" });
  const [outageForm, setOutageForm] = useState({ area: "", reason: "", time: "" });
  const [billForm, setBillForm] = useState({
    consumerId: "", month: "", unitsUsed: "", rate: "", dueDate: ""
  });

  useEffect(() => {
    fetchRequests();
    fetchSchedule();
    fetchOutages();
    fetchBill();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/water/all");
      setRequests(res.data);
    } catch (err) {
      console.log("Water requests fetch error:", err);
    }
  };

  const fetchSchedule = async () => {
    try {
      const res = await API.get("/water/schedule");
      setSchedule(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOutages = async () => {
    try {
      const res = await API.get("/water/outages");
      setOutages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBill = async () => {
    try {
      const res = await API.get("/water/bill");
      if (res.data) {
        setBill(res.data);
        setBillForm({
          consumerId: res.data.consumerId || "",
          month: res.data.month || "",
          unitsUsed: res.data.unitsUsed || "",
          rate: res.data.rate || "",
          dueDate: res.data.dueDate || "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/water/${id}/status`, { status });
      fetchRequests();
      setSelected(prev => prev ? { ...prev, status } : null);
      alert(`✅ Status updated to ${status}!`);
    } catch (err) {
      alert("❌ Failed to update status");
    }
  };

  const addSchedule = async (e) => {
    e.preventDefault();
    try {
      await API.post("/water/schedule", scheduleForm);
      setScheduleForm({ area: "", time: "" });
      fetchSchedule();
    } catch (err) {
      alert("❌ Failed to add schedule");
    }
  };

  const deleteSchedule = async (id) => {
    try {
      await API.delete(`/water/schedule/${id}`);
      fetchSchedule();
    } catch (err) {
      alert("❌ Failed to delete");
    }
  };

  const addOutage = async (e) => {
    e.preventDefault();
    try {
      await API.post("/water/outages", outageForm);
      setOutageForm({ area: "", reason: "", time: "" });
      fetchOutages();
    } catch (err) {
      alert("❌ Failed to add outage");
    }
  };

  const toggleOutage = async (id) => {
    try {
      await API.put(`/water/outages/${id}/toggle`);
      fetchOutages();
    } catch (err) {
      alert("❌ Failed to toggle");
    }
  };

  const deleteOutage = async (id) => {
    try {
      await API.delete(`/water/outages/${id}`);
      fetchOutages();
    } catch (err) {
      alert("❌ Failed to delete");
    }
  };

  const saveBill = async (e) => {
    e.preventDefault();
    try {
      await API.put("/water/bill", billForm);
      alert("✅ Bill info saved!");
      fetchBill();
    } catch (err) {
      alert("❌ Failed to save bill info");
    }
  };

  const filtered = filter === "All"
    ? requests
    : requests.filter(r => r.status === filter);

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <div className="admin-dashboard-main">
        <AdminHeader />

        <div className="admin-dashboard-home">
          <h2>💧 Water Supply Management</h2>
          <p className="sub-text">
            Manage citizen water complaints, tanker requests, schedule, outages and bill info
          </p>

          {/* Stats */}
          <div className="water-admin-stats">
            <div className="water-admin-stat">
              <span className="water-admin-stat-icon">📋</span>
              <div>
                <h4>{requests.length}</h4>
                <p>Total Requests</p>
              </div>
            </div>
            <div className="water-admin-stat">
              <span className="water-admin-stat-icon">⏳</span>
              <div>
                <h4>{requests.filter(r => r.status === "Pending").length}</h4>
                <p>Pending</p>
              </div>
            </div>
            <div className="water-admin-stat">
              <span className="water-admin-stat-icon">✅</span>
              <div>
                <h4>{requests.filter(r => r.status === "Approved").length}</h4>
                <p>Approved</p>
              </div>
            </div>
            <div className="water-admin-stat">
              <span className="water-admin-stat-icon">🚛</span>
              <div>
                <h4>{requests.filter(r => r.type === "tanker").length}</h4>
                <p>Tanker Requests</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="cert-filter-tabs">
            {["All", "Pending", "Approved", "Rejected", "Resolved"].map(tab => (
              <button
                key={tab}
                className={`cert-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
                <span className="cert-tab-count">
                  {tab === "All"
                    ? requests.length
                    : requests.filter(r => r.status === tab).length}
                </span>
              </button>
            ))}
          </div>

          {/* Requests Table */}
          <div className="recent-complaints">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Citizen</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Area</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="cert-empty-row">
                      No requests found
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, index) => (
                    <tr key={r._id}>
                      <td>{index + 1}</td>
                      <td>{r.user?.name || "N/A"}</td>
                      <td>{r.user?.email || "N/A"}</td>
                      <td>
                        <span className={`water-type-badge ${r.type}`}>
                          {r.type === "complaint" ? "📝 Complaint" : "🚛 Tanker"}
                        </span>
                      </td>
                      <td>{r.area}</td>
                      <td>{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                      <td>
                        <span className={`cert-status ${r.status.toLowerCase()}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="cert-view-btn"
                          onClick={() => setSelected(r)}
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

          {/* ===== MANAGE SECTION ===== */}
          <div className="water-manage-grid">

            {/* Schedule */}
            <div className="water-manage-card">
              <h3>🕐 Water Supply Schedule</h3>

              <form onSubmit={addSchedule} className="water-manage-form">
                <input
                  placeholder="Area name"
                  value={scheduleForm.area}
                  onChange={e => setScheduleForm({
                    ...scheduleForm, area: e.target.value
                  })}
                  required
                />
                <input
                  placeholder="Time (e.g. 6:00 AM - 8:00 AM)"
                  value={scheduleForm.time}
                  onChange={e => setScheduleForm({
                    ...scheduleForm, time: e.target.value
                  })}
                  required
                />
                <button type="submit" className="water-manage-btn">
                  + Add Schedule
                </button>
              </form>

              <div className="water-manage-list">
                {schedule.length === 0 ? (
                  <p className="water-manage-empty">No schedule added</p>
                ) : (
                  schedule.map(s => (
                    <div key={s._id} className="water-manage-item">
                      <div>
                        <p className="water-manage-title">{s.area}</p>
                        <p className="water-manage-sub">{s.time}</p>
                      </div>
                      <button
                        className="water-delete-btn"
                        onClick={() => deleteSchedule(s._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Outages */}
            <div className="water-manage-card">
              <h3>🚨 Water Outage Alerts</h3>

              <form onSubmit={addOutage} className="water-manage-form">
                <input
                  placeholder="Area"
                  value={outageForm.area}
                  onChange={e => setOutageForm({
                    ...outageForm, area: e.target.value
                  })}
                  required
                />
                <input
                  placeholder="Reason"
                  value={outageForm.reason}
                  onChange={e => setOutageForm({
                    ...outageForm, reason: e.target.value
                  })}
                  required
                />
                <input
                  placeholder="Time (e.g. Today 10AM - 2PM)"
                  value={outageForm.time}
                  onChange={e => setOutageForm({
                    ...outageForm, time: e.target.value
                  })}
                  required
                />
                <button type="submit" className="water-manage-btn">
                  + Add Outage
                </button>
              </form>

              <div className="water-manage-list">
                {outages.length === 0 ? (
                  <p className="water-manage-empty">No outages added</p>
                ) : (
                  outages.map(o => (
                    <div key={o._id} className="water-manage-item">
                      <div>
                        <p className="water-manage-title">
                          {o.area} — {o.reason}
                        </p>
                        <p className="water-manage-sub">{o.time}</p>
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          className={`water-toggle-btn ${o.resolved ? "resolved" : ""}`}
                          onClick={() => toggleOutage(o._id)}
                        >
                          {o.resolved ? "✅" : "🔴"}
                        </button>
                        <button
                          className="water-delete-btn"
                          onClick={() => deleteOutage(o._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bill Info */}
            <div className="water-manage-card">
              <h3>💰 Water Bill Info</h3>
              <form onSubmit={saveBill} className="water-manage-form">
                <input
                  placeholder="Consumer ID"
                  value={billForm.consumerId}
                  onChange={e => setBillForm({
                    ...billForm, consumerId: e.target.value
                  })}
                />
                <input
                  placeholder="Month (e.g. March 2026)"
                  value={billForm.month}
                  onChange={e => setBillForm({
                    ...billForm, month: e.target.value
                  })}
                />
                <input
                  placeholder="Units Used (KL)"
                  type="number"
                  value={billForm.unitsUsed}
                  onChange={e => setBillForm({
                    ...billForm, unitsUsed: e.target.value
                  })}
                />
                <input
                  placeholder="Rate per KL (₹)"
                  type="number"
                  value={billForm.rate}
                  onChange={e => setBillForm({
                    ...billForm, rate: e.target.value
                  })}
                />
                <input
                  placeholder="Due Date (e.g. 31 March 2026)"
                  value={billForm.dueDate}
                  onChange={e => setBillForm({
                    ...billForm, dueDate: e.target.value
                  })}
                />
                <button type="submit" className="water-manage-btn">
                  💾 Save Bill Info
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="cert-modal-overlay" onClick={() => setSelected(null)}>
          <div className="cert-modal" onClick={e => e.stopPropagation()}>
            <h3>
              {selected.type === "complaint"
                ? "📝 Water Complaint Details"
                : "🚛 Tanker Request Details"}
            </h3>
            <hr />

            <div className="cert-modal-info">
              <p><strong>Citizen:</strong> {selected.user?.name}</p>
              <p><strong>Email:</strong> {selected.user?.email}</p>
              <p><strong>Mobile:</strong> {selected.user?.mobile}</p>
              <p><strong>Type:</strong>{" "}
                {selected.type === "complaint" ? "Water Complaint" : "Tanker Request"}
              </p>
              <p><strong>Area:</strong> {selected.area}</p>
              <p><strong>Address:</strong> {selected.address}</p>
              <p><strong>Description:</strong> {selected.description}</p>
              <p><strong>Date:</strong>{" "}
                {new Date(selected.createdAt).toLocaleDateString("en-IN")}
              </p>
              <p><strong>Status:</strong>{" "}
                <span className={`cert-status ${selected.status.toLowerCase()}`}>
                  {selected.status}
                </span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="water-modal-actions">
              {selected.status !== "Approved" && (
                <button
                  className="cert-approve-btn"
                  onClick={() => updateStatus(selected._id, "Approved")}
                >
                  ✅ Approve
                </button>
              )}
              {selected.status !== "Resolved" && (
                <button
                  className="water-resolve-btn"
                  onClick={() => updateStatus(selected._id, "Resolved")}
                >
                  🔧 Resolve
                </button>
              )}
              {selected.status !== "Rejected" && (
                <button
                  className="cert-reject-btn"
                  onClick={() => updateStatus(selected._id, "Rejected")}
                >
                  ❌ Reject
                </button>
              )}
            </div>

            <button
              className="cert-close-btn"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminWaterManagement;