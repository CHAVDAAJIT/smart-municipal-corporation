import { useEffect, useState } from "react";
import API from "../../services/apiUser";

import DashboardSidebar from "../../components/user/DashboardSidebar";
import DashboardHeader from "../../components/user/DashboardHeader";
import DashboardHome from "./dashboard/DashboardHome";

import "../../styles/UserDashboard.css";

function UserDashboard() {

  //  STATE 
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  });

  //  API CALL
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/complaints/stats");
      setStats(res.data);
    } catch (err) {
      console.log("Stats error:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        {/* stats PASS KARO */}
        <DashboardHome stats={stats} />
      </div>
    </div>
  );
}

export default UserDashboard;
