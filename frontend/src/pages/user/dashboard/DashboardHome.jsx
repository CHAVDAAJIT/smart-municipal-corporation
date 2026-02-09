import DashboardHero from "../../../components/user/DashboardHero";
import DashboardStats from "../../../components/user/DashboardStats";
import DashboardServices from "../../../components/user/DashboardServices";

function DashboardHome() {
  return (
    <div className="dashboard-home">
      <DashboardHero />
      <DashboardStats />
      <DashboardServices />
    </div>
  );
}

export default DashboardHome;
