import "../../styles/DashboardStats.css";

function DashboardStats({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>{stats.total}</h3>
        <p>Total Complaints</p>
      </div>

      <div className="stat-card">
        <h3>{stats.pending}</h3>
        <p>Pending</p>
      </div>

      <div className="stat-card">
        <h3>{stats.resolved}</h3>
        <p>Resolved</p>
      </div>
    </div>
  );
}

export default DashboardStats;
