import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import API from "../../../services/apiUser";
import DashboardSidebar from "../../../components/user/DashboardSidebar";
import DashboardHeader from "../../../components/user/DashboardHeader";
import "../../../styles/GarbageTracking.css";
import "../../../styles/UserDashboard.css";

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom truck icon
const truckIcon = new L.DivIcon({
  html: `<div style="
    background: #0f4c75;
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

const schedule = [
  { area: "Sector 1 - Maninagar", time: "7:00 AM - 9:00 AM" },
  { area: "Sector 2 - Satellite", time: "9:00 AM - 11:00 AM" },
  { area: "Sector 3 - Bopal", time: "11:00 AM - 1:00 PM" },
  { area: "Sector 4 - Gota", time: "2:00 PM - 4:00 PM" },
  { area: "Sector 5 - Nikol", time: "4:00 PM - 6:00 PM" },
];

function GarbageTracking() {
  const [trucks, setTrucks] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [form, setForm] = useState({ area: "", description: "", address: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchTrucks();
    fetchMyComplaints();
  }, []);

  const fetchTrucks = async () => {
    try {
      const res = await API.get("/garbage/trucks");
      setTrucks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMyComplaints = async () => {
    try {
      const res = await API.get("/garbage/my-complaints");
      setMyComplaints(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/garbage/complaint", form);
      setMsg("✅ Complaint submitted!");
      setForm({ area: "", description: "", address: "" });
      fetchMyComplaints();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("❌ Failed to submit");
    }
  };

  // Route polyline — on route trucks ko connect karo
  const routePoints = trucks
    .filter(t => t.status === "On Route")
    .map(t => [t.lat, t.lng]);

  const activeTrucks = trucks.filter(t => t.status === "Active").length;
  const onRouteTrucks = trucks.filter(t => t.status === "On Route").length;
  const inactiveTrucks = trucks.filter(t => t.status === "Inactive").length;

  return (
    <div className="dashboard-container">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <div className="garbage-page">
          <h2>🚛 Garbage Truck Tracking</h2>
          <p className="sub-text" style={{ marginBottom: "20px" }}>
            Track garbage collection vehicles and schedule
          </p>

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
                <h4>{activeTrucks}</h4>
                <p>Active</p>
              </div>
            </div>
            <div className="garbage-stat-card">
              <div className="garbage-stat-icon">🔄</div>
              <div>
                <h4>{onRouteTrucks}</h4>
                <p>On Route</p>
              </div>
            </div>
            <div className="garbage-stat-card">
              <div className="garbage-stat-icon">❌</div>
              <div>
                <h4>{inactiveTrucks}</h4>
                <p>Inactive</p>
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

                {/* Truck Markers */}
                {trucks.map(truck => (
                  <Marker
                    key={truck._id}
                    position={[truck.lat, truck.lng]}
                    icon={truckIcon}
                  >
                    <Popup>
                      <div style={{ minWidth: "160px" }}>
                        <strong>🚛 {truck.truckId}</strong><br />
                        👤 {truck.driverName}<br />
                        📍 {truck.area}<br />
                        <span style={{
                          background: truck.status === "On Route" ? "#e8f4fd"
                            : truck.status === "Active" ? "#d1fae5" : "#ffe4e4",
                          color: truck.status === "On Route" ? "#1b6ca8"
                            : truck.status === "Active" ? "#059669" : "#e63946",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}>
                          {truck.status}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Route Line */}
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

          {/* Schedule */}
          <div className="garbage-schedule-card">
            <h3>📅 Collection Schedule</h3>
            <div className="garbage-schedule-grid">
              {schedule.map((s, i) => (
                <div key={i} className="garbage-schedule-item">
                  <p className="garbage-schedule-area">{s.area}</p>
                  <p className="garbage-schedule-time">⏰ {s.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Complaint Form */}
          <div className="garbage-form-card">
            <h3>📝 Register Garbage Complaint</h3>
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Your Area / Ward"
                value={form.area}
                onChange={e => setForm({ ...form, area: e.target.value })}
                required
              />
              <input
                placeholder="Full Address"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                required
              />
              <textarea
                placeholder="Describe your complaint..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
              />
              <button type="submit" className="garbage-submit-btn">
                Submit Complaint
              </button>
            </form>
            {msg && <p className="success-msg">{msg}</p>}
          </div>

          {/* My Complaints */}
          <div className="garbage-complaints-card">
            <h3>📋 My Garbage Complaints</h3>
            {myComplaints.length === 0 ? (
              <div className="garbage-empty">No complaints submitted yet</div>
            ) : (
              myComplaints.map(c => (
                <div key={c._id} className="garbage-complaint-item">
                  <div className="garbage-complaint-left">
                    <div className="garbage-complaint-icon">🗑️</div>
                    <div>
                      <p className="garbage-complaint-title">{c.area}</p>
                      <p className="garbage-complaint-meta">
                        📍 {c.address} • 📅 {new Date(c.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <span className={`garbage-badge ${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default GarbageTracking;