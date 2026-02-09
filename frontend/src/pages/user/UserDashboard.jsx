import DashboardSidebar from "../../components/user/DashboardSidebar";
import DashboardHeader from "../../components/user/DashboardHeader";
import DashboardHome from "./dashboard/DashboardHome";
import "../../styles/UserDashboard.css";

function UserDashboard() {
  return (
    <div className="dashboard-container">
      <DashboardSidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <DashboardHome />
      </div>
    </div>
  );
}

export default UserDashboard;
