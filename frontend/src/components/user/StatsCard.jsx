function StatsCard({ title, value, icon }) {
  return (
    <div className="stats-card">
      <div className="stats-icon">{icon}</div>
      <div>
        <h4>{value}</h4>
        <p>{title}</p>
      </div>
    </div>
  );
}

export default StatsCard;
