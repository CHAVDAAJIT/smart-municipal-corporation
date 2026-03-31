import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/apiUser";
import DashboardSidebar from "../../../components/user/DashboardSidebar";
import DashboardHeader from "../../../components/user/DashboardHeader";
import "../../../styles/Notifications.css";
import "../../../styles/UserDashboard.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const markRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const markAllRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAll = async () => {
    if (!window.confirm("Delete all notifications?")) return;
    try {
      await API.delete("/notifications");
      setNotifications([]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (notif) => {
    if (!notif.isRead) await markRead(notif._id);
    if (notif.link) navigate(notif.link);
  };

  const getIcon = (type) => {
    switch (type) {
      case "complaint": return "📋";
      case "water": return "💧";
      case "garbage": return "🚛";
      case "certificate": return "📄";
      case "announcement": return "📢";
      default: return "🔔";
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const filters = ["All", "Unread", "complaint", "water", "garbage", "certificate", "announcement"];

  const filtered = notifications.filter(n => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.isRead;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="dashboard-container">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <div className="notif-page">
          <h2>🔔 Notifications</h2>

          {/* Header Actions */}
          <div className="notif-header-actions">
            <div className="notif-header-left">
              <p className="sub-text" style={{ margin: 0 }}>
                Your activity updates
              </p>
              {unreadCount > 0 && (
                <span className="notif-unread-badge">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <div className="notif-header-right">
              {unreadCount > 0 && (
                <button className="notif-action-btn" onClick={markAllRead}>
                  ✅ Mark All Read
                </button>
              )}
              {notifications.length > 0 && (
                <button className="notif-action-btn danger" onClick={deleteAll}>
                  🗑️ Clear All
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="notif-filter-tabs">
            {filters.map(tab => (
              <button
                key={tab}
                className={`notif-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab === "complaint" ? "📋 Complaints"
                  : tab === "water" ? "💧 Water"
                  : tab === "garbage" ? "🚛 Garbage"
                  : tab === "certificate" ? "📄 Certificates"
                  : tab === "announcement" ? "📢 Announcements"
                  : tab}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          {filtered.length === 0 ? (
            <div className="notif-empty">
              🔔 No notifications found
            </div>
          ) : (
            <div className="notif-list">
              {filtered.map(n => (
                <div
                  key={n._id}
                  className={`notif-item ${n.isRead ? "read" : "unread"}`}
                  onClick={() => handleClick(n)}
                >
                  {/* Icon */}
                  <div className={`notif-icon ${n.type}`}>
                    {getIcon(n.type)}
                  </div>

                  {/* Content */}
                  <div className="notif-content">
                    <p className="notif-title">{n.title}</p>
                    <p className="notif-message">{n.message}</p>
                    <p className="notif-time">
                      🕐 {getTimeAgo(n.createdAt)} •{" "}
                      {new Date(n.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && <div className="notif-dot" />}

                  {/* Delete */}
                  <button
                    className="notif-delete-btn"
                    onClick={(e) => deleteNotification(n._id, e)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;