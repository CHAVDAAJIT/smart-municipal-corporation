import { useEffect, useState } from "react";
import API from "../../services/apiAdmin";
import "../../styles/AdminHeader.css";

function AdminHeader() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      const res = await API.get("/settings/profile");
      setAdmin(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "A";

  return (
    <div className="admin-header">
      {/* Left */}
      <div className="admin-header-left">
        <h2>Administrator Panel</h2>
        {admin && (
          <p className="admin-welcome">
            👋 Welcome, <strong>{admin.name}</strong>
          </p>
        )}
      </div>

      {/* Right */}
      <div className="admin-header-right">
        {admin && (
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {getInitial(admin.name)}
            </div>
            <div className="admin-user-details">
              <p className="admin-user-name">{admin.name}</p>
              <p className="admin-user-email">{admin.email}</p>
            </div>
          </div>
        )}
        <button onClick={logout} className="admin-logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminHeader;