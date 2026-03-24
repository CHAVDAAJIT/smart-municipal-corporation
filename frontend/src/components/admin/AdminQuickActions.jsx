import { useNavigate } from "react-router-dom";

function AdminQuickActions() {
  const navigate = useNavigate();
  return (
    <div className="admin-actions">
      <h3>Quick Actions</h3>

      <div className="admin-actions-grid">
        <div className="admin-action-card">📢 Create Announcement</div>
        <div className="admin-action-card">📝 Assign Complaint</div>
        <div className="admin-action-card">👤 Add Admin</div>
        <div 
          className="admin-action-card"
          onClick={() => navigate("/admin/certificates")} 
        >
          📄 Approve Certificates
        </div>
      </div>
    </div>
  );
}

export default AdminQuickActions;
