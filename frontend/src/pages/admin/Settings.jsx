import { useEffect, useState } from "react";
import API from "../../services/apiAdmin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import "../../styles/AdminDashboard.css";
import "../../styles/Settings.css";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({ name: "", email: "", mobile: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });
  const [appSettings, setAppSettings] = useState({
    siteName: "", contactEmail: "", contactPhone: "", address: "", website: ""
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    complaintAlerts: true,
    paymentAlerts: true,
    systemAlerts: false,
  });

  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [appMsg, setAppMsg] = useState({ type: "", text: "" });
  const [notifMsg, setNotifMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
    fetchAppSettings();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/settings/profile");
      setProfile({
        name: res.data.name || "",
        email: res.data.email || "",
        mobile: res.data.mobile || ""
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAppSettings = async () => {
    try {
      const res = await API.get("/settings/app");
      setAppSettings({
        siteName: res.data.siteName || "",
        contactEmail: res.data.contactEmail || "",
        contactPhone: res.data.contactPhone || "",
        address: res.data.address || "",
        website: res.data.website || "",
      });
      if (res.data.notifications) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await API.put("/settings/profile", profile);
      setProfileMsg({ type: "success", text: "✅ Profile updated successfully!" });
      setTimeout(() => setProfileMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setProfileMsg({ type: "error", text: "❌ Failed to update profile" });
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ type: "error", text: "❌ New passwords do not match" });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "❌ Password must be at least 6 characters" });
      return;
    }
    try {
      await API.put("/settings/change-password", {
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

  const saveAppSettings = async (e) => {
    e.preventDefault();
    try {
      await API.put("/settings/app", appSettings);
      setAppMsg({ type: "success", text: "✅ App settings saved!" });
      setTimeout(() => setAppMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setAppMsg({ type: "error", text: "❌ Failed to save settings" });
    }
  };

  const saveNotifications = async () => {
    try {
      await API.put("/settings/app", { notifications });
      setNotifMsg({ type: "success", text: "✅ Notification preferences saved!" });
      setTimeout(() => setNotifMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setNotifMsg({ type: "error", text: "❌ Failed to save" });
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
    { id: "app", label: "⚙️ App Settings" },
    { id: "notifications", label: "🔔 Notifications" },
  ];

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <div className="admin-dashboard-main">
        <AdminHeader />

        <div className="admin-dashboard-home">
          <h2>⚙️ Settings</h2>
          <p className="sub-text" style={{ marginBottom: "24px" }}>
            Manage your profile and application settings
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
              <h3>👤 Admin Profile</h3>

              {/* Avatar */}
              <div className="settings-avatar">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
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
                    placeholder="Admin Name"
                    required
                  />
                </div>
                <div className="settings-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    placeholder="admin@email.com"
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

          {/* ===== APP SETTINGS TAB ===== */}
          {activeTab === "app" && (
            <div className="settings-card">
              <h3>⚙️ Application Settings</h3>

              {appMsg.text && (
                <div className={appMsg.type === "success" ? "settings-success" : "settings-error"}>
                  {appMsg.text}
                </div>
              )}

              <form onSubmit={saveAppSettings}>
                <div className="settings-form-group">
                  <label>Site Name</label>
                  <input
                    value={appSettings.siteName}
                    onChange={e => setAppSettings({ ...appSettings, siteName: e.target.value })}
                    placeholder="Smart Municipal Corporation"
                  />
                </div>
                <div className="settings-form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    value={appSettings.contactEmail}
                    onChange={e => setAppSettings({ ...appSettings, contactEmail: e.target.value })}
                    placeholder="admin@smartmunicipal.gov.in"
                  />
                </div>
                <div className="settings-form-group">
                  <label>Contact Phone</label>
                  <input
                    value={appSettings.contactPhone}
                    onChange={e => setAppSettings({ ...appSettings, contactPhone: e.target.value })}
                    placeholder="+91 79 2234 5678"
                  />
                </div>
                <div className="settings-form-group">
                  <label>Office Address</label>
                  <input
                    value={appSettings.address}
                    onChange={e => setAppSettings({ ...appSettings, address: e.target.value })}
                    placeholder="Municipal Corporation Office, Ahmedabad"
                  />
                </div>
                <div className="settings-form-group">
                  <label>Website</label>
                  <input
                    value={appSettings.website}
                    onChange={e => setAppSettings({ ...appSettings, website: e.target.value })}
                    placeholder="www.smartmunicipal.gov.in"
                  />
                </div>
                <button type="submit" className="settings-save-btn">
                  💾 Save Settings
                </button>
              </form>
            </div>
          )}

          {/* ===== NOTIFICATIONS TAB ===== */}
          {activeTab === "notifications" && (
            <div className="settings-card">
              <h3>🔔 Notification Preferences</h3>

              {notifMsg.text && (
                <div className={notifMsg.type === "success" ? "settings-success" : "settings-error"}>
                  {notifMsg.text}
                </div>
              )}

              <div className="settings-toggle-row">
                <div>
                  <p className="settings-toggle-label">Email Notifications</p>
                  <p className="settings-toggle-sub">Receive updates via email</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={e => setNotifications({
                      ...notifications, emailNotifications: e.target.checked
                    })}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <p className="settings-toggle-label">Complaint Alerts</p>
                  <p className="settings-toggle-sub">Get notified for new complaints</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notifications.complaintAlerts}
                    onChange={e => setNotifications({
                      ...notifications, complaintAlerts: e.target.checked
                    })}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <p className="settings-toggle-label">Payment Alerts</p>
                  <p className="settings-toggle-sub">Get notified for tax payments</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notifications.paymentAlerts}
                    onChange={e => setNotifications({
                      ...notifications, paymentAlerts: e.target.checked
                    })}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <p className="settings-toggle-label">System Alerts</p>
                  <p className="settings-toggle-sub">Get notified for system updates</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notifications.systemAlerts}
                    onChange={e => setNotifications({
                      ...notifications, systemAlerts: e.target.checked
                    })}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>

              <br />
              <button
                className="settings-save-btn"
                onClick={saveNotifications}
              >
                💾 Save Preferences
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Settings;