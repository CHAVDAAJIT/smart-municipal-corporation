import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/AdminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { label: "Dashboard Overview", icon: "📊", path: "/admin/dashboard" },
    { label: "Complaints Management", icon: "📝", path: "/admin/complaints" },
    { label: "Certificates", icon: "📄", path: "/admin/certificates" },
    { label: "Citizens Management", icon: "👥", path: "/admin/citizens" },
    { label: "Garbage Monitoring", icon: "🚛", path: "/admin/garbage" },
    { label: "Water Supply Control", icon: "💧", path: "/admin/water" },
    { label: "Announcements", icon: "📢", path: "/admin/announcements" },
    { label: "City Updates", icon: "🏙️", path: "/admin/city-updates" },
    { label: "Property Tax", icon: "🏠", path: "/admin/property-tax" },
    { label: "Feedback & Ratings", icon: "⭐", path: "/admin/feedback" },
    { label: "Live Chat Support", icon: "💬", path: "/admin/chat" },
    { label: "Admin Management", icon: "👤", path: "/admin/manage" },
    { label: "Reports & Analytics", icon: "📈", path: "/admin/reports" },
    { label: "Settings", icon: "⚙️", path: "/admin/settings" },
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-title">
        🏙️ Smart City
      </div>
      <ul>
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li
              key={item.path}
              className={`admin-sidebar-item ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="admin-sidebar-icon">{item.icon}</span>
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default AdminSidebar;