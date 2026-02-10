import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import DashboardHome from "./dashboard/DashboardHome";
import "../../styles/AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <div className="admin-dashboard-main">
        <AdminHeader />
        <DashboardHome />
      </div>
    </div>
  );
}

export default AdminDashboard;
