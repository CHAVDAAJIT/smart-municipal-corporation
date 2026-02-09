import ServiceCard from "./ServiceCard";

function DashboardServices() {
  return (
    <div className="dashboard-services">
      <h3>City Services</h3>

      <div className="services-grid">
        <ServiceCard
          title="Documents Service"
          icon="📄"
          description="Apply and download certificates"
        />

        <ServiceCard
          title="Complaint Register"
          icon="📝"
          description="Register and track complaints"
        />

        <ServiceCard
          title="Property Tax"
          icon="🏠"
          description="View and pay property tax"
        />

        <ServiceCard
          title="Garbage Truck Tracking"
          icon="🚛"
          description="Track garbage collection vehicles"
        />

        <ServiceCard
          title="Water Management"
          icon="💧"
          description="Water supply and issues"
        />

        <ServiceCard
          title="Event Announcements"
          icon="📢"
          description="Municipal announcements"
        />

        <ServiceCard
          title="City Updates"
          icon="🏙️"
          description="Latest city updates"
        />

        <ServiceCard
          title="Notifications"
          icon="🔔"
          description="Alerts and notifications"
        />
      </div>
    </div>
  );
}

export default DashboardServices;
