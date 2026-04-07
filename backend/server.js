require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ✅ ADD THIS (YOU MISSED THIS PART)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

global.io = io; // optional but good practice

// ✅ IMPORT MODEL (also missing)
const ChatMessage = require("./models/chatMessage");

/* 
   SOCKET EVENTS
 */
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  // ✅ User live message
  socket.on("userLiveMessage", async (data) => {
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
  });

  // ✅ Admin message
  socket.on("adminMessage", async (data) => {
    const { message, roomId, adminName } = data;

    const saved = await ChatMessage.create({
      sender: "admin",
      senderName: adminName || "Admin",
      message,
      roomId,
      chatType: "live",
    });

    io.to(roomId).emit("newLiveMessage", saved);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

/* 
   MIDDLEWARE
 */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* 
   ROUTES
 */
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
const { generalLimiter, authLimiter } = require("./middleware/rateLimiter");
const feedbackRoutes = require("./routes/feedbackRoutes");

app.use("/api/feedback", feedbackRoutes);
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
// Apply general limit to all routes
app.use("/api", generalLimiter);

// Apply strict limit to auth routes
app.use("/api/auth", authLimiter);

/*
   DATABASE
 */
mongoose
  .connect("mongodb://127.0.0.1:27017/smartMunicipal")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

/*SERVER START*/
server.listen(5000, () => {
  console.log("Server running on port 5000");
});