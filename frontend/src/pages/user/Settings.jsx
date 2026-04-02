import { useEffect, useState } from "react";
import API from "../../services/apiUser";
import DashboardSidebar from "../../components/user/DashboardSidebar";
import DashboardHeader from "../../components/user/DashboardHeader";
import "../../styles/UserDashboard.css";
import "../../styles/Settings.css";

function UserSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({ name: "", email: "", mobile: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/user/dashboard");
      setProfile({
        name: res.data.user.name || "",
        email: res.data.user.email || "",
        mobile: res.data.user.mobile || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await API.put("/user/profile", profile);
      setProfileMsg({ type: "success", text: "✅ Profile updated successfully!" });
      setTimeout(() => setProfileMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setProfileMsg({
        type: "error",
        text: "❌ " + (err.response?.data?.message || "Failed to update")
      });
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ type: "error", text: "❌ Passwords do not match" });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "❌ Min 6 characters required" });
      return;
    }
    try {
      await API.put("/user/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswordMsg({ type: "success", text: "✅ Password changed successfully!" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setPasswordMsg({
        type: "error",
        text: "❌ " + (err.response?.data?.message || "Failed to change password")
      });
    }
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return "";
    if (pwd.length < 6) return "weak";
    if (pwd.length < 10) return "medium";
    return "strong";
  };

  const tabs = [
    { id: "profile", label: "👤 Profile" },
    { id: "password", label: "🔐 Password" },
  ];

  return (
    <div className="dashboard-container">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <div className="dashboard-home">
          <h2 style={{ color: "#0f4c75", marginBottom: "4px" }}>⚙️ Settings</h2>
          <p className="sub-text" style={{ marginBottom: "24px" }}>
            Manage your profile and account settings
          </p>

          {/* Tabs */}
          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ===== PROFILE TAB ===== */}
          {activeTab === "profile" && (
            <div className="settings-card">
              <h3>👤 My Profile</h3>

              {/* Avatar */}
              <div className="settings-avatar">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </div>

              {profileMsg.text && (
                <div className={profileMsg.type === "success" ? "settings-success" : "settings-error"}>
                  {profileMsg.text}
                </div>
              )}

              <form onSubmit={saveProfile}>
                <div className="settings-form-group">
                  <label>Full Name</label>
                  <input
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="settings-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="settings-form-group">
                  <label>Mobile Number</label>
                  <input
                    value={profile.mobile}
                    onChange={e => setProfile({ ...profile, mobile: e.target.value })}
                    placeholder="Mobile Number"
                  />
                </div>
                <button type="submit" className="settings-save-btn">
                  💾 Save Profile
                </button>
              </form>
            </div>
          )}

          {/* ===== PASSWORD TAB ===== */}
          {activeTab === "password" && (
            <div className="settings-card">
              <h3>🔐 Change Password</h3>

              {passwordMsg.text && (
                <div className={passwordMsg.type === "success" ? "settings-success" : "settings-error"}>
                  {passwordMsg.text}
                </div>
              )}

              <form onSubmit={changePassword}>
                <div className="settings-form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div className="settings-form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    required
                  />
                  {passwords.newPassword && (
                    <div className={`password-strength ${getPasswordStrength(passwords.newPassword)}`} />
                  )}
                </div>
                <div className="settings-form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <button type="submit" className="settings-save-btn">
                  🔐 Change Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSettings;