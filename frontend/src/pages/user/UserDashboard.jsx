function UserDashboard() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Citizen Dashboard</h1>
      <p>Welcome! You can manage your complaints here.</p>

      <button
        onClick={() => {
          localStorage.removeItem("userToken");
          window.location.href = "/user/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default UserDashboard;
