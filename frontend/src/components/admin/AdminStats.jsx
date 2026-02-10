import AdminStatCard from "./AdminStatCard";

function AdminStats() {
  return (
    <div className="admin-stats">
      <AdminStatCard title="Total Complaints" value="128" icon="📝" />
      <AdminStatCard title="Pending Complaints" value="34" icon="⏳" />
      <AdminStatCard title="Resolved Complaints" value="94" icon="✅" />
      <AdminStatCard title="Active Citizens" value="560" icon="👥" />
      <AdminStatCard title="Garbage Trucks Online" value="18" icon="🚛" />
      <AdminStatCard title="Property Tax Revenue" value="₹12.5L" icon="💰" />
    </div>
  );
}

export default AdminStats;
