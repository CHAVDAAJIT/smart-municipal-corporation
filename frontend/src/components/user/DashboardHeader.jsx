import { useEffect, useState } from "react";
import API from "../../services/apiUser";
import "../../styles/DashboardHeader.css";

function DashboardHeader() {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    fetchUser();
    fetchPoints();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get("/user/dashboard");
      setUser(res.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPoints = async () => {
    try {
      const res = await API.get("/points");
      setPoints(res.data.points || 0);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/user/login";
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className="dashboard-header">
      <div className="dashboard-header-left">
        <h2>Citizen Dashboard</h2>
        {user && (
          <p className="dashboard-welcome">
            👋 Welcome back, <strong>{user.name}</strong>!
          </p>
        )}
      </div>

      <div className="dashboard-header-right">
        {/* ✅ Points Badge */}
        <div className="dashboard-points-badge">
          <span className="points-icon">⭐</span>
          <div>
            <p className="points-value">{points} pts</p>
            <p className="points-money">≈ ₹{Math.floor(points / 100)}</p>
          </div>
        </div>

        {user && (
          <div className="dashboard-user-info">
            <div className="dashboard-user-avatar">
              {getInitial(user.name)}
            </div>
            <div className="dashboard-user-details">
              <p className="dashboard-user-name">{user.name}</p>
              <p className="dashboard-user-email">{user.email}</p>
            </div>
          </div>
        )}
        <button onClick={logout} className="dashboard-logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardHeader;