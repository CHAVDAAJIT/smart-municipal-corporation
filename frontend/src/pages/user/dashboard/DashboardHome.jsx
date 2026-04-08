import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "../../../services/apiUser";
import DashboardHero from "../../../components/user/DashboardHero";
import DashboardStats from "../../../components/user/DashboardStats";
import DashboardServices from "../../../components/user/DashboardServices";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer
} from "recharts";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
const COLORS = ["#e63946", "#1b6ca8", "#059669", "#f57c00"];

function DashboardHome() {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [complaints, setComplaints] = useState([]);
  const [liveAlert, setLiveAlert] = useState("");

  useEffect(() => {
    fetchStats();
    fetchComplaints();

    // ✅ Socket.io connect
    const socket = io(SOCKET_URL);

    socket.on("complaintUpdated", (data) => {
      setLiveAlert("🔔 Your complaint status has been updated!");
      fetchStats();
      fetchComplaints();
      setTimeout(() => setLiveAlert(""), 5000);
    });

    return () => socket.disconnect();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/complaints/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Chart data
  const pieData = [
    { name: "Pending", value: stats.pending || 0 },
    { name: "Resolved", value: stats.resolved || 0 },
    { name: "Assigned", value: (stats.total - stats.pending - stats.resolved) || 0 },
  ].filter(d => d.value > 0);

  // Complaint type breakdown
  const typeCount = complaints.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(typeCount).map(([name, count]) => ({ name, count }));

  return (
    <div className="dashboard-home">
      <DashboardHero />

      {/* ✅ Live Alert */}
      {liveAlert && (
        <div style={{
          background: "#e8f4fd",
          border: "1px solid #1b6ca8",
          borderRadius: "10px",
          padding: "12px 16px",
          marginBottom: "16px",
          color: "#0f4c75",
          fontWeight: "500",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          animation: "fadeIn 0.3s ease"
        }}>
          {liveAlert}
        </div>
      )}

      <DashboardStats stats={stats} />

      {/* ✅ Charts — only show if complaints exist */}
      {complaints.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginTop: "10px"
        }}>

          {/* Pie Chart */}
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            border: "1px solid #eef2f7"
          }}>
            <h3 style={{ fontSize: "15px", color: "#0f4c75", marginBottom: "16px" }}>
              📊 Complaint Status
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          {barData.length > 0 && (
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              border: "1px solid #eef2f7"
            }}>
              <h3 style={{ fontSize: "15px", color: "#0f4c75", marginBottom: "16px" }}>
                📋 Complaints by Type
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0f4c75" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>
      )}

      <DashboardServices />
    </div>
  );
}

export default DashboardHome;