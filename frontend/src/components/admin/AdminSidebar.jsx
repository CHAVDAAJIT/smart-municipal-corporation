import { useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <div className="admin-sidebar">
      <h3>Smart City</h3>
      <ul>
        <li onClick={() => navigate("/admin/dashboard")}>📊 Dashboard Overview</li>
        <li onClick={() => navigate("/admin/complaints")}>📝 Complaints Management</li>
        <li>👥 Citizens Management</li>
        <li>🚛 Garbage Monitoring</li>
        <li>💧 Water Supply Control</li>
        <li>📢 Announcements</li>
        <li>🏠 Property Tax</li>
        <li onClick={() => navigate("/admin/certificates")}>📄 Certificates</li> {/* ✅ */}
        <li>📈 Reports & Analytics</li>
        <li>⚙️ Settings</li>
      </ul>
    </div>
  );
}

export default AdminSidebar;