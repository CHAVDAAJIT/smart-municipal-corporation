import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/DashboardSidebar.css";

function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
     { label: "Dashboard Overview", icon: "📊", path: "/user/dashboard" },
    { label: "Documents Service", icon: "📄", path: "/user/documents" },
    { label: "My Certificates", icon: "🏅", path: "/user/my-certificates" },
    { label: "Complaint Register", icon: "📝", path: "/user/complaint/register" },
    { label: "My Complaints", icon: "📋", path: "/user/complaints" },
    { label: "Property Tax", icon: "🏠", path: "/user/property-tax" },
    { label: "Garbage Truck Tracking", icon: "🚛", path: "/user/garbage" },
    { label: "Water Management", icon: "💧", path: "/user/water" },
    { label: "Event Announcements", icon: "📢", path: "/user/events" },
    { label: "City Updates", icon: "🏙️", path: "/user/updates" },
    { label: "Notifications", icon: "🔔", path: "/user/notifications" },
    { label: "About Corporation", icon: "ℹ️", path: "/user/about" },
  ];

  return (
    <div className="dashboard-sidebar">
      <h3 className="sidebar-title">🏙️ Smart City</h3>
      <ul>
        {menu.map((item) => (
          <li
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardSidebar;