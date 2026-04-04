require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ✅ Socket.io
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

global.io = io;

const ChatMessage = require("./models/chatMessage");
const { getBotResponse } = require("./utils/aiChatbot");

// ✅ Socket events
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Join room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // User sends message
  socket.on("userMessage", async (data) => {
    const { message, roomId, userId, userName } = data;

    // Save to DB
    const saved = await ChatMessage.create({
      sender: "user",
      senderId: userId,
      senderModel: "User",
      senderName: userName,
      message,
      roomId,
    });

    // Emit to room
    io.to(roomId).emit("newMessage", saved);

    // Notify admin
    io.emit("adminNotify", { roomId, message, userName });

    // ✅ Bot response (if admin not active — auto reply after 2 sec)
    setTimeout(async () => {
      const botReply = getBotResponse(message);
      const botMsg = await ChatMessage.create({
        sender: "bot",
        senderName: "Smart Assistant 🤖",
        message: botReply,
        roomId,
      });
      io.to(roomId).emit("newMessage", botMsg);
    }, 1500);
  });

  // Admin sends message
  socket.on("adminMessage", async (data) => {
    const { message, roomId, adminName } = data;

    const saved = await ChatMessage.create({
      sender: "admin",
      senderName: adminName || "Admin",
      message,
      roomId,
    });

    io.to(roomId).emit("newMessage", saved);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

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

mongoose
  .connect("mongodb://127.0.0.1:27017/smartMunicipal")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// ✅ server.listen (http server)
server.listen(5000, () => {
  console.log("Server running on port 5000");
});