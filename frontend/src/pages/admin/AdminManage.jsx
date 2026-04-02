import { useEffect, useState } from "react";
import API from "../../services/apiAdmin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import "../../styles/AdminDashboard.css";
import "../../styles/AdminManage.css";
import "../../styles/CertificatesManagement.css";

function AdminManage() {
  const [admins, setAdmins] = useState([]);
  const [currentAdminId, setCurrentAdminId] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", mobile: "", password: "", confirmPassword: ""
  });
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });
  const [resetAdmin, setResetAdmin] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  useEffect(() => {
    fetchAdmins();
    fetchCurrentAdmin();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await API.get("/admin-manage");
      setAdmins(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCurrentAdmin = async () => {
    try {
      const res = await API.get("/settings/profile");
      setCurrentAdminId(res.data._id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setFormMsg({ type: "error", text: "❌ Passwords do not match" });
      return;
    }

    if (form.password.length < 6) {
      setFormMsg({ type: "error", text: "❌ Password must be at least 6 characters" });
      return;
    }

    try {
      await API.post("/admin-manage", {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      });
      setFormMsg({ type: "success", text: "✅ Admin created successfully!" });
      setForm({ name: "", email: "", mobile: "", password: "", confirmPassword: "" });
      fetchAdmins();
      setTimeout(() => setFormMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setFormMsg({
        type: "error",
        text: "❌ " + (err.response?.data?.message || "Failed to create admin")
      });
    }
  };

  const deleteAdmin = async (id) => {
    if (!window.confirm("Delete this admin? This cannot be undone.")) return;
    try {
      await API.delete(`/admin-manage/${id}`);
      fetchAdmins();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Failed to delete"));
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setResetMsg("❌ Password must be at least 6 characters");
      return;
    }
    try {
      await API.put(`/admin-manage/${resetAdmin._id}/reset-password`, {
        newPassword
      });
      setResetMsg("✅ Password reset successfully!");
      setTimeout(() => {
        setResetAdmin(null);
        setNewPassword("");
        setResetMsg("");
      }, 2000);
    } catch (err) {
      setResetMsg("❌ Failed to reset password");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <div className="admin-dashboard-main">
        <AdminHeader />

        <div className="admin-manage-page">
          <h2>👤 Admin Management</h2>
          <p className="sub-text" style={{ marginBottom: "24px" }}>
            Add, manage and control admin accounts
          </p>

          {/* Stats */}
          <div className="admin-manage-stats">
            <div className="admin-manage-stat">
              <div className="admin-manage-stat-icon">👤</div>
              <div>
                <h4>{admins.length}</h4>
                <p>Total Admins</p>
              </div>
            </div>
            <div className="admin-manage-stat">
              <div className="admin-manage-stat-icon">✅</div>
              <div>
                <h4>{admins.length > 0 ? admins.length : 0}</h4>
                <p>Active Admins</p>
              </div>
            </div>
          </div>

          {/* Add Admin Form */}
          <div className="admin-add-form-card">
            <h3>➕ Add New Admin</h3>

            {formMsg.text && (
              <div className={formMsg.type === "success" ? "admin-form-success" : "admin-form-error"}>
                {formMsg.text}
              </div>
            )}

            <form onSubmit={handleAddAdmin}>
              <div className="admin-add-form-grid">
                <input
                  placeholder="Full Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  placeholder="Mobile Number"
                  value={form.mobile}
                  onChange={e => setForm({ ...form, mobile: e.target.value })}
                  required
                />
                <input
                  className="admin-add-form-full"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="admin-add-btn">
                ➕ Create Admin
              </button>
            </form>
          </div>

          {/* Admins List */}
          <div className="admin-list-card">
            <h3>👥 All Admins ({admins.length})</h3>
            <div className="recent-complaints">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Admin</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="cert-empty-row">
                        No admins found
                      </td>
                    </tr>
                  ) : (
                    admins.map((admin, index) => (
                      <tr key={admin._id}>
                        <td>{index + 1}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div className="admin-list-avatar">
                              {admin.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: "600", fontSize: "13px" }}>
                                {admin.name}
                              </p>
                              {admin._id === currentAdminId && (
                                <span className="admin-current-badge">You</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>{admin.email}</td>
                        <td>{admin.mobile}</td>
                        <td>
                          <span style={{
                            background: "#e8f4fd",
                            color: "#0b3c5d",
                            padding: "3px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "600"
                          }}>
                            Admin
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              className="cert-view-btn"
                              onClick={() => {
                                setResetAdmin(admin);
                                setNewPassword("");
                                setResetMsg("");
                              }}
                            >
                              🔐 Reset
                            </button>
                            {admin._id !== currentAdminId && (
                              <button
                                className="announce-delete-btn"
                                onClick={() => deleteAdmin(admin._id)}
                              >
                                🗑️
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
      </div>

      {/* Reset Password Modal */}
      {resetAdmin && (
        <div className="reset-modal-overlay" onClick={() => setResetAdmin(null)}>
          <div className="reset-modal" onClick={e => e.stopPropagation()}>
            <h3>🔐 Reset Password</h3>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "14px" }}>
              Resetting password for: <strong>{resetAdmin.name}</strong>
            </p>

            {resetMsg && (
              <div style={{
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "10px",
                background: resetMsg.includes("✅") ? "#d1fae5" : "#ffe4e4",
                color: resetMsg.includes("✅") ? "#059669" : "#e63946",
                fontSize: "13px",
                fontWeight: "500"
              }}>
                {resetMsg}
              </div>
            )}

            <input
              type="password"
              placeholder="New Password (min 6 characters)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />

            <div className="reset-modal-actions">
              <button
                className="reset-confirm-btn"
                onClick={handleResetPassword}
              >
                🔐 Reset Password
              </button>
              <button
                className="reset-cancel-btn"
                onClick={() => setResetAdmin(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManage;