// import AdminStatCard from "./AdminStatCard";
import { useEffect, useState } from "react";
import API from "../../services/apiAdmin";
import "../../styles/AdminDashboard.css";

function AdminStats() {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    activeCitizens: 0
  });

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
       const res = await API.get("/complaints/admin-stats");
      setStats(res.data);
    } catch (err) {
      console.log("Admin stats error:", err);
    }
  };

  return (
    <div className="admin-dashboard-home">

      {/* HERO already hai */}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalComplaints}</h3>
          <p>Total Complaints</p>
        </div>

        <div className="stat-card">
          <h3>{stats.pendingComplaints}</h3>
          <p>Pending Complaints</p>
        </div>

        <div className="stat-card">
          <h3>{stats.resolvedComplaints}</h3>
          <p>Resolved Complaints</p>
        </div>

        <div className="stat-card">
          <h3>{stats.activeCitizens}</h3>
          <p>Active Citizens</p>
        </div>

        {/* 👇 Ye dono abhi dummy hi rehne do */}
        <div className="stat-card">
          <h3>18</h3>
          <p>Garbage Trucks Online</p>
        </div>

        <div className="stat-card">
          <h3>₹12.5L</h3>
          <p>Property Tax Revenue</p>
        </div>
      </div>
    </div>
  );
}

export default AdminStats;
