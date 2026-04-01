const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isBlocked: { type: Boolean, default: false },
  // ✅ Points system
  points: { type: Number, default: 0 },
  totalPointsEarned: { type: Number, default: 0 },
  pointsUsed: { type: Number, default: 0 },
});

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);