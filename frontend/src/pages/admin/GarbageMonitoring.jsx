import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import API from "../../services/apiAdmin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import "../../styles/AdminDashboard.css";
import "../../styles/GarbageTracking.css";
import "../../styles/CertificatesManagement.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const truckIcon = (status) => new L.DivIcon({
  html: `<div style="
    background: ${status === "On Route" ? "#1b6ca8" : status === "Active" ? "#059669" : "#e63946"};
    color: white;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    border: 2px solid white;
  ">🚛</div>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function GarbageMonitoring() {
  const [trucks, setTrucks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [truckForm, setTruckForm] = useState({
    truckId: "", driverName: "", area: "",
    status: "Active", lat: "", lng: ""
  });

  useEffect(() => {
    fetchTrucks();
    fetchComplaints();
  }, []);

  const fetchTrucks = async () => {
    try {
      const res = await API.get("/garbage/all-trucks");
      setTrucks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/garbage/all-complaints");
      setComplaints(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateComplaintStatus = async (id, status) => {
    try {
      await API.put(`/garbage/complaint/${id}/status`, { status });
      fetchComplaints();
      setSelected(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      alert("❌ Failed to update");
    }
  };

  const updateTruckStatus = async (id, status) => {
    try {
      await API.put(`/garbage/truck/${id}`, { status });
      fetchTrucks();
    } catch (err) {
      alert("❌ Failed to update truck");
    }
  };

  const addTruck = async (e) => {
    e.preventDefault();
    try {
      await API.post("/garbage/truck", {
        ...truckForm,
        lat: parseFloat(truckForm.lat),
        lng: parseFloat(truckForm.lng)
      });
      setTruckForm({
        truckId: "", driverName: "", area: "",
        status: "Active", lat: "", lng: ""
      });
      fetchTrucks();
      alert("✅ Truck added!");
    } catch (err) {
      alert("❌ Failed to add truck");
    }
  };

  const filtered = filter === "All"
    ? complaints
    : complaints.filter(c => c.status === filter);

  const routePoints = trucks
    .filter(t => t.status === "On Route")
    .map(t => [t.lat, t.lng]);

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <div className="admin-dashboard-main">
        <AdminHeader />

        <div className="admin-dashboard-home">
          <h2>🚛 Garbage Monitoring & Tracking</h2>
          <p className="sub-text">Monitor trucks and manage garbage complaints</p>

          {/* Stats */}
          <div className="garbage-stats">
            <div className="garbage-stat-card">
              <div className="garbage-stat-icon">🚛</div>
              <div>
                <h4>{trucks.length}</h4>
                <p>Total Trucks</p>
              </div>
            </div>
            <div className="garbage-stat-card">
              <div className="garbage-stat-icon">✅</div>
              <div>
                <h4>{trucks.filter(t => t.status === "Active").length}</h4>
                <p>Active</p>
              </div>
            </div>
            <div className="garbage-stat-card">
              <div className="garbage-stat-icon">🔄</div>
              <div>
                <h4>{trucks.filter(t => t.status === "On Route").length}</h4>
                <p>On Route</p>
              </div>
            </div>
            <div className="garbage-stat-card">
              <div className="garbage-stat-icon">📋</div>
              <div>
                <h4>{complaints.filter(c => c.status === "Pending").length}</h4>
                <p>Pending Complaints</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="garbage-map-card">
            <h3>🗺️ Live Truck Locations</h3>
            <div className="garbage-map-wrapper">
              <MapContainer
                center={[23.0225, 72.5714]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {trucks.map(truck => (
                  <Marker
                    key={truck._id}
                    position={[truck.lat, truck.lng]}
                    icon={truckIcon(truck.status)}
                  >
                    <Popup>
                      <div style={{ minWidth: "180px" }}>
                        <strong>🚛 {truck.truckId}</strong><br />
                        👤 {truck.driverName}<br />
                        📍 {truck.area}<br />
                        <br />
                        <select
                          value={truck.status}
                          onChange={e => updateTruckStatus(truck._id, e.target.value)}
                          style={{ width: "100%", padding: "4px", borderRadius: "6px" }}
                        >
                          <option value="Active">Active</option>
                          <option value="On Route">On Route</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {routePoints.length > 1 && (
                  <Polyline
                    positions={routePoints}
                    color="#0f4c75"
                    weight={3}
                    dashArray="8, 8"
                  />
                )}
              </MapContainer>
            </div>
          </div>

          {/* Truck List + Add Truck */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>

            {/* Truck List */}
            <div className="garbage-complaints-card">
              <h3>🚛 All Trucks</h3>
              {trucks.map(t => (
                <div key={t._id} className="garbage-complaint-item">
                  <div className="garbage-complaint-left">
                    <div className="garbage-complaint-icon">🚛</div>
                    <div>
                      <p className="garbage-complaint-title">{t.truckId} — {t.driverName}</p>
                      <p className="garbage-complaint-meta">📍 {t.area}</p>
                    </div>
                  </div>
                  <select
                    value={t.status}
                    onChange={e => updateTruckStatus(t._id, e.target.value)}
                    style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "12px" }}
                  >
                    <option value="Active">Active</option>
                    <option value="On Route">On Route</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Add Truck */}
            <div className="garbage-form-card">
              <h3>➕ Add New Truck</h3>
              <form onSubmit={addTruck}>
                <input
                  placeholder="Truck ID (e.g. GRB-006)"
                  value={truckForm.truckId}
                  onChange={e => setTruckForm({ ...truckForm, truckId: e.target.value })}
                  required
                />
                <input
                  placeholder="Driver Name"
                  value={truckForm.driverName}
                  onChange={e => setTruckForm({ ...truckForm, driverName: e.target.value })}
                  required
                />
                <input
                  placeholder="Area"
                  value={truckForm.area}
                  onChange={e => setTruckForm({ ...truckForm, area: e.target.value })}
                  required
                />
                <input
                  placeholder="Latitude (e.g. 23.0225)"
                  value={truckForm.lat}
                  onChange={e => setTruckForm({ ...truckForm, lat: e.target.value })}
                  required
                />
                <input
                  placeholder="Longitude (e.g. 72.5714)"
                  value={truckForm.lng}
                  onChange={e => setTruckForm({ ...truckForm, lng: e.target.value })}
                  required
                />
                <select
                  value={truckForm.status}
                  onChange={e => setTruckForm({ ...truckForm, status: e.target.value })}
                  style={{ marginBottom: "10px" }}
                >
                  <option value="Active">Active</option>
                  <option value="On Route">On Route</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <button type="submit" className="garbage-submit-btn">
                  ➕ Add Truck
                </button>
              </form>
            </div>
          </div>

          {/* Complaints Table */}
          <h3 style={{ color: "#0f4c75", marginBottom: "12px" }}>📋 Garbage Complaints</h3>

          <div className="cert-filter-tabs">
            {["All", "Pending", "Assigned", "Resolved"].map(tab => (
              <button
                key={tab}
                className={`cert-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
                <span className="cert-tab-count">
                  {tab === "All" ? complaints.length
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
                  <th>Area</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="cert-empty-row">
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, index) => (
                    <tr key={c._id}>
                      <td>{index + 1}</td>
                      <td>{c.user?.name || "N/A"}</td>
                      <td>{c.area}</td>
                      <td>{c.address}</td>
                      <td>{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                      <td>
                        <span className={`cert-status ${c.status.toLowerCase()}`}>
                          {c.status}
                        </span>
                      </td>
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

      {/* Modal */}
      {selected && (
        <div className="cert-modal-overlay" onClick={() => setSelected(null)}>
          <div className="cert-modal" onClick={e => e.stopPropagation()}>
            <h3>🗑️ Garbage Complaint Details</h3>
            <hr />
            <div className="cert-modal-info">
              <p><strong>Citizen:</strong> {selected.user?.name}</p>
              <p><strong>Email:</strong> {selected.user?.email}</p>
              <p><strong>Mobile:</strong> {selected.user?.mobile}</p>
              <p><strong>Area:</strong> {selected.area}</p>
              <p><strong>Address:</strong> {selected.address}</p>
              <p><strong>Description:</strong> {selected.description}</p>
              <p><strong>Date:</strong> {new Date(selected.createdAt).toLocaleDateString("en-IN")}</p>
              <p><strong>Status:</strong>{" "}
                <span className={`cert-status ${selected.status.toLowerCase()}`}>
                  {selected.status}
                </span>
              </p>
            </div>
            <div className="cert-modal-actions">
              {selected.status !== "Assigned" && (
                <button
                  className="cert-approve-btn"
                  onClick={() => updateComplaintStatus(selected._id, "Assigned")}
                >
                  🚛 Assign Truck
                </button>
              )}
              {selected.status !== "Resolved" && (
                <button
                  className="water-resolve-btn"
                  onClick={() => updateComplaintStatus(selected._id, "Resolved")}
                >
                  ✅ Mark Resolved
                </button>
              )}
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

export default GarbageMonitoring;