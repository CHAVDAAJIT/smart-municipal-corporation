import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "../../styles/Chat.css";

const SOCKET_URL = "http://localhost:5000";
const BASE_URL = "http://localhost:5000/api";

const quickQuestions = [
  "📋 Register complaint",
  "🔍 Track complaint",
  "🏠 Property tax",
  "📄 Certificate apply",
  "💧 Water supply issue",
  "⭐ Points & rewards",
  "🕐 Office timings",
  "📞 Contact info",
];

const botResponses = {
  "register complaint": "📋 To register a complaint:\n1. Go to 'Complaint Register' in sidebar\n2. Select type & priority\n3. Fill area & description\n4. Add photos (optional)\n5. Submit!\n\n⭐ You earn 10 points per complaint!",
  "track complaint": "🔍 To track your complaint:\n1. Go to 'My Complaints'\n2. Click '📋 Timeline' button\n3. See full activity\n\nStatus: Pending → Assigned → Resolved",
  "property tax": "🏠 For property tax:\n1. Go to Property Tax in sidebar\n2. Enter Property ID (e.g. PROP-001)\n3. View amount & due date\n4. Pay online!\n\n💡 100 points = ₹1 discount!",
  "certificate": "📄 Certificate types:\n• 🍼 Birth Certificate\n• 🕊️ Death Certificate\n• 💼 Income Certificate\n\nGo to Documents Service → Select type → Fill details → Submit",
  "water": "💧 Water Management:\n• View supply schedule\n• Register complaint\n• Request tanker\n• Check outage alerts\n\nGo to: Dashboard → Water Management",
  "points": "⭐ Points System:\n• Register complaint = +10 pts\n• Admin bonus = +10 to +100 pts\n• 100 points = ₹1 tax discount\n\nGo to: My Points & Rewards",
  "office timing": "🕐 Office Timings:\n• Mon-Fri: 9 AM - 6 PM\n• Saturday: 9 AM - 2 PM\n• Sunday: Closed\n\n✅ Portal available 24/7!",
  "contact": "📞 Contact:\n• Phone: +91 79 2234 5678\n• Email: admin@smartmunicipal.gov.in\n• Helpline: 1800-XXX-XXXX\n\n🏢 Sardar Patel Bhavan, Ahmedabad",
  "hello": "👋 Hello! I'm your Smart Assistant.\n\nI can help with complaints, tax, certificates, water, and more!\n\nClick a quick question below or type your query:",
  "hi": "👋 Hi there! How can I help you today?\n\nUse the quick buttons below or type your question:",
  "thank": "😊 You're welcome! Is there anything else I can help with?\n\nFor complex issues, switch to Live Chat tab to connect with admin!",
  "default": "🤔 I'm not sure about that. Please try:\n• Complaint registration\n• Property tax\n• Certificates\n• Water supply\n\nOr switch to Live Chat for admin support!"
};

function getBotReply(msg) {
  const lower = msg.toLowerCase();
  for (const [key, response] of Object.entries(botResponses)) {
    if (key !== "default" && lower.includes(key)) return response;
  }
  return botResponses.default;
}

function getUserId(token) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1])).id;
  } catch { return null; }
}

function getUserName(token) {
  if (!token) return "Citizen";
  try {
    const p = JSON.parse(atob(token.split(".")[1]));
    return p.email?.split("@")[0] || "Citizen";
  } catch { return "Citizen"; }
}

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("bot");
  const [botMessages, setBotMessages] = useState([]);
  const [liveMessages, setLiveMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [unread, setUnread] = useState(false);
  const [liveConnected, setLiveConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const liveEndRef = useRef(null);

  const token = localStorage.getItem("userToken");
  const userId = getUserId(token);
  const userName = getUserName(token);
  const roomId = userId;

  useEffect(() => {
    // ✅ Bot welcome message on mount
    setBotMessages([{
      id: "welcome",
      sender: "bot",
      senderName: "Smart Assistant 🤖",
      message: "👋 Hello! I'm your Smart Municipal Assistant.\n\nHow can I help you today?\n\nClick a quick question or type below:",
      time: new Date()
    }]);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    newSocket.emit("joinRoom", roomId);

    newSocket.on("newLiveMessage", (msg) => {
      setLiveMessages(prev => [...prev, msg]);
      if (activeTab !== "live") setUnread(true);
    });

    return () => newSocket.disconnect();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [botMessages]);

  useEffect(() => {
    liveEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveMessages]);

  // ✅ Load live chat history when switching to live tab
  const loadLiveHistory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/history/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLiveMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === "live") {
      setUnread(false);
      setLiveConnected(true);
      loadLiveHistory();
    }
  };

  // ✅ Bot send
  const sendBotMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: "user",
      message: msg,
      time: new Date()
    };
    setBotMessages(prev => [...prev, userMsg]);

    // Bot reply after delay
    setTimeout(() => {
      const reply = getBotReply(msg);
      setBotMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "bot",
        senderName: "Smart Assistant 🤖",
        message: reply,
        time: new Date()
      }]);
    }, 800);
  };

  // ✅ Live send
  const sendLiveMessage = () => {
    const msg = input.trim();
    if (!msg || !socket) return;
    setInput("");

    socket.emit("userLiveMessage", {
      message: msg,
      roomId,
      userId,
      userName
    });
  };

  const handleSend = () => {
    if (activeTab === "bot") sendBotMessage();
    else sendLiveMessage();
  };

  const getTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit"
    });
  };

  // ✅ Clear bot session on close
  const handleClose = () => {
    setIsOpen(false);
    // Reset bot messages
    setBotMessages([{
      id: "welcome",
      sender: "bot",
      senderName: "Smart Assistant 🤖",
      message: "👋 Hello! I'm your Smart Municipal Assistant.\n\nHow can I help you today?",
      time: new Date()
    }]);
  };

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-box">

          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-header-avatar">🏛️</div>
              <div>
                <p className="chat-header-name">SMC Support</p>
                <p className="chat-header-status">🟢 Online</p>
              </div>
            </div>
            <button className="chat-close-btn" onClick={handleClose}>✕</button>
          </div>

          {/* Tabs */}
          <div className="chat-tabs">
            <button
              className={`chat-tab-btn ${activeTab === "bot" ? "active" : ""}`}
              onClick={() => handleTabSwitch("bot")}
            >
              🤖 AI Assistant
            </button>
            <button
              className={`chat-tab-btn ${activeTab === "live" ? "active" : ""}`}
              onClick={() => handleTabSwitch("live")}
            >
              💬 Live Chat
              {unread && <span style={{
                background: "#e63946", color: "white",
                borderRadius: "50%", width: "16px", height: "16px",
                display: "inline-flex", alignItems: "center",
                justifyContent: "center", fontSize: "10px",
                marginLeft: "4px"
              }}>!</span>}
            </button>
          </div>

          {/* ===== BOT TAB ===== */}
          {activeTab === "bot" && (
            <>
              {/* ✅ Quick Questions — ALWAYS SHOW */}
              <div className="chat-quick-questions">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    className="quick-q-btn"
                    onClick={() => sendBotMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="chat-messages">
                {botMessages.map((msg, i) => (
                  <div key={msg.id || i} className={`chat-message ${msg.sender}`}>
                    {msg.sender !== "user" && (
                      <span className="chat-sender-name">{msg.senderName}</span>
                    )}
                    <div className="chat-bubble">{msg.message}</div>
                    <span className="chat-time">{getTime(msg.time)}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-area">
                <input
                  className="chat-input"
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                />
                <button className="chat-send-btn" onClick={handleSend}>➤</button>
              </div>
            </>
          )}

          {/* ===== LIVE CHAT TAB ===== */}
          {activeTab === "live" && (
            <>
              <div className="chat-messages">
                {liveMessages.length === 0 ? (
                  <div style={{
                    textAlign: "center", color: "#888",
                    fontSize: "13px", padding: "30px 20px"
                  }}>
                    <p style={{ fontSize: "30px", margin: "0 0 8px" }}>💬</p>
                    <p>Send a message to connect with admin support</p>
                    <p style={{ fontSize: "11px", marginTop: "4px" }}>
                      Response time: within 1-2 hours
                    </p>
                  </div>
                ) : (
                  liveMessages.map((msg, i) => (
                    <div
                      key={msg._id || i}
                      className={`chat-message ${msg.sender === "admin" ? "admin" : "user"}`}
                    >
                      {msg.sender === "admin" && (
                        <span className="chat-sender-name">
                          🏛️ {msg.senderName || "Admin"}
                        </span>
                      )}
                      <div className="chat-bubble">{msg.message}</div>
                      <span className="chat-time">{getTime(msg.createdAt)}</span>
                    </div>
                  ))
                )}
                <div ref={liveEndRef} />
              </div>

              <div className="chat-input-area">
                <input
                  className="chat-input"
                  placeholder="Type message to admin..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                />
                <button className="chat-send-btn" onClick={handleSend}>➤</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Toggle */}
      <button
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "💬"}
        {unread && !isOpen && <span className="chat-unread-dot" />}
      </button>
    </div>
  );
}

export default ChatWidget;