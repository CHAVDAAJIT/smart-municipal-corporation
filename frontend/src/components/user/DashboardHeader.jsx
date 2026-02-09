function DashboardHeader() {
  const logout = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/user/login";
  };

  return (
    <div className="dashboard-header">
      <h2>Citizen Dashboard</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default DashboardHeader;
