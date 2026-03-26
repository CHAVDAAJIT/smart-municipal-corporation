import { useEffect, useState } from "react";
import API from "../../../services/apiUser";
import DashboardSidebar from "../../../components/user/DashboardSidebar";
import DashboardHeader from "../../../components/user/DashboardHeader";
import "../../../styles/WaterManagement.css";
import "../../../styles/UserDashboard.css";

function WaterManagement() {
  const [myRequests, setMyRequests] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [outages, setOutages] = useState([]);
  const [bill, setBill] = useState(null);

  const [complaintForm, setComplaintForm] = useState({ area: "", description: "" });
  const [tankerForm, setTankerForm] = useState({ area: "", address: "" });
  const [complaintMsg, setComplaintMsg] = useState("");
  const [tankerMsg, setTankerMsg] = useState("");

  useEffect(() => {
    fetchMyRequests();
    fetchPublicInfo();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const res = await API.get("/water/my");
      setMyRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPublicInfo = async () => {
    try {
      const res = await API.get("/water/public-info");
      setSchedule(res.data.schedule || []);
      setOutages(res.data.outages || []);
      setBill(res.data.bill || null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComplaint = async (e) => {
    e.preventDefault();
    try {
      await API.post("/water/request", {
        type: "complaint",
        description: complaintForm.description,
        area: complaintForm.area,
        address: complaintForm.area,
      });
      setComplaintMsg("✅ Complaint submitted!");
      setComplaintForm({ area: "", description: "" });
      fetchMyRequests();
      setTimeout(() => setComplaintMsg(""), 3000);
    } catch (err) {
      setComplaintMsg("❌ Failed to submit");
    }
  };

  const handleTanker = async (e) => {
    e.preventDefault();
    try {
      await API.post("/water/request", {
        type: "tanker",
        description: "Water tanker request",
        area: tankerForm.area,
        address: tankerForm.address,
      });
      setTankerMsg("✅ Tanker request submitted!");
      setTankerForm({ area: "", address: "" });
      fetchMyRequests();
      setTimeout(() => setTankerMsg(""), 3000);
    } catch (err) {
      setTankerMsg("❌ Failed to submit");
    }
  };

  const totalRequests = myRequests.length;
  const pendingRequests = myRequests.filter(r => r.status === "Pending").length;
  const resolvedRequests = myRequests.filter(r => r.status === "Resolved").length;

  return (
    <div className="dashboard-container">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <div className="water-page">
          <h2>💧 Water Management</h2>
          <p className="sub-text" style={{ marginBottom: "20px" }}>
            Water supply info, complaints and tanker requests
          </p>

          {/* Stats */}
          <div className="water-stats">
            <div className="water-stat-card">
              <div className="water-stat-icon">📋</div>
              <div>
                <h4>{totalRequests}</h4>
                <p>Total Requests</p>
              </div>
            </div>
            <div className="water-stat-card">
              <div className="water-stat-icon">⏳</div>
              <div>
                <h4>{pendingRequests}</h4>
                <p>Pending</p>
              </div>
            </div>
            <div className="water-stat-card">
              <div className="water-stat-icon">✅</div>
              <div>
                <h4>{resolvedRequests}</h4>
                <p>Resolved</p>
              </div>
            </div>
            <div className="water-stat-card">
              <div className="water-stat-icon">🚨</div>
              <div>
                <h4>{outages.filter(o => !o.resolved).length}</h4>
                <p>Active Outages</p>
              </div>
            </div>
          </div>

          {/* Schedule + Outages + Bill */}
          <div className="water-info-grid">

            {/* Supply Schedule */}
            <div className="water-info-card">
              <h3>🕐 Water Supply Schedule</h3>
              {schedule.length === 0 ? (
                <p style={{ color: "#aaa", fontSize: "13px" }}>
                  No schedule available
                </p>
              ) : (
                schedule.map((s) => (
                  <div key={s._id} className="schedule-item">
                    <span className="schedule-area">{s.area}</span>
                    <span className="schedule-time">{s.time}</span>
                  </div>
                ))
              )}
            </div>

            {/* Outage Alerts */}
            <div className="water-info-card">
              <h3>🚨 Water Outage Alerts</h3>
              {outages.length === 0 ? (
                <p style={{ color: "#aaa", fontSize: "13px" }}>
                  No active outages
                </p>
              ) : (
                outages.map((o) => (
                  <div key={o._id} className="outage-item">
                    <div className={`outage-dot ${o.resolved ? "resolved" : ""}`} />
                    <div>
                      <p className="outage-area">{o.area} — {o.reason}</p>
                      <p className="outage-time">{o.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bill Info */}
            <div className="water-info-card">
              <h3>💰 Water Bill Info</h3>
              {bill ? (
                <>
                  <div className="bill-row">
                    <span className="bill-label">Consumer ID</span>
                    <span>{bill.consumerId}</span>
                  </div>
                  <div className="bill-row">
                    <span className="bill-label">Current Month</span>
                    <span>{bill.month}</span>
                  </div>
                  <div className="bill-row">
                    <span className="bill-label">Units Used</span>
                    <span>{bill.unitsUsed} KL</span>
                  </div>
                  <div className="bill-row">
                    <span className="bill-label">Rate</span>
                    <span>₹{bill.rate}/KL</span>
                  </div>
                  <div className="bill-row">
                    <span className="bill-label">Due Date</span>
                    <span>{bill.dueDate}</span>
                  </div>
                  <div className="bill-row">
                    <span className="bill-label">Total Amount</span>
                    <span>₹{bill.unitsUsed * bill.rate}</span>
                  </div>
                </>
              ) : (
                <p style={{ color: "#888", fontSize: "13px" }}>
                  No bill info available
                </p>
              )}
            </div>
          </div>

          {/* Forms */}
          <div className="water-request-grid">

            {/* Complaint Form */}
            <div className="water-form-card">
              <h3>📝 Register Water Complaint</h3>
              <form onSubmit={handleComplaint}>
                <input
                  placeholder="Your Area / Ward"
                  value={complaintForm.area}
                  onChange={e => setComplaintForm({
                    ...complaintForm, area: e.target.value
                  })}
                  required
                />
                <textarea
                  placeholder="Describe your complaint..."
                  value={complaintForm.description}
                  onChange={e => setComplaintForm({
                    ...complaintForm, description: e.target.value
                  })}
                  required
                />
                <button type="submit" className="water-submit-btn">
                  Submit Complaint
                </button>
              </form>
              {complaintMsg && <p className="success-msg">{complaintMsg}</p>}
            </div>

            {/* Tanker Form */}
            <div className="water-form-card">
              <h3>🚛 Request Water Tanker</h3>
              <form onSubmit={handleTanker}>
                <input
                  placeholder="Your Area / Ward"
                  value={tankerForm.area}
                  onChange={e => setTankerForm({
                    ...tankerForm, area: e.target.value
                  })}
                  required
                />
                <input
                  placeholder="Full Address for delivery"
                  value={tankerForm.address}
                  onChange={e => setTankerForm({
                    ...tankerForm, address: e.target.value
                  })}
                  required
                />
                <button type="submit" className="water-submit-btn">
                  Request Tanker
                </button>
              </form>
              {tankerMsg && <p className="success-msg">{tankerMsg}</p>}
            </div>
          </div>

          {/* My Requests */}
          <div className="water-requests-card">
            <h3>📋 My Water Requests</h3>
            {myRequests.length === 0 ? (
              <div className="water-empty">No requests submitted yet</div>
            ) : (
              myRequests.map((r) => (
                <div key={r._id} className="water-request-item">
                  <div className="water-request-left">
                    <div className="water-request-icon">
                      {r.type === "complaint" ? "📝" : "🚛"}
                    </div>
                    <div>
                      <p className="water-request-title">
                        {r.type === "complaint" ? "Water Complaint" : "Tanker Request"}
                      </p>
                      <p className="water-request-date">
                        📍 {r.area} • 📅 {new Date(r.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <span className={`water-badge ${r.status.toLowerCase()}`}>
                    {r.status}
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

export default WaterManagement;