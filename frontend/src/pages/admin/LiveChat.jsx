import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API from "../../services/apiAdmin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import "../../styles/AdminDashboard.css";
import "../../styles/Chat.css";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

function AdminLiveChat() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchRooms();
    fetchAdminName();

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("adminNotify", () => {
      fetchRooms();
    });

    newSocket.on("newLiveMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchAdminName = async () => {
    try {
      const res = await API.get("/settings/profile");
      setAdminName(res.data.name || "Admin");
    } catch (err) { console.log(err); }
  };

  const fetchRooms = async () => {
    try {
      const res = await API.get("/chat/rooms");
      setRooms(res.data);
    } catch (err) { console.log(err); }
  };

  // ✅ Room select fix
  const selectRoom = async (room) => {
    setSelectedRoom(room);
    setMessages([]);
    setLoading(true);

    // Join socket room
    if (socket) {
      socket.emit("joinRoom", room._id);
    }

    try {
      // ✅ Load history
      const res = await API.get(`/chat/admin-history/${room._id}`);
      setMessages(res.data);

      // Mark as read
      await API.put(`/chat/read/${room._id}`);

      // Update room unread count
      setRooms(prev => prev.map(r =>
        r._id === room._id ? { ...r, unread: 0 } : r
      ));
    } catch (err) {
      console.log("Chat history error:", err);
    }
    setLoading(false);
  };

  const sendMessage = () => {
    if (!input.trim() || !socket || !selectedRoom) return;
    socket.emit("adminMessage", {
      message: input,
      roomId: selectedRoom._id,
      adminName
    });
    setInput("");
  };

  const getTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit"
    });
  };

  const getDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <div className="admin-dashboard-main">
        <AdminHeader />

        <div className="admin-dashboard-home">
          <h2>💬 Live Chat Support</h2>
          <p className="sub-text" style={{ marginBottom: "20px" }}>
            Respond to citizen queries in real-time
          </p>

          <div className="admin-chat-container">

            {/* ===== ROOMS LIST ===== */}
            <div className="admin-chat-rooms">
              <h3>
                💬 Conversations
                {rooms.length > 0 && (
                  <span style={{
                    background: "#0f4c75", color: "white",
                    borderRadius: "20px", padding: "2px 8px",
                    fontSize: "12px", marginLeft: "8px"
                  }}>
                    {rooms.length}
                  </span>
                )}
              </h3>

              {rooms.length === 0 ? (
                <div style={{ padding: "30px 20px", textAlign: "center", color: "#aaa" }}>
                  <p style={{ fontSize: "30px" }}>💬</p>
                  <p style={{ fontSize: "13px" }}>No conversations yet</p>
                </div>
              ) : (
                rooms.map((room) => (
                  <div
                    key={room._id}
                    className={`admin-room-item ${selectedRoom?._id === room._id ? "active" : ""}`}
                    onClick={() => selectRoom(room)}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "4px"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {/* Avatar */}
                        <div style={{
                          width: "32px", height: "32px",
                          borderRadius: "50%", background: "#0f4c75",
                          color: "white", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          fontSize: "13px", fontWeight: "600",
                          flexShrink: 0
                        }}>
                          {room.user?.name?.charAt(0).toUpperCase() || "C"}
                        </div>
                        <p className="admin-room-name">
                          {room.user?.name || "Citizen"}
                        </p>
                      </div>
                      {room.unread > 0 && (
                        <span className="admin-room-badge">{room.unread}</span>
                      )}
                    </div>
                    <p className="admin-room-preview" style={{ paddingLeft: "40px" }}>
                      {room.lastMessage?.substring(0, 40)}
                      {room.lastMessage?.length > 40 ? "..." : ""}
                    </p>
                    <p style={{
                      fontSize: "10px", color: "#bbb",
                      margin: "2px 0 0", paddingLeft: "40px"
                    }}>
                      {getDate(room.lastTime)}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* ===== CHAT WINDOW ===== */}
            <div className="admin-chat-window">
              {!selectedRoom ? (
                <div className="admin-chat-empty">
                  <span style={{ fontSize: "50px" }}>💬</span>
                  <p style={{ fontWeight: "600", color: "#555" }}>
                    Select a conversation
                  </p>
                  <p style={{ fontSize: "12px" }}>
                    Click on a citizen to start chatting
                  </p>
                </div>
              ) : (
                <>
                  {/* Window Header */}
                  <div className="admin-chat-window-header">
                    <div style={{
                      width: "40px", height: "40px",
                      borderRadius: "50%", background: "#0f4c75",
                      color: "white", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: "16px", fontWeight: "600"
                    }}>
                      {selectedRoom.user?.name?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <div>
                      <h3 style={{ margin: "0 0 2px" }}>
                        {selectedRoom.user?.name || "Citizen"}
                      </h3>
                      <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                        {selectedRoom.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="admin-chat-messages">
                    {loading ? (
                      <div style={{ textAlign: "center", padding: "20px", color: "#aaa" }}>
                        Loading messages...
                      </div>
                    ) : messages.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "30px", color: "#aaa", fontSize: "13px" }}>
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      messages.map((msg, i) => (
                        <div
                          key={msg._id || i}
                          className={`chat-message ${msg.sender === "admin" ? "user" : "admin"}`}
                        >
                          {msg.sender !== "admin" && (
                            <span className="chat-sender-name">
                              👤 {msg.senderName || "Citizen"}
                            </span>
                          )}
                          {msg.sender === "admin" && (
                            <span className="chat-sender-name" style={{ textAlign: "right", display: "block" }}>
                              🏛️ You
                            </span>
                          )}
                          <div className="chat-bubble">{msg.message}</div>
                          <span className="chat-time">{getTime(msg.createdAt)}</span>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="admin-chat-input-area">
                    <input
                      className="admin-chat-input"
                      placeholder="Type your response..."
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendMessage()}
                    />
                    <button
                      className="admin-chat-send-btn"
                      onClick={sendMessage}
                    >
                      Send ➤
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLiveChat;