const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});


mongoose.connect("mongodb://127.0.0.1:27017/smartMunicipal")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));
