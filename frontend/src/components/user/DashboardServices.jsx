import { useNavigate } from "react-router-dom";
import ServiceCard from "./ServiceCard";

function DashboardServices() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-services">
      <h3>City Services</h3>

      <div className="services-grid">
        <ServiceCard
          title="Documents Service"
          icon="📄"
          description="Apply and download certificates"
          onClick={() => navigate("/user/documents")}
        />

        <div
          className="service-card"
          onClick={() => navigate("/user/complaint/register")}
        >
          <h2>📝</h2>
          <h4>Complaint Register</h4>
          <p>Register and track complaints</p>
        </div>

        <ServiceCard
          title="Property Tax"
          icon="🏠"
          description="View and pay property tax"
          onClick={() => navigate("/user/property-tax")} 
        />

        <ServiceCard
  title="Garbage Truck Tracking"
  icon="🚛"
  description="Track garbage collection vehicles"
  onClick={() => navigate("/user/garbage")} 
/>

        <ServiceCard
          title="Water Management"
          icon="💧"
          description="Water supply and issues"
          onClick={() => navigate("/user/water")} 
        />

        <ServiceCard
  title="Event Announcements"
  icon="📢"
  description="Municipal announcements"
  onClick={() => navigate("/user/events")} 
/>

        <ServiceCard
          title="City Updates"
          icon="🏙️"
          description="Latest city updates"
          onClick={() => navigate("/user/updates")} 
        />

        <ServiceCard
          title="Notifications"
          icon="🔔"
          description="Alerts and notifications"
          onClick={() => navigate("/user/notifications")} 
        />
      </div>
    </div>
  );
}

export default DashboardServices;