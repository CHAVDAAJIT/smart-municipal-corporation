import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "../../styles/Chat.css";

const SOCKET_URL = "http://localhost:5000";
const BASE_URL = "http://localhost:5000/api";

const quickQuestions = [
  "How to register complaint?",
  "Track my complaint",
  "Property tax payment",
  "Certificate apply",
  "Water supply issue",
  "Points & rewards",
];

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("bot"); // bot | live
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [unread, setUnread] = useState(false);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("userToken");
  const userId = getUserId(token);
  const roomId = userId;

  function getUserId(token) {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch { return null; }
  }

  function getUserName(token) {
    if (!token) return "Citizen";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.email?.split("@")[0] || "Citizen";
    } catch { return "Citizen"; }
  }

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    newSocket.emit("joinRoom", roomId);

    newSocket.on("newMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
      if (!isOpen) setUnread(true);
    });

    // Load chat history
    loadHistory();

    // Bot welcome message
    setMessages([{
      _id: "welcome",
      sender: "bot",
      senderName: "Smart Assistant 🤖",
      message: "👋 Hello! I'm your Smart Municipal Assistant.\n\nHow can I help you today?",
      createdAt: new Date()
    }]);

    return () => newSocket.disconnect();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/history/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.length > 0) {
        setMessages(prev => [...prev, ...res.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg || !socket) return;

    if (activeTab === "bot") {
      // Bot mode — emit userMessage (bot auto replies)
      socket.emit("userMessage", {
        message: msg,
        roomId,
        userId,
        userName: getUserName(token)
      });
    } else {
      // Live mode — emit userMessage to admin
      socket.emit("userMessage", {
        message: msg,
        roomId,
        userId,
        userName: getUserName(token)
      });
    }
    setInput("");
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnread(false);
  };

  const getTimeAgo = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="chat-widget">
      {/* Chat Box */}
      {isOpen && (
        <div className="chat-box">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-header-avatar">🏛️</div>
              <div>
                <p className="chat-header-name">Smart Municipal Support</p>
                <p className="chat-header-status">🟢 Online</p>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Tabs */}
          <div className="chat-tabs">
            <button
              className={`chat-tab-btn ${activeTab === "bot" ? "active" : ""}`}
              onClick={() => setActiveTab("bot")}
            >
              🤖 AI Assistant
            </button>
            <button
              className={`chat-tab-btn ${activeTab === "live" ? "active" : ""}`}
              onClick={() => setActiveTab("live")}
            >
              💬 Live Chat
            </button>
          </div>

          {/* Quick Questions */}
          {activeTab === "bot" && messages.length <= 1 && (
            <div className="chat-quick-questions">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  className="quick-q-btn"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="chat-messages">
            {activeTab === "live" && messages.filter(m => m.sender !== "bot").length === 0 && (
              <div style={{ textAlign: "center", color: "#888", fontSize: "13px", padding: "20px" }}>
                💬 Send a message to connect with admin support
              </div>
            )}
            {(activeTab === "bot"
              ? messages
              : messages.filter(m => m.sender !== "bot")
            ).map((msg, i) => (
              <div key={msg._id || i} className={`chat-message ${msg.sender}`}>
                {msg.sender !== "user" && (
                  <span className="chat-sender-name">{msg.senderName}</span>
                )}
                <div className="chat-bubble">{msg.message}</div>
                <span className="chat-time">{getTimeAgo(msg.createdAt)}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input
              className="chat-input"
              placeholder={activeTab === "bot" ? "Ask me anything..." : "Type message to admin..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button className="chat-send-btn" onClick={() => sendMessage()}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button className="chat-toggle-btn" onClick={handleOpen}>
        {isOpen ? "✕" : "💬"}
        {unread && !isOpen && <span className="chat-unread-dot" />}
      </button>
    </div>
  );
}

export default ChatWidget;