import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/apiUser";
import DashboardSidebar from "../../../components/user/DashboardSidebar";
import DashboardHeader from "../../../components/user/DashboardHeader";
import "../../../styles/Points.css";
import "../../../styles/UserDashboard.css";

function Points() {
  const [pointsData, setPointsData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPoints();
    fetchLeaderboard();
  }, []);

  const fetchPoints = async () => {
    try {
      const res = await API.get("/points");
      setPointsData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get("/complaints/leaderboard");
      setLeaderboard(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRedeem = async () => {
    const pts = parseInt(redeemAmount);
    if (!pts || pts < 100) {
      setMsg("❌ Minimum 100 points required to redeem");
      return;
    }
    if (pts > pointsData?.points) {
      setMsg("❌ Insufficient points");
      return;
    }
    try {
      const res = await API.post("/points/redeem", { pointsToRedeem: pts });
      setMsg(`✅ Redeemed ${pts} points = ₹${res.data.moneyValue} for tax payment!`);
      setRedeemAmount("");
      fetchPoints();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to redeem"));
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <div className="points-page">
          <h2>⭐ My Points & Rewards</h2>
          <p className="sub-text" style={{ marginBottom: "24px" }}>
            Earn points, climb leaderboard, redeem for tax payment!
          </p>

          {/* Points Summary */}
          {pointsData && (
            <div className="points-summary-grid">
              <div className="points-summary-card gold">
                <div className="points-summary-icon">⭐</div>
                <h3>{pointsData.points}</h3>
                <p>Available Points</p>
                <span className="points-money-val">
                  ≈ ₹{Math.floor(pointsData.points / 100)}
                </span>
              </div>
              <div className="points-summary-card blue">
                <div className="points-summary-icon">🏆</div>
                <h3>{pointsData.totalPointsEarned}</h3>
                <p>Total Points Earned</p>
              </div>
              <div className="points-summary-card green">
                <div className="points-summary-icon">💳</div>
                <h3>{pointsData.pointsUsed}</h3>
                <p>Points Redeemed</p>
                <span className="points-money-val">
                  = ₹{Math.floor(pointsData.pointsUsed / 100)} saved
                </span>
              </div>
            </div>
          )}

          {/* How to Earn */}
          <div className="points-how-card">
            <h3>💡 How to Earn Points</h3>
            <div className="points-how-grid">
              <div className="points-how-item">
                <span className="points-how-icon">📋</span>
                <div>
                  <p className="points-how-title">Register Complaint</p>
                  <p className="points-how-pts">+10 points</p>
                </div>
              </div>
              <div className="points-how-item">
                <span className="points-how-icon">⭐</span>
                <div>
                  <p className="points-how-title">Admin Reward</p>
                  <p className="points-how-pts">+10 to +100 points</p>
                </div>
              </div>
              <div className="points-how-item">
                <span className="points-how-icon">📸</span>
                <div>
                  <p className="points-how-title">Photo with Complaint</p>
                  <p className="points-how-pts">Bonus points from admin</p>
                </div>
              </div>
              <div className="points-how-item">
                <span className="points-how-icon">💰</span>
                <div>
                  <p className="points-how-title">Redeem Rate</p>
                  <p className="points-how-pts">100 points = ₹1</p>
                </div>
              </div>
            </div>
          </div>

          {/* Redeem Points */}
          <div className="points-redeem-card">
            <h3>💳 Redeem Points for Tax Payment</h3>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
              Minimum 100 points required. 100 points = ₹1 discount on property tax.
            </p>

            {msg && (
              <div style={{
                padding: "10px 14px",
                borderRadius: "8px",
                marginBottom: "12px",
                background: msg.includes("✅") ? "#d1fae5" : "#ffe4e4",
                color: msg.includes("✅") ? "#059669" : "#e63946",
                fontSize: "13px",
                fontWeight: "500"
              }}>
                {msg}
              </div>
            )}

            <div className="points-redeem-row">
              <input
                type="number"
                placeholder="Enter points to redeem (min 100)"
                value={redeemAmount}
                onChange={e => setRedeemAmount(e.target.value)}
                min="100"
                step="100"
              />
              <div className="points-redeem-value">
                = ₹{redeemAmount ? Math.floor(parseInt(redeemAmount || 0) / 100) : 0}
              </div>
              <button className="points-redeem-btn" onClick={handleRedeem}>
                💳 Redeem
              </button>
            </div>

            <button
              className="points-tax-btn"
              onClick={() => navigate("/user/property-tax")}
            >
              🏠 Go to Property Tax Payment →
            </button>
          </div>

          {/* Leaderboard */}
          <div className="points-leaderboard-card">
            <h3>🏆 Points Leaderboard</h3>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
              Top civic contributors of Smart Municipal Corporation
            </p>

            {leaderboard.length === 0 ? (
              <p style={{ textAlign: "center", color: "#aaa", padding: "20px" }}>
                No data yet
              </p>
            ) : (
              leaderboard.map((u, index) => (
                <div
                  key={u._id}
                  className={`points-lb-item ${index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : ""}`}
                >
                  <div className="points-lb-rank">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                  </div>
                  <div className="points-lb-avatar">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="points-lb-info">
                    <p className="points-lb-name">{u.name}</p>
                    <p className="points-lb-email">{u.email}</p>
                  </div>
                  <div className="points-lb-score">
                    <p className="points-lb-pts">⭐ {u.totalPointsEarned}</p>
                    <p className="points-lb-money">≈ ₹{Math.floor(u.totalPointsEarned / 100)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Points;