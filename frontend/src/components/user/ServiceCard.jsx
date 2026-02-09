function ServiceCard({ title, icon, description, onClick }) {
  return (
    <div className="service-card" onClick={onClick}>
      <div className="service-icon">{icon}</div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}

export default ServiceCard;
