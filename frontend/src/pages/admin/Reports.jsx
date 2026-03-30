import { useEffect, useState } from "react";
import API from "../../services/apiAdmin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import "../../styles/AdminDashboard.css";
import "../../styles/Reports.css";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from "recharts";

const COLORS = ["#0f4c75", "#1b6ca8", "#059669", "#e63946", "#f57c00", "#7c3aed"];

function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await API.get("/reports");
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <AdminSidebar />
        <div className="admin-dashboard-main">
          <AdminHeader />
          <div className="reports-loading">⏳ Loading reports...</div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Complaint status data for pie
  const complaintStatusData = [
    { name: "Pending", value: data.complaints.pending },
    { name: "Assigned", value: data.complaints.assigned },
    { name: "Resolved", value: data.complaints.resolved },
  ];

  // Complaint by type
  const complaintTypeData = data.complaints.byType.map(t => ({
    name: t._id,
    count: t.count
  }));

  // Certificate data
  //const certStatusData = [
    //{ name: "Pending", value: data.certificates.pending },
    //{ name: "Approved", value: data.certificates.approved },
    //{ name: "Rejected", value: data.certificates.rejected },
  //];

  const certTypeData = data.certificates.byType.map(t => ({
    name: t._id.charAt(0).toUpperCase() + t._id.slice(1),
    count: t.count
  }));

  // Water data
  const waterData = [
    { name: "Complaint", value: data.water.complaint },
    { name: "Tanker", value: data.water.tanker },
  ];

  // Property data
  const propertyData = [
    { name: "Paid", value: data.property.paid },
    { name: "Unpaid", value: data.property.unpaid },
  ];

  // Citizens data
  const citizensData = [
    { name: "Active", value: data.citizens.active },
    { name: "Blocked", value: data.citizens.blocked },
  ];

  // All services comparison
  const serviceCompData = [
    { name: "Complaints", total: data.complaints.total, resolved: data.complaints.resolved },
    { name: "Water", total: data.water.total, resolved: data.water.resolved },
    { name: "Garbage", total: data.garbage.total, resolved: data.garbage.resolved },
    { name: "Certificates", total: data.certificates.total, resolved: data.certificates.approved },
  ];

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <div className="admin-dashboard-main">
        <AdminHeader />

        <div className="admin-dashboard-home">
          <h2>📊 Reports & Analytics</h2>
          <p className="sub-text" style={{ marginBottom: "24px" }}>
            Complete overview of all city services
          </p>

          {/* Summary Stats */}
          <div className="reports-summary">
            <div className="reports-summary-card">
              <div className="reports-summary-icon">👥</div>
              <div>
                <h4>{data.citizens.total}</h4>
                <p>Total Citizens</p>
              </div>
            </div>
            <div className="reports-summary-card green">
              <div className="reports-summary-icon">📋</div>
              <div>
                <h4>{data.complaints.total}</h4>
                <p>Total Complaints</p>
              </div>
            </div>
            <div className="reports-summary-card orange">
              <div className="reports-summary-icon">💧</div>
              <div>
                <h4>{data.water.total}</h4>
                <p>Water Requests</p>
              </div>
            </div>
            <div className="reports-summary-card red">
              <div className="reports-summary-icon">🚛</div>
              <div>
                <h4>{data.garbage.total}</h4>
                <p>Garbage Complaints</p>
              </div>
            </div>
            <div className="reports-summary-card purple">
              <div className="reports-summary-icon">💰</div>
              <div>
                <h4>₹{data.property.collectedAmount.toLocaleString()}</h4>
                <p>Tax Collected</p>
              </div>
            </div>
            <div className="reports-summary-card">
              <div className="reports-summary-icon">📄</div>
              <div>
                <h4>{data.certificates.total}</h4>
                <p>Certificates</p>
              </div>
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="reports-chart-full">
            <h3>📈 Monthly Trend (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="complaints" stroke="#0f4c75" strokeWidth={2} dot={{ r: 4 }} name="Complaints" />
                <Line type="monotone" dataKey="water" stroke="#1b6ca8" strokeWidth={2} dot={{ r: 4 }} name="Water" />
                <Line type="monotone" dataKey="garbage" stroke="#059669" strokeWidth={2} dot={{ r: 4 }} name="Garbage" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Service Comparison Bar Chart */}
          <div className="reports-chart-full">
            <h3>📊 Services Comparison — Total vs Resolved</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={serviceCompData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#1b6ca8" name="Total" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#059669" name="Resolved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Charts Grid */}
          <div className="reports-charts-grid">

            {/* Complaint Status Pie */}
            <div className="reports-chart-card">
              <h3>📋 Complaints by Status</h3>
              <div className="chart-mini-stats">
                <span className="chart-mini-stat total">Total: {data.complaints.total}</span>
                <span className="chart-mini-stat pending">Pending: {data.complaints.pending}</span>
                <span className="chart-mini-stat resolved">Resolved: {data.complaints.resolved}</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={complaintStatusData}
                    cx="50%" cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {complaintStatusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Complaint by Type Bar */}
            <div className="reports-chart-card">
              <h3>📋 Complaints by Type</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={complaintTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0f4c75" name="Count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Water Requests Pie */}
            <div className="reports-chart-card">
              <h3>💧 Water Requests</h3>
              <div className="chart-mini-stats">
                <span className="chart-mini-stat total">Total: {data.water.total}</span>
                <span className="chart-mini-stat pending">Pending: {data.water.pending}</span>
                <span className="chart-mini-stat resolved">Resolved: {data.water.resolved}</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={waterData}
                    cx="50%" cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {waterData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Garbage Stats */}
            <div className="reports-chart-card">
              <h3>🚛 Garbage Complaints</h3>
              <div className="chart-mini-stats">
                <span className="chart-mini-stat total">Total: {data.garbage.total}</span>
                <span className="chart-mini-stat pending">Pending: {data.garbage.pending}</span>
                <span className="chart-mini-stat resolved">Resolved: {data.garbage.resolved}</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Pending", value: data.garbage.pending },
                      { name: "Resolved", value: data.garbage.resolved },
                    ]}
                    cx="50%" cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    <Cell fill="#e63946" />
                    <Cell fill="#059669" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Property Tax */}
            <div className="reports-chart-card">
              <h3>🏠 Property Tax Collection</h3>
              <div className="chart-mini-stats">
                <span className="chart-mini-stat total">
                  Total: ₹{data.property.totalTaxAmount.toLocaleString()}
                </span>
                <span className="chart-mini-stat resolved">
                  Collected: ₹{data.property.collectedAmount.toLocaleString()}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={propertyData}
                    cx="50%" cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    <Cell fill="#059669" />
                    <Cell fill="#e63946" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Certificates */}
            <div className="reports-chart-card">
              <h3>📄 Certificate Requests</h3>
              <div className="chart-mini-stats">
                <span className="chart-mini-stat total">Total: {data.certificates.total}</span>
                <span className="chart-mini-stat pending">Pending: {data.certificates.pending}</span>
                <span className="chart-mini-stat resolved">Approved: {data.certificates.approved}</span>
                <span className="chart-mini-stat rejected">Rejected: {data.certificates.rejected}</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={certTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7c3aed" name="Count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Citizens */}
            <div className="reports-chart-card">
              <h3>👥 Citizens Overview</h3>
              <div className="chart-mini-stats">
                <span className="chart-mini-stat total">Total: {data.citizens.total}</span>
                <span className="chart-mini-stat resolved">Active: {data.citizens.active}</span>
                <span className="chart-mini-stat rejected">Blocked: {data.citizens.blocked}</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={citizensData}
                    cx="50%" cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    <Cell fill="#059669" />
                    <Cell fill="#e63946" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;