require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const adminAuthRoutes = require("./routes/adminAuth");
const adminProtectedRoutes = require("./routes/adminProtected");
const app = express();

// Enable CORS and JSON parsing before mounting routes
app.use(cors());
app.use(express.json());

app.use("/api/admin", adminProtectedRoutes);
app.use("/api/admin", adminAuthRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/smartMunicipal")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
