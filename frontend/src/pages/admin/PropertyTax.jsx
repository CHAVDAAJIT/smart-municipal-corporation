import { useEffect, useState } from "react";
import API from "../../services/apiAdmin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import "../../styles/AdminDashboard.css";
import "../../styles/PropertyTax.css";
import "../../styles/CertificatesManagement.css";

function AdminPropertyTax() {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    propertyId: "", owner: "", email: "", mobile: "",
    address: "", area: "", propertyType: "Residential",
    sizeSqft: "", taxAmount: "", dueDate: ""
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await API.get("/property/all");
      setProperties(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addProperty = async (e) => {
    e.preventDefault();
    try {
      await API.post("/property", form);
      setForm({
        propertyId: "", owner: "", email: "", mobile: "",
        address: "", area: "", propertyType: "Residential",
        sizeSqft: "", taxAmount: "", dueDate: ""
      });
      fetchProperties();
      alert("✅ Property added!");
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Failed"));
    }
  };

  const updatePaymentStatus = async (id, paymentStatus) => {
    try {
      await API.put(`/property/${id}/payment-status`, { paymentStatus });
      fetchProperties();
      setSelected(prev => prev ? { ...prev, paymentStatus } : null);
    } catch (err) {
      alert("❌ Failed to update");
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await API.delete(`/property/${id}`);
      fetchProperties();
    } catch (err) {
      alert("❌ Failed to delete");
    }
  };

  const filtered = filter === "All"
    ? properties
    : properties.filter(p => p.paymentStatus === filter);

  const totalTax = properties.reduce((sum, p) => sum + p.taxAmount, 0);
  const paidTax = properties
    .filter(p => p.paymentStatus === "Paid")
    .reduce((sum, p) => sum + p.taxAmount, 0);

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <div className="admin-dashboard-main">
        <AdminHeader />

        <div className="admin-dashboard-home">
          <h2>🏠 Property Tax Management</h2>
          <p className="sub-text">Manage all properties and tax payments</p>

          {/* Stats */}
          <div className="water-admin-stats" style={{ marginBottom: "24px" }}>
            <div className="water-admin-stat">
              <span className="water-admin-stat-icon">🏠</span>
              <div>
                <h4>{properties.length}</h4>
                <p>Total Properties</p>
              </div>
            </div>
            <div className="water-admin-stat">
              <span className="water-admin-stat-icon">✅</span>
              <div>
                <h4>{properties.filter(p => p.paymentStatus === "Paid").length}</h4>
                <p>Paid</p>
              </div>
            </div>
            <div className="water-admin-stat">
              <span className="water-admin-stat-icon">❌</span>
              <div>
                <h4>{properties.filter(p => p.paymentStatus === "Unpaid").length}</h4>
                <p>Unpaid</p>
              </div>
            </div>
            <div className="water-admin-stat">
              <span className="water-admin-stat-icon">💰</span>
              <div>
                <h4>₹{paidTax.toLocaleString()}</h4>
                <p>Revenue Collected</p>
              </div>
            </div>
          </div>

          {/* Add Property Form */}
          <div className="property-form-card">
            <h3>➕ Add New Property</h3>
            <form onSubmit={addProperty}>
              <div className="property-form-grid">
                <input
                  placeholder="Property ID (e.g. PROP-004)"
                  value={form.propertyId}
                  onChange={e => setForm({ ...form, propertyId: e.target.value })}
                  required
                />
                <input
                  placeholder="Owner Name"
                  value={form.owner}
                  onChange={e => setForm({ ...form, owner: e.target.value })}
                  required
                />
                <input
                  placeholder="Email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
                <input
                  placeholder="Mobile"
                  value={form.mobile}
                  onChange={e => setForm({ ...form, mobile: e.target.value })}
                />
                <input
                  className="property-form-full"
                  placeholder="Full Address"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  required
                />
                <input
                  placeholder="Area"
                  value={form.area}
                  onChange={e => setForm({ ...form, area: e.target.value })}
                />
                <select
                  value={form.propertyType}
                  onChange={e => setForm({ ...form, propertyType: e.target.value })}
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
                <input
                  placeholder="Size (sq.ft)"
                  type="number"
                  value={form.sizeSqft}
                  onChange={e => setForm({ ...form, sizeSqft: e.target.value })}
                />
                <input
                  placeholder="Tax Amount (₹)"
                  type="number"
                  value={form.taxAmount}
                  onChange={e => setForm({ ...form, taxAmount: e.target.value })}
                  required
                />
                <input
                  placeholder="Due Date (e.g. 31 March 2026)"
                  value={form.dueDate}
                  onChange={e => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
              <button type="submit" className="property-add-btn">
                ➕ Add Property
              </button>
            </form>
          </div>

          {/* Filter Tabs */}
          <div className="cert-filter-tabs">
            {["All", "Paid", "Unpaid", "Partial"].map(tab => (
              <button
                key={tab}
                className={`cert-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
                <span className="cert-tab-count">
                  {tab === "All" ? properties.length
                    : properties.filter(p => p.paymentStatus === tab).length}
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
                  <th>Property ID</th>
                  <th>Owner</th>
                  <th>Area</th>
                  <th>Type</th>
                  <th>Tax Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="cert-empty-row">
                      No properties found
                    </td>
                  </tr>
                ) : (
                  filtered.map((p, index) => (
                    <tr key={p._id}>
                      <td>{index + 1}</td>
                      <td style={{ fontWeight: "600", color: "#0f4c75" }}>
                        {p.propertyId}
                      </td>
                      <td>{p.owner}</td>
                      <td>{p.area}</td>
                      <td>{p.propertyType}</td>
                      <td>₹{p.taxAmount.toLocaleString()}</td>
                      <td>{p.dueDate}</td>
                      <td>
                        <span className={`property-status-badge ${p.paymentStatus.toLowerCase()}`}>
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="cert-view-btn"
                            onClick={() => setSelected(p)}
                          >
                            👁️ View
                          </button>
                          <button
                            className="announce-delete-btn"
                            onClick={() => deleteProperty(p._id)}
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
      {selected && (
        <div className="cert-modal-overlay" onClick={() => setSelected(null)}>
          <div className="cert-modal" onClick={e => e.stopPropagation()}>
            <h3>🏠 Property Details</h3>
            <hr />
            <div className="cert-modal-info">
              <p><strong>Property ID:</strong> {selected.propertyId}</p>
              <p><strong>Owner:</strong> {selected.owner}</p>
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Mobile:</strong> {selected.mobile}</p>
              <p><strong>Address:</strong> {selected.address}</p>
              <p><strong>Area:</strong> {selected.area}</p>
              <p><strong>Type:</strong> {selected.propertyType}</p>
              <p><strong>Size:</strong> {selected.sizeSqft} sq.ft</p>
              <p><strong>Tax Amount:</strong> ₹{selected.taxAmount?.toLocaleString()}</p>
              <p><strong>Due Date:</strong> {selected.dueDate}</p>
              <p><strong>Status:</strong>{" "}
                <span className={`property-status-badge ${selected.paymentStatus.toLowerCase()}`}>
                  {selected.paymentStatus}
                </span>
              </p>
            </div>

            {/* Payment History */}
            {selected.paymentHistory?.length > 0 && (
              <div className="cert-modal-data">
                <h4>📋 Payment History</h4>
                {selected.paymentHistory.map((h, i) => (
                  <div key={i} className="cert-data-row">
                    <span className="cert-data-key">
                      ₹{h.amount} — {h.receiptNo}
                    </span>
                    <span className="cert-data-value">
                      {new Date(h.paidOn).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Update Status */}
            <div className="cert-modal-actions">
              <button
                className="cert-approve-btn"
                onClick={() => updatePaymentStatus(selected._id, "Paid")}
              >
                ✅ Mark Paid
              </button>
              <button
                className="cert-reject-btn"
                onClick={() => updatePaymentStatus(selected._id, "Unpaid")}
              >
                ❌ Mark Unpaid
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

export default AdminPropertyTax;