import { useEffect, useState } from "react";
import API from "../../../services/apiUser";

import DashboardHero from "../../../components/user/DashboardHero";
import DashboardStats from "../../../components/user/DashboardStats";
import DashboardServices from "../../../components/user/DashboardServices";

function DashboardHome() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  });

  useEffect(() => {
    API.get("/complaints/stats")
      .then(res => {
        setStats(res.data);
      })
      .catch(err => {
        console.log("Stats error:", err);
      });
  }, []);

  return (
    <div className="dashboard-home">
      <DashboardHero />
      <DashboardStats stats={stats} />
      <DashboardServices />
    </div>
  );
}

export default DashboardHome;
