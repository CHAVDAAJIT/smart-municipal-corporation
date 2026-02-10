import AdminHero from "../../../components/admin/AdminHero";
import AdminStats from "../../../components/admin/AdminStats";
import AdminQuickActions from "../../../components/admin/AdminQuickActions";
import RecentComplaintsTable from "../../../components/admin/RecentComplaintsTable";

function DashboardHome() {
  return (
    <div className="admin-dashboard-home">
      <AdminHero />
      <AdminStats />
      <AdminQuickActions />
      <RecentComplaintsTable />
    </div>
  );
}

export default DashboardHome;
