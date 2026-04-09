require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ✅ CORS origin function
// ❌ PURANA — yeh replace karo
const allowedOrigins = [
  "http://localhost:3000",
  "https://smart-municipal-corporation.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    const clean = origin.replace(/\/$/, "");
    const isAllowed = allowedOrigins.some(
      o => o && o.replace(/\/$/, "") === clean
    );
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("CORS blocked:", origin);
      callback(null, true);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ NAYA — yeh lagao
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://smart-municipal-corporation.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Preflight requests ke liye zaroori
app.options(/(.*)/, cors());

// ✅ Socket.io CORS
const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      callback(null, true); // ✅ Socket ke liye sab allow
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

global.io = io;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ChatMessage = require("./models/chatMessage");
const { getBotResponse } = require("./utils/aiChatbot");

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("userLiveMessage", async (data) => {
    try {
      const { message, roomId, userId, userName } = data;
      const saved = await ChatMessage.create({
        sender: "user",
        senderId: userId,
        senderModel: "User",
        senderName: userName,
        message,
        roomId,
        chatType: "live",
      });
      io.to(roomId).emit("newLiveMessage", saved);
      io.emit("adminNotify", { roomId, message, userName, unread: true });
    } catch (err) {
      console.log("Socket userLiveMessage error:", err.message);
    }
  });

  socket.on("adminMessage", async (data) => {
    try {
      const { message, roomId, adminName } = data;
      const saved = await ChatMessage.create({
        sender: "admin",
        senderName: adminName || "Admin",
        message,
        roomId,
        chatType: "live",
      });
      io.to(roomId).emit("newLiveMessage", saved);
    } catch (err) {
      console.log("Socket adminMessage error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Routes
const adminAuthRoutes = require("./routes/adminAuth");
const adminProtectedRoutes = require("./routes/adminProtected");
const complaintRoutes = require("./routes/complaintRoutes");
const documentRoutes = require("./routes/documentRoutes");
const waterRoutes = require("./routes/waterRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const cityUpdateRoutes = require("./routes/cityUpdateRoutes");
const garbageRoutes = require("./routes/garbageRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const citizenRoutes = require("./routes/citizenRoutes");
const adminManageRoutes = require("./routes/adminManageRoutes");
const pointsRoutes = require("./routes/pointsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

app.use("/api/admin", adminProtectedRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/userProtected"));
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", complaintRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/city-updates", cityUpdateRoutes);
app.use("/api/garbage", garbageRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/citizens", citizenRoutes);
app.use("/api/admin-manage", adminManageRoutes);
app.use("/api/points", pointsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/feedback", feedbackRoutes);

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smartMunicipal")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});






// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);


// const io = new Server(server, {
//   cors: {
//     origin: "https://smart-municipal-corporation.vercel.app/",
//     methods: ["GET", "POST"],
//   },
// });

// global.io = io; 


// const ChatMessage = require("./models/chatMessage");


// io.on("connection", (socket) => {
//   console.log("Client connected:", socket.id);

//   socket.on("joinRoom", (roomId) => {
//     socket.join(roomId);
//   });

  
//   socket.on("userLiveMessage", async (data) => {
//     const { message, roomId, userId, userName } = data;

//     const saved = await ChatMessage.create({
//       sender: "user",
//       senderId: userId,
//       senderModel: "User",
//       senderName: userName,
//       message,
//       roomId,
//       chatType: "live",
//     });

//     io.to(roomId).emit("newLiveMessage", saved);
//     io.emit("adminNotify", { roomId, message, userName, unread: true });
//   });

  
//   socket.on("adminMessage", async (data) => {
//     const { message, roomId, adminName } = data;

//     const saved = await ChatMessage.create({
//       sender: "admin",
//       senderName: adminName || "Admin",
//       message,
//       roomId,
//       chatType: "live",
//     });

//     io.to(roomId).emit("newLiveMessage", saved);
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });


// app.use(cors());
// app.use(express.json());

// app.get("/api", (req, res) => {
//   res.json({ message: "API is up and running" });
// });
// const adminAuthRoutes = require("./routes/adminAuth");
// const adminProtectedRoutes = require("./routes/adminProtected");
// const complaintRoutes = require("./routes/complaintRoutes");
// const documentRoutes = require("./routes/documentRoutes");
// const waterRoutes = require("./routes/waterRoutes");
// const announcementRoutes = require("./routes/announcementRoutes");
// const cityUpdateRoutes = require("./routes/cityUpdateRoutes");
// const garbageRoutes = require("./routes/garbageRoutes");
// const propertyRoutes = require("./routes/propertyRoutes");
// const reportsRoutes = require("./routes/reportsRoutes");
// const settingsRoutes = require("./routes/settingsRoutes");
// const citizenRoutes = require("./routes/citizenRoutes");
// const adminManageRoutes = require("./routes/adminManageRoutes");
// const pointsRoutes = require("./routes/pointsRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const { generalLimiter, authLimiter } = require("./middleware/rateLimiter");
// const feedbackRoutes = require("./routes/feedbackRoutes");



// app.use("/api/feedback", feedbackRoutes);
// app.use("/api/admin", adminProtectedRoutes);
// app.use("/api/admin", adminAuthRoutes);
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/user", require("./routes/userProtected"));
// app.use("/api/complaints", complaintRoutes);
// app.use("/api/admin", complaintRoutes);
// app.use("/api/documents", documentRoutes);
// app.use("/api/water", waterRoutes);
// app.use("/api/announcements", announcementRoutes);
// app.use("/api/city-updates", cityUpdateRoutes);
// app.use("/api/garbage", garbageRoutes);
// app.use("/api/property", propertyRoutes);
// app.use("/api/reports", reportsRoutes);
// app.use("/api/settings", settingsRoutes);
// app.use("/api/citizens", citizenRoutes);
// app.use("/api/admin-manage", adminManageRoutes);
// app.use("/api/points", pointsRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/chat", chatRoutes);

// app.use("/api", generalLimiter);


// app.use("/api/auth", authLimiter);


// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));


// server.listen(process.env.PORT || 5000, () => {
//   console.log("Server running on port " + (process.env.PORT || 5000));
// });