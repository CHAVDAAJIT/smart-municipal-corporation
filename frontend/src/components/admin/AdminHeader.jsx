function AdminHeader() {
  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="admin-header">
      <h2>Administrator Panel</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default AdminHeader;
