import StatsCard from "./StatsCard";

function DashboardStats() {
  return (
    <div className="dashboard-stats">
      <StatsCard title="Total Complaints" value="12" icon="📝" />
      <StatsCard title="Pending" value="5" icon="⏳" />
      <StatsCard title="Resolved" value="7" icon="✅" />
      <StatsCard title="Notifications" value="3" icon="🔔" />
    </div>
  );
}

export default DashboardStats;
