import { useEffect, useState } from "react";
import API from "../../services/apiAdmin";
import "../../styles/AdminDashboard.css";

function AdminStats() {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    activeCitizens: 0,
    totalTrucks: 0,
    onRouteTrucks: 0,
    totalTaxAmount: 0,
    collectedAmount: 0,
  });

  useEffect(() => {
    fetchAdminStats();
    fetchGarbageStats();
    fetchPropertyStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await API.get("/complaints/admin-stats");
      setStats(prev => ({ ...prev, ...res.data }));
    } catch (err) {
      console.log("Admin stats error:", err);
    }
  };

  const fetchGarbageStats = async () => {
    try {
      const res = await API.get("/garbage/all-trucks");
      setStats(prev => ({
        ...prev,
        totalTrucks: res.data.length,
        onRouteTrucks: res.data.filter(t => t.status === "On Route").length,
        activeTrucks: res.data.filter(t => t.status === "Active").length,
      }));
    } catch (err) {
      console.log("Garbage stats error:", err);
    }
  };

  const fetchPropertyStats = async () => {
    try {
      const res = await API.get("/property/all");
      const total = res.data.reduce((sum, p) => sum + p.taxAmount, 0);
      const collected = res.data
        .filter(p => p.paymentStatus === "Paid")
        .reduce((sum, p) => sum + p.taxAmount, 0);
      setStats(prev => ({
        ...prev,
        totalTaxAmount: total,
        collectedAmount: collected,
      }));
    } catch (err) {
      console.log("Property stats error:", err);
    }
  };

  return (
    <div className="admin-dashboard-home">
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
        <div className="stat-card">
          <h3>{stats.onRouteTrucks} / {stats.totalTrucks}</h3>
          <p>Garbage Trucks On Route</p>
        </div>
        <div className="stat-card">
          <h3>₹{stats.collectedAmount.toLocaleString()} / ₹{stats.totalTaxAmount.toLocaleString()}</h3>
          <p>Property Tax Collected</p>
        </div>
      </div>
    </div>
  );
}

export default AdminStats;