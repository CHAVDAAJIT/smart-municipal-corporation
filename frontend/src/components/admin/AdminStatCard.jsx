function AdminStatCard({ title, value, icon }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon">{icon}</div>
      <div>
        <h4>{value}</h4>
        <p>{title}</p>
      </div>
    </div>
  );
}

export default AdminStatCard;
