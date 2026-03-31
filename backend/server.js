require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const adminAuthRoutes = require("./routes/adminAuth");
const adminProtectedRoutes = require("./routes/adminProtected");
const app = express();

const complaintRoutes = require("./routes/complaintRoutes");

const documentRoutes = require("./routes/documentRoutes");

const waterRoutes = require("./routes/waterRoutes");

const announcementRoutes = require("./routes/announcementRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const garbageRoutes = require("./routes/garbageRoutes");
const cityUpdateRoutes = require("./routes/cityUpdateRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const citizenRoutes = require("./routes/citizenRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
// Enable CORS and JSON parsing before mounting routes
app.use(cors());
app.use(express.json());
app.use("/api/admin", require("./routes/adminProtected"));

app.use("/api/admin", adminProtectedRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/userProtected"));
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", require("./routes/complaintRoutes"));
app.use("/api/documents", documentRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/garbage", garbageRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/citizens", citizenRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/city-updates", cityUpdateRoutes);
app.use("/api/notifications", notificationRoutes);
mongoose
  .connect("mongodb://127.0.0.1:27017/smartMunicipal")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
