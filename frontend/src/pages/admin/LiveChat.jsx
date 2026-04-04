import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API from "../../services/apiAdmin";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import "../../styles/AdminDashboard.css";
import "../../styles/Chat.css";

const SOCKET_URL = "http://localhost:5000";

function AdminLiveChat() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [adminName, setAdminName] = useState("Admin");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchRooms();
    fetchAdminName();

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("adminNotify", (data) => {
      fetchRooms();
    });

    newSocket.on("newMessage", (msg) => {
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

  const selectRoom = async (room) => {
    setSelectedRoom(room);

    // Leave old room, join new
    if (socket) {
      socket.emit("joinRoom", room._id);
    }

    // Load history
    try {
      const res = await API.get(`/chat/history/${room._id}`);
      setMessages(res.data);
      // Mark as read
      await API.put(`/chat/read/${room._id}`);
      fetchRooms();
    } catch (err) { console.log(err); }
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

  const getTimeAgo = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
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

            {/* Rooms List */}
            <div className="admin-chat-rooms">
              <h3>💬 Conversations ({rooms.length})</h3>
              {rooms.length === 0 ? (
                <p style={{ padding: "20px", color: "#aaa", fontSize: "13px", textAlign: "center" }}>
                  No conversations yet
                </p>
              ) : (
                rooms.map((room) => (
                  <div
                    key={room._id}
                    className={`admin-room-item ${selectedRoom?._id === room._id ? "active" : ""}`}
                    onClick={() => selectRoom(room)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p className="admin-room-name">
                        👤 {room.user?.name || "Citizen"}
                      </p>
                      {room.unread > 0 && (
                        <span className="admin-room-badge">{room.unread}</span>
                      )}
                    </div>
                    <p className="admin-room-preview">{room.lastMessage}</p>
                  </div>
                ))
              )}
            </div>

            {/* Chat Window */}
            <div className="admin-chat-window">
              {!selectedRoom ? (
                <div className="admin-chat-empty">
                  <span style={{ fontSize: "40px" }}>💬</span>
                  <p>Select a conversation to start chatting</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="admin-chat-window-header">
                    <div style={{
                      width: "38px", height: "38px", borderRadius: "50%",
                      background: "#0f4c75", color: "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", fontWeight: "600"
                    }}>
                      {selectedRoom.user?.name?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <div>
                      <h3>{selectedRoom.user?.name || "Citizen"}</h3>
                      <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                        {selectedRoom.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="admin-chat-messages">
                    {messages.map((msg, i) => (
                      <div
                        key={msg._id || i}
                        className={`chat-message ${msg.sender === "admin" ? "user" : msg.sender}`}
                      >
                        {msg.sender !== "admin" && (
                          <span className="chat-sender-name">{msg.senderName}</span>
                        )}
                        <div className="chat-bubble">{msg.message}</div>
                        <span className="chat-time">{getTimeAgo(msg.createdAt)}</span>
                      </div>
                    ))}
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