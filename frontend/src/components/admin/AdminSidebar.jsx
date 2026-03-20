function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <h3>Smart City</h3>

      <ul>
        <li>📊 Dashboard Overview</li>
        <li onClick={() => window.location.href = "/admin/complaints"}>
  📝 Complaints Management
</li>
        <li>👥 Citizens Management</li>
        <li>🚛 Garbage Monitoring</li>
        <li>💧 Water Supply Control</li>
        <li>📢 Announcements</li>
        <li>🏠 Property Tax</li>
        <li>📄 Certificates</li>
        <li>📈 Reports & Analytics</li>
        <li>⚙️ Settings</li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
